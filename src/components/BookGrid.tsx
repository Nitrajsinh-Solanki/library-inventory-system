import Image from 'next/image';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  available: boolean;
}

interface BookGridProps {
  books: Book[];
}

const BookGrid: React.FC<BookGridProps> = ({ books }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Link href={`/book/${book._id}`} key={book._id}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-64 w-full">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {book.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BookGrid;
