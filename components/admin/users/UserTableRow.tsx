// components/admin/UserTableRow.tsx
"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import RoleSelector from "./RoleSelector";
import Link from "next/link";
import Image from "next/image";

interface UserTableRowProps {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  role: "User" | "Admin";
  booksBorrowed: number;
  universityIdNo: string;
  universityIdCardUrl?: string;
  onRoleChange: (id: string, newRole: "User" | "Admin") => void;
  onDelete: (id: string) => void;
}

const UserTableRow = ({
  id,
  name,
  email,
  dateJoined,
  role,
  booksBorrowed,
  universityIdNo,
  universityIdCardUrl,
  onRoleChange,
  onDelete,
}: UserTableRowProps) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Name Column */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
        </div>
      </td>

      {/* Date Joined */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dateJoined}
      </td>

      {/* Role Selector */}
      <td className="px-6 py-4 whitespace-nowrap">
        <RoleSelector 
          currentRole={role} 
          onChange={(newRole) => onRoleChange(id, newRole)} 
        />
      </td>

      {/* Books Borrowed */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {booksBorrowed}
      </td>

      {/* University ID No */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
        {universityIdNo}
      </td>

      {/* University ID Card */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {universityIdCardUrl ? (
          <Link 
            href={universityIdCardUrl} 
            target="_blank" 
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            View ID Card
          </Link>
        ) : (
          <span className="text-gray-400">No ID Card</span>
        )}
      </td>

      {/* Action - Delete Button */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
          aria-label={`Delete ${name}`}
        >
          <Image 
            src="/icons/admin/trash.svg" 
            alt="Delete" 
            width={16} 
            height={16}
            className="opacity-70 hover:opacity-100"
          />
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;
