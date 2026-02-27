import { useEffect, useState } from 'react';
import type { PlatformResult } from '../../types/aps';
import { PLATFORMS, PLATFORM_LABELS, PLATFORM_COLORS } from '../../types/aps';

interface Props {
  results: PlatformResult[];
}

export default function ProgressBars({ results }: Props) {
  const [animated, setAnimated] = useState(false);
  const map = Object.fromEntries(results.map(r => [r.platform, r]));

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-3 w-full">
      {PLATFORMS.map((platform, i) => {
        const result = map[platform];
        const pct = result?.percentage ?? 0;
        const color = PLATFORM_COLORS[platform];
        return (
          <div key={platform} className="flex items-center gap-3">
            <span className="text-sm text-gray-700 w-40 flex-shrink-0 font-medium">
              {PLATFORM_LABELS[platform]}
            </span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: animated ? `${pct}%` : '0%',
                  backgroundColor: color,
                  transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${i * 100}ms`,
                }}
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
