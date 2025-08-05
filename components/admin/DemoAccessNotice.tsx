// components/admin/DemoAccessNotice.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react"; // ✅ Added signOut import
import Image from "next/image";

const DemoAccessNotice = () => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Admin Access Required",
      description: "Use the demo credentials below to access the admin dashboard",
      variant: "destructive",
    });
  }, [toast]);

  // ✅ New function to handle demo sign-in
  const handleDemoSignIn = async () => {
    try {
      // Sign out current user first
      await signOut({ redirect: false });
      
      // Build URL with demo credentials as query parameters
      const queryParams = new URLSearchParams({
        email: 'demo@gmail.com',
        password: '12345678',
        demo: 'true' // Flag to indicate this is demo mode
      }).toString();
      
      // Redirect to sign-in page with prefilled credentials
      router.push(`/sign-in?${queryParams}`);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redirect to sign-in page",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark-200 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/icons/logo.svg" alt="logo" width={32} height={32} />
            <span className="font-bold text-lg">BookWise Admin</span>
          </div>
          <h1 className="text-xl font-semibold">Access Restricted</h1>
          <p className="text-blue-100 text-sm mt-2">
            Admin credentials required to continue
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              🎯 Demo Access Available
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              This is a portfolio demonstration. Use these credentials to explore the admin features:
            </p>
            
            <div className="space-y-2 bg-white rounded p-3 border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">demo@gmail.com</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Password:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">12345678</code>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            
            <Button 
              onClick={handleDemoSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign In with Demo Account
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push("/")} 
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          {/* Portfolio Note */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This admin panel showcases user management, book administration, 
              and analytics features built with Next.js, TypeScript, and modern UI components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAccessNotice;
