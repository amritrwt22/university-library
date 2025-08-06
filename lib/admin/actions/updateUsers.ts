// lib/actions/admin/users.ts
"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateUserRole = async (userId: string, newRole: "User" | "Admin") => {
  try {
    // Convert display role to database role
    const dbRole = newRole === "Admin" ? "ADMIN" : "USER";
    
    await db
      .update(users)
      .set({ 
        role: dbRole,
      })
      .where(eq(users.id, userId));

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // Note: You might want to handle related records (borrowRecords) first
    // depending on your database constraints
    
    await db
      .delete(users)
      .where(eq(users.id, userId));

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};
