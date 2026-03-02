import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, ChevronRight } from 'lucide-react';
import { trackInteraction } from '../lib/supabase';

const TYPED_WORDS = ['Intelligence.', 'Reasoning.', 'Automation.', 'Discovery.'];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const current = TYPED_WORDS[wordIndex];

    if (!isDeleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length - 1));
      }, 45);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % TYPED_WORDS.length);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, isDeleting, wordIndex]);

  const handleGetStarted = () => {
    trackInteraction('hero_cta', { button: 'get_started' });
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWatchDemo = () => {
    trackInteraction('hero_cta', { button: 'watch_demo' });
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-900">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
        }}
      />

      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full opacity-10 animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, transparent 70%)', animationDelay: '1.5s' }} />

      <div className="relative z-10 container-max section-padding py-32 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm">
            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
            <span className="text-slate-300">Nexus-7 v3.2 now available</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="text-white">The Future of</span>
            <br />
            <span className="gradient-text">Artificial</span>
            <br />
            <span className="text-white">
              {displayed}
              <span className="animate-blink text-primary-400">|</span>
            </span>
          </h1>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Enterprise-grade AI models for reasoning, vision, code, and autonomous agents.
            Deploy in minutes, scale to billions of requests.
          </p>
        </div>

        <div className="animate-slide-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={handleGetStarted}
            className="group flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 text-base w-full sm:w-auto justify-center"
          >
            Start Building Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleWatchDemo}
            className="group flex items-center gap-3 glass glass-hover text-white font-semibold px-8 py-4 rounded-xl text-base w-full sm:w-auto justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            Try Live Demo
          </button>
        </div>

        <div className="animate-fade-in mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500" style={{ animationDelay: '0.5s' }}>
          {['No credit card required', 'Free 14-day trial', 'SOC 2 certified', 'GDPR compliant'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary-500" />
              {item}
            </div>
          ))}
        </div>

        <div className="animate-fade-in mt-20 relative max-w-5xl mx-auto" style={{ animationDelay: '0.6s' }}>
          <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error-500/60" />
                <div className="w-3 h-3 rounded-full bg-warning-500/60" />
                <div className="w-3 h-3 rounded-full bg-success-500/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-slate-500 font-mono">nexusai.dev/playground</span>
              </div>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-accent-400 shrink-0">$</span>
                <div>
                  <span className="text-slate-300">curl https://api.nexusai.dev/v1/chat \</span>
                  <br />
                  <span className="text-slate-500 ml-4">-H "Authorization: Bearer </span>
                  <span className="text-warning-400">$NEXUS_KEY</span>
                  <span className="text-slate-500">" \</span>
                  <br />
                  <span className="text-slate-500 ml-4">-d '</span>
                  <span className="text-success-400">{'{"model":"nexus-7","messages":[{"role":"user","content":"Explain quantum entanglement"}]}'}</span>
                  <span className="text-slate-500">'</span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-4 text-slate-400 leading-relaxed">
                <span className="text-primary-400">{'{'}</span>
                <br />
                <span className="ml-4 text-slate-500">"model": </span>
                <span className="text-success-400">"nexus-7"</span>
                <span className="text-slate-500">, "content": </span>
                <span className="text-success-400">"Quantum entanglement is a phenomenon where two particles..."</span>
                <br />
                <span className="text-primary-400">{'}'}</span>
              </div>
            </div>
          </div>

          <div className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{ background: 'linear-gradient(to bottom right, rgba(59,130,246,0.1), transparent, rgba(6,182,212,0.05))' }} />
        </div>
      </div>
    </section>
  );
}
