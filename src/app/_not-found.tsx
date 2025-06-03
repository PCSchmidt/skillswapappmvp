'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
        Go back home
      </Link>
    </div>
  );
}
