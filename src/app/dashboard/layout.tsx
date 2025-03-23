// library-inventory-system\src\app\dashboard\layout.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LibraryNavbar from "@/components/LibraryNavbar";
import Footer from "@/components/Footer";
import { FiUsers, FiBook, FiDollarSign, FiSettings, FiBarChart2 } from "react-icons/fi";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        
        if (!response.ok) {
          router.push("/login?callbackUrl=/dashboard");
          return;
        }
        
        const userData = await response.json();
        
        if (userData.role !== "admin") {
          router.push("/unauthorized");
          return;
        }
        
        setUserRole(userData.role);
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login?callbackUrl=/dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LibraryNavbar userRole={userRole} />
      
      <div className="flex-grow flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white hidden md:block">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          </div>
          <nav className="mt-4">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main
            </div>
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white">
              <FiBarChart2 className="mr-3 h-5 w-5" />
              Overview
            </Link>
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Management
            </div>
            <Link href="/dashboard/users" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white">
              <FiUsers className="mr-3 h-5 w-5" />
              Users
            </Link>
            <Link href="/manage-books" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white">
              <FiBook className="mr-3 h-5 w-5" />
              Books
            </Link>
            <Link href="/manage-fare" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white">
              <FiDollarSign className="mr-3 h-5 w-5" />
              Fare Settings
            </Link>
            
           
          </nav>
        </div>
        
        {/* Mobile sidebar toggle */}
        <div className="md:hidden bg-gray-800 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            {/* Mobile menu button would go here */}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 bg-gray-100 p-6">
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
