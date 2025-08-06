// components/admin/account/AccountRequestTableRow.tsx - FIXED VERSION
"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { Eye } from "lucide-react";
import UserStatusSelector from "./UserStatusSelector";

interface AccountRequestTableRowProps {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  registrationDate: string;
  onStatusChange: (userId: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

const AccountRequestTableRow = ({
  id,
  fullName,
  email,
  universityId,
  universityCard,
  status,
  registrationDate,
  onStatusChange,
  onApprove,
  onReject,
}: AccountRequestTableRowProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove(id);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onReject(id);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleViewCard = () => {
    window.open(universityCard, '_blank');
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* User Column */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate max-w-48">
              {fullName}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-48">
              {email}
            </p>
          </div>
        </div>
      </td>

      {/* University Details Column */}
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-900 mb-1">
            ID: {universityId}
          </div>
          <button
            onClick={handleViewCard}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3 h-3" />
            <span className="text-xs">View Card</span>
          </button>
        </div>
      </td>

      {/* Registration Date Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {registrationDate}
      </td>

      {/* Status Column - WITH STATUS SELECTOR */}
      <td className="px-6 py-4 whitespace-nowrap">
        <UserStatusSelector
          currentStatus={status}
          onChange={(newStatus) => onStatusChange(id, newStatus)}
        />
      </td>

      {/* Actions Column - APPROVE/REJECT BUTTONS */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
            className="bg-green-600 hover:bg-green-700 text-white border-0 text-xs px-3 py-1"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isApproving || isRejecting}
            className="text-xs px-3 py-1"
          >
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default AccountRequestTableRow;
