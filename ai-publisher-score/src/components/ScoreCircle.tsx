'use client';
import { motion } from 'framer-motion';

interface Props {
  score: number;
}

export default function ScoreCircle({ score }: Props) {
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const color = score >= 70 ? '#10b981' : score >= 30 ? '#eab308' : '#ef4444';
  const bgColor = score >= 70 ? '#10b98122' : score >= 30 ? '#eab30822' : '#ef444422';

  const arcLabel = score >= 70 ? 'Great' : score >= 30 ? 'Fair' : 'Poor';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
          />
          <motion.circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-black"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-0.5">AI SCORE</span>
        </div>
      </div>
      <div
        className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
        style={{ background: bgColor, color }}
      >
        {arcLabel} Visibility
      </div>
    </div>
  );
}
