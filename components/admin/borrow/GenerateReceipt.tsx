// components/admin/GenerateReceiptButton.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface GenerateReceiptButtonProps {
  id: string;
  receiptUrl?: string | null;
  onGenerate: (id: string) => Promise<void>;
}

const GenerateReceiptButton = ({ 
  id, 
  receiptUrl, 
  onGenerate 
}: GenerateReceiptButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerate(id);
      toast({
        title: "Success",
        description: "Receipt generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate receipt",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If receipt already exists, show "View Receipt" link
  if (receiptUrl) {
    return (
      <a 
        href={receiptUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium"
      >
        View Receipt
      </a>
    );
  }

  // If no receipt exists, show "Generate" button
  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className={cn(
        "text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium",
        loading && "opacity-50 cursor-not-allowed"
      )}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg 
            className="animate-spin w-3 h-3" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Generating...</span>
        </div>
      ) : (
        "Generate"
      )}
    </button>
  );
};

export default GenerateReceiptButton;
