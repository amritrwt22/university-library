// lib/actions/search.ts
"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { ilike, or, and, desc, asc, eq, gt, sql, count } from "drizzle-orm";

interface SearchOptions {
  query?: string;
  genre?: string;
  availability?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

interface SearchResult {
  success: boolean;
  books: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  error?: string;
}

export const searchBooks = async ({
  query = "",
  genre = "",
  availability = "",
  sortBy = "relevance",
  page = 1,
  limit = 20
}: SearchOptions): Promise<SearchResult> => {
  try {
    let whereConditions = [];

    // Text search across multiple fields
    if (query && query.trim()) {
      const searchTerm = query.trim();
      whereConditions.push(
        or(
          ilike(books.title, `%${searchTerm}%`),
          ilike(books.author, `%${searchTerm}%`),
          ilike(books.genre, `%${searchTerm}%`),
          ilike(books.description, `%${searchTerm}%`),
          ilike(books.summary, `%${searchTerm}%`)
        )
      );
    }

    // Genre filter
    if (genre && genre !== "all") {
      whereConditions.push(eq(books.genre, genre));
    }

    // Availability filter
    if (availability && availability !== "all") {
      if (availability === "available") {
        whereConditions.push(gt(books.availableCopies, 0));
      } else if (availability === "unavailable") {
        whereConditions.push(eq(books.availableCopies, 0));
      }
    }

    // Get total count for pagination
    let countQuery = db
      .select({ count: count() })
      .from(books)
      .$dynamic();

    if (whereConditions.length > 0) {
      countQuery = countQuery.where(and(...whereConditions));
    }

    const [{ count: totalCount }] = await countQuery;
    const totalPages = Math.ceil(Number(totalCount) / limit);

    // Build main search query
    let searchQuery = db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        rating: books.rating,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
        description: books.description,
        totalCopies: books.totalCopies,
        availableCopies: books.availableCopies,
        videoUrl: books.videoUrl,
        summary: books.summary,
        createdAt: books.createdAt
      })
      .from(books)
      .$dynamic();

    // Apply where conditions
    if (whereConditions.length > 0) {
      searchQuery = searchQuery.where(and(...whereConditions));
    }

    // Apply sorting
    switch (sortBy) {
      case "title_asc":
        searchQuery = searchQuery.orderBy(asc(books.title));
        break;
      case "title_desc":
        searchQuery = searchQuery.orderBy(desc(books.title));
        break;
      case "author_asc":
        searchQuery = searchQuery.orderBy(asc(books.author));
        break;
      case "rating_desc":
        searchQuery = searchQuery.orderBy(desc(books.rating), asc(books.title));
        break;
      case "rating_asc":
        searchQuery = searchQuery.orderBy(asc(books.rating), asc(books.title));
        break;
      case "newest":
        searchQuery = searchQuery.orderBy(desc(books.createdAt));
        break;
      case "oldest":
        searchQuery = searchQuery.orderBy(asc(books.createdAt));
        break;
      default: // relevance
        if (query && query.trim()) {
          // For text searches, prioritize rating then title
          searchQuery = searchQuery.orderBy(desc(books.rating), asc(books.title));
        } else {
          // For browse all, show highest rated first
          searchQuery = searchQuery.orderBy(desc(books.rating), desc(books.createdAt));
        }
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    searchQuery = searchQuery.limit(limit).offset(offset);

    const results = await searchQuery;

    return {
      success: true,
      books: results,
      total: Number(totalCount),
      totalPages,
      currentPage: page
    };

  } catch (error) {
    console.error("Error searching books:", error);
    return {
      success: false,
      books: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      error: "Failed to search books. Please try again."
    };
  }
};

// Get search suggestions for autocomplete
export const getSearchSuggestions = async (query: string) => {
  try {
    if (!query.trim() || query.length < 2) {
      return { success: true, suggestions: [] };
    }

    const searchTerm = query.trim();

    // Get title suggestions
    const titleSuggestions = await db
      .select({
        type: sql<string>`'title'`,
        value: books.title,
        author: books.author
      })
      .from(books)
      .where(ilike(books.title, `${searchTerm}%`))
      .orderBy(desc(books.rating))
      .limit(5);

    // Get author suggestions
    const authorSuggestions = await db
      .select({
        type: sql<string>`'author'`,
        value: books.author,
        author: books.author
      })
      .from(books)
      .where(ilike(books.author, `${searchTerm}%`))
      .groupBy(books.author)
      .orderBy(books.author)
      .limit(3);

    const suggestions = [
      ...titleSuggestions.map(s => ({
        type: s.type,
        value: s.value,
        author: s.author
      })),
      ...authorSuggestions.map(s => ({
        type: s.type,
        value: s.value,
        author: s.author
      }))
    ];

    return { success: true, suggestions };
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return { success: false, error: "Failed to get suggestions", suggestions: [] };
  }
};

// Get available genres for filter dropdown
export const getAvailableGenres = async () => {
  try {
    const genres = await db
      .selectDistinct({ genre: books.genre })
      .from(books)
      .where(gt(books.totalCopies, 0))
      .orderBy(asc(books.genre));

    return { 
      success: true, 
      genres: genres.map(g => g.genre).filter(Boolean)
    };
  } catch (error) {
    console.error("Error fetching genres:", error);
    return { 
      success: false, 
      error: "Failed to fetch genres", 
      genres: [] 
    };
  }
};

// Get popular searches (based on highest rated books)
export const getPopularBooks = async (limit: number = 10) => {
  try {
    const popularBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        rating: books.rating,
        coverUrl: books.coverUrl
      })
      .from(books)
      .where(gt(books.availableCopies, 0))
      .orderBy(desc(books.rating), desc(books.createdAt))
      .limit(limit);

    return { success: true, books: popularBooks };
  } catch (error) {
    console.error("Error fetching popular books:", error);
    return { success: false, error: "Failed to fetch popular books", books: [] };
  }
};

// Advanced search with multiple criteria
export const advancedSearch = async ({
  title,
  author,
  genre,
  minRating,
  maxRating,
  availableOnly = false,
  sortBy = "relevance",
  page = 1,
  limit = 20
}: {
  title?: string;
  author?: string;
  genre?: string;
  minRating?: number;
  maxRating?: number;
  availableOnly?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    let whereConditions = [];

    // Title search
    if (title && title.trim()) {
      whereConditions.push(ilike(books.title, `%${title.trim()}%`));
    }

    // Author search
    if (author && author.trim()) {
      whereConditions.push(ilike(books.author, `%${author.trim()}%`));
    }

    // Genre filter
    if (genre && genre !== "all") {
      whereConditions.push(eq(books.genre, genre));
    }

    // Rating range
    if (minRating !== undefined && minRating > 0) {
      whereConditions.push(sql`${books.rating} >= ${minRating}`);
    }
    if (maxRating !== undefined && maxRating < 5) {
      whereConditions.push(sql`${books.rating} <= ${maxRating}`);
    }

    // Available only
    if (availableOnly) {
      whereConditions.push(gt(books.availableCopies, 0));
    }

    // Get total count
    let countQuery = db
      .select({ count: count() })
      .from(books)
      .$dynamic();

    if (whereConditions.length > 0) {
      countQuery = countQuery.where(and(...whereConditions));
    }

    const [{ count: totalCount }] = await countQuery;
    const totalPages = Math.ceil(Number(totalCount) / limit);

    // Build main query
    let searchQuery = db
      .select()
      .from(books)
      .$dynamic();

    if (whereConditions.length > 0) {
      searchQuery = searchQuery.where(and(...whereConditions));
    }

    // Apply sorting
    switch (sortBy) {
      case "title_asc":
        searchQuery = searchQuery.orderBy(asc(books.title));
        break;
      case "title_desc":
        searchQuery = searchQuery.orderBy(desc(books.title));
        break;
      case "author_asc":
        searchQuery = searchQuery.orderBy(asc(books.author));
        break;
      case "rating_desc":
        searchQuery = searchQuery.orderBy(desc(books.rating));
        break;
      case "newest":
        searchQuery = searchQuery.orderBy(desc(books.createdAt));
        break;
      default:
        searchQuery = searchQuery.orderBy(desc(books.rating), asc(books.title));
    }

    const results = await searchQuery
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      success: true,
      books: results,
      total: Number(totalCount),
      totalPages,
      currentPage: page
    };

  } catch (error) {
    console.error("Error in advanced search:", error);
    return {
      success: false,
      books: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      error: "Advanced search failed. Please try again."
    };
  }
};

// Get book by ID (for individual book pages)
export const getBookById = async (id: string) => {
  try {
    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    if (!book) {
      return { success: false, error: "Book not found", book: null };
    }

    return { success: true, book };
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return { success: false, error: "Failed to fetch book", book: null };
  }
};

// Get related books (same genre, different books)
export const getRelatedBooks = async (bookId: string, genre: string, limit: number = 6) => {
  try {
    const relatedBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        rating: books.rating,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor
      })
      .from(books)
      .where(
        and(
          eq(books.genre, genre),
          sql`${books.id} != ${bookId}`, // Exclude current book
          gt(books.totalCopies, 0)
        )
      )
      .orderBy(desc(books.rating))
      .limit(limit);

    return { success: true, books: relatedBooks };
  } catch (error) {
    console.error("Error fetching related books:", error);
    return { success: false, error: "Failed to fetch related books", books: [] };
  }
};
