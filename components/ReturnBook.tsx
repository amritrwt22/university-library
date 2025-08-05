"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { returnBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  bookTitle: string;
}

const ReturnBook = ({ userId, bookId, bookTitle }: Props) => {
  const router = useRouter();
  const [returning, setReturning] = useState(false);

  const handleReturnBook = async () => {
    setReturning(true);

    try {
      const result = await returnBook(userId, bookId);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });

        // Refresh the current page to show updated status
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while returning the book",
        variant: "destructive",
      });
    } finally {
      setReturning(false);
    }
  };

  return (
    <Button
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      onClick={handleReturnBook}
      disabled={returning}
    >
      <Image src="/icons/user-fill.svg" alt="return" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-white">
        {returning ? "Returning..." : "Return Book"}
      </p>
    </Button>
  );
};

export default ReturnBook;
