import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image' // Import the Image component
import BookCover from './BookCover' // Import the BookCover component



export const BookOverview = ({ 
  title,
  author,
  genre,
  rating,
  total_copies, 
  available_copies,
  description,
  color, 
  cover,
  videoUrl,
  summary,
  createdAt = null, // Default value for createdAt
} : Book) => {

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
            <Image src= "/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{total_copies}</span>
          </p>

          <p>
            Available Books <span>{available_copies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        <Button className='Book-Overview_btn'>
          <Image src="/icons/book.svg" alt="book" width={20} height={20} /> 
          <p className='text-sm'>Borrow Book</p> 
         </Button>
      </div>

    
      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={color}
            coverImage={cover}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={color}
              coverImage={cover}
            />
          </div>
        </div>
      </div>

    </section>
  )
}





/*
this component is used to display the overview of a book, including its title, author, genre, 
rating, total copies, available copies, description, and cover image.

# BookOverview component accepts a Book object as props and displays the book's details.

BookOverview uses the BookCover component to display the book's cover image and color.
BookCover component uses BookCoverSvg to display the book's side SVG.
*/