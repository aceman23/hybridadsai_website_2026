import { useEffect } from 'react';
import {
  Search, Database, TrendingUp, ArrowRight, CheckCircle2,
  Eye, Shield, Zap, BarChart3, MessageSquare,
} from 'lucide-react';
import type { Page } from '../App';

interface Props {
  navigate: (page: Page) => void;
}

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI Visibility / Generative Engine Optimization',
  provider: { '@type': 'Organization', name: 'Hybrid Ads', url: 'https://hybridads.ai' },
  areaServed: 'United States',
  description:
    'Makes local service businesses visible and recommended in AI assistants like ChatGPT, Perplexity, Gemini, and Google AI Overviews through knowledge catalogs, structured data, and AI Share of Voice monitoring.',
  offers: { '@type': 'Offer', url: 'https://hybridads.ai/ai-visibility' },
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between SEO and AI visibility (GEO/AEO)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "SEO optimizes to rank on a search results page. AI visibility — GEO or AEO — optimizes to be the source AI assistants cite and recommend inside their answers. Strong SEO still helps because AI pulls from well-structured pages; AI visibility adds the layer that gets you named in the answer itself.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I know if AI already recommends my business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Ask ChatGPT, Perplexity, or Google's AI who the best provider in your city is and see whether you're named. Our free AI Visibility Audit does this across every major platform and compares you to competitors.",
      },
    },
    {
      '@type': 'Question',
      name: 'Why does publishing my pricing help me get recommended by AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "People ask AI pricing questions constantly. If your pricing isn't published, AI has nothing to reference and recommends a competitor who is transparent. Publishing clear pricing makes you the citable, trustworthy answer.",
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to see results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Foundational structure and schema fixes can show early movement within weeks. Building the authority AI consistently trusts typically takes a few months of consistent publishing, with most businesses seeing measurable citation improvements within about 90 days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I still need a website and paid ads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Websites and ads still matter, but fewer people land on websites first and ads only capture existing demand. AI visibility protects you as discovery shifts, and running all three together is why Hybrid Ads works.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is AI Share of Voice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI Share of Voice measures how often AI assistants recommend or cite your business versus competitors when customers ask relevant questions. It\'s the core metric Hybrid Ads tracks and reports.',
      },
    },
  ],
};

export default function AIVisibilityPage({ navigate }: Props) {
  useEffect(() => {
    const ids = ['ld-service-aiv', 'ld-faq-aiv'];
    const schemas = [SERVICE_SCHEMA, FAQ_SCHEMA];
    schemas.forEach((schema, i) => {
      if (!document.getElementById(ids[i])) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = ids[i];
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    });
    return () => {
      ids.forEach(id => document.getElementById(id)?.remove());
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-gray-900">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-5 pt-32 pb-20 sm:pt-40 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-8">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">AI Visibility Service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-gray-900 mb-6">
            Become the Business{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">AI Recommends</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 leading-relaxed mb-10">
            Your customers now ask ChatGPT, Perplexity, and Google's AI{' '}
            <span className="text-gray-800 font-medium">"Who's the best [service] near me?"</span>{' '}
            and get one answer. Hybrid Ads makes sure that answer is you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('ai-score')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 text-base"
            >
              Get Your Free AI Visibility Check
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 font-semibold rounded-xl transition-colors text-base"
            >
              See how it works
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── ANSWER CAPSULE ── */}
      <section className="max-w-4xl mx-auto px-5 pb-20">
        <article className="bg-blue-50 border border-blue-100 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">What is AI Visibility?</h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            AI visibility is how often AI assistants like ChatGPT, Perplexity, Gemini, and Google AI Overviews recommend and cite your business when people ask them what company to hire. Unlike traditional SEO, which competes for a ranking on a results page, AI visibility competes to be{' '}
            <em className="text-gray-900 font-medium not-italic">the source the AI trusts and names in its answer.</em>{' '}
            For local service businesses, it's becoming the difference between being found and being invisible.
          </p>
        </article>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="max-w-5xl mx-auto px-5 pb-24">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            AI is intercepting your customers before they ever reach your website
          </h2>
          <p className="text-base text-gray-500 leading-relaxed mb-6">
            For twenty years, the game was simple: rank on Google, drive traffic to your site, capture the lead. That's changing fast.
          </p>
          <p className="text-base text-gray-500 leading-relaxed mb-8">
            Today people describe their problem to an AI and get a direct recommendation — no list of ten blue links, no website visit. If your business isn't the one the AI names, you don't get the call. You're not competing for rankings anymore. You're competing to become the trusted source.
          </p>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
              <p className="text-gray-600">
                Industry analysts project traditional search volume will decline meaningfully as AI answers take over discovery.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
              <p className="text-gray-600">
                The businesses that win won't have the prettiest websites. They'll have the most complete, most trusted, machine-readable data.
              </p>
            </li>
          </ul>

          <blockquote className="border-l-4 border-blue-500 pl-6 py-2">
            <p className="text-xl font-semibold text-gray-900 italic">
              "If you don't publish it, AI has no reason to recommend you."
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How Hybrid Ads Makes You the Answer</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three steps to move from invisible to recommended.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Search,
                title: 'AI Visibility Audit',
                desc: "We run the questions your customers actually ask across ChatGPT, Perplexity, Gemini, and Google AI Overviews, and show you exactly where you appear, where your competitors win instead, and what's missing. You get a clear scorecard and priority fixes.",
              },
              {
                step: '02',
                icon: Database,
                title: 'Knowledge Catalog Build',
                desc: 'We build the structured foundation AI systems consume: transparent pricing content, service and service-area pages, FAQs from real customer calls, policies, credentials, reviews, and the schema markup that makes it all machine-readable.',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Ongoing AI Visibility',
                desc: 'We turn your real customer questions into published content every month, monitor how often AI recommends you, and report your AI Share of Voice — so your visibility compounds instead of decaying.',
              },
            ].map(item => (
              <div
                key={item.step}
                className="bg-white border border-gray-200 rounded-2xl p-7 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('ai-score')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              Start With a Free Audit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── KNOWLEDGE CATALOG ── */}
      <section className="max-w-5xl mx-auto px-5 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              The Knowledge Catalog: everything AI needs to trust and recommend you
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-8">
              A structured database of everything your business knows — the foundation modern AI systems pull from:
            </p>
            <ul className="space-y-3.5">
              {[
                'Transparent pricing information',
                'Services offered and service areas',
                'Frequently asked questions from real calls',
                'Policies and processes',
                'Expertise, licensing, and credentials',
                'Reviews and testimonials',
                'Answers to the specific questions customers ask AI',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Knowledge Catalog</p>
                <p className="text-xs text-gray-500">Your AI-readable foundation</p>
              </div>
            </div>
            <div className="space-y-3">
              {['Pricing Data', 'Service Areas', 'Customer FAQs', 'Credentials', 'Reviews', 'Schema Markup'].map(
                (label, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i] }}
                    />
                    <span className="text-sm text-gray-700 font-medium">{label}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                  </div>
                )
              )}
            </div>
            <div className="mt-6 pt-5 border-t border-gray-200">
              <p className="text-sm text-gray-700 font-semibold text-center">
                Today, your website is the front-end.
                <br />
                <span className="text-blue-600">Tomorrow, your knowledge catalog is the foundation.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">The Old Way vs. The New Way</h2>
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 w-1/3" />
                  <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 w-1/3">
                    Old Way (SEO)
                  </th>
                  <th className="py-4 px-5 text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-gray-100 bg-blue-50/50 w-1/3">
                    New Way (AI Visibility)
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ['What drives discovery', 'Keywords & backlinks', 'AI-trusted content & data'],
                  ['How customers find you', 'Search \u2192 Website \u2192 Lead', 'AI answer \u2192 Direct recommendation'],
                  ['What your content is for', 'Rankings & clicks', 'Being cited and recommended by AI'],
                  ['Core digital asset', 'Your website', 'Your Knowledge Catalog'],
                  ['How you win', 'Best-looking website', 'Most complete, trusted data'],
                ].map(([label, old, neo], i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5 font-semibold text-gray-700">{label}</td>
                    <td className="py-4 px-5 text-gray-500">{old}</td>
                    <td className="py-4 px-5 text-blue-600 font-medium bg-blue-50/30">{neo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── WHY HYBRID ── */}
      <section className="max-w-5xl mx-auto px-5 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">The Hybrid Advantage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why "Hybrid"? Because paid ads and AI visibility win together.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-6">
              Most agencies do one or the other. We run your paid ads <em>and</em> your AI visibility — so we can prove the combined effect: AI recommendations capture the demand forming today, paid ads capture the demand that's ready now, and your blended cost per lead drops because you're no longer paying premium prices to fight over a shrinking slice of clickers.
            </p>
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              Hybrid Ads is an <strong className="text-gray-900">AI Systems Integrator and Paid Ads Agency</strong> — we don't just advise on this shift, we build the systems and run the campaigns.
            </p>
            <button
              onClick={() => navigate('about')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              Book a Strategy Call
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                icon: BarChart3,
                title: 'Paid Ads',
                desc: 'Capture demand that exists right now across Google, Meta, and TikTok.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 border-emerald-200',
              },
              {
                icon: Eye,
                title: 'AI Visibility',
                desc: 'Get recommended by ChatGPT, Perplexity, Gemini, and Google AI Overviews.',
                color: 'text-blue-600',
                bg: 'bg-blue-50 border-blue-200',
              },
              {
                icon: Shield,
                title: 'Combined Effect',
                desc: 'Blended cost per lead drops as AI drives organic recommendations alongside paid.',
                color: 'text-cyan-600',
                bg: 'bg-cyan-50 border-cyan-200',
              },
            ].map(item => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 flex items-start gap-4 hover:border-blue-200 hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl ${item.bg} border flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">AI Visibility: Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is the difference between SEO and AI visibility (GEO/AEO)?',
                a: "SEO optimizes to rank on a search results page. AI visibility — sometimes called GEO (Generative Engine Optimization) or AEO (Answer Engine Optimization) — optimizes to be the source AI assistants cite and recommend inside their answers. Strong SEO still helps, because AI often pulls from well-structured, authoritative pages. AI visibility adds the layer that gets you named in the answer itself.",
              },
              {
                q: 'How do I know if AI already recommends my business?',
                a: 'Ask ChatGPT, Perplexity, or Google\'s AI "Who\'s the best [your service] in [your city]?" and see whether you\'re named. Our free AI Visibility Audit does this systematically across every major platform and compares you to your competitors.',
              },
              {
                q: 'Why does publishing my pricing help me get recommended by AI?',
                a: "People ask AI pricing questions constantly. If your pricing isn't published anywhere, AI has nothing to reference and recommends a competitor who is transparent. Publishing clear pricing makes you the citable, trustworthy answer.",
              },
              {
                q: 'How long does it take to see results?',
                a: 'Foundational fixes like structure and schema can show early movement within weeks. Building the topical authority and entity recognition that AI consistently trusts typically takes a few months of consistent publishing. Most businesses see measurable citation improvements within about 90 days.',
              },
              {
                q: 'Do I still need a website and paid ads?',
                a: "Yes. Websites and ads still matter — but fewer people are landing on websites first, and ads only capture demand that already exists. AI visibility protects you as discovery shifts. Running all three together is exactly why Hybrid Ads works.",
              },
              {
                q: 'What is AI Share of Voice?',
                a: 'AI Share of Voice measures how often AI assistants recommend or cite your business versus your competitors when customers ask relevant questions. It\'s the core metric we track and report so you can see your visibility grow.',
              },
            ].map(({ q, a }) => (
              <article key={q} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition-all">
                <h3 className="text-base font-bold text-gray-900 mb-3">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50 via-white to-white" />
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
            Find out if AI recommends you — or your competitor.
          </h2>
          <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Get a free AI Visibility Audit. We'll show you exactly where you stand across ChatGPT, Perplexity, Gemini, and Google AI Overviews, and what it takes to become the answer.
          </p>
          <button
            onClick={() => navigate('ai-score')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 text-base mb-8"
          >
            Get Your Free AI Visibility Check
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <a href="mailto:hello@hybridads.ai" className="hover:text-gray-700 transition-colors">
              hello@hybridads.ai
            </a>
            <span className="text-gray-300">|</span>
            <button onClick={() => navigate('about')} className="hover:text-gray-700 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
