export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold text-text-primary mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p className="text-text-muted text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Information We Collect</h2>
          <p>When you create an account we store your email address, display name, and any skill listings you publish. We also store messages exchanged through the platform and trade activity.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">How We Use Your Data</h2>
          <p>Your data is used solely to operate the platform: authenticating you, matching you with skill-swap partners, and delivering messages. We do not sell your data to third parties.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Third-Party Services</h2>
          <p>We use Supabase for authentication and data storage, and Vercel for hosting. These providers may process data on our behalf under their own privacy policies.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Data Retention</h2>
          <p>You can delete your account at any time. Upon deletion, your personal data will be removed within 30 days.</p>

          <h2 className="text-xl font-semibold text-text-primary pt-2">Contact</h2>
          <p>Questions about this policy? Open an issue on our <a href="https://github.com/PCSchmidt/skillswapappmvp" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">GitHub repository</a>.</p>
        </div>
      </div>
    </div>
  );
}
