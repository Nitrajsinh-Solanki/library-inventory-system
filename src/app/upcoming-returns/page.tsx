// library-inventory-system\src\app\upcoming-returns\page.tsx




import React from 'react';
import UpcomingReturnsContent from '@/components/UpcomingReturnsContent';
import { getCurrentUser } from '@/lib/utils/auth';
import { redirect } from 'next/navigation';
import LibraryNavbar from '@/components/LibraryNavbar';

export const metadata = {
  title: 'Upcoming Returns | BookNest',
  description: 'Manage upcoming book returns and track overdue books',
};

export default async function UpcomingReturnsPage() {
  // Server-side check for librarian/admin access
  const user = await getCurrentUser();
  
  if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
    redirect('/unauthorized');
  }
  
  return (
    <>
      <LibraryNavbar userRole={user.role} />
      <div className="container mx-auto px-4 py-8">
        <UpcomingReturnsContent />
      </div>
    </>
  );
}
