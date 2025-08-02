import { BookOverview } from "@/components/BookOverview";
import { BookList } from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

const Home = async () => {
    // const session = await auth();

  //   const latestBooks = (await db
  //     .select()
  //     .from(books)
  //     .limit(10)
  //     .orderBy(desc(books.createdAt))) as Book[];
  const result = await db.select().from(users);
  console.log(JSON.stringify(result, null, 2));

  return (
    <>
      {/* sampleBooks is an array of objects, each obj contains details of a book , present in constants*/}
      <BookOverview {...sampleBooks[0]} />
      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
