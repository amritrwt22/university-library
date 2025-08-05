
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import BorrowedBookList from "@/components/BorrowedBookList";

import StudentDetails from "@/components/StudentDetails";

const ProfilePage = async () => {
  // Get current session
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Fetch user data from database
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (userResult.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-light-100 text-lg">User not found</p>
      </div>
    );
  }

  const user = userResult[0]; // Get the first user from the result

  return (
    <div className="flex gap-10 min-h-screen">
      {/* Left Section: Student Details Card */}
      <div className="w-1/2">
        <StudentDetails
          id ={user.id}
          name={user.fullName}
          email={user.email}
          university="Delhi Technological University" // You can make this dynamic if you have university data
          studentId={user.universityId.toString()}
          idCardUrl={user.universityCard}
          status={user.status} // Assuming status is a field in the user schema
        />
      </div>

      {/* Right Section: Borrowed Books */}
      <div className="w-1/2">
        <BorrowedBookList/>
      </div>
    </div>
  );
};

export default ProfilePage;
