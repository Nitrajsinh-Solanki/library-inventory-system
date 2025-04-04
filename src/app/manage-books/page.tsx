// library-inventory-system\src\app\manage-books\page.tsx



import React from 'react';
import { getCurrentUser } from '@/lib/utils/auth';
import { redirect } from 'next/navigation';
import LibraryNavbar from '@/components/LibraryNavbar';
import ManageBooksClient from '@/components/ManageBooksClient';

export const metadata = {
  title: 'Manage Books | BookNest',
  description: 'Add, edit, and manage library book inventory',
};

export default async function ManageBooksPage() {
  // Server-side check for librarian/admin access
  const user = await getCurrentUser();
  
  if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
    redirect('/unauthorized');
  }
  
  return (
    <>
      <LibraryNavbar userRole={user.role} />
      <ManageBooksClient />
    </>
  );
}


