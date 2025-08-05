// components/EditUserForm.tsx
"use client";

import React from "react";
import EditForm from "@/components/EditForm"; // ✅ Use EditForm instead of AuthForm
import { signUpSchema } from "@/lib/validations";
import { updateUserDetails } from "@/lib/actions/user";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface EditUserFormProps {
  userId: string;
  defaultValues: {
    fullName: string;
    email: string;
    universityId: string | number;
    password: string;
    universityCard: string | null;
  };
}

const EditUserForm = ({ userId, defaultValues }: EditUserFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const result = await updateUserDetails(userId, data);
    
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      router.push("/"); // Redirect to home
      return { success: true };
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return { success: false, error: result.error };
    }
  };

  return (
    <EditForm
      schema={signUpSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    />
  );
};

export default EditUserForm;
