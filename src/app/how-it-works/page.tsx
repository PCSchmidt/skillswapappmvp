export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-canvas py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold text-text-primary mb-6">How It Works</h1>
        <p className="text-text-secondary text-lg mb-10">
          SkillSwap connects people who want to teach with people who want to learn — no money involved, just a fair exchange of knowledge.
        </p>

        <ol className="space-y-10">
          <li className="flex gap-5">
            <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-emerald-900/30 text-emerald-400 font-semibold text-lg border border-emerald-700/30">1</span>
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-1">Create Your Profile</h2>
              <p className="text-text-secondary">Sign up and tell us what skills you can offer and what you&apos;d like to learn.</p>
            </div>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-emerald-900/30 text-emerald-400 font-semibold text-lg border border-emerald-700/30">2</span>
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-1">Discover Matches</h2>
              <p className="text-text-secondary">Browse skills or let our AI-powered matching find the best skill-swap partners for you.</p>
            </div>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-emerald-900/30 text-emerald-400 font-semibold text-lg border border-emerald-700/30">3</span>
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-1">Propose a Trade</h2>
              <p className="text-text-secondary">Found a match? Propose a trade, pick a few dates, and wait for the other person to accept.</p>
            </div>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-emerald-900/30 text-emerald-400 font-semibold text-lg border border-emerald-700/30">4</span>
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-1">Learn &amp; Teach</h2>
              <p className="text-text-secondary">Meet up (virtually or in person), exchange knowledge, and mark the trade complete when you&apos;re done.</p>
            </div>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-emerald-900/30 text-emerald-400 font-semibold text-lg border border-emerald-700/30">5</span>
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-1">Rate &amp; Repeat</h2>
              <p className="text-text-secondary">Leave a rating for your partner and browse for your next skill swap.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
