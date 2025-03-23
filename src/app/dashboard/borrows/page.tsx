// library-inventory-system\src\app\dashboard\borrows\page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiSearch,
  FiCheck,
  FiX,
  FiFilter,
} from "react-icons/fi";

interface Borrow {
  _id: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
  };
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  fine: number;
}

type FilterStatus = "all" | "borrowed" | "returned" | "overdue";

export default function BorrowsPage() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingBorrow, setProcessingBorrow] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/borrows");

      if (!response.ok) {
        throw new Error("Failed to fetch borrows");
      }

      const data = await response.json();
      setBorrows(data.borrows);
    } catch (error) {
      console.error("Error fetching borrows:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleMarkAsReturned = async (borrowId: string) => {
    try {
      setProcessingBorrow(borrowId);
      const response = await fetch(`/api/admin/borrows/${borrowId}/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark book as returned");
      }

      // Refresh the borrows list
      fetchBorrows();
    } catch (error) {
      console.error("Error marking book as returned:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setProcessingBorrow(null);
    }
  };

  // First filter by search term
  const searchFiltered = borrows.filter(
    (borrow) =>
      borrow.bookId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.userId.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Then filter by status
  const filteredBorrows = searchFiltered.filter((borrow) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "borrowed")
      return (
        borrow.status === "borrowed" && new Date(borrow.dueDate) >= new Date()
      );
    if (statusFilter === "returned") return borrow.status === "returned";
    if (statusFilter === "overdue")
      return (
        borrow.status === "borrowed" && new Date(borrow.dueDate) < new Date()
      );
    return true;
  });

  const activeBorrows = searchFiltered.filter(
    (borrow) => borrow.status === "borrowed"
  );
  const returnedBorrows = searchFiltered.filter(
    (borrow) => borrow.status === "returned"
  );
  const overdueBorrows = activeBorrows.filter(
    (borrow) => new Date(borrow.dueDate) < new Date()
  );

  if (loading && borrows.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Borrows</h1>
        <button
          onClick={fetchBorrows}
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

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by book title, username, or status..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <FiFilter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Filter:</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 text-sm rounded-md ${
                statusFilter === "all"
                  ? "bg-gray-200 text-gray-800 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("borrowed")}
              className={`px-3 py-2 text-sm rounded-md ${
                statusFilter === "borrowed"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Borrowed
            </button>
            <button
              onClick={() => setStatusFilter("overdue")}
              className={`px-3 py-2 text-sm rounded-md ${
                statusFilter === "overdue"
                  ? "bg-red-100 text-red-800 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setStatusFilter("returned")}
              className={`px-3 py-2 text-sm rounded-md ${
                statusFilter === "returned"
                  ? "bg-green-100 text-green-800 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Returned
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-md cursor-pointer ${
              statusFilter === "borrowed" ? "ring-2 ring-blue-500" : ""
            } bg-blue-50`}
            onClick={() =>
              setStatusFilter(statusFilter === "borrowed" ? "all" : "borrowed")
            }
          >
            <div className="text-sm font-medium text-blue-800">
              Active Borrows
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {activeBorrows.length}
            </div>
          </div>
          <div
            className={`p-4 rounded-md cursor-pointer ${
              statusFilter === "overdue" ? "ring-2 ring-red-500" : ""
            } bg-red-50`}
            onClick={() =>
              setStatusFilter(statusFilter === "overdue" ? "all" : "overdue")
            }
          >
            <div className="text-sm font-medium text-red-800">Overdue</div>
            <div className="text-2xl font-bold text-red-900">
              {overdueBorrows.length}
            </div>
          </div>
          <div
            className={`p-4 rounded-md cursor-pointer ${
              statusFilter === "returned" ? "ring-2 ring-green-500" : ""
            } bg-green-50`}
            onClick={() =>
              setStatusFilter(statusFilter === "returned" ? "all" : "returned")
            }
          >
            <div className="text-sm font-medium text-green-800">Returned</div>
            <div className="text-2xl font-bold text-green-900">
              {returnedBorrows.length}
            </div>
          </div>
        </div>
      </div>

      {statusFilter !== "all" && (
        <div className="mb-4 flex items-center">
          <span className="text-sm text-gray-600 mr-2">
            Showing {filteredBorrows.length} {statusFilter}{" "}
            {filteredBorrows.length === 1 ? "borrow" : "borrows"}
          </span>
          <button
            onClick={() => setStatusFilter("all")}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FiX className="h-4 w-4 mr-1" /> Clear filter
          </button>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredBorrows.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No borrows found
            {statusFilter !== "all" && (
              <div className="mt-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Book
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Borrow Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Due Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fine
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBorrows.map((borrow) => {
                const isOverdue =
                  borrow.status === "borrowed" &&
                  new Date(borrow.dueDate) < new Date();
                return (
                  <tr key={borrow._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {borrow.bookId.coverImage ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={borrow.bookId.coverImage}
                              alt={borrow.bookId.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">
                                {borrow.bookId.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {borrow.bookId.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {borrow.bookId.author}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrow.userId.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrow.userId.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(borrow.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={isOverdue ? "text-red-600 font-medium" : ""}
                      >
                        {new Date(borrow.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          borrow.status === "returned"
                            ? "bg-green-100 text-green-800"
                            : isOverdue
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {borrow.status === "returned"
                          ? "Returned"
                          : isOverdue
                          ? "Overdue"
                          : "Borrowed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {borrow.fine > 0 ? (
                        <span className="text-red-600 font-medium">
                          ${borrow.fine.toFixed(2)}
                        </span>
                      ) : (
                        <span>$0.00</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {borrow.status === "borrowed" && (
                        <button
                          onClick={() => handleMarkAsReturned(borrow._id)}
                          disabled={processingBorrow === borrow._id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingBorrow === borrow._id ? (
                            <FiRefreshCw className="animate-spin mr-1" />
                          ) : (
                            <FiCheck className="mr-1" />
                          )}
                          Mark as Returned
                        </button>
                      )}
                      {borrow.status === "returned" && (
                        <span className="text-green-600 flex items-center justify-end">
                          <FiCheck className="mr-1" />
                          Returned on{" "}
                          {new Date(borrow.returnDate!).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
