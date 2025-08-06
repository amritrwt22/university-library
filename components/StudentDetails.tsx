"use client";
import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import config from "@/lib/config";
import { useRouter } from "next/navigation";


interface StudentDetailsProps {
  id: string;
  name: string;
  email: string;
  university: string;
  studentId: string;
  idCardUrl?: string | null;
  status: "APPROVED" | "PENDING" | "REJECTED" | "NULL";
  onVerify?: () => void; // Optional callback for verify button
}

const StudentDetails = ({ 
  id,
  name, 
  email, 
  university, 
  studentId, 
  idCardUrl,
  status,
  onVerify
}: StudentDetailsProps) => {
  // Construct full ImageKit URL
  const fullImageUrl = idCardUrl 
    ? `${config.env.imagekit.urlEndpoint}${idCardUrl}`
    : null;

  // Status helpers
  const isVerified = status === "APPROVED";
  const isRejected = status === "REJECTED";
  const isPending = status === "PENDING";

  // Status colors and text
  const getStatusInfo = () => {
    if (isVerified) {
      return {
        dotColor: "bg-[#10b981]",
        textColor: "text-[#a78bfa]",
        text: "Verified"
      };
    } else if (isRejected) {
      return {
        dotColor: "bg-red-500",
        textColor: "text-red-400",
        text: "Verification Rejected"
      };
    } else {
      return {
        dotColor: "bg-yellow-500",
        textColor: "text-yellow-400",
        text: "Pending Verification"
      };
    }
  };

  const statusInfo = getStatusInfo();
  
  const Router = useRouter();
  const handleEditDetails = () => {
    // move to /edit-details page
    Router.push(`/edit-user/${id}`);
  };

  return (
    <div className="relative bg-current rounded-3xl p-8 max-w-md shadow-2xl">
      {/* Top decorative element */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-current rounded-b-lg border-2 border-[#2563eb]"></div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#2563eb]/30">
        <Avatar className="w-20 h-20 ring-3 ring-[#3b82f6] shadow-[0_0_20px_#1e40af]">
          <AvatarFallback className="bg-gradient-to-br from-[#1bbca4] to-[#05494d] text-white text-xl font-bold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></div>
            <span className={`text-xs ${statusInfo.textColor} font-semibold uppercase tracking-wider`}>
              {statusInfo.text}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
          <p className="text-sm text-[#a78bfa]">{email}</p>

          {/* Verify Again Button - Only shown when rejected */}
          {/* Edit Details Button - Only shown when rejected */}
        {(
          <Button 
            onClick={handleEditDetails}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2"
            size="sm"
          >
            Edit Details
          </Button>
        )}
        </div>
      </div>

      {/* University Info */}
      <div className="space-y-6 mb-8">
        <div>
          <p className="text-xs text-[#8b5cf6] font-medium mb-1 uppercase tracking-wider">University</p>
          <p className="text-lg font-bold text-white">{university}</p>
        </div>
        
        <div>
          <p className="text-xs text-[#8b5cf6] font-medium mb-1 uppercase tracking-wider">Student ID</p>
          <p className="text-xl font-bold text-white tracking-widest">{studentId}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2563eb]/50 mb-6"></div>

      {/* ID Card */}
      <div className="bg-gradient-to-r from-[#1e293b] to-[#312e81] rounded-xl p-6 border border-[#3b82f6]/30">
        {fullImageUrl ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-white font-bold text-base mb-4 border-b border-[#60a5fa]/30 pb-2">
                {university}
              </h4>
              <div className="space-y-2 text-xs text-[#e2e8f0]">
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Student ID:</span>
                  <span className="font-semibold">{studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Full Name:</span>
                  <span className="font-semibold">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Department:</span>
                  <span className="font-semibold">Web Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Date of Birth:</span>
                  <span className="font-semibold">02/14/1998</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Contact no.:</span>
                  <span className="font-semibold">1234567</span>
                </div>
              </div>
            </div>
            
            <div className="ml-4">
              <Image
                src={fullImageUrl}
                alt="University ID Card"
                width={200}
                height={120}
                className="rounded-lg shadow-lg object-cover border border-[#3b82f6]/50"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Image src="/icons/user.svg" alt="ID Card" width={48} height={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xs text-[#94a3b8]">University ID Card</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
