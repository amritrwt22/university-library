import dummyBooks from "../dummybooks.json";
import ImageKit from "imagekit";
import { books } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env.local" });

// Database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// ImageKit configuration for file uploads
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

// Function to upload images/videos to ImageKit
const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: url,           // Source URL of the image/video
      fileName,            // What to name the file
      folder,              // Which folder to store it in
    });

    return response.filePath; // Returns the imagekit file path for the uploaded file
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
  }
};
// Function to seed the database with dummy book data
const seed = async () => {
  console.log("Seeding data...");

  try {
    
    // Loop through each book in dummybooks.json
    for (const book of dummyBooks) {
      
      // 1. Upload book cover image to ImageKit
      const coverUrl = (await uploadToImageKit(
        book.coverUrl,              // Original URL from JSON
        `${book.title}.jpg`,        // New filename: ex- "Cracking the Coding Interview.jpg"
        "/books/covers",            // Folder: /books/covers
      )) as string;

       // 2. Upload book video to ImageKit  
       const videoUrl = (await uploadToImageKit(
        book.videoUrl,              // Original URL from JSON
        `${book.title}.mp4`,        // New filename: "Cracking the Coding Interview.mp4"
        "/books/videos",            // Folder: /books/videos
      )) as string;

      // 3. Insert book data into database
      await db.insert(books).values({
        ...book,        // Spread all original book properties
        coverUrl,       // Override with new ImageKit cover URL
        videoUrl,       // Override with new ImageKit video URL
      });
    }

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();
// this file seeds the database with dummy book data
// use command `npx tsx database/seed.ts` to run this file
// uses dummybooks.json as the source of data

/*
so in dummybooks.json, each book object has source coverUrl and videoUrl, 
we will use those url and upload them to our ImageKit account, get a new url
file path to it which we will store in the our database .


*/