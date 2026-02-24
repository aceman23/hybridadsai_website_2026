import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointerClick,
  Target,
  BarChart3,
  Calendar,
  Download,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
} from 'lucide-react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';

interface DashboardPageProps {
  navigate: (page: Page) => void;
}

const metrics = [
  { label: 'Total Spend', value: '$127,540', change: '+12.3%', trend: 'up', icon: DollarSign, color: 'blue' },
  { label: 'Impressions', value: '4.2M', change: '+18.7%', trend: 'up', icon: Eye, color: 'sky' },
  { label: 'Clicks', value: '156.8K', change: '+24.1%', trend: 'up', icon: MousePointerClick, color: 'green' },
  { label: 'Conversions', value: '8,432', change: '-3.2%', trend: 'down', icon: Target, color: 'orange' },
  { label: 'CTR', value: '3.73%', change: '+5.2%', trend: 'up', icon: BarChart3, color: 'teal' },
  { label: 'ROAS', value: '3.08x', change: '+8.9%', trend: 'up', icon: TrendingUp, color: 'blue' },
];

const campaigns = [
  { name: 'Spring Sale 2024', platform: 'Google', status: 'Active', spend: '$12,450', roas: '4.2x', ctr: '4.1%' },
  { name: 'Brand Awareness Q1', platform: 'Facebook', status: 'Active', spend: '$8,920', roas: '2.8x', ctr: '2.9%' },
  { name: 'Product Launch', platform: 'Instagram', status: 'Active', spend: '$15,600', roas: '5.1x', ctr: '5.4%' },
  { name: 'Retargeting Campaign', platform: 'Google', status: 'Paused', spend: '$5,240', roas: '3.6x', ctr: '3.2%' },
  { name: 'Holiday Special', platform: 'TikTok', status: 'Active', spend: '$22,100', roas: '4.8x', ctr: '6.1%' },
];

const platforms = [
  { name: 'Google Ads', spend: '$45,200', pct: 35, color: 'bg-blue-500' },
  { name: 'Facebook Ads', spend: '$38,800', pct: 30, color: 'bg-blue-600' },
  { name: 'LinkedIn Ads', spend: '$24,600', pct: 19, color: 'bg-sky-600' },
  { name: 'Instagram Ads', spend: '$18,940', pct: 16, color: 'bg-pink-500' },
];

const faqs = [
  {
    question: 'How does this dashboard simplify my workflow compared to separate platform reports?',
    answer: "The integrated dashboard eliminates the need to jump between platforms to compile data. It's a single source of truth where you can instantly see the relationships between ad performance on different channels and their ultimate impact on sales. This streamlined approach saves valuable time and allows for faster, more informed adjustments.",
  },
  {
    question: "My business doesn't use Shopify. Can I still benefit from this dashboard?",
    answer: "Yes! While the integrated dashboard has powerful synergies with Shopify, it's still highly valuable for understanding cross-platform advertising performance. It provides a powerful view of how Facebook and Google ads drive traffic to your website and contribute to conversions even if your sales platform is different.",
  },
  {
    question: 'Can I customize the dashboard to track specific metrics that matter most to my business?',
    answer: "Absolutely! The dashboard is designed to be flexible. Choose the key performance indicators (KPIs) that align with your unique goals, whether it's cost-per-acquisition, ROAS (return on ad spend), or specific audience interactions.",
  },
];

export default function DashboardPage({ navigate }: DashboardPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <img
                src="/AdPerformance_Icon.png"
                alt="Ad Performance Dashboard"
                className="w-full object-cover"
              />
              <div className="bg-gray-900 px-6 py-4 text-center">
                <p className="font-black text-xl tracking-widest text-white uppercase">Ad Performance</p>
                <p className="text-pink-400 font-black text-2xl tracking-widest uppercase">Dashboard</p>
              </div>
            </div>

            <div>
              <AnimateIn>
                <p className="text-yellow-400 font-bold text-lg mb-3">The Challenge</p>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Data Silos. Wasted Ad Spend. Missed Opportunities.
                </h2>
              </AnimateIn>
              <AnimateIn delay={150}>
                <p className="text-gray-300 leading-relaxed mb-8">
                  Juggling ad reports from Google Analytics, Meta Ad Manager, LinkedIn Ads, X, TikTok,
                  Amazon and Shopify is a headache. You're getting insights, but the big picture is lost.
                  Sound familiar? Without a cohesive view, you're making uninformed decisions and leaving
                  money on the table.
                </p>
              </AnimateIn>
              <AnimateIn delay={300}>
                <button
                  onClick={() => navigate('home')}
                  className="inline-flex items-center bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Simplify Your Workflow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <AnimateIn>
                <p className="text-teal-400 font-bold text-lg mb-3">The Solution</p>
                <h2 className="text-4xl font-black text-white mb-6">Manage Your Datasets</h2>
              </AnimateIn>
              <div className="space-y-4 mb-8">
                {[
                  { label: 'Real-time Decision Making:', desc: 'No more waiting on reports; make impactful adjustments on the fly.' },
                  { label: 'Enhanced Attribution:', desc: 'Know exactly which ads drive sales, not just clicks.' },
                  { label: 'Cost Efficiency:', desc: 'Uncover underperformers and redistribute budgets for maximum return.' },
                  { label: 'Time Savings:', desc: 'One dashboard, one view, no more wasted hours jumping between platforms.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">
                      <span className="text-white font-semibold">{item.label}</span> {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Track the full customer journey, from ad impression to purchase, and everything in between.
                Effortlessly reveal what's working, what's not, and where to optimize.
              </p>
              <button className="inline-flex items-center bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-shadow">
                Master Your Metrics
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <img
                src="/HybridAdsAnalyticsDashboard2.png"
                alt="Digital Marketing Analytics"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Live Performance Overview</h2>
              <p className="text-gray-500 text-sm mt-1">Powered by AI-driven insights</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const isUp = metric.trend === 'up';
              return (
                <div key={metric.label} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className={`text-xs font-semibold flex items-center ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                      {isUp ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-lg font-black text-gray-900">{metric.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{metric.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-black text-gray-900 mb-5">Campaign Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Campaign</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Platform</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Status</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">Spend</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">ROAS</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-600">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium text-gray-900">{c.name}</td>
                        <td className="py-3 px-2 text-gray-600">{c.platform}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-700">{c.spend}</td>
                        <td className="py-3 px-2 font-bold text-blue-600">{c.roas}</td>
                        <td className="py-3 px-2 text-gray-700">{c.ctr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-black text-gray-900 mb-5">Platform Breakdown</h3>
              <div className="space-y-5">
                {platforms.map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-800">{p.name}</span>
                      <span className="text-sm font-bold text-gray-900">{p.spend}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`${p.color} h-2 rounded-full`} style={{ width: `${p.pct}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{p.pct}% of total spend</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">AI-Powered Insights</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { color: 'blue', title: 'Optimization Opportunity', msg: 'Your Spring Sale campaign performs 32% better during 2–4 PM. Consider increasing budget during these hours.' },
                { color: 'green', title: 'Audience Insight', msg: 'Users aged 25–34 show 2.4x higher conversion rates. Expand targeting in this demographic.' },
                { color: 'orange', title: 'Creative Recommendation', msg: 'Video ads generate 45% more engagement. Allocate more budget toward video creatives.' },
              ].map((insight) => (
                <div key={insight.title} className={`flex items-start gap-3 p-4 bg-${insight.color}-50 rounded-xl`}>
                  <div className={`bg-${insight.color}-500 rounded-full p-1.5 flex-shrink-0`}>
                    <TrendingUp className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{insight.title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{insight.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="text-4xl md:text-5xl font-black text-center mb-14 leading-tight">
              <span className="text-yellow-400">See Why These Businesses</span>{' '}
              <span className="text-orange-400">Trust the Dashboard</span>
            </h2>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'NewportBodyWorks.com',
                category: 'Service Business (Wellness Lounge)',
                quote: '"Before the dashboard, it was a headache figuring out if our Facebook ads actually led to sales. Now, I can see the complete customer journey and know exactly which campaigns are crushing it and which need tweaking. A game-changer!"',
                attribution: 'Owners - NewportBodyWorks.com',
              },
              {
                name: 'TerraRosaWines.com',
                category: 'E-commerce (Wines)',
                quote: '"With the setup of Google Ads, Facebook Ads and Shopify pixel tracking and the dashboard, we were able to see a complete view of our ad spend, site performance & attributed purchases by channels and audience type"',
                attribution: 'Owner - TerraRosaWines Family Office',
              },
              {
                name: 'AsteriasBeaute.com',
                category: 'E-commerce (Beauty)',
                quote: '"We\'re a small team, and this dashboard saves us countless hours compared to sifting through multiple platform reports. The ability to drill down to keyword-level & meta ads performance has been crucial for refining our ad targeting."',
                attribution: 'Owner - AsteriasBeaute.com',
              },
            ].map((t, i) => (
              <AnimateIn key={i} delay={i * 120}>
                <div className="flex flex-col h-full">
                  <h3 className="text-white font-black text-xl mb-2">{t.name}</h3>
                  <p className="text-blue-400 text-sm mb-4">{t.category}</p>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1">{t.quote}</p>
                  <p className="text-gray-500 text-sm italic mt-6">{t.attribution}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <button
                    className="w-full flex items-start justify-between gap-4 px-6 py-6 text-left"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <span className="text-white font-bold text-lg leading-snug">{faq.question}</span>
                    <span className="flex-shrink-0 mt-1 text-gray-400">
                      {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimateIn>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Ready to Stop Guessing?
            </h2>
          </AnimateIn>
          <AnimateIn delay={150}>
            <p className="text-gray-400 text-lg mb-8">
              Get a free strategy call with our team. We'll audit your ad accounts, identify wasted
              spend, and show you exactly how to hit 3x+ ROAS.
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
              See Case Studies
            </button>
          </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
