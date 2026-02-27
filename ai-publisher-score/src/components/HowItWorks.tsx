'use client';
import { useState } from 'react';
import { ChevronDown, Globe, Bot, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    icon: Globe,
    title: 'Step 1: Extract Business Data',
    color: 'text-cyan-400',
    content: 'We fetch your website and use AI to extract your ground-truth business information — name, address, phone, categories, and website — including hidden schema.org structured data.',
  },
  {
    icon: Bot,
    title: 'Step 2: Query All AI Platforms',
    color: 'text-blue-400',
    content: 'We simultaneously query OpenAI ChatGPT, Google Gemini, Microsoft Copilot, xAI Grok, and Perplexity with the same prompt about your business and collect their responses.',
  },
  {
    icon: BarChart3,
    title: 'Step 3: Score & Report',
    color: 'text-emerald-400',
    content: 'Each AI response is compared field-by-field against your ground truth. Consistent matches score 100%, missing data scores 0%. The weighted average becomes your AI Publisher Score.',
  },
];

export default function HowItWorks() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <p className="text-center text-slate-500 text-sm mb-4">How it works</p>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isOpen = openIndex === i;
          return (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${step.color} flex-shrink-0`} />
                  <span className="text-sm font-medium text-slate-200">{step.title}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-700 pt-3">
                      {step.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
