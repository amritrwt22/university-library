// components/search/SearchResults.tsx - Updated for your dark theme
import React from "react";
import BookCard from "@/components/BookCard"; // Your existing BookCard
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  videoUrl: string;
  summary: string;
}

interface SearchResultsProps {
  books: Book[];
  query: string;
}

const SearchResults = ({ books, query }: SearchResultsProps) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-16 w-16 text-light-500 mb-4" />
        <h3 className="text-xl font-semibold text-light-100 mb-2">No books found</h3>
        <p className="text-light-400 mb-6 max-w-md mx-auto">
          {query ? (
            <>
              We couldn't find any books matching <strong className="text-light-200">"{query}"</strong>. 
              Try adjusting your search terms or browse all books.
            </>
          ) : (
            "No books match your current filters. Try adjusting your criteria."
          )}
        </p>
        <div className="space-x-4">
          <Button asChild variant="outline" className="bg-dark-400 border-dark-500 text-light-200 hover:bg-dark-200 hover:text-light-100">
            <Link href="/search">
              Clear Search
            </Link>
          </Button>
          <Button asChild className="bg-primary-500 hover:bg-primary-600 text-white border-0">
            <Link href="/">
              Browse All Books
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard 
            key={book.id}
            {...book}  // ✅ Spread book properties (fixed from previous error)
            searchQuery={query} // Pass search query for highlighting
          />
        ))}
      </div>

      {/* Load More / Pagination can be added here */}
    </div>
  );
};

export default SearchResults;
