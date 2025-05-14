import Link from 'next/link';
import React from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/**
 * Next.js Not Found Page
 * This component is rendered when a page is not found (404)
 */
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="p-8 max-w-lg mx-auto bg-yellow-50 border-yellow-200">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-6xl font-bold text-yellow-600 mb-2">404</div>
          <h1 className="text-2xl font-bold text-yellow-800">Page Not Found</h1>
          
          <p className="text-md text-yellow-700 mt-2">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="flex gap-4 mt-6">
            <Button
              variant="primary"
              onClick={() => window.history.back()}
            >
              Go back
            </Button>
            
            <Link href="/" passHref>
              <Button
                variant="outline"
              >
                Go to home page
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
