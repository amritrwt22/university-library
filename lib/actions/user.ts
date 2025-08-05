// lib/actions/user.ts
"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export const updateUserDetails = async (userId: string, data: any) => {
  try {
    // Hash password if provided
    const updateData: any = {
      fullName: data.fullName,
      email: data.email,
      universityId: data.universityId,
      universityCard: data.universityCard,
      status: "PENDING", // Reset status to pending for re-verification
      updatedAt: new Date(),
    };

    // Only update password if provided
    if (data.password && data.password.trim() !== "") {
      updateData.password = await hash(data.password, 10);
    }

    // Update user in database
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    revalidatePath("/admin"); // Refresh admin dashboard
    revalidatePath("/"); // Refresh user dashboard

    return { success: true, message: "Details updated successfully. Your account is now pending approval." };
  } catch (error) {
    console.error("Error updating user details:", error);
    return { success: false, error: "Failed to update details. Please try again." };
  }
};
