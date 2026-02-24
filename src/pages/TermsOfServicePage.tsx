import type { Page } from '../App';

interface Props {
  navigate: (page: Page) => void;
}

export default function TermsOfServicePage({ navigate }: Props) {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-950 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold text-blue-400 tracking-widest uppercase mb-3">Legal</div>
          <h1 className="text-4xl font-black">Terms of Service</h1>
          <p className="text-gray-400 mt-3 text-sm">Last updated: February 24, 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using the HybridAds.ai website (hybridads.ai) or any services provided by HybridAds.ai ("Company," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access the site or use our services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">2. Services</h2>
          <p className="text-gray-600 leading-relaxed">
            HybridAds.ai provides paid advertising management, AI agency services, and related digital marketing consulting. Specific service terms, deliverables, timelines, and fees are outlined in individual service agreements or statements of work executed between the Company and the client.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">3. User Obligations</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>You must be at least 18 years of age to use our services.</li>
            <li>You agree to provide accurate, current, and complete information during any registration or intake process.</li>
            <li>You are responsible for maintaining the confidentiality of any account credentials.</li>
            <li>You agree not to use our services for unlawful purposes or in violation of any applicable laws or regulations.</li>
            <li>You agree not to interfere with or disrupt the integrity or performance of the website or services.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">4. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed">
            All content on hybridads.ai — including text, graphics, logos, images, and software — is the exclusive property of HybridAds.ai or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            Creative assets, ad copy, and custom software developed by HybridAds.ai on behalf of a client under a paid engagement become the property of the client upon full payment, as specified in the applicable service agreement.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">5. Payment Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            Fees for services are as agreed in individual service contracts. Invoices are due within the timeframe specified in the applicable agreement. We reserve the right to suspend services for accounts with overdue balances. All fees are non-refundable unless explicitly stated otherwise in a service agreement.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">6. Disclaimers & Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            THE WEBSITE AND SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE SPECIFIC ADVERTISING RESULTS, RETURN ON AD SPEND, OR BUSINESS OUTCOMES.
          </p>
          <p className="text-gray-600 leading-relaxed">
            TO THE FULLEST EXTENT PERMITTED BY LAW, HYBRIDADS.AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF, OR INABILITY TO USE, OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE THREE MONTHS PRECEDING THE CLAIM.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">7. Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            Either party may terminate a service engagement with written notice as specified in the applicable service agreement. We reserve the right to terminate access to our website or services immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, the Company, or third parties.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">8. Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes shall be resolved exclusively in the courts located in Los Angeles County, California.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">9. DMCA / Copyright Policy</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            HybridAds.ai respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). If you believe that content on our site infringes your copyright, please send a written notice to our designated DMCA Agent containing:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
            <li>Your physical or electronic signature.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing, including its location on our site.</li>
            <li>Your contact information (address, phone number, email).</li>
            <li>A statement that you have a good faith belief the disputed use is not authorized by the copyright owner.</li>
            <li>A statement, under penalty of perjury, that the information is accurate and you are the copyright owner or authorized to act on their behalf.</li>
          </ul>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-700 text-sm space-y-1">
            <p className="font-semibold text-gray-900">DMCA Designated Agent</p>
            <p>Email: <a href="mailto:dmca@hybridads.ai" className="text-blue-600 hover:underline">dmca@hybridads.ai</a></p>
            <p>Subject Line: DMCA Takedown Notice</p>
          </div>
          <p className="text-gray-600 leading-relaxed mt-4">
            Counter-notifications and repeat infringer policies are handled in accordance with the DMCA. Abuse of the DMCA process may result in liability.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">10. Changes to Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes are posted constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-3">11. Contact</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-700 text-sm space-y-1">
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
            onClick={() => navigate('privacy')}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
