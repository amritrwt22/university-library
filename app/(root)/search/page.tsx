// app/(root)/search/page.tsx - USING ALL 4 COMPONENTS
import React, { Suspense } from "react";
import SearchBar from "@/components/search/SearchBar";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import SearchStats from "@/components/search/SearchStats";
import { searchBooks } from "@/lib/actions/search";

interface SearchPageProps {
  searchParams: { 
    q?: string; 
    genre?: string; 
    availability?: string;
    sort?: string; 
    page?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q || "";
  const genre = searchParams.genre || "";
  const availability = searchParams.availability || "";
  const sort = searchParams.sort || "relevance";
  const page = parseInt(searchParams.page || "1");

  // Fetch search results using our search action
  const result = await searchBooks({
    query,
    genre,
    availability,
    sortBy: sort,
    page,
    limit: 20
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Bar Component */}
        <div className="mb-8">
          <SearchBar defaultValue={query} />
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SearchFilters Component - Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-dark-300 rounded-xl border border-dark-500 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-light-100 mb-4">Filters</h2>
              <SearchFilters 
                currentFilters={{ genre, availability, sort }}
              />
            </div>
          </aside>

          {/* Main Results Section */}
          <main className="flex-1">
            <Suspense fallback={
              <div className="bg-dark-300 rounded-xl border border-dark-500 p-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-dark-400 rounded mb-4"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-80 bg-dark-400 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            }>
              {result.success ? (
                <div className="bg-dark-300 rounded-xl border border-dark-500">
                  {/* SearchStats Component */}
                  <div className="p-6 border-b border-dark-500">
                    <SearchStats 
                      query={query}
                      totalResults={result.total || 0}
                      currentPage={page}
                      resultsPerPage={20}
                    />
                  </div>
                  
                  {/* SearchResults Component */}
                  <div className="p-6">
                    <SearchResults 
                      books={result.books || []}
                      query={query}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                  <h2 className="text-red-400 font-semibold">Search Error</h2>
                  <p className="text-red-300 text-sm mt-1">
                    {result.error || "Failed to search books. Please try again."}
                  </p>
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
