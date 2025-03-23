// library-inventory-system\src\components\AdminDashboardLink.tsx



"use client";

import Link from "next/link";
import { FiSettings } from "react-icons/fi";

interface AdminDashboardLinkProps {
  userRole: string | null;
}

export default function AdminDashboardLink({ userRole }: AdminDashboardLinkProps) {
  if (userRole !== "admin") {
    return null;
  }

  return (
    <Link 
      href="/dashboard" 
      className="text-gray-800 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
    >
      <FiSettings className="mr-1.5 h-4 w-4" />
      Admin Dashboard
    </Link>
  );
}
