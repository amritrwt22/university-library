"use client";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { getInitials, cn } from "@/lib/utils";

import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { signOut } from "@/auth";


export const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link href="/library" className="text-base cursor-pointer capitalize bg-white" >
            Library
          </Link>
        </li>

        <li>
          <Link href="/my-profile"> 

          <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png"/> */}
            <AvatarFallback className="bg-amber-100">{getInitials(session?.user?.name || "IN")}</AvatarFallback>
          </Avatar>
          
          </Link>
        </li>

      </ul>
    </header>
  );
};




