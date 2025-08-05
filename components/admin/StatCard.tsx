// components/admin/StatCard.tsx
import React from "react";

interface StatCardProps {
  title: string;
  count: number;
  trend: string;
  isPositive: boolean;
}

const StatCard = ({ title, count, trend, isPositive }: StatCardProps) => {
  return (
    <div 
      className="bg-white flex flex-col justify-between shadow-sm flex-1"
      style={{
        height: '114px',
        borderRadius: '14px',
        padding: '20px',
        minWidth: '300px' // Minimum width to prevent cards from getting too small
      }}
    >
      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      
      {/* Count and Trend */}
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-black">{count}</span>
        
        {/* Trend Indicator */}
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          <span className="text-xs">
            {isPositive ? '▲' : '▼'}
          </span>
          <span>{trend}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

