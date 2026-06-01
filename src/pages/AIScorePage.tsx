import { useState } from 'react';
import {
  ArrowRight, Search, Zap, Globe, Bot, BarChart3,
  TrendingUp, ShieldCheck, Users, MapPin, Star,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import type { AnalysisReport } from '../types/aps';
import LoadingState from '../components/aps/LoadingState';
import ReportView from '../components/aps/ReportView';
import type { Page } from '../App';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/aps-analyze`;

interface Props {
  navigate: (page: Page) => void;
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Globe,
      num: '01',
      color: 'bg-blue-100 text-blue-600',
      title: 'Extract Business Data',
      body: 'We fetch your website and use AI to extract your ground-truth business information — name, address, phone, categories, and URL — including hidden schema.org structured data.',
    },
    {
      icon: Bot,
      num: '02',
      color: 'bg-cyan-100 text-cyan-600',
      title: 'Query All AI Platforms',
      body: 'We simultaneously query OpenAI ChatGPT, Google Gemini, Microsoft Copilot, xAI Grok, and Perplexity with the same prompt about your business and collect their responses.',
    },
    {
      icon: BarChart3,
      num: '03',
      color: 'bg-emerald-100 text-emerald-600',
      title: 'Score & Report',
      body: 'Each AI response is compared field-by-field against your ground truth. Consistent matches score green, mismatches yellow, missing data red. The average becomes your AI Publisher Score.',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            How It Works
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Three Steps to Your AI Score</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We audit 5 major AI platforms in seconds so you know exactly where your business stands.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="bg-slate-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-black text-gray-200">{s.num}</span>
                </div>
                <h3 className="font-black text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyBusinessesSection() {
  const stats = [
    { value: '73%', label: 'of users trust AI answers for local business info', color: 'text-blue-600' },
    { value: '58%', label: 'of AI-generated business data contains errors or omissions', color: 'text-red-500' },
    { value: '3×', label: 'more likely to be contacted when AI data is accurate', color: 'text-emerald-600' },
    { value: '2.1B', label: 'monthly active users across the 5 AI platforms we audit', color: 'text-amber-600' },
  ];

  const reasons = [
    {
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
      title: 'AI is Now a Discovery Channel',
      body: 'Consumers increasingly ask ChatGPT, Gemini, and Perplexity to recommend local businesses, restaurants, and services. If your data is wrong there, you lose customers before they even reach your website.',
    },
    {
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-600',
      title: 'Protect Your Brand Reputation',
      body: 'Wrong phone numbers, outdated addresses, and incorrect hours in AI responses erode customer trust instantly. A high APS score means AI platforms are reliably giving customers the right information.',
    },
    {
      icon: Users,
      color: 'bg-cyan-100 text-cyan-600',
      title: 'Beat Competitors in AI Search',
      body: 'Most businesses have no idea how AI describes them. Getting ahead now — before your competitors — means owning the AI narrative about your brand while others are still asleep.',
    },
    {
      icon: MapPin,
      color: 'bg-amber-100 text-amber-600',
      title: 'Local Businesses Are Most at Risk',
      body: 'AI platforms frequently hallucinate or use stale data for local businesses. A wrong address or phone number can send customers to a competitor. Your APS score reveals these gaps immediately.',
    },
    {
      icon: Zap,
      color: 'bg-rose-100 text-rose-600',
      title: 'Zero-Click AI Answers Are Growing',
      body: 'More searches end with AI giving a direct answer — no website visit required. That means your AI presence is often the first and only impression a potential customer gets of your business.',
    },
    {
      icon: Star,
      color: 'bg-blue-100 text-blue-700',
      title: 'Data Accuracy Compounds Over Time',
      body: "AI models are trained periodically on web data. Fixing inaccuracies now means future model versions will train on correct information, compounding your visibility advantage over competitors who don't act.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-red-50 text-red-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Why It Matters
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">The AI Search Revolution Is Here</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Millions of customers are already asking AI assistants to find businesses like yours. Is the information they're getting accurate?
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {stats.map(stat => (
            <div key={stat.value} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
              <p className="text-gray-500 text-xs leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map(r => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${r.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-gray-900 mb-2">{r.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{r.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the AI Publisher Score (APS)?',
      a: 'The AI Publisher Score measures how accurately and consistently your business information appears across the five major AI platforms: ChatGPT, Google Gemini, Microsoft Copilot, xAI Grok, and Perplexity. It scores fields like your business name, address, phone number, website, and category — giving you a single percentage that reflects your overall AI visibility health.',
    },
    {
      q: 'Which AI platforms does the audit check?',
      a: 'We audit five platforms: OpenAI ChatGPT, Google Gemini, Microsoft Copilot (Bing), xAI Grok, and Perplexity AI. Together these platforms have over 2 billion monthly active users, making them the most important AI discovery channels for businesses today.',
    },
    {
      q: 'Is this really free?',
      a: 'Yes, completely free. Enter your website URL and receive your full AI Publisher Score report in about 15–30 seconds. There is no credit card required, no account sign-up, and no hidden fees. We offer this as a free audit tool to help businesses understand their AI visibility.',
    },
    {
      q: 'What do the green, yellow, and red scores mean?',
      a: 'Green (Consistent) means the AI platform returned accurate information matching your website. Yellow (Inconsistent) means the AI has some information but it is incorrect or outdated. Red (Not Available) means the AI platform could not find or returned no information about your business for that field.',
    },
    {
      q: 'How do I improve my AI Publisher Score?',
      a: 'Improving your score involves ensuring your website has up-to-date structured data (schema.org markup), maintaining consistent NAP (Name, Address, Phone) citations across the web, having a verified Google Business Profile, and building authoritative content that AI models use as training data. Our team at Hybrid Ads specializes in AI visibility optimization — book a free call to learn more.',
    },
    {
      q: 'How often should I check my APS score?',
      a: "We recommend checking your score quarterly at a minimum. AI platforms update their knowledge bases when they retrain their models, which happens several times per year. Any time you change your business address, phone number, hours, or name — run a fresh report immediately to confirm AI platforms pick up the updated data.",
    },
    {
      q: 'Does a low score mean AI is spreading false info about me?',
      a: "A low score often means AI platforms either don't have enough data about your business or are relying on outdated sources. It doesn't always mean they're actively spreading harmful misinformation — but missing or wrong information can absolutely cost you customers who are making decisions based on AI answers.",
    },
    {
      q: 'How is this different from Google My Business or Yelp?',
      a: 'Google My Business, Yelp, and similar directories control how your business appears in their own platforms. The APS measures something newer and growing: how AI language models represent your business when customers ask them directly. These are different channels, and a great Yelp profile does not guarantee good AI visibility.',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            FAQ
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500">Everything you need to know about the AI Publisher Score.</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  {isOpen
                    ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Ready to Own Your AI Presence?
        </h2>
        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
          Get your free AI Publisher Score in seconds, then let our team help you fix every gap and dominate AI search results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#hero"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Zap className="w-5 h-5 mr-2" fill="currentColor" />
            Get My Free Score
          </a>
          <a
            href="https://calendly.com/hybridadsai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-2 border-white/40 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/10 transition-colors"
          >
            Book a Free Strategy Call
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function AIScorePage({ navigate: _navigate }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setReport(null);

    const maxAttempts = 2;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const res = await fetch(FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ url: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Analysis failed');
        setReport(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setLoading(false);
        return;
      } catch (err: unknown) {
        if (attempt === maxAttempts - 1) {
          setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-white">
      <section id="hero" className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 text-blue-700 text-xs font-semibold mb-6">
              <Zap className="w-3 h-3" fill="currentColor" />
              Free AI Visibility Audit
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 leading-tight mb-4">
              AI Publisher
              <br />
              <span className="text-blue-600">Score</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Discover how accurately ChatGPT, Gemini, Copilot, Grok, and Perplexity describe your business.
              Get your free score in seconds.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="Enter your business website URL…"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all disabled:opacity-50 shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap shadow-sm shadow-blue-200"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Generate Free Report
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-3 text-gray-400 text-xs">
              Try:{' '}
              {['starbucks.com', 'chipotle.com', 'yourwebsite.com'].map(u => (
                <button
                  key={u}
                  onClick={() => setUrl(u)}
                  className="text-gray-400 hover:text-blue-600 transition-colors underline underline-offset-2 mx-1"
                >
                  {u}
                </button>
              ))}
            </p>
          </div>

          {loading && <LoadingState />}

          {error && (
            <div className="max-w-xl mx-auto mt-8 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {report && <ReportView report={report} />}
        </div>
      </section>

      {!report && !loading && (
        <>
          <HowItWorksSection />
          <WhyBusinessesSection />
          <FAQSection />
          <CTASection />
        </>
      )}

      {(report || loading) && (
        <div className="py-10 text-center bg-white border-t border-gray-100">
          <button
            onClick={() => _navigate('home')}
            className="inline-flex items-center text-gray-400 hover:text-gray-700 text-sm transition-colors"
          >
            ← Back to Hybrid Ads
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
