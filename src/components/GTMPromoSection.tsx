import { Bot, Search, Users, Sparkles, Target, RefreshCw, Mail, Code2, Calendar, ArrowRight } from 'lucide-react';
import AnimateIn from './AnimateIn';
import type { Page } from '../App';

interface Props {
  navigate: (page: Page) => void;
  compact?: boolean;
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

export default function GTMPromoSection({ navigate, compact }: Props) {
  return (
    <section className={`${compact ? 'py-16' : 'py-20'} bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500 rounded-full filter blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <AnimateIn>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-full px-3.5 py-1.5 mb-6">
                <Bot className="w-3.5 h-3.5" />
                New Service — AI Go-To-Market
              </div>
            </AnimateIn>
            <AnimateIn delay={80}>
              <h2 className={`${compact ? 'text-3xl' : 'text-3xl md:text-4xl'} font-black text-white mb-4 leading-tight`}>
                Autonomous AI Sales Team
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  $0.03 Per Email Sent
                </span>
              </h2>
            </AnimateIn>
            <AnimateIn delay={160}>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-lg">
                Deploy a fully autonomous AI go-to-market engine that prospects, personalizes, and contacts
                ideal customers 24/7. Set your daily budget, cap your spend, and scale anytime.
              </p>
            </AnimateIn>
            <AnimateIn delay={240}>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('gtm-service')}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/20"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://calendly.com/hybridadsai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Book a Call
                </a>
              </div>
            </AnimateIn>
          </div>

          <div>
            <AnimateIn delay={200} variant="fade">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="space-y-3">
                  {features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 group">
                        <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.badgeColor} flex-shrink-0`}>
                          {f.badge}
                        </span>
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {f.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5">
                    <span className="text-amber-400 text-sm font-bold">Pay as you go</span>
                    <span className="text-amber-200 text-sm">· $0.03 per email sent</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 pl-1">Set your daily budget. Cap spend. Increase anytime.</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
