import { serve } from "@upstash/workflow/nextjs";

// Define the shape of the initial data received by the workflow
type InitialData = {
  email: string;  // User's email address for communication
};

// Export the POST handler for the workflow endpoint
export const { POST } = serve<InitialData>(async (context) => {
  // Extract the email from the incoming request payload
  const { email } = context.requestPayload;

  // Step 1: Run an isolated step to send a welcome email
  // `context.run` wraps this step so it can be retried independently if it fails
  await context.run("new-signup", async () => {
    await sendEmail("Welcome to the platform", email);
  });

  // Step 2: Sleep for 3 days (in seconds) before next action
  // This non-blocking sleep allows the workflow to pause without consuming compute
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  // Step 3: Enter an infinite loop to periodically check the user's state and send emails accordingly
  while (true) {
    // Fetch the user's state using an isolated step for retry safety
    // context.run allows this step to be retried independently if it fails
    const state = await context.run("check-user-state", async () => {
      return await getUserState(); // Retrieve the user's activity state
    });

    // Based on the user's state, send different emails using isolated steps for retry safety
    if (state === "non-active") {
      // Send an email targeting users deemed non-active
      await context.run("send-email-non-active", async () => {
        await sendEmail("Email to non-active users", email);
      });
    } else if (state === "active") {
      // Send newsletters or other content to active users
      await context.run("send-email-active", async () => {
        await sendEmail("Send newsletter to active users", email);
      });
    }

    // Sleep for 1 month before repeating the check
    // This implements a monthly cadence for periodic user engagement emails
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});


// Helper function for sending emails.
// Replace the console.log with integration to an email service provider (e.g. SendGrid, SES).
async function sendEmail(message: string, email: string) {
  console.log(`Sending ${message} email to ${email}`);
  // Implement actual email sending here
}


// Define possible user states your workflow checks
type UserState = "non-active" | "active";

// Helper function simulating retrieving the user's activity state.
// Replace this stub with real logic, such as checking last login date or borrowing activity.
const getUserState = async (): Promise<UserState> => {
  // Example: logic to determine if user is active or not
  return "non-active";  // For demo, always return "non-active"
};
