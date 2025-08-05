import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import BorrowedBookCard from "@/components/BorrowedBookCard";

const BorrowedBookList = async () => {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Fetch borrowed books with borrow record details
  const borrowedBooksData = await db
    .select({
      // Book fields
      bookId: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      description: books.description,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      videoUrl: books.videoUrl,
      summary: books.summary,
      createdAt: books.createdAt,
      // Borrow record fields
      borrowRecordId: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, session.user.id))
    .orderBy(borrowRecords.borrowDate);

  if (borrowedBooksData.length === 0) {
    return (
      <section>
        <h2 className="font-bebas-neue text-4xl text-light-100 mb-6">Borrowed Books</h2>
        <div className="text-center py-12">
          
          <p className="text-light-400 text-lg mb-2">No borrowed books</p>
          <p className="text-light-500 text-sm">Visit the library to borrow some books</p>
        </div>
      </section>
    );
  }

  // Map data to BorrowedBook format
  const borrowedBooks = borrowedBooksData.map((item) => ({
    id: item.bookId,
    title: item.title,
    author: item.author,
    genre: item.genre,
    coverColor: item.coverColor,
    coverUrl: item.coverUrl,
    description: item.description,
    rating: item.rating,
    totalCopies: item.totalCopies,
    availableCopies: item.availableCopies,
    videoUrl: item.videoUrl,
    summary: item.summary,
    createdAt: item.createdAt,
    isLoanedBook: true,
    borrowDate: item.borrowDate,
    dueDate: item.dueDate,
    returnDate: item.returnDate,
    status: item.status,
  }));

  return (
    <section>
      <h2 className="font-bebas-neue text-4xl text-light-100 mb-6">Borrowed Books</h2>
      
      <ul className="book-list">
        {borrowedBooks.map((book) => (
          <BorrowedBookCard
            key={`${book.id}-${book.borrowDate}`}
            {...book}
          />
        ))}
      </ul>
    </section>
  );
};

export default BorrowedBookList;
