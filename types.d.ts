/*this file is used to define TypeScript interfaces and types for a library management system, 
including user, book, and authentication details.

so we dont need to define types for every single object in the codebase.

typescript interfaces and types are used to define the structure of objects.

typescript interface is a way to define the shape of an object, including its properties and their types.
*/
// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   rating: number;
//   total_copies: number;
//   available_copies: number;
//   description: string;
//   color: string;
//   cover: string;
//   videoUrl: string;
//   summary: string;
//   createdAt: Date | null;
//   isLoanedBook: boolean;
// }
// use this below one when fetching from database
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
  isLoanedBook : boolean;
}

// interface for auth.ts file params
interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

// interface for Bookparams in book creation form, used in admin/actions/book.ts
interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

// interface for book borrowing params, used in actions/book.ts
interface BorrowBookParams {
  bookId: string;
  userId: string;
}
