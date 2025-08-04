import { BookOverview } from "@/components/BookOverview";
import { BookList } from "@/components/BookList";
import { db } from "@/database/drizzle";
import { books} from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";


const Home = async () => {
    const session = await auth();

    const latestBooks = (await db
      .select()
      .from(books)
      .limit(10)
      .orderBy(desc(books.createdAt))) as Book[];
  

  return (
    <>
      {/* sampleBooks is an array of objects, each obj contains details of a book , present in constants*/}
      {/* <BookOverview {...sampleBooks[0]} /> */}
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />
      {/* first book is shown in the overview section */}
      
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)} //show all books except the first one
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
