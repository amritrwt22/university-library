import React from "react";
import BookCard from "./BookCard";


interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
}

export const BookList = ({ title, books, containerClassName }: Props) => {
  if (books.length < 2) return;

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
          // why need key? because react needs a way to identify which items have changed, are added, or are removed
          // if you don't provide a key, react will throw a warning
        ))}
      </ul>
    </section>
  );
};



// this component will display a list of books

