import { ReactNode } from "react"; // reactnode is used to type the children prop, which can be any valid React element
// valid react element means it can be a component, a string, a number, or an array of these types
import { Header } from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation"; // This is a client-side redirect
import { after } from "next/server"; 
// This is a server action that runs after the component renders - will be used to update the last activity date of the user in the database
import { db } from "@/database/drizzle"; // Importing the database instance to interact with the database
import { users } from "@/database/schema"; // Importing the users table schema for querying database for user data
import { eq } from "drizzle-orm"; // Importing the equality operator for querying the database used to check if the user exists in the database


// This is the main layout component for the application , app/layout is 
const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth(); // auth() is a function that fetches the current session from NextAuth.js, which contains information about the authenticated user

  if (!session) redirect("/sign-in"); // If there is no session, redirect the user to the sign-in page
  
  // the after function is used to run some code after the component renders, in this case, it updates the last activity date of the user in the database
  after(async () => {
    if (!session?.user?.id) return; // If there is no user ID in the session, do nothing
    // If the user is not authenticated, do nothing

    // Fetch the user from the database using the user ID from the session
    const user = await db 
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);
    
    // this condition checks if the user exists in the database and if the last activity date is the same as today's date
    // if the user exists and the last activity date is the same as today's date, do no   thing
    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
      return;
    
    // if user exists, update the last activity date of the user in the database
    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
  });

  return (
    <main className="root-container ">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
