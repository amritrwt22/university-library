// components/admin/users/RoleSelector.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  currentRole: "User" | "Admin";
  onChange: (role: "User" | "Admin") => void;
}

const RoleSelector = ({ currentRole, onChange }: RoleSelectorProps) => {
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

  const roles = ["User", "Admin"];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setOpen(!open)}
        className={cn(
          "text-xs font-medium px-3 py-1 rounded-full",
          currentRole === "User" 
            ? "bg-pink-100 text-pink-600 hover:bg-pink-200" 
            : "bg-green-100 text-green-600 hover:bg-green-200"
        )}
      >
        {currentRole}
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
        <div className="absolute right-0 mt-2 w-24 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {roles.map((role) => (
              <button
                key={role}
                className={cn(
                  "block px-3 py-2 text-xs w-full text-left hover:bg-gray-100 transition-colors",
                  role === currentRole 
                    ? "text-gray-900 font-semibold bg-gray-50" 
                    : "text-gray-700"
                )}
                onClick={() => {
                  onChange(role as "User" | "Admin");
                  setOpen(false);
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
