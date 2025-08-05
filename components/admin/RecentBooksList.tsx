// components/admin/RecentBooksList.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import BookCover from "@/components/BookCover";

interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  coverUrl: string;
  coverColor: string; // Added for BookCover component
  createdAt?: Date;
}

interface RecentBooksListProps {
  books: Book[];
}

const RecentBooksList = ({ books }: RecentBooksListProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full flex flex-col">
      <SectionHeader title="Recently Added Books" viewAllLink="/admin/books" />
      
      {/* Add New Book Button */}
      <Button asChild className="w-full mb-4">
        <Link href="/admin/books/new" className="flex items-center gap-2">
          <span>+</span>
          Add New Book
        </Link>
      </Button>
      
      {/* Scrollable Book List */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-3">
          {books.map((book) => (
            <div 
              key={book.id} 
              className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
            >
              {/* Book Cover using BookCover component */}
              <div className="w-12 h-16 flex-shrink-0">
                <BookCover 
                  coverColor={book.coverColor} 
                  coverImage={book.coverUrl}
                  variant="extraSmall"
                  className="w-full h-full"
                />
              </div>
              
              {/* Book Details */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h4 className="font-medium text-black text-sm leading-tight mb-1">
                  {book.title}
                </h4>
                
                {/* Author */}
                <p className="text-xs text-gray-600 mb-1">
                  By {book.author}
                </p>
                
                {/* Genre */}
                {book.genre && (
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    {book.genre}
                  </p>
                )}
                
                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg 
                    className="w-3 h-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <span>
                    {book.createdAt 
                      ? book.createdAt.toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: '2-digit'
                        })
                      : '12/01/24'
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentBooksList;
