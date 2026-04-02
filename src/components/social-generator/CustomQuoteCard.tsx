import { useRef, useState } from 'react';
import { Download, Loader2, Link } from 'lucide-react';
import type { BrandData } from './types';
import { downloadCard } from './utils';

interface CustomQuoteCardProps {
  brand: BrandData;
}

export default function CustomQuoteCard({ brand }: CustomQuoteCardProps) {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [context, setContext] = useState('');
  const [tweetUrl, setTweetUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTweetExtract = async () => {
    if (!tweetUrl.trim()) return;
    setExtracting(true);

    try {
      const urlMatch = tweetUrl.match(/(?:twitter\.com|x\.com)\/(\w+)\/status\/(\d+)/);
      if (urlMatch) {
        const username = urlMatch[1];
        setAuthor(`@${username}`);
        setContext('Posted on X');
        if (!quote) {
          setQuote('Paste the tweet text here or edit inline on the card preview');
        }
      }
    } finally {
      setExtracting(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await downloadCard(cardRef.current, `${brand.domain}-custom-quote`);
    } finally {
      setDownloading(false);
    }
  };

  const hasContent = quote || author || context;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Custom Quote Card</h3>
        <p className="text-sm text-gray-500">1200 x 628px - Create your own quote card for LinkedIn & Twitter</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Card Content</h4>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Quote Text</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={4}
              placeholder="Enter the quote text..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Context / Title</label>
              <input
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. On Growth Strategy"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Link className="h-4 w-4" />
              Import from X/Twitter
            </label>
            <div className="flex gap-2">
              <input
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
                placeholder="Paste tweet URL..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTweetExtract}
                disabled={extracting || !tweetUrl.trim()}
                className="px-4 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Extract'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Live Preview</h4>

          <div className="overflow-hidden rounded-xl" style={{ maxWidth: '100%' }}>
            <div
              ref={cardRef}
              style={{ width: 1200, height: 628, transform: 'scale(0.45)', transformOrigin: 'top left' }}
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
                    {(author || 'A').charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {context && (
                    <div
                      className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: `${brand.primaryColor}30`, color: brand.primaryColor }}
                    >
                      {context}
                    </div>
                  )}

                  <p className="text-3xl font-bold text-white leading-snug">
                    {quote || 'Your quote will appear here...'}
                  </p>

                  {author && (
                    <div className="flex items-center gap-2">
                      <div className="h-px w-16" style={{ backgroundColor: brand.primaryColor }} />
                      <span className="text-lg text-gray-400">{author}</span>
                    </div>
                  )}
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
          </div>

          <div style={{ marginTop: '-260px', position: 'relative', zIndex: 10 }}>
            <button
              onClick={handleDownload}
              disabled={downloading || !hasContent}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
