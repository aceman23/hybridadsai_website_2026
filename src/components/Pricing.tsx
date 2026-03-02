import { useEffect, useRef, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '../data';
import { joinWaitlist } from '../lib/supabase';

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

export default function Pricing() {
  const { ref, inView } = useInView();
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCTA = (planName: string) => {
    setSelectedPlan(planName.toLowerCase());
    if (planName === 'Enterprise') {
      window.location.href = 'mailto:sales@nexusai.dev';
      return;
    }
    document.getElementById('waitlist-input')?.focus();
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await joinWaitlist(email, selectedPlan || 'starter');
      setStatus('success');
      setEmail('');
    } catch (err: unknown) {
      const error = err as { message?: string };
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section id="pricing" className="py-28 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

      <div className="container-max section-padding relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          ref={ref}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            Simple Pricing
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Scale as you grow.
            <br />
            <span className="gradient-text">Pay only for what you use.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Start for free. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PRICING_PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${
                plan.highlighted
                  ? 'bg-primary-600/10 border-2 border-primary-500/50 shadow-xl shadow-primary-500/10'
                  : 'glass'
              }`}
              style={{ transitionDelay: `${i * 120 + 200}ms` }}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 mb-1.5">{plan.period}</span>}
                </div>
              </div>

              <button
                onClick={() => handleCTA(plan.name)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 mb-6 ${
                  plan.highlighted
                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5'
                    : 'glass glass-hover text-white hover:-translate-y-0.5'
                }`}
              >
                {plan.cta}
              </button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      plan.highlighted ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-slate-400'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`max-w-lg mx-auto text-center transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <h3 className="text-xl font-bold text-white mb-2">Join the waitlist</h3>
          <p className="text-slate-400 text-sm mb-6">Get early access and 3 months free on any paid plan.</p>

          {status === 'success' ? (
            <div className="glass rounded-xl px-6 py-4 border border-success-500/30">
              <div className="flex items-center justify-center gap-2 text-success-400 font-semibold">
                <Check className="w-5 h-5" />
                You're on the list! We'll be in touch soon.
              </div>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="flex gap-3">
              <input
                id="waitlist-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-primary-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary text-sm py-3 px-5 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Joining...' : 'Join Free'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-error-400 text-xs mt-2">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}
