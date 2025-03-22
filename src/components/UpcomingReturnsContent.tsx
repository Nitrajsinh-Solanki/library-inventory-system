// library-inventory-system\src\components\UpcomingReturnsContent.tsx

"use client";

import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiBook,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { motion } from "framer-motion";
import ReturnBookModal from "./ReturnBookModal";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
}

interface Borrow {
  _id: string;
  userId: User;
  bookId: Book;
  borrowDate: string;
  dueDate: string;
  status: "borrowed" | "returned" | "overdue";
  remainingDays: number;
  totalFee: number;
}

const UpcomingReturnsContent = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "overdue" | "upcoming">("all");

  // In the fetchBorrows function, update the API endpoint
  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/borrow/all");

      if (!response.ok) {
        throw new Error("Failed to fetch borrows");
      }

      const data = await response.json();
      setBorrows(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleReturnBook = (borrow: Borrow) => {
    setSelectedBorrow(borrow);
    setShowReturnModal(true);
  };

  const handleReturnSuccess = () => {
    setShowReturnModal(false);
    fetchBorrows();
  };

  const filteredBorrows = borrows.filter((borrow) => {
    if (filter === "overdue") {
      return borrow.remainingDays < 0;
    } else if (filter === "upcoming") {
      return borrow.remainingDays >= 0;
    }
    return true;
  });

  const getStatusBadge = (borrow: Borrow) => {
    if (borrow.remainingDays < 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Overdue by {Math.abs(borrow.remainingDays)} days
        </span>
      );
    } else if (borrow.remainingDays <= 3) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Due soon ({borrow.remainingDays} days)
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          {borrow.remainingDays} days remaining
        </span>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Returns</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage borrowed books and track upcoming returns
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading borrows
              </h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("overdue")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === "overdue"
                  ? "bg-red-100 text-red-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === "upcoming"
                  ? "bg-green-100 text-green-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Upcoming
            </button>
          </div>
          <button
            onClick={fetchBorrows}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBorrows.length === 0 ? (
          <div className="p-8 text-center">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No borrows found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? "There are no borrowed books at the moment."
                : filter === "overdue"
                ? "There are no overdue books at the moment."
                : "There are no upcoming returns at the moment."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    Borrower
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
                    Fee
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
                {filteredBorrows.map((borrow) => (
                  <motion.tr
                    key={borrow._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={borrow.remainingDays < 0 ? "bg-red-50" : ""}
                  >
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
                              <FiBook className="h-5 w-5 text-gray-500" />
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
                      <div className="flex items-center">
                        <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {borrow.userId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {borrow.userId.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(borrow.borrowDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(borrow.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(borrow)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDollarSign className="h-4 w-4 text-gray-500 mr-1" />
                        <span
                          className={`text-sm font-medium ${
                            borrow.totalFee > 0
                              ? "text-amber-600"
                              : "text-gray-700"
                          }`}
                        >
                          {borrow.totalFee.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleReturnBook(borrow)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                      >
                        Return Book
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedBorrow && showReturnModal && (
        <ReturnBookModal
          borrow={selectedBorrow}
          onClose={() => setShowReturnModal(false)}
          onSuccess={handleReturnSuccess}
        />
      )}
    </div>
  );
};

export default UpcomingReturnsContent;
