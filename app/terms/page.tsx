import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Pitchcraft',
  description: 'Pitchcraft terms of service.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-[24px] md:px-[48px] py-[80px]">
      <article className="max-w-[680px] mx-auto">
        <h1 className="font-[var(--font-heading)] text-[32px] md:text-[40px] font-semibold leading-[1.2] tracking-[-0.02em] text-text-primary mb-[32px]">
          Terms of Service
        </h1>

        <div className="flex flex-col gap-[24px] font-[var(--font-body)] text-[15px] leading-[26px] text-text-secondary">
          <p className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] uppercase text-text-disabled">
            Last updated: February 2026
          </p>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              1. What Pitchcraft Is
            </h2>
            <p>
              Pitchcraft is a presentation, funding, and versioning tool for creative professionals.
              You use it to structure, share, and fund your creative work through a single shareable link.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              2. Your Content
            </h2>
            <p>
              You own everything you create on Pitchcraft. Your pitches, text, images, documents, and
              all other content belong to you. Pitchcraft does not claim ownership of your work.
            </p>
            <p className="mt-[8px]">
              We do not use your content to train AI models. We do not sell your data to third parties.
              We do not mine your pitches for patterns or insights.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              3. Accounts
            </h2>
            <p>
              You need an account to use Pitchcraft. You are responsible for keeping your login
              credentials secure. One account per person.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              4. Payments &amp; Subscriptions
            </h2>
            <p>
              Pitchcraft offers free and paid tiers. Paid subscriptions are billed monthly or annually
              through Stripe. You can cancel at any time. Cancellation takes effect at the end of your
              current billing period.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              5. Funding
            </h2>
            <p>
              Pitchcraft allows creators to accept funding through their pitch links. All payments are
              processed by Stripe. Pitchcraft charges a commission on funded amounts (see your plan
              details for rates). Stripe&apos;s standard processing fees (2.9% + $0.30 per transaction)
              apply separately.
            </p>
            <p className="mt-[8px]">
              Creators are responsible for fulfilling any rewards or commitments made to their supporters.
              Pitchcraft does not guarantee project completion or reward delivery.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              6. AI Features
            </h2>
            <p>
              Pitchcraft offers optional AI-assisted features (text refinement, reference image generation)
              for paid plan subscribers. AI suggestions are clearly labeled and always optional. AI never
              overwrites your content. You review and accept all AI output before it becomes part of your pitch.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              7. Acceptable Use
            </h2>
            <p>
              Do not use Pitchcraft for unlawful content, harassment, fraud, or to infringe on others&apos;
              intellectual property. We reserve the right to remove content that violates these terms
              and suspend accounts engaged in abuse.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              8. Availability
            </h2>
            <p>
              We aim for high availability but do not guarantee uninterrupted service. We may perform
              maintenance that temporarily limits access. We will provide notice when possible.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these terms. Significant changes will be communicated via email or in-app
              notification. Continued use of Pitchcraft after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
              10. Contact
            </h2>
            <p>
              Questions about these terms? Email us at hello@pitchcraft.app.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
