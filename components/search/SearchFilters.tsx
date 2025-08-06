// components/search/SearchFilters.tsx - Updated for your dark theme
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SearchFiltersProps {
  currentFilters: {
    genre: string;
    availability: string;
    sort: string;
  };
}

const SearchFilters = ({ currentFilters }: SearchFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to first page when filtering
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("genre");
    params.delete("availability");
    params.delete("sort");
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const hasActiveFilters = currentFilters.genre || currentFilters.availability || 
    (currentFilters.sort && currentFilters.sort !== "relevance");

  return (
    <div className="space-y-6">
      
      {/* Genre Filter */}
      <div>
        <label className="text-sm font-medium text-light-200 mb-2 block">
          Genre
        </label>
        <Select
          value={currentFilters.genre || "all"}
          onValueChange={(value) => updateFilter("genre", value)}
        >
          <SelectTrigger className="w-full bg-dark-400 border-dark-500 text-light-100 focus:ring-primary-500">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent className="bg-dark-300 border-dark-500">
            <SelectItem value="all" className="text-light-100 focus:bg-dark-400">All Genres</SelectItem>
            <SelectItem value="Fiction" className="text-light-100 focus:bg-dark-400">Fiction</SelectItem>
            <SelectItem value="Non-Fiction" className="text-light-100 focus:bg-dark-400">Non-Fiction</SelectItem>
            <SelectItem value="Science" className="text-light-100 focus:bg-dark-400">Science</SelectItem>
            <SelectItem value="Technology" className="text-light-100 focus:bg-dark-400">Technology</SelectItem>
            <SelectItem value="History" className="text-light-100 focus:bg-dark-400">History</SelectItem>
            <SelectItem value="Biography" className="text-light-100 focus:bg-dark-400">Biography</SelectItem>
            <SelectItem value="Philosophy" className="text-light-100 focus:bg-dark-400">Philosophy</SelectItem>
            <SelectItem value="Literature" className="text-light-100 focus:bg-dark-400">Literature</SelectItem>
            <SelectItem value="Business" className="text-light-100 focus:bg-dark-400">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-dark-500" />

      {/* Availability Filter */}
      <div>
        <label className="text-sm font-medium text-light-200 mb-2 block">
          Availability
        </label>
        <Select
          value={currentFilters.availability || "all"}
          onValueChange={(value) => updateFilter("availability", value)}
        >
          <SelectTrigger className="w-full bg-dark-400 border-dark-500 text-light-100 focus:ring-primary-500">
            <SelectValue placeholder="All Books" />
          </SelectTrigger>
          <SelectContent className="bg-dark-300 border-dark-500">
            <SelectItem value="all" className="text-light-100 focus:bg-dark-400">All Books</SelectItem>
            <SelectItem value="available" className="text-light-100 focus:bg-dark-400">Available Only</SelectItem>
            <SelectItem value="unavailable" className="text-light-100 focus:bg-dark-400">Currently Borrowed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-dark-500" />

      {/* Sort Filter */}
      <div>
        <label className="text-sm font-medium text-light-200 mb-2 block">
          Sort By
        </label>
        <Select
          value={currentFilters.sort || "relevance"}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger className="w-full bg-dark-400 border-dark-500 text-light-100 focus:ring-primary-500">
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent className="bg-dark-300 border-dark-500">
            <SelectItem value="relevance" className="text-light-100 focus:bg-dark-400">Relevance</SelectItem>
            <SelectItem value="title_asc" className="text-light-100 focus:bg-dark-400">Title (A-Z)</SelectItem>
            <SelectItem value="title_desc" className="text-light-100 focus:bg-dark-400">Title (Z-A)</SelectItem>
            <SelectItem value="author_asc" className="text-light-100 focus:bg-dark-400">Author (A-Z)</SelectItem>
            <SelectItem value="rating_desc" className="text-light-100 focus:bg-dark-400">Rating (High-Low)</SelectItem>
            <SelectItem value="rating_asc" className="text-light-100 focus:bg-dark-400">Rating (Low-High)</SelectItem>
            <SelectItem value="newest" className="text-light-100 focus:bg-dark-400">Newest Added</SelectItem>
            <SelectItem value="oldest" className="text-light-100 focus:bg-dark-400">Oldest Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <>
          <Separator className="bg-dark-500" />
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
            className="w-full bg-dark-400 border-dark-500 text-light-200 hover:bg-dark-200 hover:text-light-100"
          >
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
};

export default SearchFilters;
