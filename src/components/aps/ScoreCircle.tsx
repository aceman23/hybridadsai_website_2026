import { useEffect, useState } from 'react';

interface Props {
  score: number;
}

export default function ScoreCircle({ score }: Props) {
  const [animated, setAnimated] = useState(false);
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (animated ? score : 0) / 100);

  const color = score >= 70 ? '#10b981' : score >= 30 ? '#f59e0b' : '#ef4444';
  const bgColor = score >= 70 ? 'bg-emerald-100 text-emerald-700' : score >= 30 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  const label = score >= 70 ? 'Great Visibility' : score >= 30 ? 'Fair Visibility' : 'Poor Visibility';

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black" style={{ color }}>{score}%</span>
          <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-0.5">AI SCORE</span>
        </div>
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${bgColor}`}>{label}</span>
    </div>
  );
}
