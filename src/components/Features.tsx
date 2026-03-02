import { useEffect, useRef, useState } from 'react';
import {
  Shield, Globe, Activity, Code2, BarChart3, Workflow
} from 'lucide-react';
import { FEATURES } from '../data';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  globe: Globe,
  activity: Activity,
  'code-2': Code2,
  'bar-chart-3': BarChart3,
  workflow: Workflow,
};

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

export default function Features() {
  const { ref, inView } = useInView();

  return (
    <section id="features" className="py-28 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="container-max section-padding relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          ref={ref}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
            Platform Capabilities
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Built for production.<br />
            <span className="gradient-text">Ready from day one.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to build, deploy, and scale AI applications — without managing infrastructure.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon];
            return (
              <div
                key={feature.title}
                className={`glass glass-hover rounded-2xl p-6 group transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {Icon && <Icon className="w-6 h-6 text-primary-300" />}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
