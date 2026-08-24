import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { LegalPage, LegalSection } from '#/components/legal/LegalPage'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy — Vizualabs' },
      {
        name: 'description',
        content:
          'How Vizualabs (Pvt.) Ltd. collects, uses, and protects information when you use our website and services.',
      },
      { property: 'og:title', content: 'Privacy Policy — Vizualabs' },
      { property: 'og:url', content: 'https://vizualabs.com/privacy' },
    ],
  }),
})

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-[#FF5E4D] selection:text-white">
      <Navbar />
      <main>
        <LegalPage title="Privacy Policy" updated="24 August 2026">
          <LegalSection title="Who we are">
            <p>
              This policy applies to <strong className="font-medium text-[#E5E2E1]">Vizualabs (Pvt.) Ltd.</strong>{' '}
              (&quot;Vizualabs&quot;, &quot;we&quot;, &quot;us&quot;). It explains how we handle information when you
              visit vizualabs.com or contact us through our site.
            </p>
          </LegalSection>

          <LegalSection title="Information we collect">
            <p>
              We may collect information you submit through forms (such as name, email, and message content),
              basic technical data from your browser (such as IP address and device type), and usage signals that
              help us understand how the site is used.
            </p>
          </LegalSection>

          <LegalSection title="How we use information">
            <p>
              We use this information to respond to inquiries, deliver and improve our services, maintain site
              security, and communicate about projects or updates you have requested.
            </p>
          </LegalSection>

          <LegalSection title="Sharing">
            <p>
              We do not sell personal information. We may share data with service providers who help us operate
              the website (for example email or hosting), or when required by law.
            </p>
          </LegalSection>

          <LegalSection title="Contact">
            <p>
              Questions about privacy can be sent to{' '}
              <a
                href="mailto:info@vizualabs.com"
                className="text-[#FF5E4D] underline-offset-2 hover:underline"
              >
                info@vizualabs.com
              </a>
              . See also our{' '}
              <Link to="/terms" className="text-[#FF5E4D] underline-offset-2 hover:underline">
                Terms of Use
              </Link>
              .
            </p>
          </LegalSection>
        </LegalPage>
      </main>
      <Footer />
    </div>
  )
}
