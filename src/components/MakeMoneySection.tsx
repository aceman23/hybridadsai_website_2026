import { ArrowRight, DollarSign, CheckCircle2 } from 'lucide-react';
import AnimateIn from './AnimateIn';
import type { Page } from '../App';

interface Props {
  navigate: (page: Page) => void;
}

const highlights = [
  'Evaluate and improve frontier AI model outputs',
  'Prompt design, AI reasoning, and code review tasks',
  'Flexible, remote work paid for quality contributions',
];

export default function MakeMoneySection({ navigate }: Props) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-hidden" aria-labelledby="make-money-heading">
      <div className="absolute -top-24 right-0 w-[420px] h-[420px] bg-emerald-200/30 rounded-full blur-[110px]" aria-hidden="true" />
      <div className="absolute bottom-0 -left-20 w-[360px] h-[360px] bg-amber-200/30 rounded-full blur-[110px]" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <AnimateIn>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full px-3.5 py-1.5 mb-6">
                <DollarSign className="w-3.5 h-3.5" />
                AI Paid Training
              </div>
            </AnimateIn>
            <AnimateIn delay={80}>
              <h2 id="make-money-heading" className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                Get paid to help train the next generation of AI
              </h2>
            </AnimateIn>
            <AnimateIn delay={160}>
              <p className="text-gray-600 leading-relaxed mb-6">
                A new earning path for AI/ML engineers and developers. Get evaluated, get approved, and take on high-skill frontier model training work.
              </p>
            </AnimateIn>
            <AnimateIn delay={220}>
              <ul className="space-y-3 mb-8">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimateIn>
            <AnimateIn delay={280}>
              <button
                onClick={() => navigate('partners')}
                className="group inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-gray-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Start Making Money
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </AnimateIn>
          </div>

          <AnimateIn delay={120} className="lg:col-span-3">
            <button
              onClick={() => navigate('partners')}
              className="block w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xl shadow-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Learn about AI Paid Training"
            >
              <img
                src="/HybridAds_AITraining_Platform_Final.png"
                alt="New earning path for AI/ML and developers: evaluation, approval, high-skill tasks, then income and better models"
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </button>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
