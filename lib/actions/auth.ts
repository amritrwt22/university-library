"use server";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

// this function is used to sign in the user with credentials
export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  // Get the IP address from the request headers
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    // 1. Look up the user in the database
    const userArr = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userArr.length === 0) {
      return { success: false, error: "No user found with this email. Please sign up." };
    }

    const user = userArr[0];

    // 2. Check the password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid password. Please try again." };
    }

    // 3. Credentials valid: let NextAuth handle the session etc.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "Signin error");
    return { success: false, error: "Signin error" };
  }
};

// this function is used to sign up the user with credentials
export const signUp = async (params: AuthCredentials) => {
  // destructuring the params object
  const { fullName, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // ratelimit.limit is a function that checks if the request is within the rate limit
  const { success } = await ratelimit.limit(ip); // if it is in limit it returns success as true, otherwise false

  if (!success) return redirect("/too-fast"); // if the request is not within the rate limit, redirect to /too-fast page

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  // if user already exists, return error
  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }
  // Hash the password for security before storing it
  const hashedPassword = await hash(password, 10);

  try {
    // Insert the new user into the database
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    // Trigger the onboarding workflow after successful signup
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        fullName,
      },
    });

    // Sign in the user automatically after signup
    await signInWithCredentials({ email, password });
    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
