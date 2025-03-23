// library-inventory-system\src\components\ProfilePage.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LibraryNavbar from "@/components/LibraryNavbar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FiBook, FiCalendar, FiClock } from "react-icons/fi";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
}

interface BorrowedBook {
  _id: string;
  bookId: Book;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/auth/me", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error(`Failed to fetch user data: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch borrowed books
        const borrowsResponse = await fetch("/api/borrow/user", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (borrowsResponse.ok) {
          const borrowsData = await borrowsResponse.json();
          setBorrowedBooks(borrowsData.borrows || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining or overdue
  const getDaysStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        color: "text-red-600",
      };
    } else if (diffDays === 0) {
      return {
        text: "Due today",
        color: "text-yellow-600",
      };
    } else {
      return {
        text: `${diffDays} days remaining`,
        color: "text-green-600",
      };
    }
  };

  // If still loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If there's an error or no user data after loading
  if (error || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <LibraryNavbar userRole={null} />

        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Profile
            </h1>
            <p className="text-gray-700 mb-6">
              {error ||
                "Could not retrieve user information. Please try again."}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
              >
                Try Again
              </button>

              <button
                onClick={() => router.push("/library")}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition duration-300"
              >
                Return to Library
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Filter active and returned books
  const activeBooks = borrowedBooks.filter(
    (book) => book.status !== "returned"
  );
  const returnedBooks = borrowedBooks.filter(
    (book) => book.status === "returned"
  );

  // If everything is fine, show the profile
  return (
    <div className="flex flex-col min-h-screen">
      <LibraryNavbar userRole={user.role} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            User Profile
          </h1>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "active"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Active Borrows ({activeBooks.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Borrow History ({returnedBooks.length})
              </button>
            </nav>
          </div>

          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-sm font-medium text-gray-500">Username</h2>
                <p className="text-lg font-semibold text-gray-800">
                  {user.username}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-sm font-medium text-gray-500">Email</h2>
                <p className="text-lg font-semibold text-gray-800">
                  {user.email}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-sm font-medium text-gray-500">Role</h2>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {user.role}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-sm font-medium text-gray-500">
                  Verification Status
                </h2>
                <p className="text-lg font-semibold text-gray-800">
                  {user.isVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Not Verified</span>
                  )}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/library")}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition duration-300"
                >
                  Browse Books
                </button>

                <button
                  onClick={() => setActiveTab("active")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md transition duration-300"
                >
                  View My Borrowed Books
                </button>
              </div>
            </div>
          )}

          {/* Active Borrows Tab */}
          {activeTab === "active" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiBook className="mr-2 text-blue-600" />
                Currently Borrowed Books
              </h2>

              {activeBooks.length === 0 ? (
                <div className="bg-gray-50 p-5 rounded-lg text-center">
                  <p className="text-gray-600">
                    You don't have any borrowed books at the moment.
                  </p>
                  <button
                    onClick={() => router.push("/library")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Browse Library
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBooks.map((book) => {
                    const daysStatus = getDaysStatus(book.dueDate);

                    return (
                      <div
                        key={book._id}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4"
                      >
                        <div className="w-24 h-36 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                          {book.bookId.coverImage && (
                            <img
                              src={book.bookId.coverImage}
                              alt={book.bookId.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-grow">
                          <h3 className="font-medium text-lg text-gray-800">
                            {book.bookId.title}
                          </h3>
                          <p className="text-gray-600">{book.bookId.author}</p>

                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <FiCalendar className="mr-1 text-gray-500" />
                              <span className="text-gray-500">Borrowed:</span>
                              <span className="ml-1">
                                {formatDate(book.borrowDate)}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <FiCalendar className="mr-1 text-gray-500" />
                              <span className="text-gray-500">Due:</span>
                              <span className="ml-1">
                                {formatDate(book.dueDate)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center">
                            <FiClock className="mr-1" />
                            <span className={daysStatus.color}>
                              {daysStatus.text}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex items-center justify-center">
                          <button
                            onClick={() =>
                              router.push(`/library?book=${book.bookId._id}`)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Borrow History Tab */}
          {activeTab === "history" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiBook className="mr-2 text-blue-600" />
                Borrow History
              </h2>

              {returnedBooks.length === 0 ? (
                <div className="bg-gray-50 p-5 rounded-lg text-center">
                  <p className="text-gray-600">
                    You don't have any borrowing history yet.
                  </p>
                  <button
                    onClick={() => router.push("/library")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Browse Library
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {returnedBooks.map((book) => (
                    <div
                      key={book._id}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4"
                    >
                      <div className="w-24 h-36 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                        {book.bookId.coverImage && (
                          <img
                            src={book.bookId.coverImage}
                            alt={book.bookId.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-medium text-lg text-gray-800">
                          {book.bookId.title}
                        </h3>
                        <p className="text-gray-600">{book.bookId.author}</p>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <FiCalendar className="mr-1 text-gray-500" />
                            <span className="text-gray-500">Borrowed:</span>
                            <span className="ml-1">
                              {formatDate(book.borrowDate)}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <FiCalendar className="mr-1 text-gray-500" />
                            <span className="text-gray-500">Returned:</span>
                            <span className="ml-1">
                              {book.returnDate
                                ? formatDate(book.returnDate)
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center">
                          <span className="text-green-600 font-medium">
                            Returned
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center justify-center">
                        <button
                          onClick={() =>
                            router.push(`/library?book=${book.bookId._id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
