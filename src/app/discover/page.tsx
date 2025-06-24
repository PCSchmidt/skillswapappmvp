'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DiscoverPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the search page
    router.replace('/search');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mb-4"></div>
        <p className="text-gray-700">Redirecting to skill discovery...</p>
      </div>
    </div>
  );
}
