import { useState, useEffect, useCallback } from 'react';
import {
  Target, Mail, Zap, BarChart3, Play, Loader2, LogOut, Settings,
  Users, Search, Activity, Key, CheckCircle2, AlertCircle,
  TrendingUp, Send, Clock, Building2, User,
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
  name: string;
  company: string;
  email: string;
  status: string;
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
    // Check for success toast from GTMSuccessPage redirect
    const stored = sessionStorage.getItem('gtm_toast');
    if (stored) {
      try {
        setToast(JSON.parse(stored));
        sessionStorage.removeItem('gtm_toast');
        setTimeout(() => setToast(null), 6000);
      } catch { /* ignore */ }
    }
  }, []);

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

        if (customer?.explee_status === 'active') {
          await callExpleeProxy('/searches', 'POST', { query: icpInput.trim(), daily_budget: dailyBudget });
          setActivityFeed(prev => [{ time: 'Just now', text: 'Target audience updated & search triggered', type: 'search' }, ...prev]);
        }
      }
    } catch (err) {
      console.error('ICP update error:', err);
    }
    setSaving(false);
  };

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

      setActivityFeed(prev => [
        { time: 'Just now', text: 'Autonomous campaign launched', type: 'campaign' },
        ...prev,
      ]);
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
        setActivityFeed(prev => [{ time: 'Just now', text: 'Explee API key connected', type: 'system' }, ...prev]);
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

  const sidebarItems: Array<{ key: SidebarTab; label: string; icon: typeof Target }> = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'prospects', label: 'Prospects', icon: Users },
    { key: 'campaigns', label: 'Campaigns', icon: Zap },
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
                {item.label}
              </button>
            );
          })}
        </nav>

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
        {/* Success Toast */}
        {toast && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-4 animate-scale-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-300 font-medium flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-emerald-500/50 hover:text-emerald-400 text-lg leading-none">&times;</button>
          </div>
        )}

        {/* Connect API Key Banner */}
        {!isProvisioned && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-300 mb-1">Connect Your Explee API Key</h3>
                <p className="text-xs text-amber-200/70 mb-3">
                  To activate autonomous prospecting, enter your Explee API key below. You can get one from your Explee account settings.
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Welcome back, {customer.full_name.split(' ')[0]}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Your autonomous sales pipeline</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                  isProvisioned
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isProvisioned ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                  {isProvisioned ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={<Search className="w-4 h-4" />}
                iconBg="bg-cyan-500/10 text-cyan-400"
                label="Prospects Found"
                value={stats.prospectsFound.toLocaleString()}
                sub="Total discovered"
              />
              <StatCard
                icon={<Send className="w-4 h-4" />}
                iconBg="bg-blue-500/10 text-blue-400"
                label="Emails Sent"
                value={stats.emailsSentToday.toLocaleString()}
                sub="All time"
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4" />}
                iconBg="bg-emerald-500/10 text-emerald-400"
                label="Deliverability"
                value={`${stats.deliverability}%`}
                sub="Last 30 days"
              />
            </div>

            {/* ICP + Launch Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Target Audience (ICP)
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Describe your ideal customer in natural language. The AI agents will find and engage matching prospects.
              </p>
              <textarea
                value={icpInput}
                onChange={e => setIcpInput(e.target.value)}
                placeholder='e.g. "B2B SaaS companies in the US, 10-200 employees, targeting VP Sales or Head of Growth, using Stripe or HubSpot"'
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
              />

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Daily Budget
                  </label>
                  <span className="text-sm font-bold text-cyan-400">
                    {dailyBudget} emails/day <span className="text-gray-500 font-normal">(~${costEstimate}/day)</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={500}
                  step={5}
                  value={dailyBudget}
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
                <p className="text-[11px] text-amber-400/80 mt-2">Connect your Explee API key above to launch campaigns.</p>
              )}
            </div>

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
                  {activityFeed.slice(0, 8).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === 'campaign' ? 'bg-blue-500/10' : item.type === 'search' ? 'bg-cyan-500/10' : 'bg-gray-800'
                      }`}>
                        {item.type === 'campaign' && <Zap className="w-3 h-3 text-blue-400" />}
                        {item.type === 'search' && <Search className="w-3 h-3 text-cyan-400" />}
                        {item.type === 'system' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300 truncate">{item.text}</p>
                      </div>
                      <span className="text-[10px] text-gray-600 shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prospects Tab */}
        {activeTab === 'prospects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-white">Prospects</h1>
              <span className="text-xs text-gray-500">{stats.prospectsFound} total found</span>
            </div>

            {stats.prospectsFound === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
                <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-300 mb-1">No prospects yet</h3>
                <p className="text-xs text-gray-500 mb-4">Launch an autonomous campaign to start discovering prospects.</p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-cyan-400 text-sm font-semibold hover:text-cyan-300"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Name</th>
                        <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Company</th>
                        <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Email</th>
                        <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {prospects.length > 0 ? prospects.map((p, i) => (
                        <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-gray-500" />
                              </div>
                              <span className="text-sm text-gray-200 font-medium">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3 h-3 text-gray-600" />
                              <span className="text-sm text-gray-400">{p.company}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-400">{p.email}</td>
                          <td className="px-5 py-3">
                            <StatusBadge status={p.status} />
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">
                            Prospect data will appear here once campaigns are running.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Campaigns Tab */}
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
                <p className="text-xs text-gray-500 mb-4">Define your ICP and launch your first autonomous campaign.</p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-cyan-400 text-sm font-semibold hover:text-cyan-300"
                >
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
                        <p className="text-xs text-gray-500 truncate">
                          {campaign.icp_definition || 'No ICP defined'}
                        </p>
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
                        <span className="text-[10px] text-gray-600 font-mono">Run ID: {campaign.explee_run_id}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Settings</h1>

            {/* Explee Connection */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Explee API Connection
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-xs text-gray-400">Status</span>
                  <span className={`text-xs font-semibold ${isProvisioned ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isProvisioned ? 'Active' : 'Not Connected'}
                  </span>
                </div>
                {customer.explee_customer_id && (
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-xs text-gray-400">Customer ID</span>
                    <span className="text-xs font-mono text-gray-300">{customer.explee_customer_id}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-xs text-gray-400">API Key</span>
                  <span className="text-xs font-mono text-gray-300">
                    {customer.explee_api_key ? `${customer.explee_api_key.slice(0, 8)}...` : 'Not set'}
                  </span>
                </div>
              </div>

              {!isProvisioned && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="expl_xxxxxxxxxxxxxxxx"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <button
                    onClick={handleConnectApiKey}
                    disabled={connectingKey || !apiKeyInput.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    {connectingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                Account
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-xs text-gray-400">Name</span>
                  <span className="text-xs text-gray-200 font-medium">{customer.full_name}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-xs text-gray-400">Email</span>
                  <span className="text-xs text-gray-200">{customer.email}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-xs text-gray-400">Credits Remaining</span>
                  <span className="text-xs font-bold text-cyan-400">{customer.credits_remaining.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-xs text-gray-400">Daily Budget</span>
                  <span className="text-xs text-gray-200">{customer.daily_budget} emails/day</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
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
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
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
    new: 'bg-gray-800 text-gray-400 border-gray-700',
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status] || styles.new}`}>
      {status.toUpperCase()}
    </span>
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

function ToggleRow({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <span className="text-xs text-gray-300">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-9 h-5 rounded-full relative transition-colors ${on ? 'bg-cyan-600' : 'bg-gray-700'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
