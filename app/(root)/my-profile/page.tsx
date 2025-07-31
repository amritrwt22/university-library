import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import { BookList } from "@/components/BookList";
import { sampleBooks } from "@/constants";

const Page = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};
export default Page;

// this file is used to display the user's profile page
// it contains a button to logout the user and a list of borrowed books.
// the borrowed books are currently hardcoded in the sampleBooks array in constants.ts