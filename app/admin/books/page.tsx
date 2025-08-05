// app/admin/books/page.tsx
import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import BooksTable from "@/components/admin/books/BooksTable";
import { updateBook, deleteBook } from "@/lib/admin/actions/editbooks";
import { redirect } from "next/navigation";

const AllBooksPage = async () => {
  // Fetch all books from database, ordered by creation date descending
  const booksData = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      description: books.description,
      coverUrl: books.coverUrl,
      // isbn: books.isbn,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      createdAt: books.createdAt,
    })
    .from(books)
    .orderBy(desc(books.createdAt));

  // Format data for BooksTable component
  const formattedBooks = booksData.map((book) => ({
    id: book.id,
    title: book.title || "Untitled",
    author: book.author || "Unknown Author",
    genre: book.genre || "Unknown Genre",
    dateCreated: book.createdAt 
      ? new Date(book.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : "Unknown",
    coverUrl: book.coverUrl || null,
  }));

  // Edit handler - redirects to edit page (you can create this later)
  const handleEdit = async (id: string) => {
    "use server";
    redirect(`/admin/books/edit/${id}`);
  };

  // Delete handler - uses the deleteBook server action
  const handleDelete = async (id: string) => {
    "use server";
    await deleteBook(id);
  };

  return (
    <div className="p-6">
      
      <BooksTable
        books={formattedBooks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AllBooksPage;
