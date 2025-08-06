// components/search/SearchStats.tsx - Updated for your dark theme
import React from "react";

interface SearchStatsProps {
  query: string;
  totalResults: number;
  currentPage: number;
  resultsPerPage: number;
}

const SearchStats = ({ query, totalResults, currentPage, resultsPerPage }: SearchStatsProps) => {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 className="text-xl font-semibold text-light-100">
          {query ? (
            <>
              Search Results for <span className="text-primary-500">"{query}"</span>
            </>
          ) : (
            "All Books"
          )}
        </h2>
        <p className="text-sm text-light-400 mt-1">
          {totalResults > 0 ? (
            <>
              Showing {startResult}-{endResult} of {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''}
            </>
          ) : (
            "No results found"
          )}
        </p>
      </div>
      
      {totalResults > 0 && (
        <div className="text-sm text-light-500">
          Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}
        </div>
      )}
    </div>
  );
};

export default SearchStats;
