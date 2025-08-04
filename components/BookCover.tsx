"use client";

import React from "react";
import { cn } from "@/lib/utils"; // utility function for className concatenation
import Image from "next/image"; // Next.js Image component for optimized image loading
import BookCoverSvg from "@/components/BookCoverSvg";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";

// this is a type definition for the different variants of book covers
type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

// this is a mapping of the BookCoverVariant to the corresponding CSS class names
const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

// this is the props interface for the BookCover component, interface Props defines the properties that the BookCover component accepts
interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string;
}

// this is the BookCover component, it accepts className, variant, coverColor, and coverImage as props
const BookCover = ({
  className,
  variant = "regular",  //default variant is "regular"
  coverColor = "#012B48", //default cover color
  coverImage = "https://placehold.co/400x600.png", //default cover image
}: Props) => {
  return (
    <div
    // the main container for the book cover, it applies styles based on the variant and className props
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      {/* BOOK SIDE SVG */}
      {/* This is a custom SVG component that represents the book's side, it uses the coverColor prop to set the color of the book cover */}
      <BookCoverSvg coverColor={coverColor} />

      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <IKImage
          path={coverImage}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt="Book cover"
          fill
          className="rounded-sm object-fill"
          loading="lazy"
          lqip={{ active: true }}
        />
        <Image src={coverImage} 
        alt="Book cover" 
        fill 
        className="rounded-sm object-fill"/>
      </div>
    </div>
  );
};
export default BookCover;


// This component is used to display a book cover with a specific style and image.
// It uses the Next.js Image component for optimized image loading and a custom SVG for the book's side.