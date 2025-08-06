// components/admin/BorrowRequestsList.tsx
"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import SectionHeader from "./SectionHeader";
import BookCover from "@/components/BookCover"; // Import your existing BookCover

interface BorrowRequest {
  id: string;
  book: {
    title: string;
    author: string;
    coverUrl: string;
    coverColor: string; // Add this field
  };
  user: {
    name: string;
    avatar?: string;
  };
  requestDate: Date;
}

interface BorrowRequestsListProps {
  requests: BorrowRequest[];
}

const BorrowRequestsList = ({ requests }: BorrowRequestsListProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <SectionHeader title="Borrow Requests" viewAllLink="/admin/borrowRequests" />
      
      <div className="space-y-4">
        {requests.slice(0, 3).map((request) => (
          <div key={request.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
            {/* Book Cover using your existing component */}
            <div className="w-[40px] h-[60px] flex-shrink-0">
              <BookCover
                coverColor={request.book.coverColor}
                coverImage={request.book.coverUrl}
                variant="extraSmall" // Use the smallest variant
                className="w-full h-full"
              />
            </div>
            
            {/* Book & User Info */}
            <div className="flex-1">
              <h4 className="font-medium text-black text-sm">{request.book.title}</h4>
              <p className="text-xs text-gray-600">By {request.book.author}</p>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="w-4 h-4">
                  <AvatarFallback className="text-xs bg-gray-200">
                    {getInitials(request.user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-500">{request.user.name}</span>
              </div>
            </div>
            
            {/* Date & Actions */}
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-2">
                {request.requestDate.toLocaleDateString('en-US')}
              </p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BorrowRequestsList;
