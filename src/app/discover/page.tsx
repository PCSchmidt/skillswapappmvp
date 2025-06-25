'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DiscoverPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the browse skills page
    router.replace('/skills/browse');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-700">Redirecting to skill discovery...</p>
      </div>
    </div>
  );
}
