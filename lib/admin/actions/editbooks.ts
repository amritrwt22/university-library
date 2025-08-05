// lib/actions/admin/books.ts
"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface BookData {
  title: string;
  author: string;
  genre: string;
  description?: string;
  coverUrl?: string | null;
  isbn?: string;
  totalCopies?: number;
  availableCopies?: number;
}


export const updateBook = async (bookId: string, data: BookData) => {
  try {
    // Check if book exists
    const existingBook = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (existingBook.length === 0) {
      return { success: false, error: "Book not found" };
    }

    // Validate required fields
    if (!data.title || !data.author || !data.genre) {
      return { success: false, error: "Title, author, and genre are required" };
    }

    const [updatedBook] = await db
      .update(books)
      .set({
        title: data.title,
        author: data.author,
        genre: data.genre,
        description: data.description ,
        coverUrl: data.coverUrl || existingBook[0].coverUrl,
        isbn: data.isbn || null,
        totalCopies: data.totalCopies || existingBook[0].totalCopies,
        availableCopies: data.availableCopies || existingBook[0].availableCopies,
        updatedAt: new Date(),
      })
      .where(eq(books.id, bookId))
      .returning();

    revalidatePath("/admin/books");
    revalidatePath("/admin");
    revalidatePath("/library");

    return { 
      success: true, 
      message: "Book updated successfully",
      book: updatedBook 
    };
  } catch (error) {
    console.error("Error updating book:", error);
    return { 
      success: false, 
      error: "Failed to update book. Please try again." 
    };
  }
};

export const deleteBook = async (bookId: string) => {
  try {
    // Check if book exists
    const existingBook = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (existingBook.length === 0) {
      return { success: false, error: "Book not found" };
    }

    // Check if book has active borrows
    const activeBorrows = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.bookId, bookId))
      .limit(1);

    if (activeBorrows.length > 0) {
      return { 
        success: false, 
        error: "Cannot delete book with active borrow records. Please wait for all copies to be returned." 
      };
    }

    // Delete the book
    await db.delete(books).where(eq(books.id, bookId));

    revalidatePath("/admin/books");
    revalidatePath("/admin");
    revalidatePath("/library");

    return { 
      success: true, 
      message: `"${existingBook[0].title}" has been deleted successfully` 
    };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { 
      success: false, 
      error: "Failed to delete book. Please try again." 
    };
  }
};

// Get single book by ID (useful for edit forms)
export const getBookById = async (bookId: string) => {
  try {
    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    return { success: true, book };
  } catch (error) {
    console.error("Error fetching book:", error);
    return { success: false, error: "Failed to fetch book" };
  }
};


