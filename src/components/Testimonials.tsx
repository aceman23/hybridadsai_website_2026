import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const LOGOS = [
  'Stripe', 'Vercel', 'Shopify', 'Atlassian', 'Figma', 'MongoDB', 'Twilio', 'Datadog',
];

export default function Testimonials() {
  const { ref, inView } = useInView();

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0a0a18, #06060f)' }}>
      <div className="container-max section-padding">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          ref={ref}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm text-slate-400">
            <Star className="w-3.5 h-3.5 text-warning-400 fill-warning-400" />
            Customer Stories
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Trusted by{' '}
            <span className="gradient-text">18,000+ teams</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From startups to Fortune 500 companies, teams everywhere are building on NexusAI.
          </p>
        </div>

        <div className="mb-16 overflow-hidden">
          <div className="flex items-center gap-12 animate-none">
            <div className="flex gap-12 shrink-0">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <div
                  key={i}
                  className="text-slate-600 font-bold text-lg tracking-tight whitespace-nowrap hover:text-slate-400 transition-colors cursor-default"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`glass glass-hover rounded-2xl p-6 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 150 + 200}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-warning-400 fill-warning-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-primary-500/40" />
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                />
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
