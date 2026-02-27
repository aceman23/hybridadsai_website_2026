'use client';
import { useState } from 'react';
import { Search, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onSubmit: (url: string) => void;
  loading: boolean;
}

const EXAMPLE_URLS = ['starbucks.com', 'chipotle.com', 'yourwebsite.com'];

export default function HeroSection({ onSubmit, loading }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  };

  return (
    <div className="text-center max-w-3xl mx-auto pt-16 pb-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-semibold mb-6">
          <Zap className="w-3 h-3" fill="currentColor" />
          Free AI Visibility Audit
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4">
          AI Publisher
          <br />
          <span className="text-cyan-400">Score</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Discover how accurately ChatGPT, Gemini, Copilot, Grok, and Perplexity describe your business.
          Get your free score in seconds.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter your business website URL…"
            disabled={loading}
            className="w-full pl-10 pr-4 py-3.5 bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Analyzing…
            </span>
          ) : (
            <>
              Generate Free Report
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 text-slate-600 text-xs"
      >
        Try: {EXAMPLE_URLS.map((u, i) => (
          <button
            key={u}
            onClick={() => setUrl(u)}
            className="text-slate-500 hover:text-cyan-400 transition-colors underline underline-offset-2 mx-1"
          >
            {u}
          </button>
        ))}
      </motion.p>
    </div>
  );
}
