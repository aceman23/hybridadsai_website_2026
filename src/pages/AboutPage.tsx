import { CheckCircle2, ArrowRight, Award, Users, Globe, Rocket } from 'lucide-react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';
import TwitterFeed from '../components/TwitterFeed';

interface AboutPageProps {
  navigate: (page: Page) => void;
}

const team = [
  {
    name: 'Anton Ansalmar',
    role: 'AI and Growth Architect',
    bio: '12+ years in paid advertising. Built campaigns generating $400k/month in e-commerce revenue. Architects AI Systems and manages AI Engineers and Data Scientists.',
    img: '/AntonAnsalmar.png',
    displayName: null,
  },
  {
    name: 'Richard Wayne',
    role: 'Creative Director',
    bio: 'Crafts ad creative that converts. Specialized in e-commerce, SaaS, and local business campaigns.',
    img: '/RichardFarkas.png',
    displayName: null,
  },
  {
    name: 'JK Bright',
    role: 'Full Stack Engineer',
    bio: 'Builds and maintains our web platforms and integrations across the full technology stack.',
    img: null,
    displayName: 'JK',
  },
  {
    name: 'Zhiwen Huang',
    role: 'Full Stack Engineer',
    bio: 'Develops scalable front-end and back-end systems that power our AI-driven ad infrastructure.',
    img: null,
    displayName: 'ZH',
  },
  {
    name: 'Daniel Block',
    role: 'Growth Strategist',
    bio: 'Managing Ad Campaigns.',
    img: '/DanielBlock.png',
    displayName: null,
  },
];

const projects = [
  {
    client: 'Newport Body Works',
    result: '602.6% increase in "Book Now" clicks',
    detail: '490+ bookings per month with a 70% conversion rate through targeted ads and a redesigned website.',
    tag: 'Local Business',
  },
  {
    client: 'Delivery Brand – Sacramento, CA',
    result: '$476,109/month in online revenue',
    detail: 'Grew online sales over 50% by driving organic search. Transaction volume hit 4,386 monthly orders.',
    tag: 'E-Commerce',
  },
  {
    client: 'Comerit.com',
    result: 'Billion-dollar enterprise leads',
    detail: 'Quality lead generation attracting large enterprise clients with $100M+ in revenues.',
    tag: 'B2B SaaS',
  },
  {
    client: 'SomaLabs',
    result: '3X increase in monthly bookings',
    detail: 'Website redesign, SEO optimizations, and paid campaigns working together for compounding growth.',
    tag: 'Health & Wellness',
  },
  {
    client: 'Pivet',
    result: 'First-ever daily B2C orders',
    detail: 'Went from sporadic sales to consistent new B2C orders every single day.',
    tag: 'E-Commerce',
  },
  {
    client: 'Bond & Stitch Company',
    result: 'Shopify store live in 14 days',
    detail: 'Full e-commerce setup with the latest features. Client thrilled with design and results.',
    tag: 'Fashion & Apparel',
  },
  {
    client: 'KARLimoLax',
    result: '101.9K Instagram views in 30 days',
    detail: 'Built website and booking system on LimoLogic.io, launched Meta ads driving 26.7K impressions, 712 clicks at $0.63 CPC, and 757 website sessions.',
    tag: 'Luxury Transportation',
  },
];

const faqItems = [
  {
    question: 'Why do most marketing agencies fail to deliver real ROI?',
    answer:
      'Traditional agencies rely on templated strategies and vanity metrics — impressions, clicks, reach — that look good in reports but never move the needle on revenue. Hybrid Ads ties every dollar of ad spend directly to measurable business outcomes like booked appointments, qualified leads, and actual sales. We build custom tracking pipelines so you see exactly which campaign produced which customer.',
  },
  {
    question: 'How is Hybrid Ads different from a typical digital marketing agency?',
    answer:
      'We are an AI-first performance agency, not a creative shop that bolts on analytics as an afterthought. Every campaign is powered by proprietary AI systems that continuously optimize targeting, creative, and budget allocation in real time. Our team includes AI engineers and data scientists alongside growth strategists — a combination most agencies simply do not have.',
  },
  {
    question: 'I have been burned by agencies that lock me into long contracts with no results — do you do that?',
    answer:
      'No. We do not rely on 12-month lock-in contracts to keep clients. Our engagements are results-driven: you stay because the numbers work, not because of fine print. We provide full transparency into spend, performance, and strategy so you always know exactly what you are paying for and what it is producing.',
  },
  {
    question: 'Can you actually handle both paid ads and full website or app development?',
    answer:
      'Yes — and that is a core advantage. Most agencies outsource dev work or hand you a WordPress template. We build complete digital platforms in-house: custom websites, admin dashboards, CMS systems, analytics integrations, and AI-powered tools. For example, we recently delivered an 18-page platform with a full admin panel, CMS, AI image creation, and real-time analytics — all under one roof.',
  },
  {
    question: 'How do you use AI in advertising and is it actually better than manual campaign management?',
    answer:
      'Our AI systems analyze thousands of data points per hour — audience behavior, bid landscapes, creative fatigue, conversion patterns — and adjust campaigns faster than any human team. This is not a chatbot writing ad copy. We build custom AI agents that manage budget pacing, identify winning creatives, and surface insights that would take a traditional media buyer days to find.',
  },
  {
    question: 'What if my business is small — do you only work with large companies?',
    answer:
      'We work with businesses at every stage, from local service businesses generating their first leads online to e-commerce brands scaling past $400K per month. Our systems are built to be efficient at any budget level. A local body shop client saw a 602% increase in bookings through our campaigns — proof that smart strategy matters more than massive spend.',
  },
  {
    question: 'Why do my current ads get a lot of clicks but very few actual customers?',
    answer:
      'Clicks without conversions usually mean one of three things: wrong audience targeting, a disconnect between the ad and the landing page, or no real conversion tracking in place. We audit the entire funnel — from impression to purchase — and fix every leak. Our campaigns are optimized for downstream revenue, not upstream vanity metrics.',
  },
  {
    question: 'How do you make sure my business shows up in AI search results like ChatGPT, Perplexity, and Google AI Overviews?',
    answer:
      'AI search engines pull from structured, authoritative, and well-cited content. We optimize your digital presence with structured data markup, entity-rich content, FAQ schemas, and topical authority signals so that AI systems recognize and surface your brand. This is a fundamentally different discipline from traditional SEO — and most agencies have not caught up yet.',
  },
  {
    question: 'What kind of reporting and transparency do you provide?',
    answer:
      'You get a real-time analytics dashboard — not a monthly PDF full of jargon. Our dashboards show live campaign performance, cost per acquisition, revenue attribution, and funnel health. We also provide custom AI-generated reports that highlight what is working, what is not, and exactly what we are doing about it.',
  },
  {
    question: 'How fast can I expect to see results?',
    answer:
      'Most clients see measurable improvements within the first 2–4 weeks as our AI systems gather data and begin optimizing. Significant revenue impact typically materializes within 60–90 days depending on your industry, offer, and starting point. We set realistic benchmarks upfront and report against them honestly — no inflated promises.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function AboutPage({ navigate }: AboutPageProps) {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="bg-gradient-to-br from-gray-900 to-blue-950 text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <AnimateIn>
                <div className="inline-flex items-center bg-white/10 text-sm font-medium rounded-full px-4 py-1.5 mb-6">
                  About HybridAds.ai
                </div>
              </AnimateIn>
              <AnimateIn delay={120}>
                <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                  Where <span className="text-blue-400">Humans</span> &{' '}
                  <span className="text-pink-400">AI</span> Work Together
                </h1>
              </AnimateIn>
              <AnimateIn delay={240}>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  We're not your typical ad agency. We combine seasoned human strategists with
                  cutting-edge AI platforms to deliver results that neither could achieve alone.
                </p>
              </AnimateIn>
              <AnimateIn delay={360}>
                <button
                  onClick={() => navigate('dashboard')}
                  className="inline-flex items-center bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  View Performance Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </AnimateIn>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, label: 'Meta · X · TikTok · Google', sub: 'Ads Experience' },
                { icon: Award, label: '15 Years', sub: 'Web + Mobile Dev' },
                { icon: Users, label: '2M+ Leads', sub: 'Generated' },
                { icon: Rocket, label: '3000+', sub: 'Campaigns Launched' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <Icon className="h-8 w-8 text-blue-400 mb-3" />
                  <div className="text-xl font-black text-white">{label}</div>
                  <div className="text-sm text-gray-400 mt-1">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
            <img
              src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=700"
              alt="Team working"
              className="rounded-3xl object-cover w-full shadow-xl"
              width="700"
              height="467"
              loading="lazy"
              decoding="async"
            />
            <div>
              <AnimateIn><h2 className="text-4xl font-black text-gray-900 mb-5">Our Mission</h2></AnimateIn>
              <p className="text-gray-600 leading-relaxed mb-5">
                Our mission at Hybrid Ads is to build production-ready AI systems that eliminate costly manual processes — reducing{' '}
                <span className="text-green-600 font-semibold">digital labor overhead</span> while delivering measurable, compounding returns.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                From autonomous ad agents and RAG pipelines to voice AI and LLM fine-tuning, we integrate AI into the fabric of your business operations — turning repetitive tasks into intelligent, self-improving systems.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Every system we ship learns from real-world usage. Impressions, signals, and outcomes feed back into the model — so your AI gets sharper over time, driving both paid and organic growth for your brand.
              </p>
              <div className="space-y-3">
                {[
                  'AI Systems Integrators serving businesses in the USA and globally',
                  '50+ production AI systems shipped — agents, RAG pipelines, voice AI & more',
                  'Systems that learn and compound in value with every interaction',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-4xl font-black text-gray-900 mb-3">Our Team</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500 max-w-xl mx-auto">
                A blend of veteran ad strategists and AI engineers working as one unified team
              </p>
            </AnimateIn>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group flex flex-row items-center gap-4 p-4">
                <div className="overflow-hidden rounded-xl flex-shrink-0 w-16 h-16">
                  {member.img ? (
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width="64"
                      height="64"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
                      <span className="text-xl font-black text-blue-300 select-none">{member.displayName}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-gray-900 text-sm leading-tight">{member.name}</h3>
                  <p className="text-blue-600 text-xs font-semibold mb-1">{member.role}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-4xl font-black text-gray-900 mb-3">Work We've Done</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500 max-w-xl mx-auto mb-4">
                Real results for real businesses across e-commerce, SaaS, local services, and beyond
              </p>
              <button
                onClick={() => navigate('case-studies')}
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm"
              >
                View detailed case studies
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </AnimateIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {project.tag}
                </div>
                <h3 className="font-black text-gray-900 mb-2">{project.client}</h3>
                <p className="text-blue-600 font-bold text-lg mb-3 leading-tight">{project.result}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{project.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <AnimateIn><h2 className="text-4xl font-black text-blue-600 mb-5">Why Work With Us</h2></AnimateIn>
              <p className="text-gray-600 leading-relaxed mb-6">
                Selling Ads has become more effective than ever before, using the latest Performance Max &
                AI tools in ads. At <span className="text-blue-600 font-semibold">Hybrid Ads</span>, we've
                made it possible to generate more returns for paid ad spend.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our teams and AI platforms learn from your ad's performance. Every time you run an ad, we
                see how many people reacted, commented on, shared and clicked on it. Using those insights
                we automatically improve the effectiveness of your future ad campaigns and help guide your
                messaging — driving{' '}
                <span className="text-blue-600 font-semibold">organic search</span> for your brand,
                product or service.
              </p>
              <div className="space-y-3">
                {[
                  'AI + Humans working together in 🇺🇸 serving the world',
                  'Experience in Meta Ads, X Ads, TikTok Ads & Google Ads 🌎',
                  '15 years of experience in Web + Mobile Development 📈',
                  'Grown E-commerce Sales monthly to $400k per month 🤑',
                  '2 Million Leads Generated ✅',
                  '3000+ Paid Ad Campaigns across Meta, X, TikTok & Google',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden shadow-md group col-span-2">
                <div className="overflow-hidden">
                  <img
                    src="/OpenTranslateAI.png"
                    alt="OpenTranslateAI"
                    className="w-full object-contain object-top h-36 group-hover:scale-105 transition-transform duration-300 bg-gray-50"
                    width="400" height="144" loading="lazy" decoding="async"
                  />
                </div>
                <div className="bg-gray-900 px-3 py-1.5 text-xs text-gray-300 font-medium">OpenTranslateAI</div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md group">
                <div className="overflow-hidden">
                  <img
                    src="/Screenshot_2026-04-01_at_11.28.12_AM.png"
                    alt="KARLimoLax"
                    className="w-full object-contain object-top h-28 group-hover:scale-105 transition-transform duration-300 bg-gray-50"
                    width="400" height="112" loading="lazy" decoding="async"
                  />
                </div>
                <div className="bg-gray-900 px-3 py-1.5 text-xs text-gray-300 font-medium">KARLimoLax</div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md group mt-4">
                <div className="overflow-hidden">
                  <img
                    src="/AsterionDB.png"
                    alt="AsterionDB"
                    className="w-full object-contain object-top h-28 group-hover:scale-105 transition-transform duration-300 bg-gray-50"
                    width="400" height="112" loading="lazy" decoding="async"
                  />
                </div>
                <div className="bg-gray-900 px-3 py-1.5 text-xs text-gray-300 font-medium">AsterionDB</div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md group">
                <div className="overflow-hidden">
                  <img
                    src="/InferenceLearningHub.png"
                    alt="Inference Learning Hub"
                    className="w-full object-contain object-top h-28 group-hover:scale-105 transition-transform duration-300 bg-gray-50"
                    width="400" height="112" loading="lazy" decoding="async"
                  />
                </div>
                <div className="bg-gray-900 px-3 py-1.5 text-xs text-gray-300 font-medium">Inference Learning Hub</div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md group mt-4">
                <div className="overflow-hidden">
                  <img
                    src="/mySomaLabs.png"
                    alt="mySomaLabs"
                    className="w-full object-contain object-top h-28 group-hover:scale-105 transition-transform duration-300 bg-gray-50"
                    width="400" height="112" loading="lazy" decoding="async"
                  />
                </div>
                <div className="bg-gray-900 px-3 py-1.5 text-xs text-gray-300 font-medium">mySomaLabs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section – AI-search-optimized with FAQPage structured data */}
      <section className="py-20 bg-slate-50" id="faq" itemScope itemType="https://schema.org/FAQPage">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-4xl font-black text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Straight answers to the biggest frustrations businesses face with marketing agencies today
              </p>
            </AnimateIn>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <AnimateIn key={i} delay={i * 60}>
                <details
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left select-none list-none [&::-webkit-details-marker]:hidden">
                    <h3 className="font-bold text-gray-900 pr-4 text-[15px] leading-snug" itemProp="name">
                      {faq.question}
                    </h3>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg font-bold transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div
                    className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <div itemProp="text">{faq.answer}</div>
                  </div>
                </details>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <TwitterFeed />

      <section className="bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimateIn>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Let's Grow Your Business Together
            </h2>
          </AnimateIn>
          <AnimateIn delay={150}>
            <p className="text-gray-400 text-lg mb-8">
              Stop wasting budget. Start growing with AI-powered advertising managed by real humans
              who care about your results.
            </p>
          </AnimateIn>
          <AnimateIn delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/hybridadsai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-xl shadow-green-900/30"
            >
              Book a Free Call
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <button
              onClick={() => navigate('dashboard')}
              className="inline-flex items-center justify-center border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition-colors"
            >
              View Our Dashboard
            </button>
          </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
