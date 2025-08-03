import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";

type UserState = "non-active" | "active";


// Define the shape of the initial data received by the workflow
type InitialData = {
  email: string;  // User's email address for communication
  fullName: string;
};

const ONE_DAY_IN_MS = 24*60*60*1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active";
  }

  return "active";
};


// Export the POST handler for the workflow endpoint
export const { POST } = serve<InitialData>(async (context) => {
  // Extract the email from the incoming request payload
  const { email, fullName } = context.requestPayload;

  // Step 1: Run an isolated step to send a welcome email
  // `context.run` wraps this step so it can be retried independently if it fails
  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to the platform",
      message: `Welcome ${fullName}!`,
    });
  });

  // Step 2: Sleep for 3 days (in seconds) before next action
  // This non-blocking sleep allows the workflow to pause without consuming compute
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  // Step 3: Enter an infinite loop to periodically check the user's state and send emails accordingly
  while (true) {
    // Fetch the user's state using an isolated step for retry safety
    // context.run allows this step to be retried independently if it fails
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email); // Retrieve the user's activity state
    });

    // Based on the user's state, send different emails using isolated steps for retry safety
    if (state === "non-active") {
      // Send an email targeting users deemed non-active
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "Are you still there?",
          message: `Hey ${fullName}, we miss you!`,
        });
      });
    } else if (state === "active") {
      // Send newsletters or other content to active users
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Welcome back!",
          message: `Welcome back ${fullName}!`,
        });
      });
    }

    // Sleep for 1 month before repeating the check
    // This implements a monthly cadence for periodic user engagement emails
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});





