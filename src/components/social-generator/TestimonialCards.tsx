import { useRef, useState } from 'react';
import { Download, RefreshCw, Loader2, Star, Linkedin } from 'lucide-react';
import type { BrandData, TestimonialCardData } from './types';
import { downloadCard } from './utils';

const TESTIMONIAL_SETS: TestimonialCardData[][] = [
  [
    { quote: '"This completely transformed how we approach our marketing. The results speak for themselves."', authorName: 'Sarah Chen', authorTitle: 'VP of Marketing, TechCorp', authorImage: '', rating: 5 },
    { quote: '"We saw a 3x increase in conversions within the first month. Absolutely game-changing."', authorName: 'James Rodriguez', authorTitle: 'CEO, GrowthLabs', authorImage: '', rating: 5 },
    { quote: '"The best investment we made this year. Our team productivity has never been higher."', authorName: 'Emily Watson', authorTitle: 'COO, ScaleUp Inc', authorImage: '', rating: 5 },
  ],
  [
    { quote: '"Finally, a solution that actually delivers on its promises. Our ROI exceeded expectations."', authorName: 'Michael Park', authorTitle: 'Director of Sales, NexGen', authorImage: '', rating: 5 },
    { quote: '"The onboarding was seamless and the support team is incredibly responsive."', authorName: 'Lisa Thompson', authorTitle: 'CTO, DataFlow', authorImage: '', rating: 4 },
    { quote: '"We reduced our operational costs by 40% in just three months. Highly recommended."', authorName: 'David Kim', authorTitle: 'CFO, OptimizeAI', authorImage: '', rating: 5 },
  ],
];

interface TestimonialCardsProps {
  brand: BrandData;
}

export default function TestimonialCards({ brand }: TestimonialCardsProps) {
  const [setIndex, setSetIndex] = useState(0);
  const [cards, setCards] = useState<TestimonialCardData[]>([...TESTIMONIAL_SETS[0]]);
  const [downloading, setDownloading] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cycleSet = () => {
    const next = (setIndex + 1) % TESTIMONIAL_SETS.length;
    setSetIndex(next);
    setCards([...TESTIMONIAL_SETS[next]]);
  };

  const updateCard = (index: number, field: keyof TestimonialCardData, value: string | number) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleDownload = async (index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;
    setDownloading(index);
    try {
      await downloadCard(el, `${brand.domain}-testimonial-${index + 1}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Testimonial Cards</h3>
          <p className="text-sm text-gray-500">380 x 480px - Perfect for Instagram Stories & LinkedIn</p>
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
              style={{ width: 380, height: 480 }}
              className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col justify-between relative overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.secondaryColor})` }} />

              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateCard(i, 'rating', star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className="h-5 w-5"
                        fill={star <= card.rating ? '#f59e0b' : 'none'}
                        stroke={star <= card.rating ? '#f59e0b' : '#d1d5db'}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={card.quote}
                  onChange={(e) => updateCard(i, 'quote', e.target.value)}
                  rows={5}
                  className="text-lg font-medium text-gray-800 leading-relaxed bg-transparent outline-none w-full resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    {card.authorName.charAt(0)}
                  </div>
                  <div>
                    <input
                      value={card.authorName}
                      onChange={(e) => updateCard(i, 'authorName', e.target.value)}
                      className="text-sm font-bold text-gray-900 bg-transparent outline-none w-full"
                    />
                    <input
                      value={card.authorTitle}
                      onChange={(e) => updateCard(i, 'authorTitle', e.target.value)}
                      className="text-xs text-gray-500 bg-transparent outline-none w-full"
                    />
                  </div>
                </div>
                <Linkedin className="h-5 w-5 text-blue-600 flex-shrink-0" />
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
