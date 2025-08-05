// app/admin/page.tsx
import React from "react";
import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import { count, eq, desc } from "drizzle-orm";
import StatsRow from "@/components/admin/StatsRow";
import MainContentGrid from "@/components/admin/MainContentGrid";

const AdminDashboard = async () => {
  // Fetch statistics from database
  const [totalUsers] = await db.select({ count: count() }).from(users);
  const [totalBooks] = await db.select({ count: count() }).from(books);
  const [borrowedBooks] = await db
    .select({ count: count() })
    .from(borrowRecords)
    .where(eq(borrowRecords.status, "BORROWED"));

  // Fetch recent borrow requests (active borrows)
  const recentBorrowRequestsData = await db
    .select({
      id: borrowRecords.id,
      // Book fields
      bookId: books.id,
      bookTitle: books.title,
      bookAuthor: books.author,
      bookCoverUrl: books.coverUrl,
      bookCoverColor: books.coverColor,
      // User fields
      userId: users.id,
      userName: users.fullName,
      userAvatar: users.universityCard,
      // Record fields - FIXED: Use the correct date field
      borrowDate: borrowRecords.borrowDate,
      createdAt: borrowRecords.createdAt, // When the borrow record was created
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(eq(borrowRecords.status, "BORROWED"))
    .orderBy(desc(borrowRecords.createdAt)) // Order by when borrow was created
    .limit(3);

  // Fetch pending account requests
  const pendingAccountRequestsData = await db
    .select({
      id: users.id,
      name: users.fullName,
      email: users.email,
      avatar: users.universityCard,
      createdAt: users.createdAt, // FIXED: Added user registration date
    })
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(desc(users.createdAt)) // Order by registration date
    .limit(6);

  // Fetch recent books - FIXED: Include createdAt
  const recentBooksData = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre, // FIXED: Added genre for display
      coverUrl: books.coverUrl,
      coverColor: books.coverColor,
      createdAt: books.createdAt, // FIXED: Added book creation date
    })
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(5); // FIXED: Get more books for scrolling

  // Format data for components
  const formattedBorrowRequests = recentBorrowRequestsData.map((item) => ({
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
    requestDate: item.createdAt, // FIXED: Use createdAt for when request was made
  }));

  const formattedAccountRequests = pendingAccountRequestsData.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    avatar: item.avatar,
    createdAt: item.createdAt, // FIXED: Added registration date
  }));

  const formattedRecentBooks = recentBooksData.map((item) => ({
    id: item.id,
    title: item.title,
    author: item.author,
    genre: item.genre, // FIXED: Added genre
    coverUrl: item.coverUrl,
    coverColor: item.coverColor,
    createdAt: item.createdAt, // FIXED: Added book creation date for display
  }));

  return (
    <div className="p-6 space-y-8">
      
      {/* Stats Cards Row */}
      <StatsRow
        borrowedBooks={borrowedBooks.count}
        totalUsers={totalUsers.count}
        totalBooks={totalBooks.count}
        borrowedTrend="2"
        usersTrend="1"
        booksTrend="2"
      />

      {/* Main Content Grid */}
      <MainContentGrid
        borrowRequests={formattedBorrowRequests}
        accountRequests={formattedAccountRequests}
        recentBooks={formattedRecentBooks}
      />
    </div>
  );
};

export default AdminDashboard;
