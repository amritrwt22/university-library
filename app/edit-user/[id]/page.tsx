// app/edit-user/[id]/page.tsx
import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import EditUserForm from "@/components/EditUserForm";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const { id } = await params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    redirect("/");
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (existingUser.length === 0) {
    redirect("/");
  }

  const user = existingUser[0];

  const defaultValues = {
    fullName: user.fullName || "",
    email: user.email || "",
    universityId: user.universityId || "",
    password: "",
    universityCard: user.universityCard || null,
  };

  return (
    <div className="min-h-screen bg-dark-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Update Your Details</h1>
          <p className="text-light-100">
            Please update your information to resubmit for verification
          </p>
        </div>
        
        <EditUserForm 
          userId={id}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  );
};

export default EditUserPage;
