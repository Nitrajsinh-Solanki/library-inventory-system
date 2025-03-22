// library-inventory-system\src\components\ReturnBookModal.tsx



'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiCalendar, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
  status: 'borrowed' | 'returned' | 'overdue';
  remainingDays: number;
  totalFee: number;
}

interface ReturnBookModalProps {
  borrow: Borrow;
  onClose: () => void;
  onSuccess: () => void;
}

const ReturnBookModal: React.FC<ReturnBookModalProps> = ({ borrow, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [feeCollected, setFeeCollected] = useState(true);

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Handle background click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      console.log(`Submitting return for borrow ID: ${borrow._id}`);
      
      const response = await fetch(`/api/borrow/${borrow._id}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feeCollected: feeCollected,
          returnDate: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to return book');
      }

      console.log('Return successful:', data);
      setSuccess(true);
      
      // Delay success callback to show success message
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Return book error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg max-w-lg w-full mx-4 p-6 shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {success ? (
            <div className="text-center">
              <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Book returned successfully</h3>
              <p className="mt-2 text-sm text-gray-500">
                The book has been marked as returned and is now available for borrowing.
              </p>
            </div>
          ) : (
            <>
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <FiCalendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Return Book</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You are about to mark this book as returned. Please confirm the details below.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 p-4 rounded-md">
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

              <div className="mt-5">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Book:</span>
                    <span className="text-sm text-gray-900">{borrow.bookId.title}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Borrower:</span>
                    <span className="text-sm text-gray-900">{borrow.userId.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Borrow Date:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(borrow.borrowDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Due Date:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(borrow.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`text-sm ${borrow.remainingDays < 0 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {borrow.remainingDays < 0
                        ? `Overdue by ${Math.abs(borrow.remainingDays)} days`
                        : `${borrow.remainingDays} days remaining`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Total Fee:</span>
                    <span className={`text-sm font-medium ${borrow.totalFee > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                      ${borrow.totalFee.toFixed(2)}
                    </span>
                  </div>
                </div>

                {borrow.totalFee > 0 && (
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={feeCollected}
                        onChange={(e) => setFeeCollected(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Fee has been collected (${borrow.totalFee.toFixed(2)})</span>
                    </label>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || (borrow.totalFee > 0 && !feeCollected)}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Confirm Return'
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ReturnBookModal;
