'use client';
import { motion } from 'framer-motion';
import { Download, Calendar, ExternalLink, AlertTriangle, Sparkles } from 'lucide-react';
import type { AnalysisReport } from '@/lib/types';
import ScoreCircle from './ScoreCircle';
import ProgressBars from './ProgressBars';
import Legend from './Legend';
import DataTable from './DataTable';

interface Props {
  report: AnalysisReport;
}

async function downloadPDF(report: AnalysisReport) {
  const { default: jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');
  const element = document.getElementById('report-content');
  if (!element) return;
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0f172a' });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  const domain = report.url.replace(/https?:\/\//, '').split('/')[0];
  pdf.save(`ai-publisher-score-${domain}.pdf`);
}

export default function ReportView({ report }: Props) {
  const formattedDate = new Date(report.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto mt-10"
    >
      {report.isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-yellow-400 text-sm"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Demo mode — no API keys detected. Showing sample data. Add your API keys to .env.local to run live analysis.</span>
        </motion.div>
      )}

      <div id="report-content" className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="bg-slate-800 px-6 py-5 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-white">AI Publisher Score</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <a
                  href={report.url.startsWith('http') ? report.url : `https://${report.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300"
                >
                  {report.url.replace(/https?:\/\//, '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
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
              <Legend />
            </div>
            <div className="flex justify-center lg:justify-end">
              <ScoreCircle score={report.overallScore} />
            </div>
          </div>

          <DataTable report={report} />

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => downloadPDF(report)}
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

        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800">
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
    </motion.div>
  );
}
