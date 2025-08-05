import React from "react";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  session: any; // Pass session from your admin layout
}

const Header = ({ session }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between pt-0 pb-4 w-full">
      {/* Left Side - Welcome Message */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Welcome, {session?.user?.name?.split(' ')[0] || "Admin"}
          </h1>
          <p className="text-sm text-gray-600">
            Monitor all of your projects and tasks here
          </p>
        </div>
      </div>

      {/* Right Side - Search Bar and Logout */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        {/* <div className="relative">
          <Image 
            src="/icons/search-fill.svg" 
            alt="search" 
            width={16} 
            height={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50"
          />
          <input
            type="text"
            placeholder="Search users, books by title, author, or genre"
            className="w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div> */}

        {/* Logout Button */}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-100">
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
