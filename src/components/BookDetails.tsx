// library-inventory-system\src\components\BookDetails.tsx

'use client';

import { useState, useEffect } from 'react';
import { FiBook, FiUser, FiCalendar, FiTag, FiInfo, FiBookmark } from 'react-icons/fi';
import { motion } from 'framer-motion';
import BorrowBookModal from './BorrowBookModal';

interface BookDetailsProps {
  bookId: string;
  onClose: () => void;
}

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
  availableCopies: number;
  totalCopies: number;
}

const BookDetails: React.FC<BookDetailsProps> = ({ bookId, onClose }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/${bookId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleBorrowClick = () => {
    setShowBorrowModal(true);
  };

  const handleBorrowSuccess = () => {
    // Update book availability after successful borrow
    if (book) {
      setBook({
        ...book,
        availableCopies: book.availableCopies - 1,
        available: book.availableCopies - 1 > 0
      });
    }
    setShowBorrowModal(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Book Cover */}
          <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-6">
            {book.coverImage ? (
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-full max-w-xs object-contain rounded-md shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
                <FiBook className="text-gray-400 text-6xl" />
              </div>
            )}
          </div>
          
          {/* Book Details */}
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{book.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              {/* Author */}
              <div className="flex items-center">
                <FiUser className="text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Author:</span>
                <span className="ml-2 text-gray-600">{book.author}</span>
              </div>
              
              {/* Published Year & Publisher */}
              <div className="flex items-center">
                <FiCalendar className="text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Published:</span>
                <span className="ml-2 text-gray-600">
                  {book.publishedYear ? book.publishedYear : 'Unknown'} 
                  {book.publisher && ` by ${book.publisher}`}
                </span>
              </div>
              
              {/* Genre */}
              <div className="flex items-center">
                <FiTag className="text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Genre:</span>
                <span className="ml-2 text-gray-600">{book.genre || 'Not specified'}</span>
              </div>
              
              {/* ISBN */}
              {book.isbn && (
                <div className="flex items-center">
                  <FiBookmark className="text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">ISBN:</span>
                  <span className="ml-2 text-gray-600">{book.isbn}</span>
                </div>
              )}
              
              {/* Availability */}
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${book.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700 font-medium">Status:</span>
                <span className={`ml-2 ${book.available ? 'text-green-600' : 'text-red-600'}`}>
                  {book.available ? 'Available' : 'Not Available'}
                </span>
              </div>
              
              {/* Description */}
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <FiInfo className="text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">Description:</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {book.description || 'No description available.'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleBorrowClick}
                className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                  book.available 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!book.available}
              >
                Borrow Book
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Borrow Book Modal */}
      {showBorrowModal && book && (
        <BorrowBookModal 
          book={book} 
          onClose={() => setShowBorrowModal(false)}
          onSuccess={handleBorrowSuccess}
        />
      )}
    </motion.div>
  );
};

export default BookDetails;
