import { useState, useRef } from 'react';
import { ArrowRight, Search, Download, Sparkles, Globe, Bot, BarChart3, ChevronDown, AlertTriangle, ExternalLink, Zap } from 'lucide-react';
import type { AnalysisReport } from '../types/aps';
import ScoreCircle from '../components/aps/ScoreCircle';
import ProgressBars from '../components/aps/ProgressBars';
import DataTable from '../components/aps/DataTable';
import type { Page } from '../App';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/aps-analyze`;

interface Props {
  navigate: (page: Page) => void;
}

function HowItWorksAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  const steps = [
    {
      icon: Globe,
      color: 'text-cyan-400',
      title: 'Step 1: Extract Business Data',
      body: 'We fetch your website and use AI to extract your ground-truth business information — name, address, phone, categories, and URL — including hidden schema.org structured data.',
    },
    {
      icon: Bot,
      color: 'text-blue-400',
      title: 'Step 2: Query All AI Platforms',
      body: 'We simultaneously query OpenAI ChatGPT, Google Gemini, Microsoft Copilot, xAI Grok, and Perplexity with the same prompt about your business and collect their responses.',
    },
    {
      icon: BarChart3,
      color: 'text-emerald-400',
      title: 'Step 3: Score & Report',
      body: 'Each AI response is compared field-by-field against your ground truth. Consistent matches score green, mismatches yellow, missing data red. The average becomes your AI Publisher Score.',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <p className="text-center text-slate-500 text-sm mb-3">How it works</p>
      <div className="space-y-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isOpen = open === i;
          return (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
                  <span className="text-sm font-medium text-slate-200">{s.title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-700 pt-3">
                  {s.body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadingState() {
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
    <div className="w-full max-w-md mx-auto mt-12 animate-fade-in">
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>
        <h3 className="text-white font-semibold mb-6 text-lg">Analyzing your AI presence…</h3>
        <div className="space-y-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isDone = done.includes(i);
            const isActive = !isDone && (i === 0 || done.includes(i - 1));
            return (
              <div key={i} className="flex items-center gap-3 text-left">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isDone ? 'bg-emerald-500/20 text-emerald-400' : isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm transition-colors ${isDone ? 'text-emerald-400' : isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {isActive && (
                  <div className="flex gap-0.5 ml-auto">
                    {[0, 1, 2].map(d => (
                      <div
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-6">This may take 15–30 seconds</p>
      </div>
    </div>
  );
}

function ReportView({ report, navigate }: { report: AnalysisReport; navigate: (page: Page) => void }) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const el = reportRef.current;
    if (!el) return;
    const { default: html2canvas } = await import('html2canvas');
    const { jsPDF } = await import('jspdf');
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#0f172a' });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = pdf.internal.pageSize.getWidth();
    pdf.addImage(img, 'PNG', 0, 0, w, (canvas.height * w) / canvas.width);
    pdf.save(`ai-publisher-score-${report.url.replace(/https?:\/\//, '').split('/')[0]}.pdf`);
  };

  const date = new Date(report.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="w-full max-w-5xl mx-auto mt-10" style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
      {report.isDemo && (
        <div className="mb-4 flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-yellow-400 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Demo mode — showing sample data. Add your AI API keys to the Supabase Edge Function secrets to run live analysis.</span>
        </div>
      )}

      <div ref={reportRef} className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="bg-slate-800 px-6 py-5 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-white">AI Publisher Score</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <a
                  href={report.url.startsWith('http') ? report.url : `https://${report.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  {report.url.replace(/https?:\/\//, '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500 text-xs">{date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mb-8">
            The AI Publisher Score (APS) algorithm helps businesses understand how accurately their information
            appears across top AI platforms. The higher the APS percentage, the more complete and consistent a
            business&apos;s data is across AI publishers.
          </p>

          <div className="grid lg:grid-cols-[1fr_200px] gap-8 items-start">
            <div className="space-y-6">
              <ProgressBars results={report.results} />
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                {[
                  { icon: '✅', label: 'Consistent', desc: 'Information is up to date and accurate', color: 'text-emerald-400' },
                  { icon: '⚠️', label: 'Inconsistent Data', desc: 'Mismatch in the information', color: 'text-yellow-400' },
                  { icon: '❌', label: 'Not Available', desc: 'Information could not be found', color: 'text-red-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2">
                    <span className="text-sm leading-none mt-0.5">{item.icon}</span>
                    <div>
                      <p className={`text-xs font-semibold ${item.color}`}>{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <ScoreCircle score={report.overallScore} />
            </div>
          </div>

          <DataTable report={report} />

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
            <a
              href="https://calendly.com/hybridadsai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Optimize My AI Presence
            </a>
          </div>
        </div>

        <div className="bg-slate-950/60 px-6 py-4 border-t border-slate-800">
          <p className="text-slate-600 text-xs leading-relaxed">
            Due to the vagaries that can occur in the electronic distribution of information and due to the
            limitations inherent in providing information obtained from multiple sources, report refreshing,
            and report caching there may be delays, omissions, or inaccuracies in the content provided on this
            report. As a result, we do not represent that the information posted is correct in every case.
            © Hybridads v2.8.2
          </p>
        </div>
      </div>

      <p className="text-center text-slate-600 text-xs mt-4">Powered by Hybridads AI</p>
    </div>
  );
}

export default function AIScorePage({ navigate }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setReport(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center max-w-3xl mx-auto pt-16 pb-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-semibold mb-6">
            <Zap className="w-3 h-3" fill="currentColor" />
            Free AI Visibility Audit
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4">
            AI Publisher
            <br />
            <span className="text-cyan-400">Score</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Discover how accurately ChatGPT, Gemini, Copilot, Grok, and Perplexity describe your business.
            Get your free score in seconds.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter your business website URL…"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  Generate Free Report
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-3 text-slate-600 text-xs">
            Try:{' '}
            {['starbucks.com', 'chipotle.com', 'yourwebsite.com'].map((u) => (
              <button
                key={u}
                onClick={() => setUrl(u)}
                className="text-slate-500 hover:text-cyan-400 transition-colors underline underline-offset-2 mx-1"
              >
                {u}
              </button>
            ))}
          </p>
        </div>

        {!loading && !report && <HowItWorksAccordion />}
        {loading && <LoadingState />}

        {error && (
          <div className="max-w-xl mx-auto mt-8 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {report && <ReportView report={report} navigate={navigate} />}

        {!report && !loading && (
          <div className="mt-16 max-w-3xl mx-auto">
            <p className="text-center text-slate-500 text-xs mb-6 uppercase tracking-widest">Why this matters</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { pct: '73%', label: 'of users trust AI answers for local business info', color: 'text-cyan-400' },
                { pct: '58%', label: 'of AI-generated business data contains errors', color: 'text-red-400' },
                { pct: '3×', label: 'more likely to be called when AI data is accurate', color: 'text-emerald-400' },
              ].map(stat => (
                <div key={stat.pct} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
                  <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.pct}</div>
                  <p className="text-slate-400 text-xs leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Back to Hybrid Ads
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeSlideUp 0.4s ease both; }
      `}</style>
    </div>
  );
}
