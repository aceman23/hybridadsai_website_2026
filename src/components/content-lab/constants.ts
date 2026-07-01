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

export interface MotionSection {
  id: string;
  category: string;
  title: string;
  angle: string;
  data: string;
}

export const MOTION_SECTIONS: MotionSection[] = [
  {
    id: 'KF-001',
    category: 'Key Finding',
    title: 'Winning ads are rare',
    angle: 'Only ~5% of ads become winners — low hit rates are a feature of performance advertising, not a sign of weak creative.',
    data: `Only ~5% of ads spend at least 10x their account median ($500 min).
Low hit rates are a statistical feature of how performance advertising works.
578,750 creatives analyzed, 6,015 accounts, $1.29B spend (Sep 2025–Jan 2026).
A "winner" = 10x account median spend and >= $500.
Most ads receive little or no spend; ~6% are responsible for the majority of spend in any account.`,
  },
  {
    id: 'KF-002',
    category: 'Key Finding',
    title: 'Scale changes frequency, not fundamentals',
    angle: 'Larger advertisers surface more winners because they test more — not because their creative is inherently better.',
    data: `Larger advertisers surface more winning ads because they introduce more variation.
Smaller advertisers are not excluded from getting winners but get them less often.
Volume helps because it creates more opportunities. It does not make the average ad better.
Each new ad is another chance to find a standout.
What separates stronger advertisers is testing cadence — enough new ideas to give wins a chance to appear.`,
  },
  {
    id: 'KF-003',
    category: 'Key Finding',
    title: 'Trends are not universal',
    angle: 'The most popular ad formats are not always the ones that capture the most spend — performance shifts with context.',
    data: `The most popular ad formats are not always the ones that capture the most spend.
Performance shifts with context: scale, industry, timing, and saturation.
A format strong overall may perform well in one category and barely appear in others.
Results are time-bound (BFCM / holiday season window, Sep 2025 – Jan 2026).`,
  },
  {
    id: 'KF-004-spend',
    category: 'Key Finding',
    title: 'Spend concentration by tier',
    angle: '55% of total ad spend goes to just ~5% of creatives — and the concentration gets more extreme at larger budgets.',
    data: `Spend concentration:
- ~55% of total spend goes to winners; ~28% to mid-range; ~17% to losers.
- Share of spend on winners rises by tier: Micro ~23% → Enterprise ~64%.
Spend allocation by tier:
| Tier | Loser % | Mid-range % | Winner % |
| Micro (<$10K) | 31.5 | 45.6 | 23.0 |
| Small ($10K-$50K) | 25.7 | 39.7 | 34.6 |
| Medium ($50K-$200K) | 18.6 | 28.1 | 53.3 |
| Large ($200K-$1M) | 17.1 | 26.4 | 56.5 |
| Enterprise ($1M+) | 13.8 | 22.4 | 63.7 |`,
  },
  {
    id: 'KF-005',
    category: 'Key Finding',
    title: 'The 10x benchmark explained',
    angle: 'The 10x winner threshold sits at the 92.3rd percentile — expect roughly 1 in 10-13 creatives to be a winner.',
    data: `The 10x winner threshold = ~92.3rd percentile of the ratio-to-median distribution.
~7.7% of creatives fall above 10x.
Do not expect more than about 1 in 10-13 creatives to be winners on average.
Winner = spend >= 10x account median and >= $500.
Mid-range = 28+ days spend, not winner. Loser = turned off before 28 days.
~50-53% losers, ~38-46% mid-range, ~4-8% winners by tier.`,
  },
  {
    id: 'CH-001',
    category: 'Chart Insight',
    title: 'Creative volume drives winner count',
    angle: 'Advertisers that launch more ads get more winners — not because they predict better, but because they run more tests.',
    data: `Scatter pattern: as ads launched per week increase, winner count across advertisers increases.
Higher avgCreativesPerWeek is associated with higher winner count.
The relationship holds even when comparing advertisers with similar budgets.
Creative strategy should be seen as capacity planning as much as optimization.
Volume = more opportunities to get winners. Does not make the average ad better.`,
  },
  {
    id: 'CH-003',
    category: 'Chart Insight',
    title: 'Testing volume and hit rate by spend tier',
    angle: 'Enterprise accounts test 7x more ads per week than Micro — and their hit rate is more than double.',
    data: `Testing volume and hit rate by spend tier:
| Tier | Avg testing vol (per week) | Avg hit rate (%) |
| Micro (<$10K) | 2.8 | 4.0 |
| Small ($10K-$50K) | 4.1 | 6.4 |
| Medium ($50K-$200K) | 6.6 | 8.1 |
| Large ($200K-$1M) | 11.2 | 8.6 |
| Enterprise ($1M+) | 18.8 | 8.8 |
Testing volume = mean creatives per week per account.
Hit rate = (winner creatives / total creatives) x 100, unweighted mean.`,
  },
  {
    id: 'CH-004',
    category: 'Chart Insight',
    title: 'Why hit rate can be misleading',
    angle: 'A 20% hit rate with 5 launches beats one with 50 launches on paper — but the second account found 5x more winners.',
    data: `Hypothetical example:
Account A: 50 launches, 5 winners, 10% hit rate.
Account B: 5 launches, 1 winner, 20% hit rate.
High hit rates may actually signal insufficient testing.
Hit rate alone does not distinguish "testing a lot with some winners" from "testing little with one winner."
Hit rate is valuable but not a proxy for performance success or efficiency.
Lower hit rates often appear in accounts that test more ideas.`,
  },
  {
    id: 'CH-005',
    category: 'Chart Insight',
    title: 'Portfolio breakdown: losers, mid-range, winners',
    angle: 'Half of all ads are "losers" turned off before 28 days — but the 38-46% mid-range ads quietly keep accounts stable.',
    data: `Portfolio breakdown by spend tier:
| Tier | Loser % | Mid-range % | Winner % |
| Micro (<$10K) | 50.2 | 46.0 | 3.7 |
| Small ($10K-$50K) | 49.3 | 44.6 | 6.2 |
| Medium ($50K-$200K) | 52.6 | 40.1 | 7.3 |
| Large ($200K-$1M) | 53.9 | 38.0 | 8.1 |
| Enterprise ($1M+) | 52.2 | 39.6 | 8.2 |
Mid-range ads help keep results stable. Treating them as "second-best" or failed tests is a mistake.
In a healthy account, mid-range ads connect testing and scaling.`,
  },
  {
    id: 'CH-008',
    category: 'Chart Insight',
    title: 'Top 25% ship dramatically more creative',
    angle: 'Top-quartile Large accounts ship 31.1 creatives/week vs 11.2 average — and find 3.5x more winners per month.',
    data: `Top 25% vs all accounts by spend tier:
| Tier | All vol | Top 25% vol | All winners/mo | Top 25% winners/mo |
| Micro (<$10K) | 2.8 | 4.8 | 0.0 | 0.0 |
| Small ($10K-$50K) | 4.1 | 8.0 | 0.2 | 0.5 |
| Medium ($50K-$200K) | 6.6 | 15.9 | 0.7 | 2.0 |
| Large ($200K-$1M) | 11.2 | 31.1 | 1.7 | 5.9 |
| Enterprise ($1M+) | 18.8 | 54.6 | 3.9 | 10.4 |
Top 25% = accounts with winner count in the top quartile within tier.
Gap is not marginal; top advertisers ship significantly more creative.`,
  },
  {
    id: 'CH-009',
    category: 'Chart Insight',
    title: 'Top visual styles: hit rate vs spend ratio',
    angle: 'Offer-first banners dominate spend share at 29.3% — but unboxing videos have the highest hit rate at 9.8%.',
    data: `Top visual formats:
| Format | Winners | Mid-range | Hit rate % | % Creative | % Spend | Spend use ratio |
| Offer-First Banner | 1100 | 3944 | 8.6 | 21.9 | 29.3 | 1.3 |
| Demo | 556 | 2855 | 8.1 | 12.6 | 12.9 | 1.0 |
| Testimonial | 507 | 3051 | 6.5 | 13.3 | 13.3 | 1.0 |
| Unboxing | 136 | 820 | 9.8 | 2.1 | 2.8 | 1.3 |
| Celebrity | 58 | 335 | 5.9 | 0.8 | 1.8 | 2.1 |
Spend use ratio >1.0 = punches above its weight.
Some formats have high hit rate but lower spend use (unboxing, POV, founder ads).`,
  },
  {
    id: 'CH-011',
    category: 'Chart Insight',
    title: 'Top hooks and headlines that win',
    angle: 'Hooks signaling immediacy, price framing, and urgency produce winners most often — curiosity and bold claims interrupt scrolling.',
    data: `Top hooks/headlines by hit rate (6-11% band):
Newness, Sale announcement, Price anchor, Urgency, Announcement, Offer only, FOMO,
New product announcement, Confession, Exclusivity, Curiosity, Giveaway, Bold claim,
Reverse psychology, Shocking statement, Contrarian, Relatability.
Top by spend use ratio (0.9-2.2 band):
Giveaway (2.2), Price anchor, Announcement, Event announcement, Offer only,
Confession, Urgency, Curiosity, FOMO, Wordplay, Myth busting, Contrarian.
Hooks that signal immediacy, clarity, or a concrete reason to act tend to surface often.
Patterns are time-bound (BFCM / holiday season).`,
  },
  {
    id: 'CH-012',
    category: 'Chart Insight',
    title: 'Text-forward assets punch above their weight',
    angle: 'Text-only ads have the highest hit rate at ~12% — speed and clarity beat production value for finding winners.',
    data: `Top asset types by hit rate (4-12% range):
Text only (~12%), Product image with text, Lifestyle-product image, UGC,
High production, GIF, Illustration, UGC mashup, Lifestyle-product image with text.
Top by spend use ratio (0.5-1.9 range):
Text only (1.9), Product image with text (1.6), Illustration, UGC,
Lifestyle-product image with text, UGC mashup, Hybrid, Product image.
Text-forward assets (text-only, product+text, simple GIFs) appear among winners more often than expected.
Their strength is speed and clarity. Higher-production assets build credibility but are slower to iterate.
Distinction: assets that support fast learning vs those requiring longer cycles.`,
  },
];

export const BUILTIN_DATA = MOTION_SECTIONS.map(s => `[${s.id}] ${s.title}: ${s.angle}`).join('\n');

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
