import React from "react";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import BorrowBook from "@/components/BorrowBook";
import ReturnBook from "@/components/ReturnBook";
import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";

interface Props extends Book {
  userId: string;
}

export const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  id,
  userId,
}: Props) => {
  // Fetch user data to check borrowing eligibility
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Check if this book is currently borrowed by the user
  const borrowedByUser = await db
    .select()
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.bookId, id),
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED")
      )
    )
    .limit(1);

  const isBorrowed = borrowedByUser.length > 0;

  // Borrowing eligibility (only relevant if book is not already borrowed)
  const borrowingEligibility = {
    isEligible: availableCopies > 0 && user?.status === "APPROVED" && !isBorrowed,
    message: isBorrowed 
      ? "You have already borrowed this book"
      : availableCopies <= 0
      ? "Book is not available"
      : "You are not eligible to borrow this book",
  };

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{totalCopies}</span>
          </p>

          <p>
            Available Books <span>{availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        {user && (
          isBorrowed ? (
            // Show Return Book button if user has borrowed this book
            <ReturnBook
              bookId={id}
              userId={userId}
              bookTitle={title}
            />
          ) : (
            // Show Borrow Book button if user hasn't borrowed this book
            <BorrowBook
              bookId={id}
              userId={userId}
              borrowingEligibility={borrowingEligibility}
            />
          )
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};



/*
this component is used to display the overview of a book, including its title, author, genre, 
rating, total copies, available copies, description, and cover image.

# BookOverview component accepts a Book object as props and displays the book's details.

BookOverview uses the BookCover component to display the book's cover image and color.
BookCover component uses BookCoverSvg to display the book's side SVG.
*/