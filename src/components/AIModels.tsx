import { useEffect, useRef, useState } from 'react';
import {
  Brain, Eye, Zap, Cpu, Layers, Code, ChevronRight, Clock, FileText
} from 'lucide-react';
import { AI_MODELS } from '../data';
import { trackInteraction } from '../lib/supabase';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain,
  eye: Eye,
  zap: Zap,
  cpu: Cpu,
  layers: Layers,
  code: Code,
};

const BADGE_COLORS: Record<string, string> = {
  blue: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
  cyan: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
  green: 'bg-success-500/20 text-success-400 border border-success-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  rose: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  teal: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
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

export default function AIModels() {
  const { ref, inView } = useInView();
  const [selected, setSelected] = useState('nexus-7');

  const selectedModel = AI_MODELS.find((m) => m.id === selected) ?? AI_MODELS[0];

  const handleSelect = (id: string) => {
    setSelected(id);
    trackInteraction('model_view', { model_id: id });
  };

  const Icon = ICONS[selectedModel.icon];

  return (
    <section id="models" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #06060f, #0a0a18)' }}>
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

      <div className="container-max section-padding relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          ref={ref}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
            AI Model Suite
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Six specialized models.<br />
            <span className="gradient-text">One unified API.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Purpose-built AI systems for every use case — from blazing-fast inference to deep autonomous reasoning.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-3">
            {AI_MODELS.map((model, i) => {
              const ModelIcon = ICONS[model.icon];
              const isSelected = model.id === selected;
              return (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                    inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                  } ${
                    isSelected
                      ? 'bg-primary-600/20 border border-primary-500/40 shadow-lg shadow-primary-500/10'
                      : 'glass glass-hover'
                  }`}
                  style={{ transitionDelay: `${i * 80 + 200}ms` }}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-primary-600/40' : 'bg-white/5'
                    }`}
                  >
                    {ModelIcon && <ModelIcon className={`w-5 h-5 ${isSelected ? 'text-primary-300' : 'text-slate-400'}`} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {model.name}
                      </span>
                      {model.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_COLORS[model.badgeColor ?? 'blue']}`}>
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs truncate">{model.latency} latency</p>
                  </div>
                  {isSelected && <ChevronRight className="w-4 h-4 text-primary-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <div
              className={`glass rounded-2xl p-8 h-full border border-primary-500/20 transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary-600/20 flex items-center justify-center shrink-0">
                  {Icon && <Icon className="w-7 h-7 text-primary-300" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{selectedModel.name}</h3>
                    {selectedModel.badge && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${BADGE_COLORS[selectedModel.badgeColor ?? 'blue']}`}>
                        {selectedModel.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{selectedModel.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-accent-400" />
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Latency</span>
                  </div>
                  <span className="text-white font-bold text-lg">{selectedModel.latency}</span>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-accent-400" />
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Context</span>
                  </div>
                  <span className="text-white font-bold text-lg">{selectedModel.contextWindow}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-sm px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/8 hover:border-primary-500/30 hover:text-white transition-colors"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                <button
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary text-sm py-2.5 flex-1"
                >
                  Try in Demo
                </button>
                <button className="btn-secondary text-sm py-2.5 flex-1">
                  View Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
