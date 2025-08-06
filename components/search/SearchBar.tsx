// components/search/SearchBar.tsx - FIXED VERSION with better visibility
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { Search, X } from "lucide-react";

// Props interface defining the component's expected properties
interface SearchBarProps {
    defaultValue?: string;  // Initial value for the search input
    placeholder?: string;   // Placeholder text for the input field
    className?: string;     // Additional CSS classes for styling
}

const SearchBar = ({ 
  defaultValue = "", 
  placeholder = "Search by title, author, genre...",
  className = ""
}: SearchBarProps) => {
  const router = useRouter();
  // Hook to access current URL search parameters
  const searchParams = useSearchParams();
  
  // State to manage the current input value
  const [searchValue, setSearchValue] = useState(defaultValue);
  
  // State to track input focus for visual effects (scale animation)
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search function - delays search request by 500ms to avoid excessive API calls 
  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams); 
    if (term.trim()) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }, 500);
  
  // Form submission handler (triggered by Enter key or Search button click)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 
    const params = new URLSearchParams(searchParams); 
    
    if (searchValue.trim()) {
      params.set("q", searchValue.trim());
    } else {
      params.delete("q");
    }
    
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`relative flex items-center max-w-2xl mx-auto transition-all duration-200 ${
        isFocused ? 'scale-105' : ''
      }`}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 text-lg bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:ring-0 transition-colors shadow-lg"
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <Button 
          type="submit" 
          className="ml-3 px-8 py-3 text-lg rounded-xl bg-primary-500 hover:bg-primary-600 text-white border-0 shadow-lg"
          disabled={!searchValue.trim()}
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
