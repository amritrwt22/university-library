// components/admin/SectionHeader.tsx
import React from "react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  viewAllLink: string;
}

const SectionHeader = ({ title, viewAllLink }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-black">{title}</h2>
      <Link 
        href={viewAllLink}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        View all
      </Link>
    </div>
  );
};

export default SectionHeader;
