import { Queue, Worker } from "bullmq";
import { config } from "dotenv";
import { sendEmail } from "./sendEmail.js";
config();

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const emailQueue = new Queue("mailQueue", {
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

const worker = new Worker(
  "mailQueue",
  async (job) => {
    const { purpose, context } = job.data;
    try {
      // Simulate sending email
      console.log(
        `Sending email to: ${context.to}, Purpose: ${purpose}, context: ${JSON.stringify(context)}`
      );
      await sendEmail(purpose, context);
      // Here you would integrate with your email service provider
      // e.g., using nodemailer or any other service
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error; // Re-throw to let Bull handle retries
    }
  },
  {
    connection: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log(`Email job completed successfully: ${job.id}`);
});
worker.on("failed", (job, err) => {
  console.error(`Email job failed: ${job.id}, Error:`, err);
});
