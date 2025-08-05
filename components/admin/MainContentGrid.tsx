// components/admin/MainContentGrid.tsx
import React from "react";
import BorrowRequestsList from "./BorrowRequestsList";
import AccountRequestsList from "./AccountRequestsList";
import RecentBooksList from "./RecentBooksList";

interface MainContentGridProps {
  borrowRequests: any[];
  accountRequests: any[];
  recentBooks: any[];
}

const MainContentGrid = ({ 
  borrowRequests, 
  accountRequests, 
  recentBooks 
}: MainContentGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 w-full">
      {/* Left Column - Borrow & Account Requests (1 column) */}
      <div className="space-y-6 col-span-1">
        <BorrowRequestsList requests={borrowRequests} />
        <AccountRequestsList requests={accountRequests} />
      </div>
      
      {/* Right Column - Recent Books (2 columns) */}
      <div className="col-span-1">
        <RecentBooksList books={recentBooks} />
      </div>
    </div>
  );
};

export default MainContentGrid;
