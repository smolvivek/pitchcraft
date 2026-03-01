import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Pitchcraft',
  description: 'Pitchcraft privacy policy. Your data belongs to you.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-[24px] md:px-[48px] py-[80px]">
      <article className="max-w-[680px] mx-auto">
        <h1 className="font-[var(--font-heading)] text-[32px] md:text-[40px] font-semibold leading-[1.2] tracking-[-0.02em] text-text-primary mb-[32px]">
          Privacy Policy
        </h1>

        <div className="flex flex-col gap-[24px] font-[var(--font-body)] text-[15px] leading-[26px] text-text-secondary">
          <p className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] uppercase text-text-disabled">
            Last updated: February 2026
          </p>

          <p>
            Pitchcraft is built on trust. This policy explains what data we collect, why, and what
            we never do with it.
          </p>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              1. What We Collect
            </h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li><strong className="text-text-primary">Account information:</strong> email address, name (for authentication via Supabase)</li>
              <li><strong className="text-text-primary">Pitch content:</strong> text, images, PDFs, and media you upload (stored in Supabase)</li>
              <li><strong className="text-text-primary">Payment information:</strong> processed by Stripe &mdash; we never see or store your card details</li>
              <li><strong className="text-text-primary">Basic usage:</strong> AI feature usage counts (for rate limiting only, not behavioral tracking)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              2. What We Never Do
            </h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li>We do <strong className="text-text-primary">not</strong> track viewer engagement, clicks, scroll depth, or time-on-page</li>
              <li>We do <strong className="text-text-primary">not</strong> use your content to train AI models</li>
              <li>We do <strong className="text-text-primary">not</strong> sell or share your data with third parties</li>
              <li>We do <strong className="text-text-primary">not</strong> use tracking pixels, heat maps, or behavioral analytics</li>
              <li>We do <strong className="text-text-primary">not</strong> build advertising profiles from your data</li>
              <li>We do <strong className="text-text-primary">not</strong> mine pitch content for patterns or insights</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              3. How We Use Your Data
            </h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li>To provide the service (storing and displaying your pitches)</li>
              <li>To process payments through Stripe</li>
              <li>To enforce rate limits on AI features</li>
              <li>To send transactional emails (funding received, password reset)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              4. Data Storage
            </h2>
            <p>
              Your data is stored in Supabase (hosted PostgreSQL). Media files are stored in Supabase
              Storage. All data is encrypted in transit (TLS) and at rest.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              5. Third-Party Services
            </h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li><strong className="text-text-primary">Supabase:</strong> database, authentication, file storage</li>
              <li><strong className="text-text-primary">Stripe:</strong> payment processing</li>
              <li><strong className="text-text-primary">Vercel:</strong> hosting</li>
              <li><strong className="text-text-primary">OpenAI:</strong> AI image generation (only when you explicitly request it)</li>
              <li><strong className="text-text-primary">Anthropic:</strong> AI text assistance (only when you explicitly request it)</li>
            </ul>
            <p className="mt-[8px]">
              Each service has its own privacy policy. We only share the minimum data required for
              each service to function.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              6. Your Rights
            </h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li><strong className="text-text-primary">Access:</strong> you can view all your data at any time through the dashboard</li>
              <li><strong className="text-text-primary">Delete:</strong> you can delete your pitches and account at any time</li>
              <li><strong className="text-text-primary">Export:</strong> you can download your pitch data (planned feature)</li>
              <li><strong className="text-text-primary">Correct:</strong> you can edit any of your content at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              7. Cookies
            </h2>
            <p>
              We use essential cookies only (authentication session). No marketing cookies, no tracking
              cookies, no third-party cookies.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              8. GDPR
            </h2>
            <p>
              If you are in the EU/EEA, you have additional rights under GDPR including data portability
              and the right to be forgotten. Contact us at hello@pitchcraft.app to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              9. Changes
            </h2>
            <p>
              We may update this policy. Changes will be communicated via email. The &ldquo;last updated&rdquo;
              date at the top will reflect the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              10. Contact
            </h2>
            <p>
              Privacy questions? Email hello@pitchcraft.app.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
