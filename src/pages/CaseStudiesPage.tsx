import { ArrowRight, TrendingUp, Eye, MousePointer, Users, Globe, BarChart3, Target } from 'lucide-react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';

interface CaseStudiesPageProps {
  navigate: (page: Page) => void;
}

const caseStudies = [
  {
    client: 'KARLimoLax',
    url: 'https://karlimolax.com',
    tag: 'Luxury Transportation',
    tagColor: 'bg-amber-100 text-amber-700',
    headline: '101.9K Instagram views and 712 Meta Ad clicks in the first month',
    summary: 'Using the LimoLogic.io platform, we built KARLimoLax.com\'s website and booking system and kicked off his Meta ads campaigns.',
    img: '/Screenshot_2026-04-01_at_11.28.12_AM.png',
    summaryImg: '/HybridAds_MarchMetaAdsSummary.jpeg',
    chartImg: '/HybridAds_MarchMetaAdsSummary2.jpeg',
    featured: true,
    services: ['Website Build', 'Booking System', 'Meta Ads', 'Instagram Growth', 'SEO'],
    platform: 'LimoLogic.io',
    metrics: {
      instagram: [
        { label: 'Views (30 days)', value: '101.9K' },
        { label: 'Views (Feb-Mar)', value: '18.3K' },
        { label: 'Interactions', value: '157' },
      ],
      website: [
        { label: 'Sessions', value: '757' },
        { label: 'Active Users', value: '562' },
        { label: 'New Users', value: '545' },
      ],
      metaAds: [
        { label: 'Impressions', value: '26.7K' },
        { label: 'Reach', value: '15.7K' },
        { label: 'Clicks', value: '712' },
        { label: 'CPC', value: '$0.63' },
      ],
    },
  },
];

const otherResults = [
  {
    client: 'Delivery Brand - Sacramento, CA',
    result: '$476,109/month in online revenue',
    detail: 'Grew online sales over 50% by driving organic search. Transaction volume hit 4,386 monthly orders with a 10.36% conversion rate.',
    tag: 'E-Commerce',
    stats: [
      { label: 'Monthly Revenue', value: '$476K' },
      { label: 'Transactions', value: '4,386' },
      { label: 'Conversion Rate', value: '10.36%' },
    ],
  },
  {
    client: 'Newport Body Works',
    result: '602.6% increase in "Book Now" clicks',
    detail: '490+ bookings per month with a 70% conversion rate through targeted ads and a redesigned website.',
    tag: 'Local Business',
    stats: [
      { label: 'Bookings/mo', value: '490+' },
      { label: 'Conversion Rate', value: '70%' },
      { label: 'Click Increase', value: '602.6%' },
    ],
  },
  {
    client: 'SomaLabs',
    result: '3X increase in monthly bookings',
    detail: 'Website redesign, SEO optimizations, and paid campaigns working together for compounding growth.',
    tag: 'Health & Wellness',
    stats: [
      { label: 'Booking Growth', value: '3X' },
      { label: 'Channels', value: 'SEO + Ads' },
      { label: 'Strategy', value: 'Full Stack' },
    ],
  },
  {
    client: 'Comerit.com',
    result: 'Billion-dollar enterprise leads',
    detail: 'Quality lead generation attracting large enterprise clients with $100M+ in revenues.',
    tag: 'B2B SaaS',
    stats: [
      { label: 'Client Size', value: '$100M+' },
      { label: 'Lead Quality', value: 'Enterprise' },
      { label: 'Pipeline', value: 'B2B' },
    ],
  },
  {
    client: 'Pivet',
    result: 'First-ever daily B2C orders',
    detail: 'Went from sporadic sales to consistent new B2C orders every single day.',
    tag: 'E-Commerce',
    stats: [
      { label: 'Order Frequency', value: 'Daily' },
      { label: 'Channel', value: 'B2C' },
      { label: 'Status', value: 'Consistent' },
    ],
  },
  {
    client: 'Bond & Stitch Company',
    result: 'Shopify store live in 14 days',
    detail: 'Full e-commerce setup with the latest features. Client thrilled with design and results.',
    tag: 'Fashion & Apparel',
    stats: [
      { label: 'Launch Time', value: '14 days' },
      { label: 'Platform', value: 'Shopify' },
      { label: 'Setup', value: 'Full E-com' },
    ],
  },
];

function MetricCard({ icon: Icon, label, value, color }: { icon: typeof TrendingUp; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function CaseStudiesPage({ navigate }: CaseStudiesPageProps) {
  const featured = caseStudies[0];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <button
              onClick={() => navigate('about')}
              className="inline-flex items-center text-gray-400 hover:text-white text-sm font-medium mb-8 transition-colors"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to About Us
            </button>
          </AnimateIn>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <AnimateIn>
                <div className="inline-flex items-center bg-white/10 text-sm font-medium rounded-full px-4 py-1.5 mb-6">
                  Case Studies
                </div>
              </AnimateIn>
              <AnimateIn delay={120}>
                <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                  Real Results for <span className="text-blue-400">Real Businesses</span>
                </h1>
              </AnimateIn>
              <AnimateIn delay={240}>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  From luxury transportation to e-commerce brands generating $476K/month — see how we combine AI systems, paid ads, and web development to deliver measurable growth.
                </p>
              </AnimateIn>
              <AnimateIn delay={360}>
                <div className="flex flex-wrap gap-3">
                  {['Meta Ads', 'Google Ads', 'Website Builds', 'AI Systems', 'SEO'].map((s) => (
                    <span key={s} className="bg-white/10 border border-white/10 text-sm font-medium px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </AnimateIn>
            </div>
            <AnimateIn delay={200} variant="fade">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-3xl font-black text-blue-400">$476K</div>
                  <div className="text-sm text-gray-400 mt-1">Monthly Revenue Generated</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-3xl font-black text-green-400">602%</div>
                  <div className="text-sm text-gray-400 mt-1">Booking Click Increase</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-3xl font-black text-amber-400">101.9K</div>
                  <div className="text-sm text-gray-400 mt-1">Instagram Views (30d)</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-3xl font-black text-pink-400">3X</div>
                  <div className="text-sm text-gray-400 mt-1">Booking Growth</div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <AnimateIn>
              <div className="inline-flex items-center bg-amber-50 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Featured Case Study
              </div>
            </AnimateIn>
            <AnimateIn delay={80}>
              <h2 className="text-4xl font-black text-gray-900 mb-2">{featured.client}</h2>
            </AnimateIn>
            <AnimateIn delay={160}>
              <p className="text-gray-500 text-lg max-w-3xl">{featured.summary}</p>
            </AnimateIn>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 mb-16">
            <AnimateIn delay={200} variant="fade" className="lg:col-span-3">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <img
                  src={featured.img}
                  alt={`${featured.client} website`}
                  className="w-full object-cover"
                  width="800" height="450" loading="lazy" decoding="async"
                />
                <div className="bg-gray-900 px-5 py-3 flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold text-sm">{featured.client}</span>
                    <span className="text-gray-500 text-sm ml-3">Built on {featured.platform}</span>
                  </div>
                  <a
                    href={featured.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    Visit Site
                  </a>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={300} variant="fade" className="lg:col-span-2">
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 h-full">
                <h3 className="font-black text-gray-900 mb-4">Services Delivered</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featured.services.map((s) => (
                    <span key={s} className="text-xs bg-white border border-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Website & Booking</p>
                      <p className="text-xs text-gray-500">Full website and online booking system built on the LimoLogic.io platform</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Meta Ads Launch</p>
                      <p className="text-xs text-gray-500">Launched targeted Meta advertising campaigns for the Los Angeles market</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Eye className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Instagram Growth</p>
                      <p className="text-xs text-gray-500">Drove 101.9K views in 30 days with 157 interactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>

          <AnimateIn delay={200}>
            <h3 className="text-2xl font-black text-gray-900 mb-6">March 2026 Performance Metrics</h3>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <MetricCard icon={Eye} label="Instagram Views (30d)" value="101.9K" color="bg-pink-100 text-pink-600" />
            <MetricCard icon={Users} label="Website Sessions" value="757" color="bg-blue-100 text-blue-600" />
            <MetricCard icon={BarChart3} label="Meta Ad Impressions" value="26.7K" color="bg-sky-100 text-sky-600" />
            <MetricCard icon={MousePointer} label="Ad Clicks @ $0.63 CPC" value="712" color="bg-green-100 text-green-600" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <AnimateIn variant="fade">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-pink-600" />
                  </div>
                  <h4 className="font-black text-gray-900">Instagram</h4>
                </div>
                <div className="space-y-3">
                  {featured.metrics.instagram.map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{m.label}</span>
                      <span className="text-sm font-bold text-gray-900">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={100} variant="fade">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-black text-gray-900">Website</h4>
                </div>
                <div className="space-y-3">
                  {featured.metrics.website.map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{m.label}</span>
                      <span className="text-sm font-bold text-gray-900">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={200} variant="fade">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-black text-gray-900">Meta Ads</h4>
                </div>
                <div className="space-y-3">
                  {featured.metrics.metaAds.map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{m.label}</span>
                      <span className="text-sm font-bold text-gray-900">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>

          <AnimateIn variant="fade">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src={featured.summaryImg}
                  alt="KAR Limo LAX March 2026 Performance Summary"
                  className="w-full object-contain bg-white"
                  width="600" height="400" loading="lazy" decoding="async"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src={featured.chartImg}
                  alt="Website Performance Google Analytics - March 2026"
                  className="w-full object-contain bg-white"
                  width="600" height="400" loading="lazy" decoding="async"
                />
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-4xl font-black text-gray-900 mb-3">More Client Results</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500 max-w-xl mx-auto">
                Proven results across e-commerce, local services, SaaS, and beyond
              </p>
            </AnimateIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherResults.map((cs, i) => (
              <AnimateIn key={cs.client} delay={i * 60} variant="fade">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all p-6 h-full flex flex-col">
                  <div className="inline-flex self-start items-center bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {cs.tag}
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">{cs.client}</h3>
                  <p className="text-blue-600 font-bold text-base mb-3 leading-snug">{cs.result}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-grow">{cs.detail}</p>
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                    {cs.stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="text-sm font-black text-gray-900">{s.value}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-3xl font-black text-gray-900 mb-3">Platforms We Use</h2>
            </AnimateIn>
          </div>
          <AnimateIn delay={120} variant="fade">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Meta Ads', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { name: 'Google Ads', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
                { name: 'TikTok Ads', color: 'bg-pink-50 text-pink-700 border-pink-100' },
                { name: 'LimoLogic.io', color: 'bg-sky-50 text-sky-700 border-sky-100' },
                { name: 'Shopify', color: 'bg-green-50 text-green-700 border-green-100' },
                { name: 'Supabase', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
              ].map((p) => (
                <div key={p.name} className={`rounded-xl border px-4 py-3 text-center font-semibold text-sm ${p.color}`}>
                  {p.name}
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimateIn>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Ready to Be Our Next Success Story?
            </h2>
          </AnimateIn>
          <AnimateIn delay={150}>
            <p className="text-gray-400 text-lg mb-8">
              Whether you need a website, ad campaigns, or a full AI-powered growth strategy — we deliver measurable results.
            </p>
          </AnimateIn>
          <AnimateIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/hybridadsai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-xl shadow-green-900/30"
              >
                Book a Free Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <button
                onClick={() => navigate('about')}
                className="inline-flex items-center justify-center border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition-colors"
              >
                About Our Team
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
