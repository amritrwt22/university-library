// components/admin/AccountRequestsList.tsx
"use client";
import React from "react";
import SectionHeader from "./SectionHeader";
import UserCard from "./UserCard";
import { approveUser, rejectUser } from "@/lib/admin/actions/request";
import { useToast } from "@/hooks/use-toast";

interface AccountRequest {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AccountRequestsListProps {
  requests: AccountRequest[];
}

const AccountRequestsList = ({ requests }: AccountRequestsListProps) => {
  const { toast } = useToast();

  const handleApprove = async (userId: string) => {
    try {
      const result = await approveUser(userId);
      if (result.success) {
        toast({
          title: "Success",
          description: "User approved successfully!",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const result = await rejectUser(userId);
      if (result.success) {
        toast({
          title: "Success",
          description: "User rejected successfully!",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <SectionHeader title="Account Requests" viewAllLink="/admin/requests/account" />
      
      {/* 3-Column Grid */}
      <div className="grid grid-cols-3 gap-4">
        {requests.slice(0, 6).map((request) => (
          <UserCard
            key={request.id}
            name={request.name}
            email={request.email}
            avatar={request.avatar}
            onApprove={() => handleApprove(request.id)}
            onReject={() => handleReject(request.id)}
          />
        ))}
      </div>

      {/* Show message if no requests */}
      {requests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No pending account requests</p>
        </div>
      )}
    </div>
  );
};

export default AccountRequestsList;
