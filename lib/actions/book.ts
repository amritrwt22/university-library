"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

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
    const dueDate = dayjs().add(7, "day").toDate().toDateString();
    
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


// used for booking books - borrowbutton 
/*
this file contains the borrowBook function which allows a user to borrow a book.
It checks if the book is available, creates a borrow record, and updates the book's available copies.
*/