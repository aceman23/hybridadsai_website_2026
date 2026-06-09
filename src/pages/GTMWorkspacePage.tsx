import { useState, useEffect } from 'react';
import {
  Target, Mail, Zap, BarChart3, Play, Pause, Plus,
  ArrowRight, Loader2, LogOut, Settings, CreditCard,
} from 'lucide-react';
import type { Page } from '../App';
import { supabase } from '../lib/supabase';
import AnimateIn from '../components/AnimateIn';

interface Props {
  navigate: (page: Page) => void;
}

interface Customer {
  full_name: string;
  credits_remaining: number;
  daily_send_limit: number;
  icp_definition: string | null;
  workspace_status: string;
}

interface Campaign {
  id: string;
  name: string;
  icp_definition: string | null;
  status: string;
  emails_sent: number;
  created_at: string;
}

export default function GTMWorkspacePage({ navigate }: Props) {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [icpInput, setIcpInput] = useState('');
  const [dailyLimit, setDailyLimit] = useState(100);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'settings'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('gtm-service');
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gtm-status`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (!data.customer || data.customer.payment_status !== 'paid') {
        navigate('gtm-service');
        return;
      }
      setCustomer(data.customer);
      setCampaigns(data.campaigns || []);
      setIcpInput(data.customer.icp_definition || '');
      setDailyLimit(data.customer.daily_send_limit || 100);
    } else {
      navigate('gtm-service');
      return;
    }
    setLoading(false);
  };

  const handleSaveICP = async () => {
    if (!icpInput.trim()) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase
        .from('gtm_customers')
        .update({ icp_definition: icpInput.trim(), daily_send_limit: dailyLimit })
        .eq('user_id', session.user.id);
      setCustomer((prev) => prev ? { ...prev, icp_definition: icpInput.trim(), daily_send_limit: dailyLimit } : prev);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('gtm-service');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading workspace...</p>
      </div>
    );
  }

  if (!customer) return null;

  const creditsPercent = Math.round((customer.credits_remaining / 5000) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">
              Welcome, {customer.full_name.split(' ')[0]}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Your AI Sales Team workspace</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Credits Remaining</span>
              </div>
              <div className="text-2xl font-black text-gray-900">{customer.credits_remaining.toLocaleString()}</div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${creditsPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Daily Send Limit</span>
              </div>
              <div className="text-2xl font-black text-gray-900">{customer.daily_send_limit}</div>
              <p className="text-xs text-gray-400 mt-1">emails per day</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Active Campaigns</span>
              </div>
              <div className="text-2xl font-black text-gray-900">
                {campaigns.filter((c) => c.status === 'active').length}
              </div>
              <p className="text-xs text-gray-400 mt-1">of {campaigns.length} total</p>
            </div>
          </div>
        </AnimateIn>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 w-fit">
          {([
            { key: 'overview', label: 'Overview', icon: Target },
            { key: 'campaigns', label: 'Campaigns', icon: Zap },
            { key: 'settings', label: 'Settings', icon: Settings },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <AnimateIn>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Define Your Ideal Customer Profile</h2>
              <p className="text-sm text-gray-500 mb-5">
                Describe your target audience in natural language. Our AI agents will find matching companies and decision-makers.
              </p>
              <textarea
                value={icpInput}
                onChange={(e) => setIcpInput(e.target.value)}
                placeholder='Example: "B2B SaaS companies in the US with 10-200 employees that use Stripe for payments, targeting VP of Sales or Head of Growth"'
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />

              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Daily Send Limit: <span className="text-blue-600">{dailyLimit} emails/day</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10/day</span>
                  <span>1,000/day</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleSaveICP}
                  disabled={saving || !icpInput.trim()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Save Configuration
                </button>
                {customer.icp_definition && (
                  <span className="text-sm text-emerald-600 font-medium">ICP saved</span>
                )}
              </div>
            </div>
          </AnimateIn>
        )}

        {activeTab === 'campaigns' && (
          <AnimateIn>
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                  <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">No campaigns yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Define your ICP first, then launch your first campaign.</p>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-700"
                  >
                    Go to Overview
                  </button>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{campaign.name}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            campaign.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : campaign.status === 'paused'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {campaign.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {campaign.emails_sent} emails sent
                        {campaign.icp_definition && ` · ${campaign.icp_definition.slice(0, 60)}...`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {campaign.status === 'draft' && (
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors">
                          <Play className="w-3.5 h-3.5" />
                          Launch
                        </button>
                      )}
                      {campaign.status === 'active' && (
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-semibold rounded-lg transition-colors">
                          <Pause className="w-3.5 h-3.5" />
                          Pause
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              <button className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 mt-4">
                <Plus className="w-4 h-4" />
                Create New Campaign
              </button>
            </div>
          </AnimateIn>
        )}

        {activeTab === 'settings' && (
          <AnimateIn>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Workspace Settings</h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified when meetings are booked</p>
                  </div>
                  <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Weekly Reports</h3>
                    <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
                  </div>
                  <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Calendar Integration</h3>
                    <p className="text-sm text-gray-500">Connect Google Calendar or Calendly</p>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </AnimateIn>
        )}
      </div>
    </div>
  );
}
