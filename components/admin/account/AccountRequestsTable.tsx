// components/admin/account/AccountRequestsTable.tsx - FIXED VERSION
"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AccountRequestTableRow from "./AccountRequestTableRow";
import { useToast } from "@/hooks/use-toast";

interface AccountRequest {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  registrationDate: string;
}

interface AccountRequestsTableProps {
  requests: AccountRequest[];
  onStatusChange: (userId: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => Promise<{ success: boolean; error?: string }>;
  onApprove: (userId: string) => Promise<{ success: boolean; error?: string }>;
  onReject: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

const AccountRequestsTable = ({ 
  requests, 
  onStatusChange,
  onApprove,
  onReject
}: AccountRequestsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOldestFirst, setSortOldestFirst] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const { toast } = useToast();

  // Filter requests based on search term and status
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const lowerTerm = searchTerm.toLowerCase();
      const matchesSearch = (
        request.fullName.toLowerCase().includes(lowerTerm) ||
        request.email.toLowerCase().includes(lowerTerm) ||
        request.universityId.toString().includes(lowerTerm) ||
        request.status.toLowerCase().includes(lowerTerm)
      );
      
      const matchesStatus = statusFilter === "ALL" || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, requests, statusFilter]);

  // Sort requests by registration date
  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      const dateA = new Date(a.registrationDate);
      const dateB = new Date(b.registrationDate);
      
      return sortOldestFirst 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });
  }, [filteredRequests, sortOldestFirst]);

  const toggleSort = () => {
    setSortOldestFirst(!sortOldestFirst);
  };

  const handleStatusChange = async (userId: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    try {
      const result = await onStatusChange(userId, newStatus);
      if (result.success) {
        toast({
          title: "Success",
          description: `User status updated to ${newStatus}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const result = await onApprove(userId);
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
      const result = await onReject(userId);
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

  // Count requests by status , use useMemo to optimize performance , this helps avoid recalculating counts on every render
  // what it does is it counts the number of requests for each status (PENDING, APPROVED, REJECTED) and returns an object with these counts
  const statusCounts = useMemo(() => {
    const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    requests.forEach(req => {
      counts[req.status as keyof typeof counts]++;
    });
    return counts;
  }, [requests]);
  // requests is the array of user requests passed to the component, and it counts how many requests are in each status category.

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Accounts</h1>
          <p className="text-gray-600 text-sm mt-1">
            {sortedRequests.length} user{sortedRequests.length !== 1 ? 's' : ''} found
            {statusFilter !== "ALL" && ` (${statusFilter.toLowerCase()})`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Status ({requests.length})</option>
            <option value="PENDING">Pending ({statusCounts.PENDING})</option>
            <option value="APPROVED">Approved ({statusCounts.APPROVED})</option>
            <option value="REJECTED">Rejected ({statusCounts.REJECTED})</option>
          </select>
          
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search by name, email, university ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          
          {/* Sort Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSort}
            className="px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            {sortOldestFirst ? "Oldest to Recent" : "Recent to Oldest"} ↕️
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="text-gray-500">
                      <div className="text-gray-400 text-6xl mb-4">👥</div>
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? "Try adjusting your search criteria" : "No users match the selected filters"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRequests.map((request) => (
                  <AccountRequestTableRow
                    key={request.id}
                    id={request.id}
                    fullName={request.fullName}
                    email={request.email}
                    universityId={request.universityId}
                    universityCard={request.universityCard}
                    status={request.status}
                    registrationDate={request.registrationDate}
                    onStatusChange={handleStatusChange}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountRequestsTable;
