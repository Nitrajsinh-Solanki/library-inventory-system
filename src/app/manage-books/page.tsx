// library-inventory-system\src\app\manage-books\page.tsx

"use client";

import { useState, useEffect } from "react";
import BookForm from "@/components/BookForm";
import IsbnFetchForm from "@/components/IsbnFetchForm";
import { useRouter } from "next/navigation";
import { FiPlus, FiBook, FiList, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import Image from "next/image";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

// Define the Book interface
interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  genre: string;
  publishedYear: string | number;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
  available: boolean;
  coverImage: string;
  createdAt: string;
}

export default function ManageBooksPage() {
  const [activeTab, setActiveTab] = useState("add");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  // Fetch books when the component mounts or when a new book is added
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/books");
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookAdded = () => {
    fetchBooks();
    setActiveTab("list");
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setActiveTab("edit");
  };

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;

    try {
      const response = await fetch(`/api/books/${bookToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the book from the list
        setBooks(books.filter((book) => book._id !== bookToDelete._id));
        setShowDeleteModal(false);
        setBookToDelete(null);
      } else {
        console.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleBookUpdated = () => {
    fetchBooks();
    setEditingBook(null);
    setActiveTab("list");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Manage Library Books
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 flex-wrap">
        <button
          onClick={() => {
            setActiveTab("add");
            setEditingBook(null);
          }}
          className={`py-4 px-6 flex items-center text-sm font-medium ${
            activeTab === "add"
              ? "border-b-2 border-indigo-500 text-indigo-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <FiPlus className="mr-2" />
          Add New Book
        </button>
        <button
          onClick={() => {
            setActiveTab("fetch-isbn");
            setEditingBook(null);
          }}
          className={`py-4 px-6 flex items-center text-sm font-medium ${
            activeTab === "fetch-isbn"
              ? "border-b-2 border-indigo-500 text-indigo-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <FiSearch className="mr-2" />
          Fetch Using ISBN
        </button>
        <button
          onClick={() => {
            setActiveTab("list");
            setEditingBook(null);
          }}
          className={`py-4 px-6 flex items-center text-sm font-medium ${
            activeTab === "list"
              ? "border-b-2 border-indigo-500 text-indigo-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <FiList className="mr-2" />
          Book List
        </button>
        {activeTab === "edit" && (
          <div className="py-4 px-6 flex items-center text-sm font-medium border-b-2 border-indigo-500 text-indigo-600">
            <FiEdit className="mr-2" />
            Edit Book
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "add" ? (
          <BookForm onSuccess={handleBookAdded} />
        ) : activeTab === "fetch-isbn" ? (
          <IsbnFetchForm onSuccess={handleBookAdded} />
        ) : activeTab === "edit" && editingBook ? (
          <BookForm
            book={editingBook}
            onSuccess={handleBookUpdated}
            isEditing={true}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Book Inventory
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-10">
                <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No books yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new book.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("add")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                    Add New Book
                  </button>
                </div>
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
                        Author
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Genre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Copies
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
                        Added Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {book.coverImage ? (
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={book.coverImage}
                                  alt={book.title}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                  <FiBook className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {book.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {book.isbn || "No ISBN"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {book.author}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {book.genre || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {book.availableCopies} / {book.totalCopies}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              book.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {book.available ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(book)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit book"
                            >
                              <FiEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(book)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete book"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && bookToDelete && (
        <DeleteConfirmModal
          title="Delete Book"
          message={`Are you sure you want to delete "${bookToDelete.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setBookToDelete(null);
          }}
        />
      )}
    </div>
  );
}
