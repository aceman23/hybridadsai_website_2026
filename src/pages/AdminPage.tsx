import { useEffect, useMemo, useState } from 'react';
import {
  Loader2, Shield, Users, FileSignature, Search, ExternalLink, Mail,
  CheckCircle2, XCircle, Send, AlertCircle, X, Github, Linkedin, Globe,
  RefreshCw,
} from 'lucide-react';
import type { Page } from '../App';
import { supabase } from '../lib/supabase';

interface Props {
  navigate: (page: Page) => void;
}

interface Application {
  id: string;
  user_id: string;
  full_name: string;
  legal_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  timezone: string | null;
  address: string | null;
  website: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  years_experience: string | null;
  primary_skills: string[] | null;
  services_offered: string[] | null;
  languages: string[] | null;
  tools: string[] | null;
  availability: string | null;
  hourly_rate: string | null;
  currency: string | null;
  bio: string | null;
  why_partner: string | null;
  work_style: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'agreement_sent' | 'signed';
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface Agreement {
  id: string;
  application_id: string;
  user_id: string;
  template_version: number;
  document_sha256: string;
  status: 'sent' | 'signed' | 'void';
  sent_at: string;
  hybrid_signer_name: string | null;
  hybrid_signer_title: string | null;
  hybrid_signed_at: string | null;
  signer_legal_name: string | null;
  signed_at: string | null;
  signer_ip: string | null;
  signer_user_agent: string | null;
}

const STATUS_TABS: { key: 'all' | Application['status']; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'agreement_sent', label: 'Agreement sent' },
  { key: 'signed', label: 'Signed' },
  { key: 'rejected', label: 'Rejected' },
];

const STATUS_STYLE: Record<Application['status'], string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-blue-50 text-blue-700 border-blue-200',
  agreement_sent: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  signed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminPage({ navigate }: Props) {
  const [gate, setGate] = useState<'loading' | 'denied' | 'ok'>('loading');
  const [tab, setTab] = useState<'applications' | 'agreements'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [statusTab, setStatusTab] = useState<'all' | Application['status']>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setGate('denied'); return; }
      const { data, error: rpcErr } = await supabase.rpc('is_admin');
      if (rpcErr || !data) { setGate('denied'); return; }
      setGate('ok');
    })();
  }, []);

  useEffect(() => {
    if (gate !== 'ok') return;
    (async () => {
      setLoading(true);
      setError('');
      const [appsRes, agrsRes] = await Promise.all([
        supabase.from('partner_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('partner_agreements').select('*').order('created_at', { ascending: false }),
      ]);
      if (appsRes.error) setError(appsRes.error.message);
      setApplications((appsRes.data as Application[] | null) ?? []);
      setAgreements((agrsRes.data as Agreement[] | null) ?? []);
      setLoading(false);
    })();
  }, [gate, refreshTick]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: applications.length };
    for (const a of applications) c[a.status] = (c[a.status] || 0) + 1;
    return c;
  }, [applications]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (statusTab !== 'all' && a.status !== statusTab) return false;
      if (!s) return true;
      return (
        a.full_name.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        (a.country || '').toLowerCase().includes(s) ||
        (a.primary_skills || []).some((sk) => sk.toLowerCase().includes(s))
      );
    });
  }, [applications, statusTab, search]);

  if (gate === 'loading') {
    return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  }
  if (gate === 'denied') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-600 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Admin</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Partner Program</h1>
            <p className="text-gray-600 mt-1">Review applications, approve partners, and manage agreements.</p>
          </div>
          <button
            onClick={() => setRefreshTick((t) => t + 1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-gray-200">
          <TabButton active={tab === 'applications'} onClick={() => setTab('applications')} icon={Users} label={`Applications (${applications.length})`} />
          <TabButton active={tab === 'agreements'} onClick={() => setTab('agreements')} icon={FileSignature} label={`Agreements (${agreements.length})`} />
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="mt-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : tab === 'applications' ? (
          <div className="mt-6">
            {/* filter + search */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div className="flex flex-wrap gap-2">
                {STATUS_TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setStatusTab(t.key)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      statusTab === t.key
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {t.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusTab === t.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                      {counts[t.key] || 0}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, country, skill"
                  className="pl-9 pr-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-500">No applications match this filter.</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-5 py-3">Name</th>
                      <th className="text-left px-5 py-3">Skills</th>
                      <th className="text-left px-5 py-3">Location</th>
                      <th className="text-left px-5 py-3">Applied</th>
                      <th className="text-left px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((a) => (
                      <tr key={a.id} onClick={() => setSelected(a)} className="hover:bg-blue-50/40 cursor-pointer">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-gray-900">{a.full_name}</div>
                          <div className="text-xs text-gray-500">{a.email}</div>
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          <div className="flex flex-wrap gap-1">
                            {(a.primary_skills || []).slice(0, 3).map((s) => (
                              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{s}</span>
                            ))}
                            {(a.primary_skills?.length || 0) > 3 && (
                              <span className="text-[10px] text-gray-400">+{(a.primary_skills?.length || 0) - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{[a.city, a.country].filter(Boolean).join(', ') || '—'}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLE[a.status]}`}>
                            {a.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {agreements.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">No agreements yet.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-5 py-3">Partner</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Sent</th>
                    <th className="text-left px-5 py-3">Signed</th>
                    <th className="text-left px-5 py-3">SHA-256</th>
                    <th className="text-left px-5 py-3">Signer IP</th>
                    <th className="text-left px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agreements.map((ag) => {
                    const app = applications.find((a) => a.id === ag.application_id);
                    return (
                      <tr key={ag.id}>
                        <td className="px-5 py-3">
                          <div className="font-semibold text-gray-900">{app?.full_name || ag.signer_legal_name || '—'}</div>
                          <div className="text-xs text-gray-500">{app?.email}</div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            ag.status === 'signed' ? STATUS_STYLE.signed : ag.status === 'sent' ? STATUS_STYLE.agreement_sent : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>{ag.status}</span>
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-600">{new Date(ag.sent_at).toLocaleDateString()}</td>
                        <td className="px-5 py-3 text-xs text-gray-600">{ag.signed_at ? new Date(ag.signed_at).toLocaleDateString() : '—'}</td>
                        <td className="px-5 py-3 text-[10px] font-mono text-gray-500">{ag.document_sha256.slice(0, 16)}…</td>
                        <td className="px-5 py-3 text-xs text-gray-500">{ag.signer_ip || '—'}</td>
                        <td className="px-5 py-3">
                          {ag.status === 'sent' && app && (
                            <ResendButton application={app} onDone={() => setRefreshTick((t) => t + 1)} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {selected && (
        <ApplicationDrawer
          application={selected}
          onClose={() => setSelected(null)}
          onRefresh={() => { setSelected(null); setRefreshTick((t) => t + 1); }}
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
        active ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function ResendButton({ application, onDone }: { application: Application; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      onClick={async (e) => {
        e.stopPropagation();
        setBusy(true);
        await callAdminAction({ action: 'resend', application_id: application.id });
        setBusy(false);
        onDone();
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
      Resend
    </button>
  );
}

async function callAdminAction(body: {
  action: 'approve' | 'reject' | 'resend';
  application_id: string;
  hybrid_signer_name?: string;
  hybrid_signer_title?: string;
  admin_notes?: string;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not signed in');
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-admin-action`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload?.error || `Action failed (${res.status})`);
  return payload;
}

function ApplicationDrawer({
  application, onClose, onRefresh,
}: {
  application: Application;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [notes, setNotes] = useState(application.admin_notes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirm, setConfirm] = useState<null | 'approve' | 'reject'>(null);
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await callAdminAction({
        action: 'save_notes',
        application_id: application.id,
        admin_notes: notes,
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const doAction = async (action: 'approve' | 'reject') => {
    setSubmitting(true);
    setError('');
    try {
      const body: Parameters<typeof callAdminAction>[0] = {
        action,
        application_id: application.id,
        admin_notes: notes || undefined,
      };
      if (action === 'approve') {
        if (!signerName.trim() || !signerTitle.trim()) {
          throw new Error('Signer name and title are required to approve.');
        }
        body.hybrid_signer_name = signerName.trim();
        body.hybrid_signer_title = signerTitle.trim();
      }
      await callAdminAction(body);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative bg-white h-full w-full max-w-xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{application.full_name}</h2>
            <p className="text-sm text-gray-500">{application.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLE[application.status]}`}>
              {application.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-500">Applied {new Date(application.created_at).toLocaleString()}</span>
          </div>

          <Section title="Contact">
            <Row label="Legal name" value={application.legal_name} />
            <Row label="Phone" value={application.phone || '—'} />
            <Row label="Country" value={[application.city, application.country].filter(Boolean).join(', ') || '—'} />
            <Row label="Timezone" value={application.timezone || '—'} />
            <Row label="Address" value={application.address || '—'} />
          </Section>

          <Section title="Online">
            <LinkRow icon={Globe} label="Website" href={application.website} />
            <LinkRow icon={ExternalLink} label="Portfolio" href={application.portfolio_url} />
            <LinkRow icon={Linkedin} label="LinkedIn" href={application.linkedin_url} />
            <LinkRow icon={Github} label="GitHub" href={application.github_url} />
          </Section>

          <Section title="Skills">
            <TagRow label="Primary" values={application.primary_skills} />
            <TagRow label="Services" values={application.services_offered} />
            <TagRow label="Languages" values={application.languages} />
            <TagRow label="Tools" values={application.tools} />
            <Row label="Years experience" value={application.years_experience || '—'} />
            <Row label="Availability" value={application.availability || '—'} />
            <Row label="Rate" value={application.hourly_rate ? `${application.hourly_rate} ${application.currency || ''}` : '—'} />
          </Section>

          <Section title="About">
            <Paragraph label="Bio" value={application.bio} />
            <Paragraph label="Why Hybrid Ads?" value={application.why_partner} />
            <Paragraph label="Work style" value={application.work_style} />
          </Section>

          <Section title="Admin notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Internal notes about this applicant"
            />
            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              {savingNotes ? 'Saving…' : 'Save notes'}
            </button>
          </Section>

          {application.status === 'pending' || application.status === 'approved' ? (
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <button
                onClick={() => setConfirm('approve')}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve and send agreement
              </button>
              <button
                onClick={() => setConfirm('reject')}
                className="w-full inline-flex items-center justify-center gap-2 border border-red-200 text-red-700 hover:bg-red-50 font-semibold py-3 rounded-xl transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-200 pt-6">
              <a
                href={`mailto:${application.email}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email partner
              </a>
            </div>
          )}
        </div>

        {confirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setConfirm(null)} />
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {confirm === 'approve' ? 'Approve and send agreement?' : 'Reject this application?'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {confirm === 'approve'
                  ? `An agreement will be generated with the applicant's information and emailed to ${application.email}.`
                  : `${application.full_name} will be notified by email that their application wasn't approved.`}
              </p>

              {confirm === 'approve' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Hybrid Ads signer name</label>
                    <input
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="e.g. Alex Doe"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Signer title</label>
                    <input
                      value={signerTitle}
                      onChange={(e) => setSignerTitle(e.target.value)}
                      placeholder="e.g. CEO"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 mb-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setConfirm(null); setError(''); }}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => doAction(confirm)}
                  disabled={submitting}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg disabled:opacity-50 ${
                    confirm === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirm === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900 text-right">{value}</span>
    </div>
  );
}
function TagRow({ label, values }: { label: string; values: string[] | null }) {
  return (
    <div className="text-sm">
      <span className="text-gray-500">{label}: </span>
      {values && values.length > 0 ? (
        <span className="inline-flex flex-wrap gap-1 mt-1">
          {values.map((v) => (
            <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{v}</span>
          ))}
        </span>
      ) : <span className="text-gray-400">—</span>}
    </div>
  );
}
function LinkRow({ icon: Icon, label, href }: { icon: React.ComponentType<{ className?: string }>; label: string; href: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-gray-500 flex items-center gap-2"><Icon className="w-3.5 h-3.5" /> {label}</span>
      {href ? (
        <a href={href.startsWith('http') ? href : `https://${href}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate max-w-[16rem]">{href}</a>
      ) : <span className="text-gray-400">—</span>}
    </div>
  );
}
function Paragraph({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{value || '—'}</p>
    </div>
  );
}
