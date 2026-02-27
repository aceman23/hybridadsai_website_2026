'use client';
import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-slate-950" fill="currentColor" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">hybridads</span>
        </div>
        <a
          href="mailto:sales@hybridads.ai"
          className="text-xs text-slate-400 hover:text-cyan-400 transition-colors hidden sm:block"
        >
          (485) sales@hybridads.ai
        </a>
      </div>
    </header>
  );
}
