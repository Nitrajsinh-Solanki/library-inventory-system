// library-inventory-system\src\app\dashboard\users\page.tsx



"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiUserCheck, FiAlertCircle, FiSearch, FiRefreshCw } from "react-icons/fi";
import Link from "next/link";
import { Tab } from "@headlessui/react";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromoteToLibrarian = async (userId: string) => {
    try {
      setProcessingUser(userId);
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to promote user");
      }
      
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setProcessingUser(null);
    }
  };

  const handleDemoteToUser = async (userId: string) => {
    try {
      setProcessingUser(userId);
      const response = await fetch(`/api/admin/users/${userId}/demote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to demote librarian");
      }
      
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error("Error demoting librarian:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setProcessingUser(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customers = filteredUsers.filter(user => user.role === "user");
  const librarians = filteredUsers.filter(user => user.role === "librarian");

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={fetchUsers} 
          className="mt-2 md:mt-0 flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <FiRefreshCw className="mr-2" /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
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
      )}

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white shadow text-blue-700' 
              : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }>
            <div className="flex items-center justify-center">
              <FiUsers className="mr-2" /> Customers ({customers.length})
            </div>
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white shadow text-blue-700' 
              : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }>
            <div className="flex items-center justify-center">
              <FiUserCheck className="mr-2" /> Librarians ({librarians.length})
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {customers.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No customers found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {customers.map((user) => (
                    <li key={user._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                            <button
                              onClick={() => handlePromoteToLibrarian(user._id)}
                              disabled={processingUser === user._id}
                              className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingUser === user._id ? (
                                <FiRefreshCw className="animate-spin mr-1" />
                              ) : null}
                              Promote to Librarian
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {librarians.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No librarians found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {librarians.map((user) => (
                    <li key={user._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Librarian
                            </span>
                            <button
                              onClick={() => handleDemoteToUser(user._id)}
                              disabled={processingUser === user._id}
                              className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingUser === user._id ? (
                                <FiRefreshCw className="animate-spin mr-1" />
                              ) : null}
                              Demote to User
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
