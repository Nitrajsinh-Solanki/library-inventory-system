// library-inventory-system\src\components\IsbnFetchForm.tsx

"use client";

import { useState } from "react";
import {
  FiBook,
  FiSearch,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

interface IsbnFetchFormProps {
  onSuccess: () => void;
}

interface OpenLibraryBook {
  title: string;
  authors?: any[]; // Using any to handle different possible formats
  publish_date?: string;
  publishers?: string[];
  isbn_13?: string[];
  isbn_10?: string[];
  cover?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

const IsbnFetchForm: React.FC<IsbnFetchFormProps> = ({ onSuccess }) => {
  const [isbn, setIsbn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookData, setBookData] = useState<OpenLibraryBook | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [authorDisplay, setAuthorDisplay] = useState("Unknown");

  // Form data for fields not provided by the API
  const [formData, setFormData] = useState({
    description: "",
    genre: "",
    totalCopies: 1,
    available: true,
  });

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsbn(e.target.value.trim());
  };

  // Helper function to safely extract author name
  const getAuthorName = async (authors: any[]): Promise<string> => {
    if (!authors || authors.length === 0) return "Unknown Author";

    const authorKey = authors[0].key; // Example: "/authors/OL242220A"
    const authorUrl = `https://openlibrary.org${authorKey}.json`;

    try {
      const response = await fetch(authorUrl);
      const authorData = await response.json();
      return authorData.name || "Unknown Author";
    } catch (error) {
      console.error("Error fetching author details:", error);
      return "Unknown Author";
    }
  };

  const fetchBookByIsbn = async () => {
    if (!isbn) {
      setError("Please enter an ISBN");
      return;
    }

    setIsLoading(true);
    setError("");
    setBookData(null);
    setCoverImageUrl("");
    setAuthorDisplay("Unknown");

    try {
      const cleanIsbn = isbn.replace(/[-\s]/g, "");
      const response = await fetch(`https://openlibrary.org/isbn/${cleanIsbn}.json`);

      if (!response.ok) {
        throw new Error("Failed to fetch book data");
      }

      const book = await response.json();
      console.log("Book data from API:", book);

      let authorName = "Unknown";
      if (book.authors && book.authors.length > 0) {
        authorName = await getAuthorName(book.authors);
      }
      setAuthorDisplay(authorName);

      setBookData(book);

      // Get cover image using OpenLibrary Cover API
      setCoverImageUrl(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "totalCopies") {
      // Convert to number if it's a valid number
      const numValue = value === "" ? 1 : Number(value);
      setFormData({ ...formData, [name]: numValue });
    } else if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookData) {
      setError("Please fetch a book first");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare book data for submission
      const bookToAdd = {
        title: bookData.title,
        author: authorDisplay, // Use the pre-processed author name
        isbn: isbn,
        description: formData.description,
        genre: formData.genre,
        publishedYear: bookData.publish_date
          ? parseInt(bookData.publish_date.slice(-4)) || ""
          : "",
        publisher: bookData.publishers?.[0] || "",
        totalCopies: formData.totalCopies,
        available: formData.available,
        coverImage: coverImageUrl,
      };

      // Send book data to API
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookToAdd),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add book");
      }

      setSuccess("Book added successfully!");

      // Reset form
      setIsbn("");
      setBookData(null);
      setCoverImageUrl("");
      setAuthorDisplay("Unknown");
      setFormData({
        description: "",
        genre: "",
        totalCopies: 1,
        available: true,
      });

      // Notify parent component
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Fetch Book by ISBN
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center"
        >
          <FiAlertCircle className="mr-2" />
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center"
        >
          <FiCheckCircle className="mr-2" />
          {success}
        </motion.div>
      )}

      {/* ISBN Search Form */}
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN Number
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBook className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={isbn}
                onChange={handleIsbnChange}
                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter ISBN (e.g., 9780451524935)"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={fetchBookByIsbn}
            disabled={isLoading || !isbn}
            className={`mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
              isLoading || !isbn
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Searching...
              </>
            ) : (
              <>
                <FiSearch className="mr-2" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Book Details Form */}
      {bookData && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Book Found:
            </h3>
            <div className="flex flex-col md:flex-row">
              {coverImageUrl && (
                <div className="mb-4 md:mb-0 md:mr-6">
                  <img
                    src={coverImageUrl}
                    alt={bookData.title}
                    className="w-32 h-auto object-cover rounded-md shadow-md"
                  />
                </div>
              )}
              <div>
                <p className="text-xl font-bold text-gray-800">
                  {bookData.title}
                </p>
                <p className="text-gray-600">
                  Author: {authorDisplay}
                </p>
                {bookData.publish_date && (
                  <p className="text-gray-600">
                    Published: {bookData.publish_date}
                  </p>
                )}
                {bookData.publishers && bookData.publishers.length > 0 && (
                  <p className="text-gray-600">
                    Publisher: {bookData.publishers[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter book description"
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre <span className="text-red-500">*</span>
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Children">Children</option>
              <option value="Young Adult">Young Adult</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Total Copies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Copies <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              required
              min="1"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={(e) =>
                setFormData({ ...formData, available: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="available"
              className="ml-2 block text-sm text-gray-700"
            >
              Book is available for borrowing
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Adding Book...
                </>
              ) : (
                "Add Book to Library"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default IsbnFetchForm;
