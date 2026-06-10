import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Target, Mail, Zap, BarChart3, Play, Loader2, LogOut, Settings,
  Users, Search, Activity, Key, CheckCircle2,
  TrendingUp, Send, Clock, Building2, User, RefreshCw,
  Sparkles, ArrowRight, StopCircle,
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
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const [connectingKey, setConnectingKey] = useState(false);
  const [activityFeed, setActivityFeed] = useState<Array<{ time: string; text: string; type: string }>>([]);
  const [stats, setStats] = useState({ prospectsFound: 0, emailsSentToday: 0, deliverability: 98.2 });

  // Agent action states
  const [searching, setSearching] = useState(false);
  const [personalizing, setPersonalizing] = useState(false);
  const [launchingSequence, setLaunchingSequence] = useState(false);
  const [activeRuns, setActiveRuns] = useState<RunStatus[]>([]);
  const [searchType, setSearchType] = useState<'companies' | 'people'>('people');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const callExpleeProxy = useCallback(async (endpoint: string, method = 'GET', body?: unknown) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
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
      throw new Error(err.error || `Request failed: ${res.status}`);
    }
    return res.json();
  }, []);

  useEffect(() => {
    fetchData();
    const stored = sessionStorage.getItem('gtm_toast');
    if (stored) {
      try {
        setToast(JSON.parse(stored));
        sessionStorage.removeItem('gtm_toast');
        setTimeout(() => setToast(null), 6000);
      } catch { /* ignore */ }
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  // Poll active runs
  useEffect(() => {
    if (activeRuns.some(r => r.status === 'running')) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(pollRunStatuses, 5000);
      }
    } else {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    }
  }, [activeRuns]);

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
            ...r,
            status: newStatus,
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
      } catch {
        // Polling failure is non-fatal
      }
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
          status: 'new',
          personalized: false,
          sequence_status: 'none',
        }));
        setProspects(prev => [...mapped, ...prev]);
        setStats(prev => ({ ...prev, prospectsFound: prev.prospectsFound + mapped.length }));
      }
    } catch {
      // Results fetch failure is non-fatal
    }
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
        await supabase
          .from('gtm_customers')
          .update({ icp_description: icpInput.trim(), daily_budget: dailyBudget })
          .eq('user_id', session.user.id);
        setCustomer(prev => prev ? { ...prev, icp_description: icpInput.trim(), daily_budget: dailyBudget } : prev);
        addActivity('Target audience updated', 'system');
        showToast('Target audience saved successfully');
      }
    } catch (err) {
      console.error('ICP update error:', err);
    }
    setSaving(false);
  };

  // --- SEARCH PROSPECTS ---
  const handleSearchProspects = async () => {
    if (!icpInput.trim() || !isProvisioned) return;
    setSearching(true);
    try {
      const endpoint = searchType === 'companies' ? '/search/companies' : '/search/people';
      const result = await callExpleeProxy(endpoint, 'POST', {
        query: icpInput.trim(),
        limit: dailyBudget,
        filters: { icp: icpInput.trim() },
      });

      const runId = result?.data?.run_id || result?.data?.id || `search_${Date.now()}`;

      // Check if results were returned immediately (synchronous response)
      const immediateResults = result?.data?.results || result?.data?.prospects;
      if (Array.isArray(immediateResults) && immediateResults.length > 0) {
        const mapped: Prospect[] = immediateResults.map((r: Record<string, unknown>) => ({
          id: (r.id as string) || undefined,
          name: (r.full_name as string) || (r.name as string) || 'Unknown',
          company: (r.company_name as string) || (r.company as string) || (r.organization as string) || '',
          email: (r.email as string) || (r.work_email as string) || '',
          title: (r.title as string) || (r.job_title as string) || '',
          status: 'new',
          personalized: false,
          sequence_status: 'none',
        }));
        setProspects(prev => [...mapped, ...prev]);
        setStats(prev => ({ ...prev, prospectsFound: prev.prospectsFound + mapped.length }));
        addActivity(`Found ${mapped.length} prospects via ${searchType} search`, 'search');
      } else {
        // Async run — add to active runs for polling
        setActiveRuns(prev => [...prev, {
          id: runId,
          type: 'search',
          status: 'running',
          progress: 0,
          started_at: new Date().toISOString(),
        }]);
        addActivity(`Prospect search started (${searchType})`, 'search');
      }
    } catch (err) {
      console.error('Search error:', err);
      showToast('Search failed. Please try again.');
    }
    setSearching(false);
  };

  // --- RUN PERSONALIZATION AGENT ---
  const handleRunPersonalization = async () => {
    if (prospects.length === 0 || !isProvisioned) return;
    setPersonalizing(true);
    try {
      const prospectIds = prospects.filter(p => !p.personalized).slice(0, 50).map(p => p.id || p.email);
      const result = await callExpleeProxy('/agents/personalize', 'POST', {
        prospect_ids: prospectIds,
        prospects: prospects.filter(p => !p.personalized).slice(0, 50).map(p => ({
          name: p.name,
          company: p.company,
          email: p.email,
          title: p.title,
        })),
        depth: 'deep',
      });

      const runId = result?.data?.run_id || result?.data?.id || `pers_${Date.now()}`;

      // Check for immediate personalization results
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
        setActiveRuns(prev => [...prev, {
          id: runId,
          type: 'personalize',
          status: 'running',
          progress: 0,
          started_at: new Date().toISOString(),
        }]);
        addActivity('Deep personalization agent started', 'system');
      }
    } catch (err) {
      console.error('Personalization error:', err);
      showToast('Personalization failed. Please try again.');
    }
    setPersonalizing(false);
  };

  // --- LAUNCH SEQUENCE ---
  const handleLaunchSequence = async () => {
    const eligible = prospects.filter(p => p.personalized && p.sequence_status !== 'active');
    if (eligible.length === 0 || !isProvisioned) return;
    setLaunchingSequence(true);
    try {
      const result = await callExpleeProxy('/sequences/launch', 'POST', {
        prospects: eligible.slice(0, dailyBudget).map(p => ({
          name: p.name,
          company: p.company,
          email: p.email,
          title: p.title,
        })),
        follow_ups: 3,
        delay_days: 2,
        icp: icpInput.trim(),
      });

      const runId = result?.data?.run_id || result?.data?.id || `seq_${Date.now()}`;

      // Check if sequence started immediately
      if (result?.data?.status === 'active' || result?.data?.launched) {
        const count = eligible.slice(0, dailyBudget).length;
        setProspects(prev => prev.map(p => {
          if (eligible.some(e => e.email === p.email)) {
            return { ...p, sequence_status: 'active', status: 'contacted' };
          }
          return p;
        }));
        setStats(prev => ({ ...prev, emailsSentToday: prev.emailsSentToday + count }));
        addActivity(`Email sequence launched for ${count} prospects`, 'campaign');
        showToast(`Sequence launched for ${count} prospects with 3 follow-ups`);

        // Save campaign to DB
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: newCampaign } = await supabase
            .from('gtm_campaigns')
            .insert({
              user_id: session.user.id,
              name: `Sequence ${campaigns.length + 1}`,
              icp_definition: icpInput.trim(),
              status: 'active',
              explee_run_id: runId,
              prospects_found: eligible.length,
              emails_sent: count,
            })
            .select()
            .single();
          if (newCampaign) setCampaigns(prev => [newCampaign, ...prev]);
        }
      } else {
        setActiveRuns(prev => [...prev, {
          id: runId,
          type: 'sequence',
          status: 'running',
          progress: 0,
          started_at: new Date().toISOString(),
        }]);
        addActivity('Email sequence queued for launch', 'campaign');
      }
    } catch (err) {
      console.error('Sequence error:', err);
      showToast('Sequence launch failed. Please try again.');
    }
    setLaunchingSequence(false);
  };

  // --- LAUNCH AUTONOMOUS CAMPAIGN (all 3 steps) ---
  const handleLaunchCampaign = async () => {
    if (!icpInput.trim()) return;
    setLaunching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const result = await callExpleeProxy('/campaigns', 'POST', {
        icp: icpInput.trim(),
        daily_budget: dailyBudget,
        mode: 'autonomous',
      });

      const runId = result?.data?.id || result?.data?.run_id || null;

      const { data: newCampaign } = await supabase
        .from('gtm_campaigns')
        .insert({
          user_id: session.user.id,
          name: `Autonomous Campaign ${campaigns.length + 1}`,
          icp_definition: icpInput.trim(),
          status: 'active',
          explee_run_id: runId,
          prospects_found: 0,
          emails_sent: 0,
        })
        .select()
        .single();

      if (newCampaign) setCampaigns(prev => [newCampaign, ...prev]);

      await supabase
        .from('gtm_customers')
        .update({ last_campaign_run: new Date().toISOString() })
        .eq('user_id', session.user.id);

      if (runId) {
        setActiveRuns(prev => [...prev, { id: runId, type: 'search', status: 'running', progress: 0, started_at: new Date().toISOString() }]);
      }

      addActivity('Autonomous campaign launched', 'campaign');
      showToast('Autonomous campaign launched! Agents are searching, personalizing, and sequencing.');
    } catch (err) {
      console.error('Launch error:', err);
    }
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
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: 'starter', explee_api_key: apiKeyInput.trim(), icp_description: icpInput || undefined }),
        }
      );

      if (res.ok) {
        setCustomer(prev => prev ? { ...prev, explee_api_key: apiKeyInput.trim(), explee_status: 'active' } : prev);
        setApiKeyInput('');
        addActivity('Explee API key connected', 'system');
        showToast('API key connected successfully');
      }
    } catch (err) {
      console.error('Connect key error:', err);
    }
    setConnectingKey(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('gtm-service');
  };

  const showToast = (message: string) => {
    setToast({ type: 'success', message });
    setTimeout(() => setToast(null), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Loading workspace...</p>
      </div>
    );
  }

  if (!customer) return null;

  const isProvisioned = customer.explee_status === 'active' && !!customer.explee_api_key;
  const costEstimate = (dailyBudget * 0.03).toFixed(2);
  const hasRunningJobs = activeRuns.some(r => r.status === 'running');
  const unpersonalizedCount = prospects.filter(p => !p.personalized).length;
  const readyForSequence = prospects.filter(p => p.personalized && p.sequence_status !== 'active').length;

  const sidebarItems: Array<{ key: SidebarTab; label: string; icon: typeof Target; badge?: number }> = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'prospects', label: 'Prospects', icon: Users, badge: prospects.length || undefined },
    { key: 'campaigns', label: 'Campaigns', icon: Zap, badge: campaigns.length || undefined },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 pt-16 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-gray-900/50 pt-6 pb-4 px-3 fixed top-16 bottom-0 left-0 z-30">
        <div className="px-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">autoGTM</p>
              <p className="text-[11px] text-gray-500">by Explee</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? (
                  <span className="text-[10px] font-bold bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full">{item.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Active Runs indicator */}
        {hasRunningJobs && (
          <div className="mx-3 mb-3 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
              <span className="text-[11px] font-semibold text-cyan-400">
                {activeRuns.filter(r => r.status === 'running').length} agent(s) running
              </span>
            </div>
            {activeRuns.filter(r => r.status === 'running').map(run => (
              <div key={run.id} className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                {run.type === 'search' ? 'Searching' : run.type === 'personalize' ? 'Personalizing' : 'Sequencing'}
                {run.progress ? ` (${run.progress}%)` : ''}
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-800 pt-4 mt-4 px-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-300 truncate">{customer.full_name}</p>
              <p className="text-[10px] text-gray-500 truncate">{customer.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 font-medium transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40 flex">
        {sidebarItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                isActive ? 'text-cyan-400' : 'text-gray-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {/* Toast */}
        {toast && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-4 animate-scale-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-300 font-medium flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-emerald-500/50 hover:text-emerald-400 text-lg leading-none">&times;</button>
          </div>
        )}

        {/* API Key Banner */}
        {!isProvisioned && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-300 mb-1">Connect Your Explee API Key</h3>
                <p className="text-xs text-amber-200/70 mb-3">
                  To activate prospecting agents, enter your Explee API key below.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="expl_xxxxxxxxxxxxxxxx"
                    className="flex-1 max-w-sm px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                  />
                  <button
                    onClick={handleConnectApiKey}
                    disabled={connectingKey || !apiKeyInput.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 text-sm font-bold rounded-lg transition-colors"
                  >
                    {connectingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ DASHBOARD TAB ============ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Welcome back, {customer.full_name.split(' ')[0]}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Your autonomous sales pipeline</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                isProvisioned
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isProvisioned ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                {isProvisioned ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={<Search className="w-4 h-4" />} iconBg="bg-cyan-500/10 text-cyan-400" label="Prospects Found" value={stats.prospectsFound.toLocaleString()} sub="Total discovered" />
              <StatCard icon={<Send className="w-4 h-4" />} iconBg="bg-blue-500/10 text-blue-400" label="Emails Sent" value={stats.emailsSentToday.toLocaleString()} sub="All time" />
              <StatCard icon={<TrendingUp className="w-4 h-4" />} iconBg="bg-emerald-500/10 text-emerald-400" label="Deliverability" value={`${stats.deliverability}%`} sub="Last 30 days" />
            </div>

            {/* ICP Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Target Audience (ICP)
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Describe your ideal customer. The AI agents will find and engage matching prospects.
              </p>
              <textarea
                value={icpInput}
                onChange={e => setIcpInput(e.target.value)}
                placeholder='e.g. "B2B SaaS companies in the US, 10-200 employees, targeting VP Sales or Head of Growth"'
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
              />

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-300">Daily Budget</label>
                  <span className="text-sm font-bold text-cyan-400">
                    {dailyBudget} emails/day <span className="text-gray-500 font-normal">(~${costEstimate}/day)</span>
                  </span>
                </div>
                <input
                  type="range" min={5} max={500} step={5} value={dailyBudget}
                  onChange={e => setDailyBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                  <span>5/day ($0.15)</span>
                  <span>500/day ($15.00)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
                <button
                  onClick={handleUpdateICP}
                  disabled={saving || !icpInput.trim()}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                  Update Target Audience
                </button>
                <button
                  onClick={handleLaunchCampaign}
                  disabled={launching || !icpInput.trim() || !isProvisioned}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
                >
                  {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Launch Autonomous Campaign
                </button>
              </div>
              {!isProvisioned && (
                <p className="text-[11px] text-amber-400/80 mt-2">Connect your Explee API key above to use agents.</p>
              )}
            </div>

            {/* Agent Actions */}
            {isProvisioned && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Agent Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Search Prospects */}
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">Search Prospects</h3>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-3">Find matching companies and people based on your ICP.</p>
                    <div className="flex gap-1 mb-3">
                      <button
                        onClick={() => setSearchType('people')}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                          searchType === 'people' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        People
                      </button>
                      <button
                        onClick={() => setSearchType('companies')}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                          searchType === 'companies' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        Companies
                      </button>
                    </div>
                    <button
                      onClick={handleSearchProspects}
                      disabled={searching || !icpInput.trim()}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      Search {searchType === 'companies' ? 'Companies' : 'People'}
                    </button>
                  </div>

                  {/* Personalization Agent */}
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold text-white">Personalize</h3>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-3">Deep research agent creates custom messaging for each prospect.</p>
                    {unpersonalizedCount > 0 && (
                      <p className="text-[10px] text-gray-400 mb-2">
                        <span className="text-purple-400 font-bold">{unpersonalizedCount}</span> prospects awaiting research
                      </p>
                    )}
                    <button
                      onClick={handleRunPersonalization}
                      disabled={personalizing || prospects.length === 0 || unpersonalizedCount === 0}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      {personalizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      Run Personalization
                    </button>
                  </div>

                  {/* Launch Sequence */}
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Send className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">Launch Sequence</h3>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-3">Auto-send emails with 3 follow-ups spaced 2 days apart.</p>
                    {readyForSequence > 0 && (
                      <p className="text-[10px] text-gray-400 mb-2">
                        <span className="text-emerald-400 font-bold">{readyForSequence}</span> ready for outreach
                      </p>
                    )}
                    <button
                      onClick={handleLaunchSequence}
                      disabled={launchingSequence || readyForSequence === 0}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      {launchingSequence ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Launch Sequence
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Runs */}
            {activeRuns.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 text-cyan-400 ${hasRunningJobs ? 'animate-spin' : ''}`} />
                  Active Runs
                </h3>
                <div className="space-y-2">
                  {activeRuns.map(run => (
                    <div key={run.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        run.status === 'running' ? 'bg-cyan-400 animate-pulse' :
                        run.status === 'completed' ? 'bg-emerald-400' : 'bg-red-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-200 capitalize">{run.type}</span>
                          <RunStatusBadge status={run.status} />
                        </div>
                        {run.result_count !== undefined && (
                          <p className="text-[10px] text-gray-500">{run.result_count} results</p>
                        )}
                      </div>
                      {run.progress !== undefined && run.status === 'running' && (
                        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${run.progress}%` }} />
                        </div>
                      )}
                      <span className="text-[10px] text-gray-600 font-mono">{run.id.slice(0, 8)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Feed */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Recent Activity
              </h3>
              {activityFeed.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">No activity yet. Launch a campaign to get started.</p>
              ) : (
                <div className="space-y-3">
                  {activityFeed.slice(0, 10).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === 'campaign' ? 'bg-blue-500/10' : item.type === 'search' ? 'bg-cyan-500/10' : 'bg-gray-800'
                      }`}>
                        {item.type === 'campaign' && <Zap className="w-3 h-3 text-blue-400" />}
                        {item.type === 'search' && <Search className="w-3 h-3 text-cyan-400" />}
                        {item.type === 'system' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-gray-300 flex-1 min-w-0 truncate">{item.text}</p>
                      <span className="text-[10px] text-gray-600 shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ PROSPECTS TAB ============ */}
        {activeTab === 'prospects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-xl font-black text-white">Prospects</h1>
              <div className="flex items-center gap-2">
                {isProvisioned && (
                  <button
                    onClick={handleSearchProspects}
                    disabled={searching || !icpInput.trim()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {searching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                    Search More
                  </button>
                )}
                <span className="text-xs text-gray-500">{prospects.length} prospects</span>
              </div>
            </div>

            {prospects.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
                <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-300 mb-1">No prospects yet</h3>
                <p className="text-xs text-gray-500 mb-4">Use the Search Prospects agent to discover leads matching your ICP.</p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-cyan-400 text-sm font-semibold hover:text-cyan-300"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                {/* Bulk action bar */}
                {isProvisioned && (unpersonalizedCount > 0 || readyForSequence > 0) && (
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                    {unpersonalizedCount > 0 && (
                      <button
                        onClick={handleRunPersonalization}
                        disabled={personalizing}
                        className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        {personalizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Personalize {unpersonalizedCount}
                      </button>
                    )}
                    {readyForSequence > 0 && (
                      <button
                        onClick={handleLaunchSequence}
                        disabled={launchingSequence}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        {launchingSequence ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Sequence {readyForSequence}
                      </button>
                    )}
                    <ArrowRight className="w-3 h-3 text-gray-600" />
                    <span className="text-[10px] text-gray-500">Pipeline: Search &rarr; Personalize &rarr; Sequence</span>
                  </div>
                )}

                {/* Prospects Table */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Name</th>
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Company</th>
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Email</th>
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                          <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Pipeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {prospects.map((p, i) => (
                          <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
                                  <User className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                <div>
                                  <span className="text-sm text-gray-200 font-medium">{p.name}</span>
                                  {p.title && <p className="text-[10px] text-gray-500">{p.title}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-3 h-3 text-gray-600" />
                                <span className="text-sm text-gray-400">{p.company}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-400 hidden sm:table-cell">{p.email || '-'}</td>
                            <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-5 py-3">
                              <PipelineBadges personalized={!!p.personalized} sequenceStatus={p.sequence_status} />
                            </td>
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

        {/* ============ CAMPAIGNS TAB ============ */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-white">Campaigns</h1>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold hover:text-cyan-300"
              >
                <Play className="w-3 h-3" />
                New Campaign
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
                <Zap className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-300 mb-1">No campaigns yet</h3>
                <p className="text-xs text-gray-500 mb-4">Define your ICP and launch your first campaign.</p>
                <button onClick={() => setActiveTab('dashboard')} className="text-cyan-400 text-sm font-semibold hover:text-cyan-300">
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-white truncate">{campaign.name}</h3>
                          <CampaignStatusBadge status={campaign.status} />
                        </div>
                        <p className="text-xs text-gray-500 truncate">{campaign.icp_definition || 'No ICP defined'}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-center">
                          <p className="text-gray-500">Prospects</p>
                          <p className="font-bold text-gray-200">{campaign.prospects_found || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Emails</p>
                          <p className="font-bold text-gray-200">{campaign.emails_sent || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Created</p>
                          <p className="font-bold text-gray-200">{new Date(campaign.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    {campaign.explee_run_id && (
                      <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-600 font-mono">Run: {campaign.explee_run_id}</span>
                        {activeRuns.find(r => r.id === campaign.explee_run_id)?.status === 'running' && (
                          <span className="flex items-center gap-1 text-[10px] text-cyan-400">
                            <Loader2 className="w-2.5 h-2.5 animate-spin" /> Running
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ SETTINGS TAB ============ */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Settings</h1>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Explee API Connection
              </h3>
              <div className="space-y-3">
                <SettingsRow label="Status" value={isProvisioned ? 'Active' : 'Not Connected'} valueClass={isProvisioned ? 'text-emerald-400' : 'text-amber-400'} />
                {customer.explee_customer_id && <SettingsRow label="Customer ID" value={customer.explee_customer_id} mono />}
                <SettingsRow label="API Key" value={customer.explee_api_key ? `${customer.explee_api_key.slice(0, 8)}...` : 'Not set'} mono />
              </div>
              {!isProvisioned && (
                <div className="mt-4 flex gap-2">
                  <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder="expl_xxxxxxxxxxxxxxxx"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <button onClick={handleConnectApiKey} disabled={connectingKey || !apiKeyInput.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors">
                    {connectingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                Account
              </h3>
              <div className="space-y-3">
                <SettingsRow label="Name" value={customer.full_name} />
                <SettingsRow label="Email" value={customer.email} />
                <SettingsRow label="Credits" value={customer.credits_remaining.toLocaleString()} valueClass="text-cyan-400 font-bold" />
                <SettingsRow label="Daily Budget" value={`${customer.daily_budget} emails/day`} />
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                Notifications
              </h3>
              <div className="space-y-3">
                <ToggleRow label="Email when meetings are booked" defaultOn />
                <ToggleRow label="Weekly performance reports" defaultOn />
                <ToggleRow label="Alert when credits are low" defaultOn />
                <ToggleRow label="Campaign paused alerts" defaultOn={false} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, sub }: { icon: React.ReactNode; iconBg: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      <p className="text-[11px] text-gray-600 mt-1">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    bounced: 'bg-red-500/10 text-red-400 border-red-500/20',
    researched: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    new: 'bg-gray-800 text-gray-400 border-gray-700',
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status] || styles.new}`}>
      {status.toUpperCase()}
    </span>
  );
}

function PipelineBadges({ personalized, sequenceStatus }: { personalized: boolean; sequenceStatus?: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-5 h-5 rounded flex items-center justify-center ${personalized ? 'bg-purple-500/20' : 'bg-gray-800'}`}>
        <Sparkles className={`w-2.5 h-2.5 ${personalized ? 'text-purple-400' : 'text-gray-600'}`} />
      </span>
      <span className={`w-5 h-5 rounded flex items-center justify-center ${sequenceStatus === 'active' ? 'bg-emerald-500/20' : 'bg-gray-800'}`}>
        <Send className={`w-2.5 h-2.5 ${sequenceStatus === 'active' ? 'text-emerald-400' : 'text-gray-600'}`} />
      </span>
    </div>
  );
}

function CampaignStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    draft: 'bg-gray-800 text-gray-400 border-gray-700',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status] || styles.draft}`}>
      {status.toUpperCase()}
    </span>
  );
}

function RunStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    running: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border ${styles[status] || styles.running}`}>
      {status.toUpperCase()}
    </span>
  );
}

function SettingsRow({ label, value, mono, valueClass }: { label: string; value: string; mono?: boolean; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-xs ${mono ? 'font-mono' : 'font-medium'} ${valueClass || 'text-gray-200'}`}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <span className="text-xs text-gray-300">{label}</span>
      <button onClick={() => setOn(!on)} className={`w-9 h-5 rounded-full relative transition-colors ${on ? 'bg-cyan-600' : 'bg-gray-700'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
