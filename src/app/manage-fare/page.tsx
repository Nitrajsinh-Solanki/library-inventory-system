
// library-inventory-system\src\app\manage-fare\page.tsx

import React from 'react';
import ManageFareSettings from '@/components/ManageFareSettings';
import { getCurrentUser } from '@/lib/utils/auth';
import { redirect } from 'next/navigation';
import LibraryNavbar from '@/components/LibraryNavbar';

export const metadata = {
  title: 'Manage Fare Settings | BookNest',
  description: 'Configure book borrowing fees and late penalties',
};

export default async function ManageFarePage() {
  // Server-side check for librarian/admin access
  const user = await getCurrentUser();
  
  if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
    redirect('/unauthorized');
  }
  
  return (
    <>
      <LibraryNavbar userRole={user.role} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fare Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure borrowing fees and late penalties for library books
          </p>
        </div>
        
        <ManageFareSettings />
      </div>
    </>
  );
}
