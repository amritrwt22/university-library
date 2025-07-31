"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues,FieldValues,Path,SubmitHandler,useForm,UseFormReturn,} from "react-hook-form";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "@/components/ImageUpload"; //using imagekit for id image upload
// import FileUpload from "@/components/FileUpload";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";



// this interface defines the props for the AuthForm component
interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}




// <T extends FieldValues> is a generic type that allows the component to accept any type of form data, making it flexible for different forms.
// anydata means that the form can accept any type of data structure, as long as it conforms to the Zod schema provided in the props.
// zod schema is used to validate the form data, ensuring that it meets the specified requirements before submission.
const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  // useRouter is a hook from Next.js that allows us to programmatically navigate to different pages.
  const router = useRouter();

  // isSignIn is a boolean that indicates whether the form is for signing in or signing up.
  const isSignIn = type === "SIGN_IN";
  
  // useForm is a hook from react-hook-form that provides methods and properties to manage form state and validation.
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // this function handles the sign-in or sign-up form submission 
  const handleSubmit: SubmitHandler<T> = async (data) => {
    
    //onSubmit is a function that takes the form data as an argument and returns a promise that resolves to an object with success and error properties.
    const result = await onSubmit(data); // onSubmit is a prop function passed to the AuthForm component, which is called when the form is submitted.
    
    // result is an object that contains the success status and an optional error message.
    if (result.success) {
      toast({
        title: "Success",
        description: isSignIn
          ? "You have successfully signed in."
          : "You have successfully signed up.",
      });
   
      router.push("/"); // Redirect to the home page after successful sign-in or sign-up
    } else {
      toast({
        title: `Error ${isSignIn ? "signing in" : "signing up"}`,
        description: result.error ?? "An error occurred.",
        variant: "destructive", 
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? (
                      // Using ImageUpload component for universityCard field
                      <ImageUpload
                        type="image"
                        accept="image/*"
                        placeholder="Upload your ID"
                        folder="ids"
                        variant="dark"
                        onFileChange={field.onChange}
                      />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className="form-input"
                      />
                    )}        
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}

        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;
