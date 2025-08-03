import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";


// workflowClient is an instance of WorkflowClient that connects to Upstash Workflow service
// workflow service is a serverless workflow orchestration service that allows you to define and execute workflows
// It is used to manage workflows, which are sequences of steps that can be executed in a defined order
export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

// qstashClient is an instance of QStashClient that connects to Upstash QStash service
// qstash service is a message queue service that allows you to publish and consume messages asynchronously
// It is used to publish messages to a queue, which can be processed asynchronously
const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

// sendEmail is a function that publishes a message to the QStash queue to send an email
// It uses the Resend service to send emails asynchronously
// it uses the qstashClient to publish a message to the queue so that the email can be sent later 
// nodemailer isnt used here instead // we use the Resend service to send emails asynchronously
export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "Amrit Rawat <hello.theoneinthefrontofthegun.shop>",
      to: [email],
      subject,
      html: message,
    },
  });
};

// this whole file is used to manage workflows and send emails using Upstash Workflow and QStash services