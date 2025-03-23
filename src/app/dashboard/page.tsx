// library-inventory-system\src\app\dashboard\page.tsx



"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiBook, FiBookOpen, FiAlertCircle ,FiDollarSign} from "react-icons/fi";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  totalLibrarians: number;
  totalBooks: number;
  activeBorrows: number;
  overdueBooks: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* User Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiUsers className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/users" className="text-sm text-blue-600 hover:text-blue-800">
              View all users →
            </Link>
          </div>
        </div>
        
        {/* Books Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiBook className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Books</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalBooks || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/manage-books" className="text-sm text-green-600 hover:text-green-800">
              Manage books →
            </Link>
          </div>
        </div>
        
        {/* Borrows Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <FiBookOpen className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Active Borrows</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats?.activeBorrows || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/borrows" className="text-sm text-amber-600 hover:text-amber-800">
              View active borrows →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/dashboard/users" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition">
              <div className="flex items-center">
                <FiUsers className="h-5 w-5 text-blue-600 mr-3" />
                <span>Manage Users</span>
              </div>
            </Link>
            <Link href="/manage-books" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition">
              <div className="flex items-center">
                <FiBook className="h-5 w-5 text-green-600 mr-3" />
                <span>Manage Books</span>
              </div>
            </Link>
            <Link href="/manage-fare" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition">
              <div className="flex items-center">
                <FiDollarSign className="h-5 w-5 text-amber-600 mr-3" />
                <span>Manage Fare Settings</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
              <div className="flex items-center">
                <FiAlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <span>Overdue Books</span>
              </div>
              <span className="font-medium text-red-600">{stats?.overdueBooks || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
              <div className="flex items-center">
                <FiUsers className="h-5 w-5 text-blue-600 mr-3" />
                <span>Librarians</span>
              </div>
              <span className="font-medium text-blue-600">{stats?.totalLibrarians || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
