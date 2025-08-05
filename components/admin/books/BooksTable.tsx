// components/admin/BooksTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookTableRow from "./BookTableRow";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  dateCreated: string;
  coverUrl?: string | null;
}

interface BooksTableProps {
  books: Book[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BooksTable = ({ books, onEdit, onDelete }: BooksTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Filter books based on search term
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const lowerTerm = searchTerm.toLowerCase();
      return (
        book.title.toLowerCase().includes(lowerTerm) ||
        book.author.toLowerCase().includes(lowerTerm) ||
        book.genre.toLowerCase().includes(lowerTerm)
      );
    });
  }, [searchTerm, books]);

  // Sort books by title
  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      if (titleA < titleB) return sortAscending ? -1 : 1;
      if (titleA > titleB) return sortAscending ? 1 : -1;
      return 0;
    });
  }, [filteredBooks, sortAscending]);

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  const handleEdit = async (id: string) => {
    try {
      onEdit(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to edit book",
        variant: "destructive",
      });
    }
  };
  // Handle book deletion with confirmation first using toast
  const handleDelete = async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await onDelete(id);
        toast({
          title: "Success",
          description: "Book deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete book",
          variant: "destructive",
        });
      }
    }
  };

  // Navigate to create book page
  const handleCreateBook = () => {
    router.push('/admin/books/new');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Books</h1>
          <p className="text-gray-600 text-sm mt-1">
            {sortedBooks.length} book{sortedBooks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search book by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          
          {/* A-Z Sort Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSort}
            className="px-4 py-2 text-sm font-medium"
          >
            A-Z {sortAscending ? "↓" : "↑"}
          </Button>
          
          {/* Create New Book Button - Just navigates to /admin/books/new */}
          <Button
            onClick={handleCreateBook}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
            size="sm"
          >
            + Create a New Book
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No books found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? "Try adjusting your search criteria" : "No books have been added yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedBooks.map((book) => (
                  <BookTableRow
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    dateCreated={book.dateCreated}
                    coverUrl={book.coverUrl}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BooksTable;
