import { config } from "dotenv";
import nodemailer from "nodemailer";
import { SendMailEnum } from "./constants.js";
config();

const isDevelopment = process.env.NODE_ENV === "development";

const transporter = nodemailer.createTransport(
  isDevelopment
    ? {
        host: process.env.MAILHOG_SMTP_HOST,
        port: Number(process.env.MAILHOG_SMTP_PORT),
      }
    : {
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      }
);

// SVG Icons
const svgIcons = {
  library: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.837 4.263 18.201 4.732 17.732C5.201 17.263 5.837 17 6.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.5 2H20V22H6.5C5.837 22 5.201 21.737 4.732 21.268C4.263 20.799 4 20.163 4 19.5V4.5C4 3.837 4.263 3.201 4.732 2.732C5.201 2.263 5.837 2 6.5 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 7H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 11H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  key: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 2L19 4M7 7L3 3C2.5 2.5 2.5 1.5 3 1S4.5 0.5 5 1L9 5L13 9L19 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 7L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="8.5" cy="8.5" r="2.5" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  
  alert: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  x: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  lock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
    <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  
  mapPin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 10C21 17 12 23 12 23S3 17 3 10A9 9 0 1 1 21 10Z" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
  </svg>`
};

// Common styles for consistent branding
const commonStyles = `
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f8f9fa; 
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      background: white; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
      border: 1px solid #e9ecef;
    }
    .header { 
      background: #495057; 
      color: white; 
      padding: 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 500; 
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .header p {
      margin: 8px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content { 
      padding: 40px 30px; 
    }
    .greeting { 
      font-size: 20px; 
      margin-bottom: 20px; 
      color: #2c3e50; 
      font-weight: 500;
    }
    .code-container { 
      background: #f8f9fa; 
      border: 2px solid #495057;
      padding: 25px; 
      border-radius: 12px; 
      text-align: center; 
      margin: 30px 0; 
    }
    .verification-code { 
      font-size: 32px; 
      font-weight: bold; 
      color: #495057; 
      letter-spacing: 4px; 
      margin: 10px 0; 
      font-family: 'Courier New', monospace;
    }
    .code-label { 
      color: #6c757d; 
      font-size: 14px; 
      font-weight: 600;
      margin-bottom: 5px; 
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer { 
      background: #f8f9fa; 
      padding: 30px; 
      text-align: center; 
      border-top: 1px solid #e9ecef; 
    }
    .footer p { 
      margin: 5px 0; 
      color: #6c757d; 
      font-size: 14px; 
    }
    .brand { 
      color: #495057; 
      font-weight: 600; 
    }
    .notice-box { 
      border-radius: 8px; 
      padding: 16px; 
      margin: 20px 0; 
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .notice-warning { 
      background: #fff8e1; 
      border: 1px solid #ffcc02; 
      color: #bf8c00; 
    }
    .notice-info { 
      background: #e3f2fd; 
      border: 1px solid #2196f3; 
      color: #1565c0; 
    }
    .notice-success { 
      background: #e8f5e8; 
      border: 1px solid #4caf50; 
      color: #2e7d32; 
    }
    .notice-danger { 
      background: #ffebee; 
      border: 1px solid #f44336; 
      color: #c62828; 
    }
    .security-details { 
      background: #f8f9fa; 
      border: 1px solid #dee2e6; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 25px 0; 
    }
    .security-details h3 {
      margin-top: 0;
      color: #495057;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .details-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 15px 0; 
    }
    .details-table tr { 
      border-bottom: 1px solid #dee2e6; 
    }
    .details-table td { 
      padding: 12px 0; 
      vertical-align: top;
    }
    .details-table td:first-child { 
      font-weight: 600; 
      color: #495057; 
      width: 30%; 
    }
    .status-success { 
      color: #28a745; 
      font-weight: 600; 
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .status-failed { 
      color: #dc3545; 
      font-weight: 600; 
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .icon { 
      display: inline-flex; 
      align-items: center; 
      vertical-align: middle; 
    }
    @media (max-width: 600px) { 
      .container { margin: 10px; } 
      .header, .content, .footer { padding: 20px; } 
      .verification-code { font-size: 28px; } 
      .header h1 { font-size: 24px; }
    }
  </style>
`;

export const sendEmail = async (purpose, context) => {
  try {
    let subject = "";
    let html = "";
    let text = "";

    if (purpose === SendMailEnum.VERIFY_EMAIL) {
      subject = "Verify Your Email Address - OpenLibrary";
      html = `
        ${commonStyles}
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span class="icon">${svgIcons.library}</span>
                OpenLibrary
              </h1>
              <p>Welcome to your digital library</p>
            </div>
            <div class="content">
              <div class="greeting">Hello ${context.name}!</div>
              <p>Thank you for joining OpenLibrary! We're excited to have you as part of our reading community.</p>
              <p>To get started, please verify your email address using the code below:</p>
              
              <div class="code-container">
                <div class="code-label">Verification Code</div>
                <div class="verification-code">${context.verificationCode}</div>
              </div>
              
              <div class="notice-box notice-warning">
                <span class="icon">${svgIcons.clock}</span>
                <div>
                  <strong>Time Sensitive:</strong> This verification code will expire in <strong>${context.expiredAfter}</strong>. Please use it soon!
                </div>
              </div>
              
              <p>Once verified, you'll have access to thousands of books, personalized recommendations, and much more.</p>
              <p>If you didn't create an account with us, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>Happy reading!</p>
              <p><span class="brand">OpenLibrary Team</span></p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      `;
      text = `Hello ${context.name}!\n\nWelcome to OpenLibrary! Your verification code is: ${context.verificationCode}\n\nThis code will expire in ${context.expiredAfter}.\n\nIf you didn't create an account, please ignore this email.\n\nHappy reading!\nOpenLibrary Team`;
    
    } else if (purpose === SendMailEnum.SIGN_IN) {
      subject = "Security Alert - New Sign-in Detected";
      html = `
        ${commonStyles}
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span class="icon">${svgIcons.shield}</span>
                Security Alert
              </h1>
              <p>Account activity notification</p>
            </div>
            <div class="content">
              <div class="greeting">Hi ${context.name}!</div>
              <p>We detected a new sign-in to your OpenLibrary account. Here are the details:</p>
              
              <div class="security-details">
                <h3>
                  <span class="icon">${svgIcons.mapPin}</span>
                  Sign-in Details
                </h3>
                <table class="details-table">
                  <tr>
                    <td>Time:</td>
                    <td>${new Date().toLocaleString("en-US", {
                      timeZone: context.details?.timezone || "UTC",
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}</td>
                  </tr>
                  <tr>
                    <td>Location:</td>
                    <td>${context.details?.city || "Unknown"}, ${context.details?.region || "Unknown"}, ${context.details?.country_name || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td>IP Address:</td>
                    <td>${context.ipAddress || context.details?.ip || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td>Network:</td>
                    <td>${context.details?.org || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <td class="status-success">
                      <span class="icon">${svgIcons.check}</span>
                      Successful
                    </td>
                  </tr>
                </table>
              </div>
              
              <div class="notice-box notice-success">
                <span class="icon">${svgIcons.check}</span>
                <div>
                  <h4 style="margin: 0 0 10px 0;">Was this you?</h4>
                  <p style="margin: 0;"><strong>If this was you:</strong> No further action is required. You can continue enjoying your reading experience safely.</p>
                </div>
              </div>
              
              <div class="notice-box notice-danger">
                <span class="icon">${svgIcons.alert}</span>
                <div>
                  <h4 style="margin: 0 0 10px 0;">If this wasn't you:</h4>
                  <p style="margin-bottom: 10px;"><strong>Take immediate action to secure your account:</strong></p>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li>Change your password immediately</li>
                    <li>Review your recent account activity</li>
                    <li>Enable two-factor authentication if available</li>
                    <li>Contact our support team if you need assistance</li>
                  </ul>
                </div>
              </div>
              
              <div class="notice-box notice-info">
                <span class="icon">${svgIcons.lock}</span>
                <div>
                  <h4 style="margin: 0 0 10px 0;">Security Tips</h4>
                  <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Always sign out from public or shared devices</li>
                    <li>Use a unique, strong password for your account</li>
                    <li>Keep your browser and devices updated</li>
                    <li>Be cautious of phishing emails and suspicious links</li>
                  </ul>
                </div>
              </div>
              
              <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
                <strong>Technical Details:</strong> This notification was generated for security purposes.
              </p>
            </div>
            <div class="footer">
              <p>Your security is our priority!</p>
              <p><span class="brand">OpenLibrary Security Team</span></p>
              <p>This is an automated security notification • Do not reply to this email</p>
            </div>
          </div>
        </body>
      `;
      text = `Hi ${context.name}!\n\nNew sign-in detected on your OpenLibrary account:\n\nTime: ${new Date().toLocaleString("en-US", { timeZone: context.details?.timezone || "UTC" })}\nLocation: ${context.details?.city || "Unknown"}\nIP Address: ${context.ipAddress || "Unknown"}\n\nIf this was you, no action needed.\nIf this wasn't you, please change your password immediately.\n\nOpenLibrary Security Team`;
    
    } else if (purpose === SendMailEnum.RESET_PASSWORD) {
      subject = "Password Reset Request - OpenLibrary";
      html = `
        ${commonStyles}
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span class="icon">${svgIcons.key}</span>
                Password Reset
              </h1>
              <p>Secure your account</p>
            </div>
            <div class="content">
              <div class="greeting">Hello ${context.userName}!</div>
              <p>We received a request to reset your OpenLibrary account password.</p>
              <p>Use the verification code below to create a new password:</p>
              
              <div class="code-container">
                <div class="code-label">Password Reset Code</div>
                <div class="verification-code">${context.verificationCode}</div>
              </div>
              
              <div class="notice-box notice-warning">
                <span class="icon">${svgIcons.clock}</span>
                <div>
                  <strong>Time Sensitive:</strong> This reset code will expire in <strong>${context.expiredAfter}</strong>. Use it promptly to secure your account.
                </div>
              </div>
              
              <div class="notice-box notice-info">
                <span class="icon">${svgIcons.lock}</span>
                <div>
                  <h4 style="margin: 0 0 10px 0;">Security Tips:</h4>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li>Choose a strong password with at least 8 characters</li>
                    <li>Include uppercase, lowercase, numbers, and symbols</li>
                    <li>Don't reuse passwords from other accounts</li>
                  </ul>
                </div>
              </div>
              
              <p>If you didn't request this password reset, please ignore this email. Your current password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>Keep your account safe!</p>
              <p><span class="brand">OpenLibrary Team</span></p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      `;
      text = `Hello ${context.userName}!\n\nPassword reset requested for your OpenLibrary account.\n\nYour reset code is: ${context.verificationCode}\n\nThis code expires in ${context.expiredAfter}.\n\nIf you didn't request this, please ignore this email.\n\nOpenLibrary Team`;
    
    } else if (purpose === SendMailEnum.TOO_MANY_FAILED_LOGIN_ATTEMPTS) {
      subject = "Security Alert - Account Temporarily Locked";
      html = `
        ${commonStyles}
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span class="icon">${svgIcons.alert}</span>
                Security Alert
              </h1>
              <p>Account protection notification</p>
            </div>
            <div class="content">
              <div class="greeting">Hi there!</div>
              <p>We noticed multiple failed login attempts on your OpenLibrary account. For your security, we have temporarily locked your account.</p>
              
              <div class="security-details">
                <h3>
                  <span class="icon">${svgIcons.x}</span>
                  Failed Login Attempts
                </h3>
                <table class="details-table">
                  <tr>
                    <td>Time:</td>
                    <td>${new Date().toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}</td>
                  </tr>
                  <tr>
                    <td>IP Address:</td>
                    <td>${context.ipAddress || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <td class="status-failed">
                      <span class="icon">${svgIcons.x}</span>
                      Multiple Failed Attempts
                    </td>
                  </tr>
                </table>
              </div>
              
              <div class="notice-box notice-danger">
                <span class="icon">${svgIcons.lock}</span>
                <div>
                  <h4 style="margin: 0 0 10px 0;">Account Locked</h4>
                  <p style="margin-bottom: 10px;">To protect your account, we have temporarily locked it due to suspicious activity.</p>
                  <p style="margin-bottom: 10px;"><strong>To unlock your account:</strong></p>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li>Reset your password using a secure method</li>
                    <li>Enable two-factor authentication for added security</li>
                    <li>Contact our support team if you need assistance</li>
                  </ul>
                </div>
              </div>
              
              <div class="notice-box notice-info">
                <span class="icon">${svgIcons.shield}</span>
                <div>
                  <h4 style="margin: 0 0 10px 0;">Security Tips</h4>
                  <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Always sign out from public or shared devices</li>
                    <li>Use a unique, strong password for your account</li>
                    <li>Keep your browser and devices updated</li>
                    <li>Be cautious of phishing emails and suspicious links</li>
                  </ul>
                </div>
              </div>
              
              <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
                <strong>Technical Details:</strong> This notification was generated for security purposes due to multiple failed login attempts from IP address ${context.ipAddress || "Unknown"}.
              </p>
            </div>
            <div class="footer">
              <p>Your security is our priority!</p>
              <p><span class="brand">OpenLibrary Security Team</span></p>
              <p>This is an automated security notification • Do not reply to this email</p>
              <p style="font-size: 12px; color: #adb5bd;">
                For support, visit our help center or contact security@openlibrary.com
              </p>
            </div>
          </div>
        </body>
      `;
      text = `Security Alert: Your OpenLibrary account has been temporarily locked due to multiple failed login attempts.\n\nTime: ${new Date().toLocaleString("en-US")}\nIP Address: ${context.ipAddress || "Unknown"}\n\nTo unlock your account, please reset your password.\n\nOpenLibrary Security Team`;
    } else {
      throw new Error("Unsupported email purpose");
    }

    const mailOptions = {
      from: `OpenLibrary <noreply@openlibrary.com>`,
      to: context.to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};