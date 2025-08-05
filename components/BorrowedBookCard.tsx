import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BorrowedBook extends Book {
  borrowDate: Date;
  dueDate: string; // date field from schema in format "Wed Dec 15 2021"
  returnDate?: string | null; // nullable date field
  status: "BORROWED" | "RETURNED" | null;
}

const BorrowedBookCard = ({
  id,
  title,
  author,
  genre,
  coverColor,
  coverUrl,
  borrowDate,
  dueDate,
  returnDate,
  status,
}: BorrowedBook) => {
  // Fixed: Calculate days left properly to handle toDateString() format
  const getDaysLeft = () => {
    if (!dueDate) return 0;
    
    try {
      // Parse the date string format from toDateString() - "Wed Dec 15 2021"
      const due = new Date(dueDate);
      const today = new Date();
      
      // Set both dates to midnight to avoid time zone issues
      due.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('Error parsing due date:', dueDate, error);
      return 0;
    }
  };

  const daysLeft = getDaysLeft();
  const isReturned = status === "RETURNED";
  const isOverdue = !isReturned && daysLeft < 0; // Only overdue if not returned and past due date

  // Status display logic 
  const getStatusDisplay = () => {
    if (isReturned && returnDate) {
      return {
        icon: "/icons/user-fill.svg",
        text: `Returned on ${new Date(returnDate).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short' 
        })}`,
        color: "text-green-400"
      };
    } else if (isOverdue) {
      return {
        icon: "/icons/admin/trash.svg",
        text: "Overdue Return",
        color: "text-red-500"
      };
    } else if (daysLeft === 0) {
      return {
        icon: "/icons/clock.svg",
        text: "Due today",
        color: "text-yellow-500"
      };
    } else if (daysLeft === 1) {
      return {
        icon: "/icons/clock.svg",
        text: "01 day left to due",
        color: "text-orange-400"
      };
    } else {
      return {
        icon: "/icons/clock.svg",
        text: `${Math.abs(daysLeft).toString().padStart(2, '0')} days left to due`,
        color: "text-orange-400"
      };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <li className="xs:w-52 w-full">
      <Link href={`/books/${id}`} className="w-full flex flex-col items-center">
        <BookCover coverColor={coverColor} coverImage={coverUrl} />

        <div className="mt-4 xs:max-w-40 max-w-28">
          <p className="book-title">{title}</p>
          <p className="book-genre">By {author}</p>
          <p className="text-xs text-light-500 mt-1">{genre}</p>
        </div>

        <div className="mt-3 w-full">
          {/* Borrowed Date */}
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/icons/calendar.svg"
              alt="borrowed"
              width={16}
              height={16}
              className="object-contain"
            />
            <p className="text-xs text-blue-400">
              Borrowed on {new Date(borrowDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Status Display */}
          <div className="book-loaned mb-3">
            <Image
              src={statusInfo.icon}
              alt="status"
              width={16}
              height={16}
              className="object-contain"
            />
            <p className={cn("text-sm font-medium", statusInfo.color)}>
              {statusInfo.text}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default BorrowedBookCard;
