// components/admin/UserCard.tsx
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  onApprove: () => void;
  onReject: () => void;
}

const UserCard = ({ name, email, avatar, onApprove, onReject }: UserCardProps) => {
  return (
    <div className="p-4 border border-gray-100 rounded-lg text-center bg-white hover:shadow-sm transition-shadow">
      {/* User Avatar */}
      <Avatar className="w-12 h-12 mx-auto mb-3">
        <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {/* User Info */}
      <h4 className="font-medium text-black text-sm mb-1 truncate">{name}</h4>
      <p className="text-xs text-gray-600 mb-3 truncate">{email}</p>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1 text-xs h-7 hover:bg-green-50 hover:border-green-200 hover:text-green-700" 
          onClick={onApprove}
        >
          Approve
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          className="flex-1 text-xs h-7" 
          onClick={onReject}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
