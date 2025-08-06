// app/admin/page.tsx - CLEAN VERSION
import React from "react";
import StatsRow from "@/components/admin/StatsRow";
import MainContentGrid from "@/components/admin/MainContentGrid";
import { 
  getDashboardStats, 
  getRecentBorrowRequests, 
  getPendingAccountRequests, 
  getRecentBooks 
} from "@/lib/admin/actions/dashboard";

const AdminDashboard = async () => {
  // Fetch all data using action functions
  const [
    statsResult,
    borrowRequestsResult,
    accountRequestsResult,
    recentBooksResult
  ] = await Promise.all([
    getDashboardStats(),
    getRecentBorrowRequests(3),
    getPendingAccountRequests(6),
    getRecentBooks(5)
  ]);

  // Handle errors (optional - or show error states)
  if (!statsResult.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Dashboard</h2>
          <p className="text-red-700 text-sm mt-1">
            {statsResult.error || "Failed to load dashboard data."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Stats Cards Row */}
      <StatsRow
        borrowedBooks={statsResult?.stats?.borrowedBooks}
        totalUsers={statsResult?.stats?.totalUsers}
        totalBooks={statsResult?.stats?.totalBooks}
        borrowedTrend="2"
        usersTrend="1"
        booksTrend="2"
      />

      {/* Main Content Grid */}
      <MainContentGrid
        borrowRequests={borrowRequestsResult.success ? borrowRequestsResult.requests : []}
        accountRequests={accountRequestsResult.success ? accountRequestsResult.requests : []}
        recentBooks={recentBooksResult.success ? recentBooksResult.books : []}
      />
    </div>
  );
};

export default AdminDashboard;
