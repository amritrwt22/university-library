"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

// this function allows a user to borrow a book
export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params; // destructuring the params object to get userId and bookId

  try {
    // book is fetched from the database to check if it is available for borrowing
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1); // limit to 1 to ensure we only get one book record
    
    // if the book is not available or has no copies left, return an error
    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }
    
    // dueDate is used to set the return date for the book, 7 days from now
    const dueDate = dayjs().add(7, "day").format('YYYY-MM-DD');
    
    // a new borrow record is created in the database , connects user and book
    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });
    // after creating the borrow record, the book's available copies are updated
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

// this function allows a user to return a borrowed book
export const returnBook = async (userId: string, bookId: string) => {
  try {
    // Check if there's an active borrow record for this user and book
    const borrowRecord = await db
      .select({ id: borrowRecords.id })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED")
        )
      )
      .limit(1);

    // if no active borrow record found, return an error
    if (!borrowRecord.length) {
      return {
        success: false,
        error: "No active borrow record found for this book",
      };
    }

    // Update the borrow record to set return date and status to returned
    await db
      .update(borrowRecords)
      .set({
        returnDate: dayjs().format('YYYY-MM-DD'), // Current date in YYYY-MM-DD format
        status: "RETURNED"
      })
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED")
        )
      );

    // Increase the available copies of the book by 1
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (book.length) {
      await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies + 1 })
        .where(eq(books.id, bookId));
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/my-profile");
    
    return {
      success: true,
      message: "Book returned successfully!",
    };
  } catch (error) {
    console.error("Error returning book:", error);
    
    return {
      success: false,
      error: "An error occurred while returning the book",
    };
  }
};



// used for booking books - borrowbutton 
/*
this file contains the borrowBook function which allows a user to borrow a book.
It checks if the book is available, creates a borrow record, and updates the book's available copies.
*/