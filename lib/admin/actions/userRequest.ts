// lib/actions/admin.ts
"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { desc } from "drizzle-orm";

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



// NEW: Update user status (works for any status change) - for the status selector component
export const updateUserStatus = async (userId: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
  try {
    await db
      .update(users)
      .set({ 
        status: newStatus,
      })
      .where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");
    return { success: true, message: `User status updated to ${newStatus}` };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: "Failed to update user status" };
  }
};

// UPDATE: Get all users (not just pending)
export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        universityId: users.universityId,
        universityCard: users.universityCard,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt)); // Most recent first

    return { 
      success: true, 
      users: allUsers 
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { 
      success: false, 
      error: "Failed to fetch users",
      users: []
    };
  }
};