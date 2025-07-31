"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
// import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";



// this function is used to sign in the user with credentials
export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  // Pick allows us to select only the email and password properties from AuthCredentials type
  const { email, password } = params; // destructuring the params object to get email and password
  
  // Get the IP address from the request headers
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // if request to signin is in limit, it will return success as true, otherwise false
  const { success } = await ratelimit.limit(ip);
  // if the request is not within the rate limit, redirect to /too-fast page
  if (!success) return redirect("/too-fast");

  try {
    // Use NextAuth's signIn function to authenticate the user
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // we don't want to redirect immediately to the dashboard
    });

    // result? checks if result is not null or undefined before accessing the error property
    if (result?.error) {
      return { success: false, error: result.error };
    }

    // If sign-in is successful, return success
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
    // await workflowClient.trigger({
    //   url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
    //   body: {
    //     email,
    //     fullName,
    //   },
    // });

    // Sign in the user automatically after signup
    await signInWithCredentials({ email, password });
    return { success: true };
    
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
