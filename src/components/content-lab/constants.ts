export const CHAR_LIMITS: Record<string, number> = {
  LinkedIn: 3000,
  'Twitter/X': 280,
  Instagram: 2200,
  Facebook: 63206,
};

export const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn: '#0077b5',
  'Twitter/X': '#000000',
  Instagram: '#e1306c',
  Facebook: '#1877f2',
};

export const PLATFORM_ASPECT: Record<string, string> = {
  LinkedIn: '16:9 landscape, professional editorial',
  'Twitter/X': '16:9 or 1:1 square, bold scroll-stopping',
  Instagram: '1:1 square or 4:5 portrait',
  Facebook: '16:9 landscape',
};

export const PLATFORM_NOTES: Record<string, string> = {
  LinkedIn:
    'Professional audience. 150-400 words. Line breaks for scanability. 2-3 hashtags.',
  'Twitter/X': 'Under 280 chars. One sharp idea. 1-2 hashtags max.',
  Instagram:
    'Hook in first line (before "more" fold). 5-7 hashtags at end.',
  Facebook:
    'Like LinkedIn but slightly more casual. Question at end drives comments.',
};

export const BRAND = `Hybrid Ads (hybridads.ai) — AI systems integrator and paid ads agency. Google, Meta, TikTok. 2M+ leads generated.
Voice: smart, direct, data-confident. Not salesy. Performance-first. Never: "game-changer","unlock","unleash","hustle","revolutionize".
LinkedIn: 2-3 hashtags. Twitter/X: 1-2 max. Instagram: 5-7 hashtags.`;

export const BUILTIN_DATA = `Motion Creative Benchmarks 2026 — 578,750 creatives, 6,015 accounts, $1.29B spend, Sep 2025–Jan 2026.
Key findings:
- ~5% of ads are winners (10x account median spend, min $500)
- 55% of total spend goes to winners; 28% mid-range; 17% losers
- Enterprise: 64% spend to winners. Micro (<$10K/mo): 23%
- Hit rate: Micro 4%, Small 6.4%, Medium 8.1%, Large 8.6%, Enterprise 8.8%
- Top 25% Large-tier: 31.1 creatives/week vs 11.2 avg (2.8x)
- Enterprise top 25%: 54.6/week vs 18.8 avg; 10.4 winners/mo vs 3.9
- Mid-range ads: 38-46% of portfolios — stability layer
- Text-forward assets (text-only, product+text) win more than expected
- Winning hooks: immediacy, price framing, urgency, product newness
- High hit rate can mean insufficient testing`;

export const TONES: Record<string, string> = {
  authoritative: 'authoritative, confident, data-led',
  provocative: 'provocative and contrarian — challenges assumptions',
  educational: 'educational and clear — explains the why',
  conversational:
    'conversational and direct — smart colleague sharing a finding',
};

export const FORMATS: Record<string, string> = {
  'stat-hook':
    'Lead with a striking data point, unpack the implication, end with a sharp takeaway.',
  'myth-bust':
    'Open naming a misconception, flip with data. "Most think X. The data says Y."',
  listicle: 'Numbered list, 3-5 tight points, each one insight.',
  question:
    'Open with a rhetorical question creating tension, answer with data.',
  story: 'Short scenario or analogy illustrating the data. Relatable for performance marketers.',
};

export const ALL_PLATFORMS = ['LinkedIn', 'Twitter/X', 'Instagram', 'Facebook'] as const;
