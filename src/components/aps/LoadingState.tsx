import { useState } from 'react';
import { Globe, Bot, BarChart3 } from 'lucide-react';

export default function LoadingState() {
  const steps = [
    { icon: Globe, label: 'Fetching website…' },
    { icon: Bot, label: 'Querying AI platforms…' },
    { icon: BarChart3, label: 'Scoring & building report…' },
  ];
  const [done, setDone] = useState<number[]>([]);
  useState(() => {
    const timers = [1200, 3000, 5500].map((ms, i) =>
      setTimeout(() => setDone(d => [...d, i]), ms)
    );
    return () => timers.forEach(clearTimeout);
  });

  return (
    <div className="w-full max-w-md mx-auto mt-12" style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        <h3 className="text-gray-900 font-semibold mb-6 text-lg">Analyzing your AI presence…</h3>
        <div className="space-y-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isDone = done.includes(i);
            const isActive = !isDone && (i === 0 || done.includes(i - 1));
            return (
              <div key={i} className="flex items-center gap-3 text-left">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isDone ? 'bg-emerald-100 text-emerald-600' : isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm transition-colors ${isDone ? 'text-emerald-600 font-medium' : isActive ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {isActive && (
                  <div className="flex gap-0.5 ml-auto">
                    {[0, 1, 2].map(d => (
                      <div
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-6">This may take 15–30 seconds</p>
      </div>
    </div>
  );
}
