import { z } from "zod"; // zod is used for schema validation , used in form validation

// signUpSchema is used to validate the user input in the sign-up form.
export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z.coerce.number(),
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(8),
});

// signInSchema is used to validate the user input in the sign-in form.
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// bookSchema is used to validate the user input in the book creation form.
export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50), //trim removes whitespace from both ends of a string
  rating: z.coerce.number().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(10000), // coerce converts the value to a number, int ensures it is an integer, positive ensures it is greater than 0, and lte ensures it is less than or equal to 10000
  coverUrl: z.string().nonempty(),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i), // regex ensures the string is a valid hex color code
  videoUrl: z.string().nonempty(),
  summary: z.string().trim().min(10),
});

// this file is used to define validation schemas for user sign-up, sign-in, and book creation forms using zod.
// z is a TypeScript-first schema declaration and validation library.
// it provides a way to define schemas for objects and validate them against the defined schemas.
// these schemas are used to validate user input in forms, ensuring that the data is in the correct format and meets the specified requirements.