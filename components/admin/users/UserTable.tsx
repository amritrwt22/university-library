// components/admin/UsersTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import UserTableRow from "./UserTableRow";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  role: "User" | "Admin";
  booksBorrowed: number;
  universityIdNo: string;
  universityIdCardUrl?: string;
}

interface UsersTableProps {
  users: User[];
  onRoleChange: (id: string, newRole: "User" | "Admin") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const UsersTable = ({ users, onRoleChange, onDelete }: UsersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

 // Filter users based on search term - 
const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const lowerTerm = searchTerm.toLowerCase();
      
      // Convert universityIdNo to string safely
      const universityIdStr = user.universityIdNo ? String(user.universityIdNo).toLowerCase() : '';
      
      return (
        user.name.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm) ||
        universityIdStr.includes(lowerTerm) ||
        user.role.toLowerCase().includes(lowerTerm)
      );
    });
  }, [searchTerm, users]);
  

  // Sort users
  const sortedUsers = useMemo(() => {
    if (!sortField) return filteredUsers;
  
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
  
      // Handle numeric sorting for booksBorrowed
      if (sortField === 'booksBorrowed') {
        const numA = Number(aValue);
        const numB = Number(bValue);
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }
  
      // Handle string sorting for all other fields
      if (typeof aValue === "string" && typeof bValue === "string") {
        const stringA = aValue.toLowerCase();
        const stringB = bValue.toLowerCase();
        
        if (stringA < stringB) return sortDirection === "asc" ? -1 : 1;
        if (stringA > stringB) return sortDirection === "asc" ? 1 : -1;
      }
  
      // Handle mixed types or fallback
      if(typeof aValue === "number" && typeof bValue === "number") {
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRoleChange = async (id: string, newRole: "User" | "Admin") => {
    try {
      await onRoleChange(id, newRole);
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await onDelete(id);
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const SortHeader = ({ field, children }: { field: keyof User; children: React.ReactNode }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-gray-400">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header Section with Search and Tip */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Users</h1>
          <p className="text-gray-600 text-sm mt-1">
            {sortedUsers.length} user{sortedUsers.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search user by name, email, or university ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          
          {/* Sorting Tip */}
          <div className="text-right">
            <p className="text-sm text-gray-500 italic">
              💡 Click column headers to sort
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortHeader field="name">Name</SortHeader>
                <SortHeader field="dateJoined">Date Joined</SortHeader>
                <SortHeader field="role">Role</SortHeader>
                <SortHeader field="booksBorrowed">Books Borrowed</SortHeader>
                <SortHeader field="universityIdNo">University ID No</SortHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University ID Card
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? "Try adjusting your search criteria" : "No users have been added yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    email={user.email}
                    dateJoined={user.dateJoined}
                    role={user.role}
                    booksBorrowed={user.booksBorrowed}
                    universityIdNo={user.universityIdNo}
                    universityIdCardUrl={user.universityIdCardUrl}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
