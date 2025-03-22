// library-inventory-system\src\components\BookForm.tsx


"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiBook,
  FiUser,
  FiCalendar,
  FiHash,
  FiFileText,
  FiUpload,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";

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
}

interface BookFormProps {
  onSuccess: () => void;
  book?: Book;
  isEditing?: boolean;
}

// Define a type for the form data
interface FormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  genre: string;
  publishedYear: string | number;
  publisher: string;
  totalCopies: number;
  available: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  onSuccess,
  book,
  isEditing = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    isbn: "",
    description: "",
    genre: "",
    publishedYear: "",
    publisher: "",
    totalCopies: 1,
    available: true,
  });

  // Image upload states
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [existingCoverImage, setExistingCoverImage] = useState<string>("");

  // Refs for file inputs
  const coverImageRef = useRef<HTMLInputElement>(null);

  // Initialize form with book data if editing
  useEffect(() => {
    if (isEditing && book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        description: book.description || "",
        genre: book.genre || "",
        publishedYear: book.publishedYear || "",
        publisher: book.publisher || "",
        totalCopies: book.totalCopies || 1,
        available: book.available,
      });

      if (book.coverImage) {
        setExistingCoverImage(book.coverImage);
        setCoverImagePreview(book.coverImage);
      }
    }
  }, [isEditing, book]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "publishedYear" || name === "totalCopies") {
      // Convert to number if it's a valid number
      const numValue = value === "" ? "" : Number(value);
      setFormData({ ...formData, [name]: numValue });
    } else if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle cover image selection
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload a single image and get its URL
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/books/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!formData.title || !formData.author) {
        throw new Error("Title and author are required");
      }

      // Upload cover image if provided
      let coverImageUrl = existingCoverImage;
      if (coverImage) {
        coverImageUrl = await uploadImage(coverImage);
      }

      // Prepare book data
      const bookData = {
        ...formData,
        coverImage: coverImageUrl,
        publishedYear: formData.publishedYear
          ? Number(formData.publishedYear)
          : undefined,
        totalCopies: Number(formData.totalCopies),
        availableCopies: isEditing ? undefined : Number(formData.totalCopies),
      };

      // Send book data to API
      const url = isEditing && book ? `/api/books/${book._id}` : "/api/books";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || `Failed to ${isEditing ? "update" : "add"} book`
        );
      }

      // Reset form on success
      if (!isEditing) {
        setFormData({
          title: "",
          author: "",
          isbn: "",
          description: "",
          genre: "",
          publishedYear: "",
          publisher: "",
          totalCopies: 1,
          available: true,
        });
        setCoverImage(null);
        setCoverImagePreview("");
      }

      setSuccess(`Book ${isEditing ? "updated" : "added"} successfully!`);
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
        {isEditing ? "Edit Book" : "Add New Book"}
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 p-4 rounded-lg mb-6"
        >
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Title <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiBook className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="pl-10 block w-full border border-gray-300  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter book title"
            />
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter author name"
            />
          </div>
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ISBN
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiHash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter ISBN"
            />
          </div>
        </div>

        {/* Two columns layout for Genre and Published Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Published Year
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="YYYY"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
        </div>

        {/* Two columns layout for Publisher and Total Copies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publisher
            </label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter publisher name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Copies
            </label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              min="1"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
              <FiFileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter book description"
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <button
              type="button"
              onClick={() => coverImageRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiUpload className="mr-2 h-5 w-5 text-gray-400" />
              {isEditing ? "Change Cover" : "Upload Cover"}
            </button>
            <input
              type="file"
              ref={coverImageRef}
              onChange={handleCoverImageChange}
              accept="image/*"
              className="hidden"
            />

            {coverImagePreview && (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="h-24 w-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage(null);
                    setCoverImagePreview(
                      isEditing && existingCoverImage ? existingCoverImage : ""
                    );
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
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
            {isLoading
              ? isEditing
                ? "Updating Book..."
                : "Adding Book..."
              : isEditing
              ? "Update Book"
              : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;

