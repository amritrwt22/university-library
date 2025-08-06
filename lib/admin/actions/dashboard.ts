// lib/admin/actions/dashboard.ts
"use server";

import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import { count, eq, desc } from "drizzle-orm";

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [totalBooks] = await db.select({ count: count() }).from(books);
    const [borrowedBooks] = await db
      .select({ count: count() })
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "BORROWED"));

    return {
      success: true,
      stats: {
        totalUsers: totalUsers.count,
        totalBooks: totalBooks.count,
        borrowedBooks: borrowedBooks.count
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard statistics" };
  }
};

// Get recent borrow requests
export const getRecentBorrowRequests = async (limit: number = 3) => {
  try {
    const recentBorrowRequestsData = await db
      .select({
        id: borrowRecords.id,
        bookId: books.id,
        bookTitle: books.title,
        bookAuthor: books.author,
        bookCoverUrl: books.coverUrl,
        bookCoverColor: books.coverColor,
        userId: users.id,
        userName: users.fullName,
        userAvatar: users.universityCard,
        borrowDate: borrowRecords.borrowDate,
        createdAt: borrowRecords.createdAt,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.status, "BORROWED"))
      .orderBy(desc(borrowRecords.createdAt))
      .limit(limit);

    const formattedRequests = recentBorrowRequestsData.map((item) => ({
      id: item.id,
      book: {
        title: item.bookTitle,
        author: item.bookAuthor,
        coverUrl: item.bookCoverUrl,
        coverColor: item.bookCoverColor,
      },
      user: {
        name: item.userName,
        avatar: item.userAvatar,
      },
      requestDate: item.createdAt,
    }));

    return { success: true, requests: formattedRequests };
  } catch (error) {
    console.error("Error fetching recent borrow requests:", error);
    return { success: false, error: "Failed to fetch borrow requests" };
  }
};

// Get pending account requests
export const getPendingAccountRequests = async (limit: number = 6) => {
  try {
    const pendingAccountRequestsData = await db
      .select({
        id: users.id,
        name: users.fullName,
        email: users.email,
        avatar: users.universityCard,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(desc(users.createdAt))
      .limit(limit);

    const formattedRequests = pendingAccountRequestsData.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      avatar: item.avatar,
      createdAt: item.createdAt,
    }));

    return { success: true, requests: formattedRequests };
  } catch (error) {
    console.error("Error fetching pending account requests:", error);
    return { success: false, error: "Failed to fetch account requests" };
  }
};

// Get recent books
export const getRecentBooks = async (limit: number = 5) => {
  try {
    const recentBooksData = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
        createdAt: books.createdAt,
      })
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(limit);

    const formattedBooks = recentBooksData.map((item) => ({
      id: item.id,
      title: item.title,
      author: item.author,
      genre: item.genre,
      coverUrl: item.coverUrl,
      coverColor: item.coverColor,
      createdAt: item.createdAt,
    }));

    return { success: true, books: formattedBooks };
  } catch (error) {
    console.error("Error fetching recent books:", error);
    return { success: false, error: "Failed to fetch recent books" };
  }
};
