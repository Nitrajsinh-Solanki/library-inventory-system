// library-inventory-system\src\app\library\page.tsx

'use client';
import { useState, useEffect } from 'react';
import LibraryNavbar from '@/components/LibraryNavbar';
import Footer from '@/components/Footer';
import BookGrid from '@/components/BookGrid';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LibraryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch user role and books data
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        } else {
          // Handle unauthenticated users
          setUserRole('guest');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserRole('guest');
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchBooks();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LibraryNavbar userRole={userRole} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Library Collection</h1>
        {books.length > 0 ? (
          <BookGrid books={books} />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No books available in the library yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}