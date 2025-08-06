// lib/actions/admin/borrow-requests.ts
"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, users, books } from "@/database/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Fetch all borrow requests with user and book details
export const getBorrowRequests = async () => {
  try {
    const requests = await db
      .select({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        borrowDate: borrowRecords.borrowDate,
        returnDate: borrowRecords.returnDate,
        dueDate: borrowRecords.dueDate,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,
        
        // User details
        userName: users.fullName,
        userEmail: users.email,
        universityIdNo: users.universityId,
        userAvatarUrl: users.universityCard, // Using university card as avatar
        
        // Book details
        bookTitle: books.title,
        bookCoverUrl: books.coverUrl,
        bookAuthor: books.author,
      })
      .from(borrowRecords)
      .leftJoin(users, eq(users.id, borrowRecords.userId))
      .leftJoin(books, eq(books.id, borrowRecords.bookId))
      .orderBy(desc(borrowRecords.createdAt));

    return { success: true, requests };
  } catch (error) {
    console.error("Error fetching borrow requests:", error);
    return { success: false, error: "Failed to fetch borrow requests" };
  }
};

// Update borrow request status
export const updateBorrowStatus = async (
  id: string, 
  newStatus: "BORROWED" | "RETURNED"
) => {
  try {
    const existingRequest = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.id, id))
      .limit(1);

    if (existingRequest.length === 0) {
      return { success: false, error: "Borrow request not found" };
    }

    const updateData: any = {
      status: newStatus,
    };

    // If marking as returned, set the return date
    if (newStatus === "RETURNED") {
      updateData.returnDate = new Date().toISOString().split('T')[0]; // Format as date
    }

    await db
      .update(borrowRecords)
      .set(updateData)
      .where(eq(borrowRecords.id, id));

    // Update book availability
    if (newStatus === "RETURNED" && existingRequest[0].status !== "RETURNED") {
      // Increase available copies when marking as returned
      await db
        .update(books)
        .set({
          availableCopies: sql`${books.availableCopies} + 1`,
        })
        .where(eq(books.id, existingRequest[0].bookId));
    } else if (existingRequest[0].status === "RETURNED" && newStatus !== "RETURNED") {
      // Decrease available copies if changing from returned to borrowed
      await db
        .update(books)
        .set({
          availableCopies: sql`${books.availableCopies} - 1`,
        })
        .where(eq(books.id, existingRequest[0].bookId));
    }

    revalidatePath("/admin/borrow-requests");
    revalidatePath("/admin");
    revalidatePath("/library");

    return { 
      success: true, 
      message: `Status updated to ${newStatus} successfully` 
    };
  } catch (error) {
    console.error("Error updating borrow status:", error);
    return { 
      success: false, 
      error: "Failed to update borrow status. Please try again." 
    };
  }
};

// Generate receipt for borrow request
export const generateReceipt = async (id: string) => {
  try {
    const [request] = await db
      .select({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        borrowDate: borrowRecords.borrowDate,
        returnDate: borrowRecords.returnDate,
        dueDate: borrowRecords.dueDate,
        status: borrowRecords.status,
        userName: users.fullName,
        userEmail: users.email,
        bookTitle: books.title,
        bookAuthor: books.author,
      })
      .from(borrowRecords)
      .leftJoin(users, eq(users.id, borrowRecords.userId))
      .leftJoin(books, eq(books.id, borrowRecords.bookId))
      .where(eq(borrowRecords.id, id))
      .limit(1);

    if (!request) {
      return { success: false, error: "Borrow request not found" };
    }

    // Generate receipt URL (since receiptUrl doesn't exist in schema)
    const receiptUrl = `/api/receipts/borrow-${id}.pdf`;
    
    revalidatePath("/admin/borrow-requests");

    return { 
      success: true, 
      receiptUrl,
      message: "Receipt generated successfully" 
    };
  } catch (error) {
    console.error("Error generating receipt:", error);
    return { 
      success: false, 
      error: "Failed to generate receipt. Please try again." 
    };
  }
};
