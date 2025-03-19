'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiBook, FiSettings, FiLogOut } from 'react-icons/fi';

interface LibraryNavbarProps {
  userRole: string | null;
}

const LibraryNavbar: React.FC<LibraryNavbarProps> = ({ userRole }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/library" className="text-2xl font-bold text-white">
              📚 BookNest
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/library" className="text-white hover:text-blue-200 px-3 py-2">
              Home
            </Link>
            
            {userRole === 'admin' && (
              <Link href="/admin-dashboard" className="text-white hover:text-blue-200 px-3 py-2">
                Admin Dashboard
              </Link>
            )}
            
            {userRole === 'librarian' && (
              <Link href="/manage-books" className="text-white hover:text-blue-200 px-3 py-2">
                Manage Books
              </Link>
            )}
            
            {userRole === 'user' && (
              <Link href="/profile" className="text-white hover:text-blue-200 px-3 py-2">
                Profile
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/library" 
              className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiBook className="mr-2" />
                Home
              </div>
            </Link>
            
            {userRole === 'admin' && (
              <Link 
                href="/admin-dashboard" 
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FiSettings className="mr-2" />
                  Admin Dashboard
                </div>
              </Link>
            )}
            
            {userRole === 'librarian' && (
              <Link 
                href="/manage-books" 
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FiBook className="mr-2" />
                  Manage Books
                </div>
              </Link>
            )}
            
            {userRole === 'user' && (
              <Link 
                href="/profile" 
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  Profile
                </div>
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="cursor-pointer w-full text-left text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium "
            >
              <div className="flex items-center cursor-pointer">
                <FiLogOut className="mr-2 cursor-pointer" />
                Logout
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LibraryNavbar;