import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell, CheckCircle2, Clock, FileText, Loader2, LogOut, AlertCircle,
  FileSignature, Download, Shield, ArrowRight, Eraser, ChevronRight,
} from 'lucide-react';
import type { Page } from '../App';
import { supabase } from '../lib/supabase';
import AnimateIn from '../components/AnimateIn';

interface Props {
  navigate: (page: Page) => void;
}

interface Application {
  id: string;
  user_id: string;
  full_name: string;
  legal_name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'agreement_sent' | 'signed';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Agreement {
  id: string;
  application_id: string;
  user_id: string;
  template_version: number;
  rendered_body: string;
  document_sha256: string;
  status: 'sent' | 'signed' | 'void';
  sent_at: string;
  hybrid_signer_name: string | null;
  hybrid_signer_title: string | null;
  hybrid_signed_at: string | null;
  signer_legal_name: string | null;
  signature_image: string | null;
  esign_consent: boolean;
  signed_at: string | null;
  signer_ip: string | null;
  signer_user_agent: string | null;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

const STAGES: { key: Application['status']; label: string }[] = [
  { key: 'pending', label: 'Applied' },
  { key: 'approved', label: 'Under review' },
  { key: 'agreement_sent', label: 'Agreement sent' },
  { key: 'signed', label: 'Signed' },
];

function stageIndex(status: Application['status']): number {
  if (status === 'rejected') return -1;
  if (status === 'pending') return 0;
  if (status === 'approved') return 1;
  if (status === 'agreement_sent') return 2;
  return 3;
}

export default function PartnerPortalPage({ navigate }: Props) {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [application, setApplication] = useState<Application | null>(null);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    const [appRes, agrRes, notRes] = await Promise.all([
      supabase.from('partner_applications').select('*').maybeSingle(),
      supabase.from('partner_agreements').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('partner_notifications').select('*').order('created_at', { ascending: false }).limit(20),
    ]);
    if (appRes.error) setError(appRes.error.message);
    setApplication((appRes.data as Application | null) ?? null);
    setAgreement((agrRes.data as Agreement | null) ?? null);
    setNotifications((notRes.data as Notification[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSignedIn(!!session);
        if (session) load();
      })();
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner portal</h1>
          <p className="text-gray-600 mb-6">Sign in to your Hybrid Ads account to access your partner portal.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('sign-in')}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('partners')}
              className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Learn about the program
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No application on file</h1>
          <p className="text-gray-600 mb-6">You haven&apos;t applied to the Hybrid Ads Partner Program yet.</p>
          <button
            onClick={() => navigate('partners')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Apply now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const idx = stageIndex(application.status);
  const unread = notifications.filter((n) => !n.read_at);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimateIn>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Partner portal</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Welcome, {application.full_name}</h1>
              <p className="text-gray-600 mt-1">Track your application status and manage your partner agreement.</p>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </AnimateIn>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {unread.length > 0 && (
          <AnimateIn delay={80}>
            <div className="mt-6 p-4 rounded-2xl border border-blue-200 bg-blue-50 flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">{unread[0].title}</p>
                {unread[0].body && <p className="text-sm text-blue-800 mt-1">{unread[0].body}</p>}
              </div>
              <button
                onClick={async () => {
                  await supabase
                    .from('partner_notifications')
                    .update({ read_at: new Date().toISOString() })
                    .eq('id', unread[0].id);
                  load();
                }}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                Mark read
              </button>
            </div>
          </AnimateIn>
        )}

        {/* Status timeline */}
        <AnimateIn delay={100}>
          <div className="mt-8 p-6 rounded-2xl bg-white border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Application status</h2>
            {application.status === 'rejected' ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm font-semibold text-red-900">Application not approved</p>
                {application.admin_notes && (
                  <p className="text-sm text-red-800 mt-2">{application.admin_notes}</p>
                )}
              </div>
            ) : (
              <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {STAGES.map((stage, i) => {
                  const done = i < idx;
                  const current = i === idx;
                  return (
                    <li key={stage.key} className={`p-4 rounded-xl border-2 ${
                      current ? 'border-blue-500 bg-blue-50' :
                      done ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        {done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                         current ? <Clock className="w-4 h-4 text-blue-600" /> :
                         <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          current ? 'text-blue-700' :
                          done ? 'text-emerald-700' : 'text-gray-500'
                        }`}>Step {i + 1}</span>
                      </div>
                      <p className={`mt-2 font-semibold text-sm ${
                        current ? 'text-blue-900' :
                        done ? 'text-emerald-900' : 'text-gray-700'
                      }`}>{stage.label}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </AnimateIn>

        {/* Agreement */}
        {agreement && (
          <AnimateIn delay={160}>
            <div className="mt-8">
              {agreement.status === 'signed'
                ? <SignedAgreementView agreement={agreement} application={application} />
                : <SignAgreementView agreement={agreement} application={application} onSigned={load} />
              }
            </div>
          </AnimateIn>
        )}

        {/* All notifications */}
        {notifications.length > 0 && (
          <AnimateIn delay={200}>
            <div className="mt-8 p-6 rounded-2xl bg-white border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                    <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      {n.body && <p className="text-sm text-gray-600 mt-0.5">{n.body}</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>
        )}
      </div>
    </div>
  );
}

function SignAgreementView({
  agreement, application, onSigned,
}: {
  agreement: Agreement;
  application: Application;
  onSigned: () => void;
}) {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [esignConsent, setEsignConsent] = useState(false);
  const [agreeAgreement, setAgreeAgreement] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const expectedName = (application.legal_name || application.full_name).trim();
  const nameMatches = typedName.trim().toLowerCase() === expectedName.toLowerCase() && typedName.trim().length > 0;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDraw = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawingRef.current = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
  };
  const moveDraw = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };
  const endDraw = () => { drawingRef.current = false; };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const canSign = scrolledToEnd && esignConsent && agreeAgreement && nameMatches && !submitting;

  const sign = async () => {
    if (!canSign) return;
    setSubmitting(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You need to be signed in.');
      const signatureImage = hasSignature && canvasRef.current
        ? canvasRef.current.toDataURL('image/png')
        : undefined;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-sign-agreement`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agreement_id: agreement.id,
            signer_legal_name: typedName.trim(),
            esign_consent: true,
            signature_image: signatureImage,
          }),
        }
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || `Signing failed (${res.status})`);
      onSigned();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-blue-600" />
            Developer Enablement & Revenue Share Agreement
          </h2>
          <p className="text-sm text-gray-600 mt-1">Version {agreement.template_version} · Sent {new Date(agreement.sent_at).toLocaleDateString()}</p>
        </div>
        <span className="text-[10px] font-mono text-gray-400 break-all">SHA-256 {agreement.document_sha256.slice(0, 12)}…</span>
      </div>

      <div
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setScrolledToEnd(true);
        }}
        className="h-96 overflow-y-auto whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-800 border border-gray-200 rounded-xl p-5 bg-gray-50"
      >
        {agreement.rendered_body}
      </div>
      {!scrolledToEnd && (
        <p className="mt-2 text-xs text-gray-500">Scroll to the end of the agreement to enable signing.</p>
      )}

      <fieldset disabled={!scrolledToEnd} className="mt-6 space-y-4 disabled:opacity-60">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={esignConsent}
            onChange={(e) => setEsignConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            I consent to sign this agreement electronically and understand that my electronic signature is legally binding.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeAgreement}
            onChange={(e) => setAgreeAgreement(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            I have read and agree to the Developer Enablement & Revenue Share Agreement above, including the 55/45 revenue split and the 12-month term.
          </span>
        </label>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
            Type your legal name to sign <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder={expectedName}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
              typedName && nameMatches
                ? 'border-emerald-300 focus:ring-emerald-500'
                : typedName
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {typedName && !nameMatches && (
            <p className="mt-1 text-xs text-red-600">Must match &quot;{expectedName}&quot; from your application.</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Draw your signature (optional)</p>
            <button
              type="button"
              onClick={clearCanvas}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
            >
              <Eraser className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <canvas
            ref={canvasRef}
            width={600}
            height={140}
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
            className="w-full h-36 border border-gray-300 rounded-lg bg-white touch-none cursor-crosshair"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={sign}
          disabled={!canSign}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              <FileSignature className="w-4 h-4" />
              Sign agreement
            </>
          )}
        </button>
      </fieldset>
    </div>
  );
}

function SignedAgreementView({
  agreement, application,
}: {
  agreement: Agreement;
  application: Application;
}) {
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });
      const margin = 54;
      const width = doc.internal.pageSize.getWidth() - margin * 2;
      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(agreement.rendered_body, width);
      let y = margin;
      const pageHeight = doc.internal.pageSize.getHeight();
      lines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 14;
      });
      doc.addPage();
      doc.setFontSize(10);
      doc.text('Signature record', margin, margin);
      doc.setFontSize(9);
      const meta = [
        `Signer: ${agreement.signer_legal_name}`,
        `Signed at: ${agreement.signed_at}`,
        `Signer IP: ${agreement.signer_ip || 'n/a'}`,
        `User agent: ${agreement.signer_user_agent || 'n/a'}`,
        `Hybrid Ads signer: ${agreement.hybrid_signer_name} (${agreement.hybrid_signer_title})`,
        `Hybrid Ads signed at: ${agreement.hybrid_signed_at}`,
        `Document SHA-256: ${agreement.document_sha256}`,
      ];
      let y2 = margin + 20;
      meta.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, width);
        wrapped.forEach((l: string) => { doc.text(l, margin, y2); y2 += 12; });
      });
      doc.save(`hybrid-ads-partner-agreement-${agreement.id}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const rows = useMemo(() => ([
    { label: 'Signer', value: agreement.signer_legal_name || application.full_name },
    { label: 'Signed at', value: agreement.signed_at ? new Date(agreement.signed_at).toLocaleString() : '—' },
    { label: 'Signer IP', value: agreement.signer_ip || '—' },
    { label: 'User agent', value: agreement.signer_user_agent || '—' },
    { label: 'Hybrid Ads signer', value: `${agreement.hybrid_signer_name || '—'} (${agreement.hybrid_signer_title || '—'})` },
    { label: 'Hybrid Ads signed at', value: agreement.hybrid_signed_at ? new Date(agreement.hybrid_signed_at).toLocaleString() : '—' },
    { label: 'Document SHA-256', value: agreement.document_sha256 },
  ]), [agreement, application]);

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Signed
          </div>
          <h2 className="text-lg font-bold text-gray-900">Developer Enablement & Revenue Share Agreement</h2>
          <p className="text-sm text-gray-600 mt-1">Version {agreement.template_version} · On file</p>
        </div>
        <button
          onClick={download}
          disabled={downloading}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download PDF
        </button>
      </div>

      <div className="h-80 overflow-y-auto whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-800 border border-gray-200 rounded-xl p-5 bg-gray-50">
        {agreement.rendered_body}
      </div>

      {agreement.signature_image && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Signature</p>
          <img src={agreement.signature_image} alt="Partner signature" className="max-w-xs border border-gray-200 rounded-lg bg-white" />
        </div>
      )}

      <dl className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="border-b border-gray-100 pb-2">
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{row.label}</dt>
            <dd className="text-gray-800 break-all">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
