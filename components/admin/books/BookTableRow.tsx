// components/admin/BookTableRow.tsx
"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import BookCover from "@/components/BookCover";

interface BookTableRowProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  dateCreated: string;
  coverUrl?: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BookTableRow = ({
  id,
  title,
  author,
  genre,
  dateCreated,
  coverUrl,
  onEdit,
  onDelete,
}: BookTableRowProps) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Book Title Column with Cover */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Book Cover Thumbnail */}
          {coverUrl ? (
            <BookCover
              coverColor="#f3f4f6" // Default color if no cover image
              coverImage={coverUrl}
              variant="extraSmall"
              className="w-10 h-14 rounded-md shadow-sm"
            />
          ) : (
            <div className="w-10 h-14 bg-gray-200 rounded-md flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-gray-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Book Title and Subtitle */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer" 
               onClick={() => onEdit(id)}>
              {title}
            </p>
            <p className="text-xs text-gray-500 mt-1">Novel by</p>
          </div>
        </div>
      </td>

      {/* Author */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {author}
      </td>

      {/* Genre */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {genre}
      </td>

      {/* Date Created */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dateCreated}
      </td>

      {/* Action Buttons */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(id)}
            className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded"
            aria-label={`Edit ${title}`}
            title="Edit Book"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
            aria-label={`Delete ${title}`}
            title="Delete Book"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookTableRow;
