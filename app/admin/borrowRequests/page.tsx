// app/admin/borrow-requests/page.tsx
import React from "react";
import BorrowRequestsTable from "@/components/admin/borrow/BorrowRequestsTable";
import { getBorrowRequests, updateBorrowStatus, generateReceipt } from "@/lib/admin/actions/borrowRequest";

const BorrowRequestsPage = async () => {
  // Fetch all borrow requests with user and book details
  const result = await getBorrowRequests();

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Borrow Requests</h2>
          <p className="text-red-700 text-sm mt-1">
            {result.error || "Failed to load borrow requests. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  // Format data for the BorrowRequestsTable component
  const formattedRequests = result.requests.map((request) => ({
    id: request.id,
    bookTitle: request.bookTitle || "Unknown Book",
    bookCoverUrl: request.bookCoverUrl || null,
    userName: request.userName || "Unknown User",
    userEmail: request.userEmail || "",
    userAvatarUrl: request.userAvatarUrl || null,
    status: request.status as "BORROWED" | "RETURNED",
    borrowedDate: request.borrowDate 
      ? new Date(request.borrowDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : "Unknown",
    returnDate: request.returnDate 
      ? new Date(request.returnDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : null,
    dueDate: request.dueDate 
      ? new Date(request.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : "Unknown",
    receiptUrl: null, // Since receiptUrl doesn't exist in schema
  }));

  return (
    <div className="p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Use status dropdown to update borrow status and generate receipts for completed transactions
        </p>
      </div>
      <BorrowRequestsTable
        requests={formattedRequests}
        onStatusChange={updateBorrowStatus}
        onGenerateReceipt={generateReceipt}
      />
    </div>
  );
};

export default BorrowRequestsPage;
