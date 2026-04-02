import { useRef, useState } from 'react';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import type { BrandData, FeatureCardData } from './types';
import { getContrastColor, downloadCard, getIconPath, AVAILABLE_ICONS } from './utils';

const FEATURE_SETS: FeatureCardData[][] = [
  [
    { icon: 'zap', title: 'Lightning Fast', description: 'Blazing performance with sub-100ms response times', stat: '99.9% uptime' },
    { icon: 'shield', title: 'Enterprise Security', description: 'SOC 2 compliant with end-to-end encryption', stat: '256-bit SSL' },
    { icon: 'globe', title: 'Global Scale', description: 'Deployed across 40+ regions worldwide', stat: '40+ regions' },
  ],
  [
    { icon: 'brain', title: 'AI-Powered', description: 'Smart automation that learns and adapts to your workflow', stat: '10x faster' },
    { icon: 'rocket', title: 'Quick Setup', description: 'Go from zero to production in under 5 minutes', stat: '< 5 min' },
    { icon: 'star', title: 'Top Rated', description: 'Trusted by thousands of companies worldwide', stat: '4.9/5 rating' },
  ],
  [
    { icon: 'shield', title: 'Data Privacy', description: 'Your data stays yours with full GDPR compliance', stat: 'GDPR ready' },
    { icon: 'zap', title: 'Real-Time Sync', description: 'Instant updates across all devices and platforms', stat: '< 50ms' },
    { icon: 'globe', title: '24/7 Support', description: 'Round the clock support from our expert team', stat: '99% CSAT' },
  ],
];

interface FeatureCardsProps {
  brand: BrandData;
}

export default function FeatureCards({ brand }: FeatureCardsProps) {
  const [setIndex, setSetIndex] = useState(0);
  const [cards, setCards] = useState<FeatureCardData[]>([...FEATURE_SETS[0]]);
  const [downloading, setDownloading] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cycleSet = () => {
    const next = (setIndex + 1) % FEATURE_SETS.length;
    setSetIndex(next);
    setCards([...FEATURE_SETS[next]]);
  };

  const updateCard = (index: number, field: keyof FeatureCardData, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleDownload = async (index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;
    setDownloading(index);
    try {
      await downloadCard(el, `${brand.domain}-feature-${index + 1}`);
    } finally {
      setDownloading(false as unknown as number);
    }
  };

  const textColor = getContrastColor(brand.primaryColor);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Feature Cards</h3>
          <p className="text-sm text-gray-500">400 x 280px - Perfect for Instagram & Twitter</p>
        </div>
        <button
          onClick={cycleSet}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Content
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((card, i) => (
          <div key={i} className="space-y-3">
            <div
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                width: 400,
                height: 280,
                background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})`,
                color: textColor,
              }}
              className="rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: textColor, transform: 'translate(30%, -30%)' }} />

              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${textColor}20` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d={getIconPath(card.icon)} />
                  </svg>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${textColor}20` }}>
                  <input
                    value={card.stat}
                    onChange={(e) => updateCard(i, 'stat', e.target.value)}
                    className="bg-transparent outline-none text-center w-20"
                    style={{ color: textColor }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <input
                  value={card.title}
                  onChange={(e) => updateCard(i, 'title', e.target.value)}
                  className="text-xl font-bold bg-transparent outline-none w-full"
                  style={{ color: textColor }}
                />
                <textarea
                  value={card.description}
                  onChange={(e) => updateCard(i, 'description', e.target.value)}
                  rows={2}
                  className="text-sm opacity-90 bg-transparent outline-none w-full resize-none leading-relaxed"
                  style={{ color: textColor }}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <select
                  value={card.icon}
                  onChange={(e) => updateCard(i, 'icon', e.target.value)}
                  className="text-xs bg-transparent outline-none opacity-60 cursor-pointer"
                  style={{ color: textColor }}
                >
                  {AVAILABLE_ICONS.map((icon) => (
                    <option key={icon} value={icon} className="text-gray-900">{icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => handleDownload(i)}
              disabled={downloading === i}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {downloading === i ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PNG
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
