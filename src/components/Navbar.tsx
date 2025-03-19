// library-inventory-system\src\components\Navbar.tsx


'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-2xl font-bold text-blue-600 cursor-pointer"
            >
              📚 BookNest
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleNavigation('/login')}
              className="cursor-pointer text-gray-700 hover:text-blue-600 px-3 py-2"
            >
              Login
            </button>
            <button 
              onClick={() => handleNavigation('/register')}
              className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-md hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;