import { useRef, useState } from 'react';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import type { BrandData, QuoteCardData } from './types';
import { downloadCard } from './utils';

const QUOTE_SETS: QuoteCardData[][] = [
  [
    {
      quote: 'The best way to predict the future is to create it.',
      author: 'Peter Drucker',
      authorImage: '',
      context: 'On Innovation & Strategy',
    },
    {
      quote: 'Data is the new oil. It is valuable, but if unrefined it cannot really be used.',
      author: 'Clive Humby',
      authorImage: '',
      context: 'On Data-Driven Growth',
    },
    {
      quote: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      authorImage: '',
      context: 'On Building Products',
    },
  ],
  [
    {
      quote: 'Innovation distinguishes between a leader and a follower.',
      author: 'Steve Jobs',
      authorImage: '',
      context: 'On Market Leadership',
    },
    {
      quote: 'Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.',
      author: 'Mark Zuckerberg',
      authorImage: '',
      context: 'On Speed & Execution',
    },
    {
      quote: 'Your most unhappy customers are your greatest source of learning.',
      author: 'Bill Gates',
      authorImage: '',
      context: 'On Customer Feedback',
    },
  ],
];

interface QuoteCardsProps {
  brand: BrandData;
}

export default function QuoteCards({ brand }: QuoteCardsProps) {
  const [setIndex, setSetIndex] = useState(0);
  const [cards, setCards] = useState<QuoteCardData[]>([...QUOTE_SETS[0]]);
  const [downloading, setDownloading] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cycleSet = () => {
    const next = (setIndex + 1) % QUOTE_SETS.length;
    setSetIndex(next);
    setCards([...QUOTE_SETS[next]]);
  };

  const updateCard = (index: number, field: keyof QuoteCardData, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleDownload = async (index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;
    setDownloading(index);
    try {
      await downloadCard(el, `${brand.domain}-quote-${index + 1}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Quote Cards</h3>
          <p className="text-sm text-gray-500">1200 x 628px - Optimized for LinkedIn & Twitter</p>
        </div>
        <button
          onClick={cycleSet}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Content
        </button>
      </div>

      <div className="flex flex-col items-center gap-8">
        {cards.map((card, i) => (
          <div key={i} className="space-y-3 w-full max-w-[1200px]">
            <div
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{ width: 1200, height: 628, transform: 'scale(0.5)', transformOrigin: 'top left' }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-16 flex items-center relative overflow-hidden"
            >
              <div className="absolute top-8 left-12 text-[180px] leading-none font-serif opacity-10" style={{ color: brand.primaryColor }}>
                &ldquo;
              </div>

              <div className="flex items-center gap-12 relative z-10 w-full">
                <div className="flex-shrink-0">
                  <div
                    className="h-32 w-32 rounded-2xl flex items-center justify-center text-white text-5xl font-bold"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    {card.author.charAt(0)}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: `${brand.primaryColor}30`, color: brand.primaryColor }}
                  >
                    <input
                      value={card.context}
                      onChange={(e) => updateCard(i, 'context', e.target.value)}
                      className="bg-transparent outline-none"
                      style={{ color: brand.primaryColor }}
                    />
                  </div>

                  <textarea
                    value={card.quote}
                    onChange={(e) => updateCard(i, 'quote', e.target.value)}
                    rows={3}
                    className="text-3xl font-bold text-white leading-snug bg-transparent outline-none w-full resize-none"
                  />

                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 max-w-16" style={{ backgroundColor: brand.primaryColor }} />
                    <input
                      value={card.author}
                      onChange={(e) => updateCard(i, 'author', e.target.value)}
                      className="text-lg text-gray-400 bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-12 flex items-center gap-3">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-8 w-8 rounded object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-sm text-gray-500 font-medium">{brand.domain}</span>
              </div>
            </div>

            <div style={{ marginTop: '-286px' }}>
              <button
                onClick={() => handleDownload(i)}
                disabled={downloading === i}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {downloading === i ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Download PNG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
