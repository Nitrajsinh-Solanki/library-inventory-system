// library-inventory-system\src\components\BookCard.tsx

'use client';

import { useState } from 'react';
import { FiBook } from 'react-icons/fi';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    coverImage?: string;
    genre?: string;
    available: boolean;
  };
  onSelect: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
      onClick={() => onSelect(book._id)}
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {book.coverImage && !imageError ? (
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-gray-200">
            <FiBook className="text-gray-400 text-4xl mb-2" />
            <span className="text-gray-500 text-sm">No cover available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{book.title}</h3>
        <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
        
        <div className="flex justify-between items-center mt-3">
          {book.genre && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {book.genre}
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${
            book.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {book.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
