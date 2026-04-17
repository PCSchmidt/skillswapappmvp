export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold text-text-primary mb-6">About SkillSwap</h1>
        <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
          <p>
            SkillSwap is a peer-to-peer learning platform where people trade skills instead of paying for lessons. Whether you&apos;re a guitar player who wants to learn Python, or a designer looking to pick up cooking, there&apos;s someone out there with the opposite wish.
          </p>
          <p>
            Our AI-powered matching engine uses sentence embeddings to pair you with the most relevant partners — not just keyword matches, but genuine semantic understanding of what you offer and what you need.
          </p>
          <h2 className="text-2xl font-semibold text-text-primary pt-4">Built With</h2>
          <ul className="list-disc list-inside space-y-2 text-text-secondary">
            <li>Next.js &amp; React for a fast, modern frontend</li>
            <li>Supabase for authentication, database, and real-time messaging</li>
            <li>FastAPI &amp; sentence-transformers for AI skill matching</li>
            <li>pgvector for efficient vector similarity search</li>
          </ul>
          <h2 className="text-2xl font-semibold text-text-primary pt-4">Open Source</h2>
          <p>
            SkillSwap is an open-source portfolio project. You can view the source code on{' '}
            <a
              href="https://github.com/PCSchmidt/skillswapappmvp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              GitHub
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
