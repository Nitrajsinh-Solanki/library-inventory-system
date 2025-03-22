// library-inventory-system\src\components\BorrowBookModal.tsx



'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiDollarSign, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
}

interface FareSettings {
  borrowDuration: number;
  borrowFee: number;
  lateFeePerDay: number;
  maxBorrowDuration: number;
  currency: string;
}

interface BorrowBookModalProps {
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
}

const BorrowBookModal: React.FC<BorrowBookModalProps> = ({ book, onClose, onSuccess }) => {
  const [fareSettings, setFareSettings] = useState<FareSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [borrowDuration, setBorrowDuration] = useState<number>(0);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFareSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/fare-settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch fare settings');
        }
        
        const data = await response.json();
        setFareSettings(data || {
          borrowDuration: 14,
          borrowFee: 0,
          lateFeePerDay: 1,
          maxBorrowDuration: 30,
          currency: '$'
        });
        
        // Set default borrow duration from settings
        setBorrowDuration(data?.borrowDuration || 14);
        
        // Calculate initial due date
        const today = new Date();
        const due = new Date(today);
        due.setDate(due.getDate() + (data?.borrowDuration || 14));
        setDueDate(due);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFareSettings();
  }, []);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (fareSettings && value >= 1 && value <= fareSettings.maxBorrowDuration) {
      setBorrowDuration(value);
      
      // Update due date
      const today = new Date();
      const due = new Date(today);
      due.setDate(due.getDate() + value);
      setDueDate(due);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fareSettings || !dueDate) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book._id,
          borrowDuration,
          dueDate: dueDate.toISOString(),
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to borrow book');
      }
      
      setSuccess('Book borrowed successfully!');
      
      // Notify parent component of success after a short delay
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!fareSettings) {
    return null;
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Borrow Book</h2>
            {!isSubmitting && !success && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center">
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success ? (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-500 mb-6">{success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Book Details</h3>
                <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-12 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-gray-400 text-xs">No cover</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-800">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Borrowing Details</h3>
                
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FiDollarSign className="text-blue-600 mr-2" />
                    <span className="text-gray-700">Borrowing Fee:</span>
                  </div>
                  <span className="font-medium">
                    {fareSettings.borrowFee > 0 
                      ? `${fareSettings.currency}${fareSettings.borrowFee.toFixed(2)}` 
                      : 'Free'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FiClock className="text-blue-600 mr-2" />
                    <span className="text-gray-700">Default Duration:</span>
                  </div>
                  <span className="font-medium">{fareSettings.borrowDuration} days</span>
                </div>
                
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FiDollarSign className="text-blue-600 mr-2" />
                    <span className="text-gray-700">Late Fee:</span>
                  </div>
                  <span className="font-medium">
                    {fareSettings.currency}{fareSettings.lateFeePerDay.toFixed(2)}/day
                  </span>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="borrowDuration" className="block text-sm font-medium text-gray-700 mb-1">
                    Borrow Duration (1-{fareSettings.maxBorrowDuration} days)
                  </label>
                  <input
                    type="range"
                    id="borrowDuration"
                    min="1"
                    max={fareSettings.maxBorrowDuration}
                    value={borrowDuration}
                    onChange={handleDurationChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">1 day</span>
                    <span className="text-sm font-medium">{borrowDuration} days</span>
                    <span className="text-xs text-gray-500">{fareSettings.maxBorrowDuration} days</span>
                  </div>
                </div>
                
                {dueDate && (
                  <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FiCalendar className="text-yellow-600 mr-2" />
                      <span className="text-gray-700">Due Date:</span>
                    </div>
                    <span className="font-medium">
                      {dueDate.toLocaleDateString('en-US', { 
                        weekday: 'short',
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    'Confirm Borrow'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BorrowBookModal;

