import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Target, Mail, Zap, BarChart3, Play, Loader2, LogOut, Settings,
  Users, Search, Activity, Key, CheckCircle2, AlertTriangle,
  TrendingUp, Send, Clock, Building2, User, RefreshCw,
  Sparkles, ArrowRight, ExternalLink,
} from 'lucide-react';
import type { Page } from '../App';
import { supabase } from '../lib/supabase';

interface Props {
  navigate: (page: Page) => void;
}

interface Customer {
  full_name: string;
  email: string;
  credits_remaining: number;
  daily_send_limit: number;
  icp_definition: string | null;
  icp_description: string | null;
  workspace_status: string;
  explee_api_key: string | null;
  explee_status: string;
  explee_customer_id: string | null;
  daily_budget: number;
  last_campaign_run: string | null;
  payment_status: string;
}

interface Campaign {
  id: string;
  name: string;
  icp_definition: string | null;
  status: string;
  emails_sent: number;
  prospects_found: number;
  explee_run_id: string | null;
  created_at: string;
}

interface Prospect {
  id?: string;
  name: string;
  company: string;
  email: string;
  title?: string;
  status: string;
  personalized?: boolean;
  sequence_status?: string;
}

interface RunStatus {
  id: string;
  type: 'search' | 'personalize' | 'sequence';
  status: 'running' | 'completed' | 'failed';
  progress?: number;
  result_count?: number;
  started_at: string;
}

type SidebarTab = 'dashboard' | 'prospects' | 'campaigns' | 'settings';
type ToastType = 'success' | 'error' | 'warning';

export default function GTMWorkspacePage({ navigate }: Props) {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [icpInput, setIcpInput] = useState('');
  const [dailyBudget, setDailyBudget] = useState(10);
  const [saving, setSaving] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [connectingKey, setConnectingKey] = useState(false);
  const [activityFeed, setActivityFeed] = useState<Array<{ time: string; text: string; type: string }>>([]);
  const [stats, setStats] = useState({ prospectsFound: 0, emailsSentToday: 0, deliverability: 98.2 });

  const [searching, setSearching] = useState(false);
  const [personalizing, setPersonalizing] = useState(false);
  const [launchingSequence, setLaunchingSequence] = useState(false);
  const [activeRuns, setActiveRuns] = useState<RunStatus[]>([]);
  const [searchType, setSearchType] = useState<'companies' | 'people'>('people');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const callExpleeProxy = useCallback(async (endpoint: string, method = 'GET', body?: unknown) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Session expired. Please sign in again.');
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/explee-proxy`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint, method, body }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error || `Request failed: ${res.status}`;
      if (res.status === 402 && msg.includes('credits')) {
        throw new Error('CREDITS_EXHAUSTED');
      }
      if (res.status === 402) throw new Error('PAYMENT_REQUIRED');
      if (res.status === 429) throw new Error('RATE_LIMITED');
      throw new Error(msg);
    }
    return res.json();
  }, []);

  useEffect(() => {
    fetchData();
    const stored = sessionStorage.getItem('gtm_toast');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setToast({ type: parsed.type || 'success', message: parsed.message });
        sessionStorage.removeItem('gtm_toast');
        setTimeout(() => setToast(null), 6000);
      } catch { /* ignore */ }
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  useEffect(() => {
    if (activeRuns.some(r => r.status === 'running')) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(pollRunStatuses, 5000);
      }
    } else {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    }
  }, [activeRuns]);

  const handleAgentError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg === 'CREDITS_EXHAUSTED') {
      showToast("You've run out of credits. Upgrade your plan to continue.", 'error');
    } else if (msg === 'PAYMENT_REQUIRED') {
      showToast('Payment is required to use this feature.', 'error');
    } else if (msg === 'RATE_LIMITED') {
      showToast('Too many requests. Please wait a moment and try again.', 'warning');
    } else {
      showToast(msg, 'error');
    }
  };

  const pollRunStatuses = async () => {
    const running = activeRuns.filter(r => r.status === 'running');
    if (running.length === 0) return;

    for (const run of running) {
      try {
        const result = await callExpleeProxy(`/runs/${run.id}/status`, 'GET');
        const data = result?.data;
        if (data) {
          const newStatus = data.status === 'completed' || data.status === 'done' ? 'completed'
            : data.status === 'failed' || data.status === 'error' ? 'failed' : 'running';

          setActiveRuns(prev => prev.map(r => r.id === run.id ? {
            ...r, status: newStatus,
            progress: data.progress ?? r.progress,
            result_count: data.result_count ?? data.results_count ?? r.result_count,
          } : r));

          if (newStatus === 'completed' && run.type === 'search') {
            fetchSearchResults(run.id);
            addActivity(`Search completed: ${data.result_count || 0} prospects found`, 'search');
          } else if (newStatus === 'completed' && run.type === 'personalize') {
            addActivity('Personalization complete for selected prospects', 'system');
            setProspects(prev => prev.map(p => ({ ...p, personalized: true })));
          } else if (newStatus === 'completed' && run.type === 'sequence') {
            addActivity('Email sequence launched successfully', 'campaign');
          }
        }
      } catch { /* polling failure is non-fatal */ }
    }
  };

  const fetchSearchResults = async (runId: string) => {
    try {
      const result = await callExpleeProxy(`/runs/${runId}/results`, 'GET');
      const results = result?.data?.results || result?.data?.prospects || result?.data || [];
      if (Array.isArray(results) && results.length > 0) {
        const mapped: Prospect[] = results.map((r: Record<string, unknown>) => ({
          id: (r.id as string) || undefined,
          name: (r.full_name as string) || (r.name as string) || 'Unknown',
          company: (r.company_name as string) || (r.company as string) || (r.organization as string) || '',
          email: (r.email as string) || (r.work_email as string) || '',
          title: (r.title as string) || (r.job_title as string) || '',
          status: 'new', personalized: false, sequence_status: 'none',
        }));
        setProspects(prev => [...mapped, ...prev]);
        setStats(prev => ({ ...prev, prospectsFound: prev.prospectsFound + mapped.length }));
      }
    } catch { /* non-fatal */ }
  };

  const addActivity = (text: string, type: string) => {
    setActivityFeed(prev => [{ time: 'Just now', text, type }, ...prev].slice(0, 20));
  };

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('gtm-service'); return; }

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gtm-status`,
      { headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' } }
    );

    if (res.ok) {
      const data = await res.json();
      if (!data.customer || data.customer.payment_status !== 'paid') { navigate('gtm-service'); return; }
      setCustomer(data.customer);
      setCampaigns(data.campaigns || []);
      setIcpInput(data.customer.icp_description || data.customer.icp_definition || '');
      setDailyBudget(data.customer.daily_budget || 10);

      const totalProspects = (data.campaigns || []).reduce((sum: number, c: Campaign) => sum + (c.prospects_found || 0), 0);
      const totalEmails = (data.campaigns || []).reduce((sum: number, c: Campaign) => sum + (c.emails_sent || 0), 0);
      setStats({ prospectsFound: totalProspects, emailsSentToday: totalEmails, deliverability: 98.2 });

      const feed: Array<{ time: string; text: string; type: string }> = [];
      (data.campaigns || []).slice(0, 5).forEach((c: Campaign) => {
        feed.push({ time: new Date(c.created_at).toLocaleDateString(), text: `Campaign "${c.name}" created`, type: 'campaign' });
      });
      if (data.customer.last_campaign_run) {
        feed.unshift({ time: new Date(data.customer.last_campaign_run).toLocaleDateString(), text: 'Autonomous search executed', type: 'search' });
      }
      setActivityFeed(feed);
    } else {
      navigate('gtm-service'); return;
    }
    setLoading(false);
  };

  const handleUpdateICP = async () => {
    if (!icpInput.trim()) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('gtm_customers')
          .update({ icp_description: icpInput.trim(), daily_budget: dailyBudget })
          .eq('user_id', session.user.id);
        setCustomer(prev => prev ? { ...prev, icp_description: icpInput.trim(), daily_budget: dailyBudget } : prev);
        addActivity('Target audience updated', 'system');
        showToast('Target audience saved successfully');
      }
    } catch (err) { handleAgentError(err); }
    setSaving(false);
  };

  const handleSearchProspects = async () => {
    if (!icpInput.trim() || !isProvisioned) return;
    setSearching(true);
    try {
      const endpoint = searchType === 'companies' ? '/search/companies' : '/search/people';
      const result = await callExpleeProxy(endpoint, 'POST', {
        query: icpInput.trim(), limit: dailyBudget, filters: { icp: icpInput.trim() },
      });

      const runId = result?.data?.run_id || result?.data?.id || `search_${Date.now()}`;
      const immediateResults = result?.data?.results || result?.data?.prospects;
      if (Array.isArray(immediateResults) && immediateResults.length > 0) {
        const mapped: Prospect[] = immediateResults.map((r: Record<string, unknown>) => ({
          id: (r.id as string) || undefined,
          name: (r.full_name as string) || (r.name as string) || 'Unknown',
          company: (r.company_name as string) || (r.company as string) || (r.organization as string) || '',
          email: (r.email as string) || (r.work_email as string) || '',
          title: (r.title as string) || (r.job_title as string) || '',
          status: 'new', personalized: false, sequence_status: 'none',
        }));
        setProspects(prev => [...mapped, ...prev]);
        setStats(prev => ({ ...prev, prospectsFound: prev.prospectsFound + mapped.length }));
        addActivity(`Found ${mapped.length} prospects via ${searchType} search`, 'search');
      } else {
        setActiveRuns(prev => [...prev, { id: runId, type: 'search', status: 'running', progress: 0, started_at: new Date().toISOString() }]);
        addActivity(`Prospect search started (${searchType})`, 'search');
      }
    } catch (err) { handleAgentError(err); }
    setSearching(false);
  };

  const handleRunPersonalization = async () => {
    if (prospects.length === 0 || !isProvisioned) return;
    setPersonalizing(true);
    try {
      const batch = prospects.filter(p => !p.personalized).slice(0, 50);
      const result = await callExpleeProxy('/agents/personalize', 'POST', {
        prospect_ids: batch.map(p => p.id || p.email),
        prospects: batch.map(p => ({ name: p.name, company: p.company, email: p.email, title: p.title })),
        depth: 'deep',
      });

      const runId = result?.data?.run_id || result?.data?.id || `pers_${Date.now()}`;
      const immediateResults = result?.data?.personalized || result?.data?.results;
      if (Array.isArray(immediateResults) && immediateResults.length > 0) {
        setProspects(prev => prev.map(p => {
          const match = immediateResults.find((r: Record<string, unknown>) =>
            (r.email as string) === p.email || (r.id as string) === p.id
          );
          return match ? { ...p, personalized: true, status: 'researched' } : p;
        }));
        addActivity(`Personalization complete for ${immediateResults.length} prospects`, 'system');
      } else {
        setActiveRuns(prev => [...prev, { id: runId, type: 'personalize', status: 'running', progress: 0, started_at: new Date().toISOString() }]);
        addActivity('Deep personalization agent started', 'system');
      }
    } catch (err) { handleAgentError(err); }
    setPersonalizing(false);
  };

  const handleLaunchSequence = async () => {
    const eligible = prospects.filter(p => p.personalized && p.sequence_status !== 'active');
    if (eligible.length === 0 || !isProvisioned) return;
    setLaunchingSequence(true);
    try {
      const result = await callExpleeProxy('/sequences/launch', 'POST', {
        prospects: eligible.slice(0, dailyBudget).map(p => ({ name: p.name, company: p.company, email: p.email, title: p.title })),
        follow_ups: 3, delay_days: 2, icp: icpInput.trim(),
      });

      const runId = result?.data?.run_id || result?.data?.id || `seq_${Date.now()}`;
      if (result?.data?.status === 'active' || result?.data?.launched) {
        const count = eligible.slice(0, dailyBudget).length;
        setProspects(prev => prev.map(p => eligible.some(e => e.email === p.email) ? { ...p, sequence_status: 'active', status: 'contacted' } : p));
        setStats(prev => ({ ...prev, emailsSentToday: prev.emailsSentToday + count }));
        addActivity(`Email sequence launched for ${count} prospects`, 'campaign');
        showToast(`Sequence launched for ${count} prospects with 3 follow-ups`);

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: newCampaign } = await supabase.from('gtm_campaigns')
            .insert({ user_id: session.user.id, name: `Sequence ${campaigns.length + 1}`, icp_definition: icpInput.trim(), status: 'active', explee_run_id: runId, prospects_found: eligible.length, emails_sent: count })
            .select().single();
          if (newCampaign) setCampaigns(prev => [newCampaign, ...prev]);
        }
      } else {
        setActiveRuns(prev => [...prev, { id: runId, type: 'sequence', status: 'running', progress: 0, started_at: new Date().toISOString() }]);
        addActivity('Email sequence queued for launch', 'campaign');
      }
    } catch (err) { handleAgentError(err); }
    setLaunchingSequence(false);
  };

  const handleLaunchCampaign = async () => {
    if (!icpInput.trim()) return;
    setLaunching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const result = await callExpleeProxy('/campaigns', 'POST', { icp: icpInput.trim(), daily_budget: dailyBudget, mode: 'autonomous' });
      const runId = result?.data?.id || result?.data?.run_id || null;

      const { data: newCampaign } = await supabase.from('gtm_campaigns')
        .insert({ user_id: session.user.id, name: `Autonomous Campaign ${campaigns.length + 1}`, icp_definition: icpInput.trim(), status: 'active', explee_run_id: runId, prospects_found: 0, emails_sent: 0 })
        .select().single();
      if (newCampaign) setCampaigns(prev => [newCampaign, ...prev]);

      await supabase.from('gtm_customers').update({ last_campaign_run: new Date().toISOString() }).eq('user_id', session.user.id);
      if (runId) setActiveRuns(prev => [...prev, { id: runId, type: 'search', status: 'running', progress: 0, started_at: new Date().toISOString() }]);
      addActivity('Autonomous campaign launched', 'campaign');
      showToast('Autonomous campaign launched!');
    } catch (err) { handleAgentError(err); }
    setLaunching(false);
  };

  const handleConnectApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    setConnectingKey(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/provision-explee`,
        { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ tier: 'starter', explee_api_key: apiKeyInput.trim(), icp_description: icpInput || undefined }) }
      );
      if (res.ok) {
        setCustomer(prev => prev ? { ...prev, explee_api_key: apiKeyInput.trim(), explee_status: 'active' } : prev);
        setApiKeyInput('');
        addActivity('Explee API key connected', 'system');
        showToast('API key connected successfully');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to connect API key', 'error');
      }
    } catch (err) { handleAgentError(err); }
    setConnectingKey(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('gtm-service');
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-7 h-7 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading workspace...</p>
      </div>
    );
  }

  if (!customer) return null;

  const isProvisioned = customer.explee_status === 'active' && !!customer.explee_api_key;
  const costEstimate = (dailyBudget * 0.03).toFixed(2);
  const hasRunningJobs = activeRuns.some(r => r.status === 'running');
  const unpersonalizedCount = prospects.filter(p => !p.personalized).length;
  const readyForSequence = prospects.filter(p => p.personalized && p.sequence_status !== 'active').length;
  const lowCredits = customer.credits_remaining < 100;

  const sidebarItems: Array<{ key: SidebarTab; label: string; icon: typeof Target; badge?: number }> = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'prospects', label: 'Prospects', icon: Users, badge: prospects.length || undefined },
    { key: 'campaigns', label: 'Campaigns', icon: Zap, badge: campaigns.length || undefined },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-gray-200 bg-white pt-6 pb-4 px-3 fixed top-16 bottom-0 left-0 z-30">
        <div className="px-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">autoGTM</p>
              <p className="text-[11px] text-gray-400">Workspace</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button key={item.key} onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        {hasRunningJobs && (
          <div className="mx-2 mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
              <span className="text-[11px] font-semibold text-blue-700">{activeRuns.filter(r => r.status === 'running').length} agent(s) running</span>
            </div>
            {activeRuns.filter(r => r.status === 'running').map(run => (
              <div key={run.id} className="flex items-center gap-2 text-[10px] text-blue-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                {run.type === 'search' ? 'Searching' : run.type === 'personalize' ? 'Personalizing' : 'Sequencing'}
                {run.progress ? ` (${run.progress}%)` : ''}
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 mt-2 px-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{customer.full_name}</p>
              <p className="text-[10px] text-gray-400 truncate">{customer.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
            <LogOut className="w-3.5 h-3.5" />Sign Out
          </button>
        </div>

        {/* Powered by Explee */}
        <div className="mt-3 px-3 pt-3 border-t border-gray-100">
          <a href="https://explee.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-gray-500 transition-colors">
            <Zap className="w-3 h-3" />
            Powered by Explee
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex safe-area-bottom">
        {sidebarItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main */}
      <main className="flex-1 md:ml-60 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6 max-w-5xl">
        {/* Toast */}
        {toast && (
          <div className={`mb-5 flex items-center gap-3 rounded-xl px-4 py-3 border animate-scale-in ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
            toast.type === 'error' ? 'bg-red-50 border-red-200' :
            'bg-amber-50 border-amber-200'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            <p className={`text-sm font-medium flex-1 ${toast.type === 'success' ? 'text-emerald-800' : toast.type === 'error' ? 'text-red-800' : 'text-amber-800'}`}>{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
          </div>
        )}

        {/* Credit warning */}
        {lowCredits && customer.credits_remaining > 0 && (
          <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">Low credits: <span className="font-bold">{customer.credits_remaining}</span> remaining. Consider upgrading to avoid interruption.</p>
          </div>
        )}
        {customer.credits_remaining <= 0 && (
          <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm text-red-800 font-medium">No credits remaining. Agent actions are paused until you upgrade.</p>
          </div>
        )}

        {/* API Key Banner */}
        {!isProvisioned && (
          <div className="mb-5 bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 mb-1">Connect Your Explee API Key</h3>
                <p className="text-xs text-gray-500 mb-3">Enter your Explee key to activate autonomous prospecting agents.</p>
                <div className="flex gap-2">
                  <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder="expl_xxxxxxxxxxxxxxxx"
                    className="flex-1 max-w-sm px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <button onClick={handleConnectApiKey} disabled={connectingKey || !apiKeyInput.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">
                    {connectingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== DASHBOARD ===== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">Welcome back, {customer.full_name.split(' ')[0]}</h1>
                <p className="text-sm text-gray-500 mt-0.5">Your autonomous sales pipeline</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                isProvisioned ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isProvisioned ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                {isProvisioned ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={<Search className="w-4 h-4" />} iconBg="bg-blue-50 text-blue-600" label="Prospects" value={stats.prospectsFound.toLocaleString()} sub="Total discovered" />
              <StatCard icon={<Send className="w-4 h-4" />} iconBg="bg-emerald-50 text-emerald-600" label="Emails Sent" value={stats.emailsSentToday.toLocaleString()} sub="All time" />
              <StatCard icon={<TrendingUp className="w-4 h-4" />} iconBg="bg-teal-50 text-teal-600" label="Deliverability" value={`${stats.deliverability}%`} sub="Last 30 days" />
            </div>

            {/* ICP Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />Target Audience (ICP)
              </h2>
              <p className="text-xs text-gray-500 mb-4">Describe your ideal customer. AI agents will find and engage matching prospects.</p>
              <textarea value={icpInput} onChange={e => setIcpInput(e.target.value)}
                placeholder='e.g. "B2B SaaS companies, 10-200 employees, VP Sales or Head of Growth"'
                rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Daily Budget</label>
                  <span className="text-sm font-bold text-blue-600">{dailyBudget} emails/day <span className="text-gray-400 font-normal">(~${costEstimate}/day)</span></span>
                </div>
                <input type="range" min={5} max={500} step={5} value={dailyBudget} onChange={e => setDailyBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow" />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>5/day</span><span>500/day</span></div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
                <button onClick={handleUpdateICP} disabled={saving || !icpInput.trim()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}Save Audience
                </button>
                <button onClick={handleLaunchCampaign} disabled={launching || !icpInput.trim() || !isProvisioned || customer.credits_remaining <= 0}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all shadow-sm">
                  {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}Launch Autonomous Campaign
                </button>
              </div>
              {!isProvisioned && <p className="text-[11px] text-amber-600 mt-2">Connect your API key above to use agents.</p>}
            </div>

            {/* Agent Actions */}
            {isProvisioned && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />Agent Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <AgentCard icon={<Search className="w-4 h-4" />} color="blue" title="Search Prospects" desc="Find companies and people matching your ICP.">
                    <div className="flex gap-1 mb-3">
                      {(['people', 'companies'] as const).map(t => (
                        <button key={t} onClick={() => setSearchType(t)}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-md capitalize transition-colors ${searchType === t ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>{t}</button>
                      ))}
                    </div>
                    <button onClick={handleSearchProspects} disabled={searching || !icpInput.trim() || customer.credits_remaining <= 0}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                      {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}Search
                    </button>
                  </AgentCard>

                  <AgentCard icon={<Sparkles className="w-4 h-4" />} color="violet" title="Personalize" desc="Deep research for custom messaging.">
                    {unpersonalizedCount > 0 && <p className="text-[10px] text-gray-500 mb-2"><span className="font-bold text-violet-600">{unpersonalizedCount}</span> awaiting research</p>}
                    <button onClick={handleRunPersonalization} disabled={personalizing || unpersonalizedCount === 0 || customer.credits_remaining <= 0}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                      {personalizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}Personalize
                    </button>
                  </AgentCard>

                  <AgentCard icon={<Send className="w-4 h-4" />} color="emerald" title="Launch Sequence" desc="Auto-send with 3 follow-ups, 2 days apart.">
                    {readyForSequence > 0 && <p className="text-[10px] text-gray-500 mb-2"><span className="font-bold text-emerald-600">{readyForSequence}</span> ready for outreach</p>}
                    <button onClick={handleLaunchSequence} disabled={launchingSequence || readyForSequence === 0 || customer.credits_remaining <= 0}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                      {launchingSequence ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}Launch
                    </button>
                  </AgentCard>
                </div>
              </div>
            )}

            {/* Active Runs */}
            {activeRuns.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 text-blue-600 ${hasRunningJobs ? 'animate-spin' : ''}`} />Active Runs
                </h3>
                <div className="space-y-2">
                  {activeRuns.map(run => (
                    <div key={run.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className={`w-2 h-2 rounded-full ${run.status === 'running' ? 'bg-blue-500 animate-pulse' : run.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-700 capitalize">{run.type}</span>
                        {run.result_count !== undefined && <span className="text-[10px] text-gray-400 ml-2">{run.result_count} results</span>}
                      </div>
                      {run.progress !== undefined && run.status === 'running' && (
                        <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${run.progress}%` }} /></div>
                      )}
                      <RunStatusBadge status={run.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" />Activity</h3>
              {activityFeed.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No activity yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {activityFeed.slice(0, 10).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.type === 'campaign' ? 'bg-blue-50' : item.type === 'search' ? 'bg-teal-50' : 'bg-gray-50'}`}>
                        {item.type === 'campaign' && <Zap className="w-3 h-3 text-blue-600" />}
                        {item.type === 'search' && <Search className="w-3 h-3 text-teal-600" />}
                        {item.type === 'system' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      </div>
                      <p className="text-xs text-gray-600 flex-1 min-w-0 truncate">{item.text}</p>
                      <span className="text-[10px] text-gray-400 shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== PROSPECTS ===== */}
        {activeTab === 'prospects' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-xl font-black text-gray-900">Prospects</h1>
              <div className="flex items-center gap-2">
                {isProvisioned && (
                  <button onClick={handleSearchProspects} disabled={searching || !icpInput.trim() || customer.credits_remaining <= 0}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                    {searching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}Search More
                  </button>
                )}
                <span className="text-xs text-gray-400">{prospects.length} total</span>
              </div>
            </div>

            {prospects.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-700 mb-1">No prospects yet</h3>
                <p className="text-xs text-gray-400 mb-4">Use Search Prospects to discover leads matching your ICP.</p>
                <button onClick={() => setActiveTab('dashboard')} className="text-blue-600 text-sm font-semibold hover:text-blue-500">Go to Dashboard</button>
              </div>
            ) : (
              <>
                {isProvisioned && (unpersonalizedCount > 0 || readyForSequence > 0) && (
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    {unpersonalizedCount > 0 && (
                      <button onClick={handleRunPersonalization} disabled={personalizing || customer.credits_remaining <= 0}
                        className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                        {personalizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}Personalize {unpersonalizedCount}
                      </button>
                    )}
                    {readyForSequence > 0 && (
                      <button onClick={handleLaunchSequence} disabled={launchingSequence || customer.credits_remaining <= 0}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                        {launchingSequence ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}Sequence {readyForSequence}
                      </button>
                    )}
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                    <span className="text-[10px] text-gray-400">Pipeline: Search &rarr; Personalize &rarr; Sequence</span>
                  </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Name</th>
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Company</th>
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Email</th>
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Pipeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {prospects.map((p, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-3.5 h-3.5 text-gray-400" /></div>
                                <div><span className="text-sm text-gray-900 font-medium">{p.name}</span>{p.title && <p className="text-[10px] text-gray-400">{p.title}</p>}</div>
                              </div>
                            </td>
                            <td className="px-5 py-3"><div className="flex items-center gap-1.5"><Building2 className="w-3 h-3 text-gray-300" /><span className="text-sm text-gray-600">{p.company}</span></div></td>
                            <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">{p.email || '-'}</td>
                            <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-5 py-3"><PipelineBadges personalized={!!p.personalized} sequenceStatus={p.sequence_status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== CAMPAIGNS ===== */}
        {activeTab === 'campaigns' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-gray-900">Campaigns</h1>
              <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-500">
                <Play className="w-3 h-3" />New Campaign
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
                <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-700 mb-1">No campaigns yet</h3>
                <p className="text-xs text-gray-400 mb-4">Define your ICP and launch your first campaign.</p>
                <button onClick={() => setActiveTab('dashboard')} className="text-blue-600 text-sm font-semibold hover:text-blue-500">Go to Dashboard</button>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-gray-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{campaign.name}</h3>
                          <CampaignStatusBadge status={campaign.status} />
                        </div>
                        <p className="text-xs text-gray-400 truncate">{campaign.icp_definition || 'No ICP'}</p>
                      </div>
                      <div className="flex items-center gap-5 text-xs">
                        <div className="text-center"><p className="text-gray-400">Prospects</p><p className="font-bold text-gray-700">{campaign.prospects_found || 0}</p></div>
                        <div className="text-center"><p className="text-gray-400">Emails</p><p className="font-bold text-gray-700">{campaign.emails_sent || 0}</p></div>
                        <div className="text-center"><p className="text-gray-400">Created</p><p className="font-bold text-gray-700">{new Date(campaign.created_at).toLocaleDateString()}</p></div>
                      </div>
                    </div>
                    {campaign.explee_run_id && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-300" />
                        <span className="text-[10px] text-gray-400 font-mono">Run: {campaign.explee_run_id}</span>
                        {activeRuns.find(r => r.id === campaign.explee_run_id)?.status === 'running' && (
                          <span className="flex items-center gap-1 text-[10px] text-blue-600"><Loader2 className="w-2.5 h-2.5 animate-spin" /> Running</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <h1 className="text-xl font-black text-gray-900">Settings</h1>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-blue-600" />Explee API</h3>
              <div className="space-y-2">
                <SettingsRow label="Status" value={isProvisioned ? 'Active' : 'Not Connected'} valueClass={isProvisioned ? 'text-emerald-600' : 'text-amber-600'} />
                {customer.explee_customer_id && <SettingsRow label="Customer ID" value={customer.explee_customer_id} mono />}
                <SettingsRow label="API Key" value={customer.explee_api_key ? `${customer.explee_api_key.slice(0, 8)}...` : 'Not set'} mono />
              </div>
              {!isProvisioned && (
                <div className="mt-4 flex gap-2">
                  <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder="expl_xxxxxxxxxxxxxxxx"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={handleConnectApiKey} disabled={connectingKey || !apiKeyInput.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors">
                    {connectingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}Save
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-blue-600" />Account</h3>
              <div className="space-y-2">
                <SettingsRow label="Name" value={customer.full_name} />
                <SettingsRow label="Email" value={customer.email} />
                <SettingsRow label="Credits" value={customer.credits_remaining.toLocaleString()} valueClass={lowCredits ? 'text-amber-600 font-bold' : 'text-blue-600 font-bold'} />
                <SettingsRow label="Daily Budget" value={`${customer.daily_budget} emails/day`} />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" />Notifications</h3>
              <div className="space-y-2">
                <ToggleRow label="Email when meetings are booked" defaultOn />
                <ToggleRow label="Weekly performance reports" defaultOn />
                <ToggleRow label="Alert when credits are low" defaultOn />
                <ToggleRow label="Campaign paused alerts" defaultOn={false} />
              </div>
            </div>
          </div>
        )}

        {/* Powered by Explee (mobile footer) */}
        <div className="md:hidden mt-8 text-center">
          <a href="https://explee.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-500 transition-colors">
            <Zap className="w-3 h-3" />Powered by Explee<ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, sub }: { icon: React.ReactNode; iconBg: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
      <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function AgentCard({ icon, color, title, desc, children }: { icon: React.ReactNode; color: string; title: string; desc: string; children: React.ReactNode }) {
  const iconBg = color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'violet' ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600';
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded flex items-center justify-center ${iconBg}`}>{icon}</div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-[11px] text-gray-500 mb-3">{desc}</p>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    contacted: 'bg-blue-50 text-blue-700 border-blue-200',
    replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bounced: 'bg-red-50 text-red-700 border-red-200',
    researched: 'bg-violet-50 text-violet-700 border-violet-200',
    new: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  return <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status] || styles.new}`}>{status.toUpperCase()}</span>;
}

function PipelineBadges({ personalized, sequenceStatus }: { personalized: boolean; sequenceStatus?: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-5 h-5 rounded flex items-center justify-center ${personalized ? 'bg-violet-50' : 'bg-gray-50'}`}>
        <Sparkles className={`w-2.5 h-2.5 ${personalized ? 'text-violet-500' : 'text-gray-300'}`} />
      </span>
      <span className={`w-5 h-5 rounded flex items-center justify-center ${sequenceStatus === 'active' ? 'bg-emerald-50' : 'bg-gray-50'}`}>
        <Send className={`w-2.5 h-2.5 ${sequenceStatus === 'active' ? 'text-emerald-500' : 'text-gray-300'}`} />
      </span>
    </div>
  );
}

function CampaignStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    paused: 'bg-amber-50 text-amber-700 border-amber-200',
    draft: 'bg-gray-50 text-gray-600 border-gray-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };
  return <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status] || styles.draft}`}>{status.toUpperCase()}</span>;
}

function RunStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    running: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };
  return <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border ${styles[status] || styles.running}`}>{status.toUpperCase()}</span>;
}

function SettingsRow({ label, value, mono, valueClass }: { label: string; value: string; mono?: boolean; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs ${mono ? 'font-mono' : 'font-medium'} ${valueClass || 'text-gray-700'}`}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-xs text-gray-700">{label}</span>
      <button onClick={() => setOn(!on)} className={`w-9 h-5 rounded-full relative transition-colors ${on ? 'bg-blue-600' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
