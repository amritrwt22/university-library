import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BookOverview } from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import BookCard from "@/components/BookCard";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  // Fetch data based on id
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");

  // Fetch similar books based on genre (excluding current book)
  const similarBooks = await db
    .select()
    .from(books)
    .where(
      eq(books.genre, bookDetails.genre) &&
      ne(books.id, id) // Exclude current book
    )
    .limit(6); // Limit to 6 similar books

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>

          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        {/* Similar Books Section */}
        <div className="flex-1">
          {similarBooks.length > 0 && (
            <section className="flex flex-col gap-7">
              <h3>You might also like</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {similarBooks.map((book) => (
                  <div key={book.id} className="flex flex-col items-center gap-10">
                    <BookCard
                      {...book}
                      isLoanedBook={false}
                    />
                  </div>
                ))}
              </div>
              
              {/* Show genre info */}
              <p className="text-sm text-light-500 mt-4">
                More books in <span className="text-primary font-semibold">{bookDetails.genre}</span> category
              </p>
            </section>
          )}
          
          {/* Fallback if no similar books */}
          {similarBooks.length === 0 && (
            <section className="flex flex-col gap-7">
              <h3>You might also like</h3>
              <div className="text-center py-8">
                <p className="text-light-400">No similar books found in this category.</p>
                <p className="text-light-500 text-sm mt-2">
                  Check out our library for more great books!
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;

