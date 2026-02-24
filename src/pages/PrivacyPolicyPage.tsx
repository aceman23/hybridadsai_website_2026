import type { Page } from '../App';

interface Props {
  navigate: (page: Page) => void;
}

export default function PrivacyPolicyPage({ navigate }: Props) {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-950 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold text-blue-400 tracking-widest uppercase mb-3">Legal</div>
          <h1 className="text-4xl font-black">Privacy Policy</h1>
          <p className="text-gray-400 mt-3 text-sm">Last updated: February 24, 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-gray max-w-none">
        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            HybridAds.ai ("we," "our," or "us") operates the website hybridads.ai and related services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage our services. Please read this policy carefully. If you disagree with its terms, please discontinue use of the site.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">2. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-3">We may collect the following categories of information:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Contact Information:</strong> Name, email address, phone number, and company name provided through contact forms or discovery calls.</li>
            <li><strong>Usage Data:</strong> IP address, browser type, operating system, referring URLs, pages visited, and time spent on pages — collected automatically via analytics tools.</li>
            <li><strong>Ad Account Data:</strong> Performance metrics, campaign data, and ad spend information you authorize us to access in order to provide our services.</li>
            <li><strong>Communications:</strong> Messages, emails, and notes from consultations or support interactions.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>To provide, operate, and improve our advertising management and AI services.</li>
            <li>To respond to inquiries and schedule discovery calls.</li>
            <li>To send service-related communications and performance reports.</li>
            <li>To analyze website traffic and improve user experience.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">4. Cookies & Tracking Technologies</h2>
          <p className="text-gray-600 leading-relaxed">
            We use cookies and similar tracking technologies to monitor activity on our website and hold certain information. These include Google Analytics, Google Ads conversion tracking, and Twitter/X pixel tracking. You may control cookie preferences through your browser settings or our cookie consent banner. For details, see our cookie notice displayed on your first visit.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">5. Sharing Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-3">We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our website and providing services (e.g., Google Analytics, Calendly, Supabase).</li>
            <li><strong>Ad Platforms:</strong> Google, Meta, TikTok, and X as required to manage your campaigns on your behalf.</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government authority.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">6. Data Retention</h2>
          <p className="text-gray-600 leading-relaxed">
            We retain personal data for as long as necessary to fulfill the purposes described in this policy or as required by law. Ad account data is retained for the duration of our engagement plus a reasonable period for reporting purposes. You may request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">7. Your Rights (GDPR & CCPA)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request erasure of your personal data ("right to be forgotten").</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
            <li><strong>Opt-Out:</strong> California residents may opt out of the sale of personal information (we do not sell data).</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for processing at any time.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">To exercise any of these rights, email us at <a href="mailto:hello@hybridads.ai" className="text-blue-600 hover:underline">hello@hybridads.ai</a>.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">8. Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement commercially reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, or alteration. However, no method of transmission over the Internet is 100% secure and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">9. Third-Party Links</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites and encourage you to review their privacy policies.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">10. Children's Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            Our services are not directed to individuals under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that a child has provided us with personal data, we will delete such information promptly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">11. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page with an updated date. Your continued use of our services after changes become effective constitutes acceptance of the revised policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">12. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            For questions, concerns, or requests related to this Privacy Policy, contact us at:
          </p>
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-700 text-sm space-y-1">
            <p className="font-semibold text-gray-900">HybridAds.ai</p>
            <p>Email: <a href="mailto:hello@hybridads.ai" className="text-blue-600 hover:underline">hello@hybridads.ai</a></p>
            <p>Website: <a href="https://hybridads.ai" className="text-blue-600 hover:underline">hybridads.ai</a></p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4 flex-wrap">
          <button
            onClick={() => navigate('home')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('terms')}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
}
