// library-inventory-system\src\app\unauthorized\page.tsx

import Link from 'next/link';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <FiAlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page. This area is restricted to librarians only.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FiHome className="mr-2" /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

