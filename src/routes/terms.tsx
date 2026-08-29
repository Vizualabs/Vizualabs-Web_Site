import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { LegalPage, LegalSection } from '#/components/legal/LegalPage'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: 'Terms of Service — Vizualabs' },
      {
        name: 'description',
        content:
          'Terms governing use of the Vizualabs (Pvt.) Ltd. website and related online materials.',
      },
      { property: 'og:title', content: 'Terms of Service — Vizualabs' },
      { property: 'og:url', content: 'https://vizualabs.com/terms' },
    ],
  }),
})

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-[#FF5E4D] selection:text-white">
      <Navbar />
      <main>
        <LegalPage title="Terms of Service" updated="24 August 2026">
          <LegalSection title="Agreement">
            <p>
              By using this website you agree to these terms with{' '}
              <strong className="font-medium text-[#E5E2E1]">Vizualabs (Pvt.) Ltd.</strong> (&quot;Vizualabs&quot;,
              &quot;we&quot;, &quot;us&quot;). If you do not agree, please do not use the site.
            </p>
          </LegalSection>

          <LegalSection title="Website content">
            <p>
              Site materials are provided for general information about Vizualabs and our services. They do not
              create a client engagement unless we enter a separate written agreement with you.
            </p>
          </LegalSection>

          <LegalSection title="Acceptable use">
            <p>
              You agree not to misuse the site — including attempting unauthorized access, disrupting service, or
              submitting unlawful or harmful content through our forms or tools.
            </p>
          </LegalSection>

          <LegalSection title="Liability">
            <p>
              To the fullest extent permitted by law, Vizualabs (Pvt.) Ltd. is not liable for indirect or
              consequential losses arising from use of this website. Nothing in these terms limits rights that
              cannot be excluded under applicable law.
            </p>
          </LegalSection>

          <LegalSection title="Contact">
            <p>
              For questions about these terms, email{' '}
              <a
                href="mailto:info@vizualabs.com"
                className="text-[#FF5E4D] underline-offset-2 hover:underline"
              >
                info@vizualabs.com
              </a>
              . See also our{' '}
              <Link to="/privacy" className="text-[#FF5E4D] underline-offset-2 hover:underline">
                Privacy Policy
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
