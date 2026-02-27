'use client';
import { motion } from 'framer-motion';
import { Globe, Bot, BarChart3, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const STEPS = [
  { icon: Globe, label: 'Fetching website…', delay: 0 },
  { icon: Bot, label: 'Querying AI platforms…', delay: 1800 },
  { icon: BarChart3, label: 'Scoring & building report…', delay: 4200 },
];

export default function LoadingState() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
      }, step.delay + 1200);
      return () => clearTimeout(t);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto mt-12"
    >
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>
        <h3 className="text-white font-semibold mb-6 text-lg">Analyzing your AI presence…</h3>
        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = completedSteps.includes(i);
            const isActive = !isDone && (i === 0 || completedSteps.includes(i - 1));
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay / 1000 }}
                className="flex items-center gap-3 text-left"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-emerald-500/20 text-emerald-400' :
                  isActive ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-slate-700 text-slate-500'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${isDone ? 'text-emerald-400' : isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {step.label}
                </span>
                {isActive && (
                  <motion.div
                    className="flex gap-0.5 ml-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map(d => (
                      <motion.div
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.2 }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-6">This may take 15–30 seconds</p>
      </div>
    </motion.div>
  );
}
