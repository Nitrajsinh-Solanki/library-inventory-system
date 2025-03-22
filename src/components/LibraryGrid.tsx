// library-inventory-system\src\components\LibraryGrid.tsx




"use client";

import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  coverImage: string;
  genre: string;
  publishedYear: number;
  publisher: string;
  available: boolean;
}

const LibraryGrid = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        setBooks(data);

        // Extract unique genres
        const uniqueGenres = Array.from(
          new Set(data.map((book: Book) => book.genre).filter(Boolean))
        ) as string[];
        setGenres(uniqueGenres);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
  };

  const handleCloseDetails = () => {
    setSelectedBookId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterGenre(e.target.value);
  };

  const handleAvailableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvailableOnly(e.target.checked);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterGenre("");
    setAvailableOnly(false);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre ? book.genre === filterGenre : true;
    const matchesAvailability = availableOnly ? book.available : true;

    return matchesSearch && matchesGenre && matchesAvailability;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Input */}
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title or author..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Genre Filter */}
          <div className="md:w-1/4">
            <select
              value={filterGenre}
              onChange={handleGenreChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Available Only Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="availableOnly"
              checked={availableOnly}
              onChange={handleAvailableChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="availableOnly" className="ml-2 text-gray-700">
              Available Only
            </label>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || filterGenre || availableOnly) && (
            <button
              onClick={clearFilters}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <FiX className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Found {filteredBooks.length}{" "}
        {filteredBooks.length === 1 ? "book" : "books"}
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} onSelect={handleSelectBook} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FiFilter className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No books found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria to find what you're
            looking for.
          </p>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBookId && (
        <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default LibraryGrid;
