import { useState, useRef } from 'react';
import {
  Bot, Search, Users, Sparkles, Target, RefreshCw, Mail,
  Code2, Calendar, ArrowRight, CheckCircle2, Zap, Shield,
  ChevronDown, ChevronUp, BarChart3, Clock, DollarSign, Play,
} from 'lucide-react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';

interface Props {
  navigate: (page: Page) => void;
}

const features = [
  { icon: Bot, label: '24/7 Fully autonomous AI sales team of 7 Agents', badge: 'INCLUDED', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { icon: Search, label: 'Search across 105M company profiles', badge: 'UNLIMITED', badgeColor: 'bg-blue-100 text-blue-700' },
  { icon: Users, label: 'Search across 536M people profiles', badge: 'INCLUDED', badgeColor: 'bg-blue-100 text-blue-700' },
  { icon: Sparkles, label: 'AI personalisation powered by deep research agent', badge: 'INCLUDED', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { icon: Target, label: 'Prospects researched and contacted with validated emails', badge: 'INCLUDED', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { icon: RefreshCw, label: 'Auto-sequences with follow-ups — 97% deliverability', badge: 'INCLUDED', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { icon: Mail, label: 'Pre-warmed mailboxes — outreach on day one', badge: 'INCLUDED', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { icon: Code2, label: 'API access — AI-agent friendly', badge: 'INCLUDED', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { icon: Calendar, label: 'Calendar and CRM integration', badge: 'INCLUDED', badgeColor: 'bg-emerald-100 text-emerald-700' },
];

const howItWorks = [
  {
    step: '01',
    icon: Target,
    title: 'Define Your Ideal Customer',
    description: 'Tell us your ICP — industry, company size, titles, geography. Our AI research agent builds hyper-targeted prospect lists from 105M+ company profiles.',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'AI Personalizes Every Touch',
    description: 'Deep research agent studies each prospect, their company, and recent activity to craft personalized sequences that feel human-written.',
  },
  {
    step: '03',
    icon: Mail,
    title: 'Autonomous Outreach Begins',
    description: 'Pre-warmed mailboxes send your sequences on day one. Auto follow-ups with 97% deliverability ensure your message lands in the primary inbox.',
  },
  {
    step: '04',
    icon: Calendar,
    title: 'Meetings Booked Automatically',
    description: 'Interested prospects are routed to your calendar via CRM integration. You show up to meetings — the AI handles everything else.',
  },
];

const stats = [
  { value: '7', label: 'AI Agents Working 24/7', icon: Bot },
  { value: '105M+', label: 'Company Profiles Searchable', icon: Search },
  { value: '97%', label: 'Email Deliverability Rate', icon: Mail },
  { value: '$0.03', label: 'Per Email Sent', icon: DollarSign },
];

const benefits = [
  { icon: Clock, title: 'Start in 24 Hours', description: 'No setup fees, no onboarding weeks. Your AI sales team is live and sending within one business day.' },
  { icon: Shield, title: 'Zero Risk — Pay Per Send', description: 'No monthly minimums. You only pay $0.03 per email sent. Set a daily cap and never overspend.' },
  { icon: BarChart3, title: 'Full Transparency', description: 'Real-time dashboard showing opens, replies, meetings booked, and ROI. Every dollar is tracked.' },
  { icon: Zap, title: 'Scales With You', description: 'Sending 100 emails a day? 10,000? Adjust your daily budget anytime. The AI scales instantly.' },
];

const faqs = [
  { q: 'How does the $0.03 per email pricing work?', a: 'You only pay for emails actually sent. Set a daily budget (e.g. $30/day = 1,000 emails) and we never exceed it. No monthly commitments, no hidden fees. Increase or pause anytime.' },
  { q: 'What are the 7 AI agents?', a: 'The system includes: a Research Agent (finds prospects), a Personalization Agent (crafts messages), a Validation Agent (verifies emails), a Sequencing Agent (manages follow-ups), a Deliverability Agent (manages mailbox health), an Analytics Agent (tracks performance), and a Routing Agent (books meetings).' },
  { q: 'Do I need to provide my own email domains?', a: 'No. We provide pre-warmed mailboxes ready to send on day one. These domains have been warmed for weeks to ensure maximum inbox placement from the start.' },
  { q: 'How is this different from other cold email tools?', a: 'Most tools give you software and say "figure it out." We deploy a fully managed, autonomous system. The AI does the prospecting, research, personalization, sending, and follow-ups. You just show up to booked meetings.' },
  { q: 'What industries does this work for?', a: 'Any B2B company selling to other businesses. SaaS, agencies, professional services, consultancies, and enterprise sales teams see the best results. If your customers have a business email, this system can reach them.' },
  { q: 'Can I integrate with my existing CRM?', a: 'Yes. We integrate with HubSpot, Salesforce, Pipedrive, and any CRM that supports webhooks or API connections. Meeting links sync directly with Google Calendar or Calendly.' },
];

export default function GTMServicePage({ navigate }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPaused, setVideoPaused] = useState(false);

  const handleVideoTap = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setVideoPaused(false);
    } else {
      v.pause();
      setVideoPaused(true);
    }
  };

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && (window as Record<string, unknown>).gtag) {
      (window as Record<string, unknown> & { gtag: (...args: unknown[]) => void }).gtag('event', 'click_gtm_cta', {
        event_category: 'conversion',
        event_label: 'ai_sales_credits_149',
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gray-950 text-white overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-600 rounded-full filter blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500 rounded-full filter blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <AnimateIn>
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-full px-3.5 py-1.5 mb-6">
                  <Zap className="w-3.5 h-3.5" />
                  AI-Powered Go-To-Market
                </div>
              </AnimateIn>
              <AnimateIn delay={80}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] mb-6">
                  Your Autonomous
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 pb-1">
                    AI Sales Team
                  </span>
                </h1>
              </AnimateIn>
              <AnimateIn delay={160}>
                <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg">
                  7 AI agents work around the clock to find, research, and contact your ideal
                  customers. Pay only $0.03 per email sent. No contracts, no minimums.
                </p>
              </AnimateIn>
              <AnimateIn delay={240}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://calendly.com/hybridadsai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors shadow-xl shadow-blue-600/25"
                  >
                    Get Started Today
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-sm transition-colors"
                  >
                    See How It Works
                  </button>
                </div>
              </AnimateIn>
            </div>

            <AnimateIn delay={300} variant="fade">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8">
                <h3 className="text-lg font-bold text-white mb-5">Everything Included</h3>
                <div className="space-y-3.5">
                  {features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.badgeColor} flex-shrink-0`}>
                          {f.badge}
                        </span>
                        <span className="text-sm text-gray-300">{f.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3">
                    <DollarSign className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <span className="text-amber-400 font-bold text-sm">Pay as you go · $0.03 per email sent</span>
                      <p className="text-amber-200/70 text-xs mt-0.5">Set your daily budget. Cap spend. Increase anytime.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Video + $149 Offer */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-950 to-gray-900 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Video */}
            <AnimateIn>
              <div className="relative mx-auto max-w-[320px] lg:max-w-[360px]">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 aspect-[9/16]">
                  <video
                    ref={videoRef}
                    src="/HybridAds_AutoGTM_Video.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onClick={handleVideoTap}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  {videoPaused && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-center text-gray-400 text-xs mt-4 italic leading-relaxed">
                  Real founder sharing how our 24/7 AI Sales Team is changing the game
                </p>
              </div>
            </AnimateIn>

            {/* $149 Offer Box */}
            <AnimateIn delay={200}>
              <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-7 md:p-8">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full px-3 py-1 mb-5">
                  <Zap className="w-3 h-3" />
                  Launching Now
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                  AI Sales Starter Credits
                </h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-white">$149</span>
                  <span className="text-gray-400 text-sm font-medium">one-time</span>
                </div>

                <div className="space-y-3 mb-7">
                  {[
                    '$150 worth of AI email credits (~5,000 emails)',
                    '24/7 Autonomous AI Sales Team of 7 Agents',
                    'Instant workspace + automated first campaign',
                    'Pay-as-you-go after credits ($0.03 per email)',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-200 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://calendly.com/hybridadsai"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="group flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-4 rounded-xl text-base transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30"
                >
                  Get $149 AI Sales Credits
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
                  {['No setup fees', 'Cancel anytime', 'Instant access'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Shield className="w-3 h-3 text-gray-500" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <AnimateIn key={s.label}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 mb-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                How It Works
              </div>
            </AnimateIn>
            <AnimateIn delay={80}>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">From Zero to Meetings in 4 Steps</h2>
            </AnimateIn>
            <AnimateIn delay={160}>
              <p className="text-gray-500 max-w-xl mx-auto">
                We handle the entire outbound pipeline — you just show up to the meetings we book.
              </p>
            </AnimateIn>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <AnimateIn key={item.step}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-3xl font-black text-gray-200">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Why Choose Our AI GTM System</h2>
            </AnimateIn>
            <AnimateIn delay={80}>
              <p className="text-gray-500 max-w-xl mx-auto">
                No long contracts, no risk, no hiring SDRs. Just results.
              </p>
            </AnimateIn>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <AnimateIn key={b.title}>
                  <div className="flex gap-4 bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">AI Sales Team vs. Traditional SDR</h2>
            </AnimateIn>
            <AnimateIn delay={80}>
              <p className="text-gray-500">See how an autonomous AI system compares to hiring outbound reps.</p>
            </AnimateIn>
          </div>
          <AnimateIn delay={160}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                <div className="p-4 text-sm font-semibold text-gray-600"></div>
                <div className="p-4 text-sm font-bold text-blue-700 text-center border-l border-gray-200">AI Sales Team</div>
                <div className="p-4 text-sm font-bold text-gray-700 text-center border-l border-gray-200">Traditional SDR</div>
              </div>
              {[
                ['Monthly Cost', '$300–$3,000', '$6,000–$12,000+'],
                ['Hours Working', '24/7 (168 hrs/week)', '40 hrs/week'],
                ['Ramp-Up Time', '24 hours', '2–3 months'],
                ['Emails/Day', '1,000–10,000+', '50–100'],
                ['Personalization', 'AI deep research per prospect', 'Manual templates'],
                ['Deliverability', '97% inbox rate', 'Variable'],
                ['Scalability', 'Instant', 'Hire more reps'],
                ['Vacation/Sick Days', 'Never', 'Yes'],
              ].map(([label, ai, trad], i) => (
                <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-100 last:border-0`}>
                  <div className="p-4 text-sm font-medium text-gray-700">{label}</div>
                  <div className="p-4 text-sm text-blue-700 font-semibold text-center border-l border-gray-100">{ai}</div>
                  <div className="p-4 text-sm text-gray-500 text-center border-l border-gray-100">{trad}</div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-3xl font-black text-gray-900 mb-3">Frequently Asked Questions</h2>
            </AnimateIn>
            <AnimateIn delay={80}>
              <p className="text-gray-500">Everything you need to know before getting started.</p>
            </AnimateIn>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
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

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimateIn>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Automate Your Outbound?
            </h2>
          </AnimateIn>
          <AnimateIn delay={80}>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Start sending personalized, AI-researched outreach at $0.03 per email. No contracts, no risk.
            </p>
          </AnimateIn>
          <AnimateIn delay={160}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/hybridadsai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Zap className="w-5 h-5" fill="currentColor" />
                Book Your Free Setup Call
              </a>
              <button
                onClick={() => navigate('home')}
                className="inline-flex items-center justify-center border-2 border-white/40 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/10 transition-colors"
              >
                Back to Hybrid Ads
              </button>
            </div>
          </AnimateIn>
          <AnimateIn delay={240}>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-10">
              {['No setup fees', 'No contracts', 'Cancel anytime', 'Live in 24 hours'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-blue-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-200" />
                  {item}
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
