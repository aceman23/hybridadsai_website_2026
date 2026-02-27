'use client';
import { motion } from 'framer-motion';
import type { PlatformResult } from '@/lib/types';
import { PLATFORM_LABELS, PLATFORM_COLORS, PLATFORMS } from '@/lib/types';

interface Props {
  results: PlatformResult[];
}

export default function ProgressBars({ results }: Props) {
  const map = Object.fromEntries(results.map(r => [r.platform, r]));

  return (
    <div className="space-y-3 w-full">
      {PLATFORMS.map((platform) => {
        const result = map[platform];
        const pct = result?.percentage ?? 0;
        const color = PLATFORM_COLORS[platform];
        return (
          <div key={platform} className="flex items-center gap-3">
            <span className="text-sm text-slate-300 w-40 flex-shrink-0 font-medium">
              {PLATFORM_LABELS[platform]}
            </span>
            <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <span className="text-sm font-bold w-10 text-right" style={{ color }}>
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
