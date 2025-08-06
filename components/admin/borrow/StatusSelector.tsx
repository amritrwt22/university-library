// components/admin/StatusSelector.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusSelectorProps {
  currentStatus: "BORROWED" | "RETURNED";
  onChange: (status: "BORROWED" | "RETURNED") => void;
}

const StatusSelector = ({ currentStatus, onChange }: StatusSelectorProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const statuses: ("BORROWED" | "RETURNED")[] = ["BORROWED", "RETURNED"];

  // Status color mapping
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "BORROWED":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "RETURNED":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setOpen(!open)}
        className={cn(
          "text-xs font-medium px-3 py-1 rounded-full",
          getStatusStyles(currentStatus)
        )}
      >
        {currentStatus}
        <svg 
          className="w-3 h-3 ml-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {statuses.map((status) => (
              <button
                key={status}
                className={cn(
                  "block px-3 py-2 text-xs w-full text-left hover:bg-gray-100 transition-colors",
                  status === currentStatus 
                    ? "text-gray-900 font-semibold bg-gray-50" 
                    : "text-gray-700"
                )}
                onClick={() => {
                  onChange(status);
                  setOpen(false);
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSelector;
