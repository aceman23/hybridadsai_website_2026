'use client';
import { useState } from 'react';
import type { AnalysisReport } from '@/lib/types';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import LoadingState from '@/components/LoadingState';
import ReportView from '@/components/ReportView';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setReport(data);

      if (typeof window !== 'undefined') {
        const { supabase } = await import('@/lib/supabase');
        await supabase.from('aps_reports').insert([{
          url,
          overall_score: data.overallScore,
          platform_scores: Object.fromEntries(data.results.map((r: { platform: string; percentage: number }) => [r.platform, r.percentage])),
          is_demo: data.isDemo,
          generated_at: data.generatedAt,
        }]).then(({ error: e }) => {
          if (e) console.warn('Could not save report:', e.message);
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <HeroSection onSubmit={handleSubmit} loading={loading} />
        {!loading && !report && <HowItWorks />}
        {loading && <LoadingState />}
        {error && (
          <div className="max-w-xl mx-auto mt-8 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {report && <ReportView report={report} />}
      </main>
    </div>
  );
}
