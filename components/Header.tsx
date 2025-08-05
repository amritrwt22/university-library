"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { getInitials, cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  return (
    <header className="my-10 flex justify-between items-center gap-5">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        <span className="text-white font-semibold text-lg">BookWise</span>
      </Link>


      {/* Profile Section */}
      <ul className="flex flex-row items-center gap-4">
        <li>
        <Link 
          href="/" 
          className={cn(
            "text-base cursor-pointer capitalize text-light-100 hover:text-white transition-colors",
            pathname === "/" && "text-white font-semibold"
          )}
        >
          Home
        </Link>
        </li>

        <li>
        <Link 
          href="/library" 
          className={cn(
            "text-base cursor-pointer capitalize text-light-100 hover:text-white transition-colors",
            pathname === "/library" && "text-white font-semibold"
          )}
        >
          Search
        </Link>
        </li>

        <li>
        <Link 
          href="/admin" 
          className={cn(
            "text-base cursor-pointer capitalize text-light-100 hover:text-white transition-colors",
            pathname === "/admin" && "text-white font-semibold"
          )}
        > 
          Admin
        </Link>
        </li>


        <li className="text-light-100 text-base">
          {session?.user?.name?.split(' ')[0] || "User"}
        </li>
        
        <li>
          <Link href="/my-profile">
            <Avatar className="w-8 h-8">
              {/* <AvatarImage src="https://github.com/shadcn.png"/> */}
              <AvatarFallback className="bg-primary text-dark-100 text-sm font-semibold">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>



        <li>
          <button 
            onClick={handleSignOut}
            type="button"
            className="text-light-100 hover:text-red-400 transition-colors p-1"
            aria-label="Sign out"
          >
            <Image 
              src="/icons/logout.svg" 
              alt="logout" 
              width={20} 
              height={20}
              className="opacity-70 hover:opacity-100"
            />
          </button>
        </li>

      </ul>
    </header>
  );
};
