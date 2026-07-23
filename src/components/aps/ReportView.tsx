import { useRef, useState } from 'react';
import { Download, Sparkles, AlertTriangle, ExternalLink, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
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
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
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
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>This is a demo report. Enter your own URL above to generate a real AI Publisher Score.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">AI Publisher Score Report</h2>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <div ref={reportRef} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">AI Publisher Score</span>
              </div>
              <h3 className="text-lg font-bold">{report.url}</h3>
              <p className="text-sm text-gray-400 mt-1">Report generated {date}</p>
            </div>
            <ScoreCircle score={report.score} size={80} />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h4 className="text-base font-bold text-gray-900 mb-4">Category Breakdown</h4>
            <ProgressBars report={report} />
          </div>

          <div>
            <h4 className="text-base font-bold text-gray-900 mb-4">Recommendations</h4>
            <div className="space-y-3">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-gray-900 mb-4">Detailed Data</h4>
            <DataTable report={report} />
          </div>

          <div>
            <h4 className="text-base font-bold text-gray-900 mb-4">AI Engine Visibility</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {report.engines.map((engine) => (
                <div key={engine.name} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{engine.name}</span>
                    <StatusIcon status={engine.status} />
                  </div>
                  <p className="text-sm text-gray-500">{engine.detail}</p>
                  {engine.citationUrl && (
                    <a
                      href={engine.citationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2"
                    >
                      View citation <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'cited':
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case 'mentioned':
      return <AlertCircle className="w-5 h-5 text-amber-500" />;
    default:
      return <XCircle className="w-5 h-5 text-red-400" />;
  }
}
