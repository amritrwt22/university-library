// app/admin/users/page.tsx
import React from "react";
import UsersTable from "@/components/admin/users/UserTable";
import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { desc, eq, count } from "drizzle-orm";
import { updateUserRole, deleteUser } from "@/lib/admin/actions/users";

interface UserWithBorrowCount {
    id: string;
    name: string;
    email: string;
    dateJoined: string;
    role: "User" | "Admin";
    booksBorrowed: number;
    universityIdNo: string;
    universityIdCardUrl?: string;
}

const AllUsersPage = async () => {
  // Fetch all users with their borrow count
  const usersData = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      createdAt: users.createdAt,
      role: users.role,
      universityId: users.universityId,
      universityCard: users.universityCard,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  // Get borrow counts for each user
  const usersWithBorrowCount = await Promise.all(
    usersData.map(async (user) => {
      const [borrowCount] = await db
        .select({ count: count() })
        .from(borrowRecords)
        .where(eq(borrowRecords.userId, user.id));

      return {
        id: user.id,
        name: user.fullName || "Unknown",
        email: user.email || "",
        dateJoined: user.createdAt 
          ? new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          : "Unknown",
        role: user.role === "ADMIN" ? "Admin" as const : "User" as const,
        booksBorrowed: borrowCount?.count || 0,
        universityIdNo: user.universityId || "N/A",
        universityIdCardUrl: user.universityCard || undefined,
      };
    })
  );

  return (
    <div className="p-6"> 
      <UsersTable
        users={usersWithBorrowCount}
        onRoleChange={updateUserRole}
        onDelete={deleteUser}
      />
    </div>
  );
};

export default AllUsersPage;
