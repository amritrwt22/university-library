// components/admin/BorrowRequestsTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BorrowRequestTableRow from "./BorrowRequestTableRow";
import { useToast } from "@/hooks/use-toast";

interface BorrowRequest {
  id: string;
  bookTitle: string;
  bookCoverUrl?: string | null;
  userName: string;
  userEmail: string;
  userAvatarUrl?: string | null;
  status: "BORROWED" | "RETURNED";
  borrowedDate: string;
  returnDate: string | null;
  dueDate: string;
  receiptUrl?: string | null;
}

interface BorrowRequestsTableProps {
  requests: BorrowRequest[];
  onStatusChange: (id: string, newStatus: "BORROWED" | "RETURNED") => Promise<void>;
  onGenerateReceipt: (id: string) => Promise<void>;
}

const BorrowRequestsTable = ({ 
  requests, 
  onStatusChange, 
  onGenerateReceipt 
}: BorrowRequestsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOldestFirst, setSortOldestFirst] = useState(true);
  const { toast } = useToast();

  // Filter requests based on search term
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const lowerTerm = searchTerm.toLowerCase();
      return (
        request.bookTitle.toLowerCase().includes(lowerTerm) ||
        request.userName.toLowerCase().includes(lowerTerm) ||
        request.userEmail.toLowerCase().includes(lowerTerm) ||
        request.status.toLowerCase().includes(lowerTerm)
      );
    });
  }, [searchTerm, requests]);

  // Sort requests by borrowed date
  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      const dateA = new Date(a.borrowedDate);
      const dateB = new Date(b.borrowedDate);
      
      return sortOldestFirst 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });
  }, [filteredRequests, sortOldestFirst]);

  const toggleSort = () => {
    setSortOldestFirst(!sortOldestFirst);
  };

  const handleStatusChange = async (id: string, newStatus: "BORROWED" | "RETURNED") => {
    try {
      await onStatusChange(id, newStatus);
      toast({
        title: "Success",
        description: `Status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReceipt = async (id: string) => {
    try {
      await onGenerateReceipt(id);
      toast({
        title: "Success",
        description: "Receipt generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate receipt",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Borrow Book Requests</h1>
          <p className="text-gray-600 text-sm mt-1">
            {sortedRequests.length} request{sortedRequests.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search requests by book, user, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          
          {/* Sort Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSort}
            className="px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            {sortOldestFirst ? "Oldest to Recent" : "Recent to Oldest"} ↕️
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No borrow requests found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? "Try adjusting your search criteria" : "No borrow requests have been made yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRequests.map((request) => (
                  <BorrowRequestTableRow
                    key={request.id}
                    id={request.id}
                    bookTitle={request.bookTitle}
                    bookCoverUrl={request.bookCoverUrl}
                    userName={request.userName}
                    userEmail={request.userEmail}
                    userAvatarUrl={request.userAvatarUrl}
                    status={request.status}
                    borrowedDate={request.borrowedDate}
                    returnDate={request.returnDate}
                    dueDate={request.dueDate}
                    receiptUrl={request.receiptUrl}
                    onStatusChange={handleStatusChange}
                    onGenerateReceipt={handleGenerateReceipt}
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

export default BorrowRequestsTable;
