import { useEffect, useRef, useState } from 'react';
import { STATS } from '../data';
import { TrendingUp } from 'lucide-react';

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

export default function Stats() {
  const { ref, inView } = useInView();

  return (
    <section className="relative py-20 overflow-hidden" id="stats">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(59,130,246,0.05), rgba(6,182,212,0.05))' }} />
      <div className="absolute inset-0 border-y border-white/5" />

      <div className="container-max section-padding" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-slate-500 text-sm mb-2">{stat.sublabel}</div>
              <div className="inline-flex items-center gap-1 text-xs text-success-400 font-medium">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
