// components/admin/BorrowRequestTableRow.tsx
"use client";

import React from "react";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import StatusSelector from "./StatusSelector";

interface BorrowRequestTableRowProps {
  id: string;
  bookTitle: string;
  bookCoverUrl?: string | null;
  userName: string;
  userEmail: string;
  userAvatarUrl?: string | null;
  status: "BORROWED" | "RETURNED";
  borrowedDate: string;
  returnDate: string | null;
  dueDate: string;
  receiptUrl?: string | null;
  onStatusChange: (id: string, newStatus: "BORROWED" | "RETURNED") => void;
  onGenerateReceipt: (id: string) => void;
}

const BorrowRequestTableRow = ({
  id,
  bookTitle,
  bookCoverUrl,
  userName,
  userEmail,
  userAvatarUrl,
  status,
  borrowedDate,
  returnDate,
  dueDate,
  receiptUrl,
  onStatusChange,
  onGenerateReceipt,
}: BorrowRequestTableRowProps) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Book Column */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Book Cover Thumbnail */}
          {bookCoverUrl ? (
            <BookCover
              coverImage={bookCoverUrl}
              coverColor="#f3f4f6" // Default color if not provided
              variant="extraSmall"
              className="w-10 h-14 rounded-md object-cover shadow-sm"
            />
            // <Image
            //   src={bookCoverUrl}
            //   alt={bookTitle}
            //   width={40}
            //   height={56}
            //   className="rounded-md object-cover shadow-sm"
            //   unoptimized
            // />
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
          
          {/* Book Title */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate max-w-48">
              {bookTitle}
            </p>
          </div>
        </div>
      </td>

      {/* User Requested Column */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* User Avatar in avatar show first letter of name*/}
          <Avatar className="w-8 h-8">
            
              <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                {getInitials(userName)}
              </AvatarFallback>
            
          </Avatar>
          
          {/* User Info */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userEmail}
            </p>
          </div>
        </div>
      </td>

      {/* Status Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusSelector
          currentStatus={status}
          onChange={(newStatus) => onStatusChange(id, newStatus)}
        />
      </td>

      {/* Borrowed Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {borrowedDate}
      </td>

      {/* Return Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {returnDate || "-"}
      </td>

      {/* Due Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dueDate}
      </td>

      {/* Receipt Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {receiptUrl ? (
          <a 
            href={receiptUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            View Receipt
          </a>
        ) : (
          <button
            onClick={() => onGenerateReceipt(id)}
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
          >
            Generate
          </button>
        )}
      </td>
    </tr>
  );
};

export default BorrowRequestTableRow;
