'use client';
import type { AnalysisReport } from '@/lib/types';
import { FIELDS, FIELD_LABELS, FIELD_REQUIRED, PLATFORMS, PLATFORM_LABELS } from '@/lib/types';

interface Props {
  report: AnalysisReport;
}

const STATUS_CONFIG = {
  consistent: { icon: '✅', label: 'Consistent', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  inconsistent: { icon: '⚠️', label: 'Inconsistent Data', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  not_available: { icon: '❌', label: 'Not Available', bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default function DataTable({ report }: Props) {
  const resultMap = Object.fromEntries(report.results.map(r => [r.platform, r]));

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 mt-6">
      <table className="w-full text-xs report-table min-w-[640px]">
        <thead>
          <tr className="bg-slate-800">
            <th className="text-left px-3 py-2.5 text-slate-400 font-semibold w-36">Field</th>
            {PLATFORMS.map(p => (
              <th key={p} className="text-center px-2 py-2.5 text-slate-300 font-semibold text-xs">
                {PLATFORM_LABELS[p].split(' ').slice(-1)[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FIELDS.map((field, i) => (
            <tr key={field} className={i % 2 === 0 ? 'bg-slate-900/50' : 'bg-slate-800/30'}>
              <td className="px-3 py-2.5 text-slate-300 font-medium">
                {FIELD_LABELS[field]}
                {FIELD_REQUIRED[field] && (
                  <span className="text-cyan-500 ml-0.5">*</span>
                )}
              </td>
              {PLATFORMS.map(platform => {
                const result = resultMap[platform];
                const status = result?.scores[field] ?? 'not_available';
                const cfg = STATUS_CONFIG[status];
                return (
                  <td key={platform} className="px-2 py-2.5 text-center">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${cfg.bg}`}>
                      <span className="text-xs">{cfg.icon}</span>
                      <span className={`${cfg.text} font-medium hidden sm:inline`}>{cfg.label}</span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
