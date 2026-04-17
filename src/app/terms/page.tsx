export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold text-text-primary mb-6">Terms of Service</h1>
        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p className="text-text-muted text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Acceptance</h2>
          <p>By using SkillSwap you agree to these terms. If you do not agree, please do not use the platform.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Accounts</h2>
          <p>You are responsible for maintaining the security of your account credentials. One account per person.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Acceptable Use</h2>
          <p>Use the platform to trade legitimate skills. Do not post harmful, illegal, or misleading content. We reserve the right to remove content or suspend accounts that violate these guidelines.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Intellectual Property</h2>
          <p>You retain ownership of any content you create. By posting skill listings you grant SkillSwap a license to display that content on the platform.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Disclaimer</h2>
          <p>SkillSwap is provided &quot;as is&quot; without warranties. We are not responsible for the quality or outcome of any skill exchanges arranged through the platform.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Contact</h2>
          <p>Questions? Open an issue on our <a href="https://github.com/PCSchmidt/skillswapappmvp" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">GitHub repository</a>.</p>
        </div>
      </div>
    </div>
  );
}
