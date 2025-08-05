// lib/actions/admin.ts
"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const approveUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ 
        status: "APPROVED",
        // updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    revalidatePath("/admin");
    return { success: true, message: "User approved successfully" };
  } catch (error) {
    console.error("Error approving user:", error);
    return { success: false, error: "Failed to approve user" };
  }
};

export const rejectUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ 
        status: "REJECTED",
        // updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    revalidatePath("/admin");
    return { success: true, message: "User rejected successfully" };
  } catch (error) {
    console.error("Error rejecting user:", error);
    return { success: false, error: "Failed to reject user" };
  }
};
