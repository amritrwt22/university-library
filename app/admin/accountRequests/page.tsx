// app/admin/account-requests/page.tsx - UPDATED TO USE NEW FUNCTIONS
import React from "react";
import AccountRequestsTable from "@/components/admin/account/AccountRequestsTable";
import { getAllUsers, updateUserStatus, approveUser, rejectUser } from "@/lib/admin/actions/userRequest";

const AccountRequestsPage = async () => {
  // ✅ CHANGED: Use getAllUsers instead of getPendingUsers
  const result = await getAllUsers();

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Users</h2>
          <p className="text-red-700 text-sm mt-1">
            {result.error || "Failed to load users. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  // Format data for the AccountRequestsTable component
  const formattedRequests = result.users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    universityId: user.universityId,
    universityCard: user.universityCard,
    status: user.status as "PENDING" | "APPROVED" | "REJECTED", // ✅ Type assertion for status
    registrationDate: user.createdAt 
      ? new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : "Unknown",
  }));

  return (
    <div className="p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Use status selector for flexible status management, or use approve/reject buttons for quick actions.
        </p>
      </div>
      <AccountRequestsTable
        requests={formattedRequests}
        onStatusChange={updateUserStatus} 
        onApprove={approveUser}           
        onReject={rejectUser}             
      />
    </div>
  );
};

export default AccountRequestsPage;
