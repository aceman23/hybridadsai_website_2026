import { ArrowRight, Terminal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

export default function CTA() {
  const { ref, inView } = useInView();

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #06060f, #0a0a18)' }}>
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container-max section-padding relative z-10">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          ref={ref}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-primary-400" />
            Start building in minutes
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            The AI stack your
            <br />
            <span className="gradient-text">team deserves.</span>
          </h2>

          <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers and companies already building the future with NexusAI.
            Start free, scale as you grow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="group flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 text-base w-full sm:w-auto justify-center"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 glass glass-hover text-white font-semibold px-8 py-4 rounded-xl text-base w-full sm:w-auto justify-center"
            >
              Talk to Sales
            </a>
          </div>

          <p className="mt-6 text-slate-600 text-sm">
            Free 14-day trial · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
