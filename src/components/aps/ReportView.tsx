import { useRef, useState } from 'react';
import { Download, Sparkles, AlertTriangle, ExternalLink, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { AnalysisReport } from '../../types/aps';
import ScoreCircle from './ScoreCircle';
import ProgressBars from './ProgressBars';
import DataTable from './DataTable';

interface Props {
  report: AnalysisReport;
}

export default function ReportView({ report }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    const el = reportRef.current;
    if (!el || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pageW) / canvas.width;
      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(img, 'PNG', 0, position, pageW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(img, 'PNG', 0, position, pageW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`ai-publisher-score-${report.url.replace(/https?:\/\//, '').split('/')[0]}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const date = new Date(report.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="w-full max-w-5xl mx-auto mt-10" style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
      {report.isDemo && (
        <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Demo mode — showing sample data. Add your AI API keys to the Supabase Edge Function secrets to run live analysis.</span>
        </div>
      )}

      <div ref={reportRef} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-white">AI Publisher Score</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <a
                  href={report.url.startsWith('http') ? report.url : `https://${report.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 text-sm flex items-center gap-1 hover:text-white transition-colors"
                >
                  {report.url.replace(/https?:\/\//, '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-blue-400">·</span>
                <span className="text-blue-200 text-xs">{date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-500 text-sm leading-relaxed max-w-3xl mb-8">
            The AI Publisher Score (APS) algorithm helps businesses understand how accurately their information
            appears across top AI platforms. The higher the APS percentage, the more complete and consistent a
            business's data is across AI publishers.
          </p>

          <div className="grid lg:grid-cols-[1fr_200px] gap-8 items-start">
            <div className="space-y-6">
              <ProgressBars results={report.results} />
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                {[
                  { icon: CheckCircle, label: 'Consistent', desc: 'Information is up to date and accurate', color: 'text-emerald-600' },
                  { icon: AlertCircle, label: 'Inconsistent Data', desc: 'Mismatch in the information', color: 'text-amber-600' },
                  { icon: XCircle, label: 'Not Available', desc: 'Information could not be found', color: 'text-red-600' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-2">
                      <Icon className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className={`text-xs font-semibold ${item.color}`}>{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <ScoreCircle score={report.overallScore} />
            </div>
          </div>

          <DataTable report={report} />

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Generating PDF…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </>
              )}
            </button>
            <a
              href="https://calendly.com/hybridadsai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm shadow-blue-200"
            >
              <Sparkles className="w-4 h-4" />
              Optimize My AI Presence
            </a>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-gray-400 text-xs leading-relaxed">
            Due to the vagaries that can occur in the electronic distribution of information and due to the
            limitations inherent in providing information obtained from multiple sources, report refreshing,
            and report caching there may be delays, omissions, or inaccuracies in the content provided on this
            report. As a result, we do not represent that the information posted is correct in every case.
            © Hybridads v2.8.2
          </p>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-4">Powered by Hybridads AI</p>
    </div>
  );
}
