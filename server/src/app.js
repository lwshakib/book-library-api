import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import session from "express-session";
import fs from "fs";
import { createServer } from "http";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import path from "path";
import requestIp from "request-ip";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yaml";
import { UserRoleEnum } from "./constants.js";
import morganMiddleware from "./logger/morgan.logger.js";
import { verifyAdmin, verifyJWT } from "./middlewares/auth.middlewares.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import { AuthenticatedUserModel } from "./models/auth/authenticated-user.model.js";
import { UserModel } from "./models/auth/user.model.js";
import { routes } from "./routes/index.js";
import { addBooks } from "./seeds/books.seeds.js";
import { ApiError } from "./utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(
  file?.replace(
    "- url: ${{server}}",
    `- url: ${process.env.BACKEND_URL || "http://localhost:7000"}`
  )
);

const app = express();
const httpServer = createServer(app);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_SSO_REDIRECT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies to be sent with requests
    preflightContinue: false,
  })
);

app.use(requestIp.mw());

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

passport.serializeUser((user, next) => {
  next(null, user._id);
});

passport.deserializeUser(async (id, next) => {
  try {
    const user = await AuthenticatedUserModel.findById(id);
    if (user) next(null, user); // return user of exist
    else next(new ApiError(404, "User does not exist"), null); // throw an error if user does not exist
  } catch (error) {
    next(
      new ApiError(
        500,
        "Something went wrong while deserializing the user. Error: " + error
      ),
      null
    );
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, next) => {
      // Check if the user with email already exist
      const user = await AuthenticatedUserModel.findOne({
        email: profile._json.email,
        type: "GOOGLE",
      });
      if (user) {
        // If user is registered with the same login method we will send the saved user
        next(null, user);
      } else {
        // If user with email does not exists, means the user is coming for the first time
        const createdUser = await AuthenticatedUserModel.create({
          email: profile._json.email,
          // There is a check for traditional logic so the password does not matter in this login method
          password: profile._json.sub, // Set user's password as sub (coming from the google)
          name: profile._json.name, // as email is unique, this username will be unique
          verified: true, // email will be already verified
          role: UserRoleEnum.USER,
          avatar: profile._json.picture, // set avatar as user's google picture
          type: "GOOGLE", // set type as google
        });
        if (createdUser) {
          const newUser = await UserModel.create({
            authUserId: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            avatar: `https://placehold.co/600x400?text=${createdUser.name
              .charAt(0)
              .toUpperCase()}`,
          });

          if (!newUser) {
            return next(new Error("Error while creating user profile"));
          }
          await newUser.save({ validateBeforeSave: false });
          // Send verification email to the user
          next(null, createdUser); // return the created user
        } else {
          next(new ApiError(500, "Error while registering the user"), null);
        }
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, next) => {
      if (!profile._json.email) {
        return next(
          new ApiError(
            400,
            "User does not have a public email associated with their account. Please try another login method"
          ),
          null
        );
      }

      const user = await AuthenticatedUserModel.findOne({
        email: profile._json.email,
        type: "GITHUB",
      });

      if (user) {
        next(null, user);
      } else {
        const createdUser = await AuthenticatedUserModel.create({
          email: profile._json.email,
          password: profile._json.node_id, // password is redundant for the SSO
          name: profile._json.name || profile._json.login, // use name or login as username
          verified: true, // email will be already verified
          role: UserRoleEnum.USER,
          avatar: profile._json.avatar_url, // set avatar as user's github picture
          type: "GITHUB", // set type as github
        });
        if (createdUser) {
          const newUser = await UserModel.create({
            authUserId: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            avatar: `https://placehold.co/600x400?text=${createdUser.name
              .charAt(0)
              .toUpperCase()}`,
          });
          if (!newUser) {
            return next(new Error("Error while creating user profile"));
          }
          await newUser.save({ validateBeforeSave: false });
          next(null, createdUser);
        } else {
          next(new ApiError(500, "Error while registering the user"), null);
        }
      }
    }
  )
);

// required for passport
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(morganMiddleware);

app.post("/seeds/add-books", verifyJWT, verifyAdmin, addBooks);
app.use(routes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// * API DOCS
// ? Keeping swagger code at the end so that we can load swagger on "/" route
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "Open Library API Documentation",
    // customCss: ".swagger-ui .topbar { display: none }", // hide the top bar
  })
);

app.use(errorHandler);

export { httpServer };
