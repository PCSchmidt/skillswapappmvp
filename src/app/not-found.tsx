import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-emerald-700 mb-4">404</p>
        <h1 className="text-3xl font-bold text-text-primary mb-3">Page Not Found</h1>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/skills"
            className="px-6 py-3 border border-border text-text-primary font-medium hover:bg-surface transition-colors"
          >
            Browse Skills
          </Link>
        </div>
      </div>
    </div>
  );
}
