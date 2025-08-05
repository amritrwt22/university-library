// components/admin/StatsRow.tsx
import React from "react";
import StatCard from "./StatCard";

interface StatsData {
  borrowedBooks: number;
  totalUsers: number;
  totalBooks: number;
  borrowedTrend: string;
  usersTrend: string;
  booksTrend: string;
}

const StatsRow = ({ 
  borrowedBooks, 
  totalUsers, 
  totalBooks,
  borrowedTrend,
  usersTrend,
  booksTrend 
}: StatsData) => {
  return (
    <div 
      className="grid grid-cols-3 gap-4 w-full "
      style={{ height: '114px' }}
    >
      <StatCard
        title="Borrowed Books"
        count={borrowedBooks}
        trend={borrowedTrend}
        isPositive={false}
      />
      
      <StatCard
        title="Total Users"
        count={totalUsers}
        trend={usersTrend}
        isPositive={true}
      />
      
      <StatCard
        title="Total Books"
        count={totalBooks}
        trend={booksTrend}
        isPositive={true}
      />

    </div>
  );
};

export default StatsRow;
