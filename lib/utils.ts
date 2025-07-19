import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/*
Purpose:
This file contains common TypeScript/JavaScript utility functions used by Shadcn UI components
(like cn for className concatenation) .

&& 

components.json 
This file is used to configure the shadcn/ui components in a Next.js project.

Purpose:
This file tracks which Shadcn UI components you’ve added to your project. It acts as a registry 
so the CLI knows what’s already there and can help you manage or update them.
*/