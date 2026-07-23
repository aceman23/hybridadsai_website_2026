import { useState, useEffect } from 'react';
import { Loader2, Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getAuthDestination } from '../lib/auth-utils';
import type { Page } from '../App';

interface Props {
  navigate: (page: Page) => void;
}

export default function SignUpPage({ navigate }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const dest = await getAuthDestination(session.access_token);
        navigate(dest);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
      const { data: { session } } = await supabase.auth.getSession();
      const dest = session ? await getAuthDestination(session.access_token) : 'gtm-service';
      setTimeout(() => navigate(dest), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      if (message.includes('already registered')) {
        setError('This email is already registered. Try signing in instead.');
      } else if (message.includes('Password should be at least')) {
        setError('Password must be at least 6 characters');
      } else {
        setError(message);
      }
    }
    setLoading(false);
  };

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Too short', color: 'bg-red-500' };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [password.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { level: 2, label: 'Weak', color: 'bg-orange-500' };
    if (score <= 2) return { level: 3, label: 'Fair', color: 'bg-yellow-500' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
  })();

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm animate-scale-in">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Account created!</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Welcome to Hybrid Ads. Redirecting you now...
          </p>
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 group w-fit"
          >
            <img src="/logo.png" alt="Hybrid Ads" className="h-16 w-auto" width="64" height="64" />
          </button>

          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Get Started Free</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Scale your growth<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">with AI.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Join performance marketers using AI to generate leads, create content, and optimize campaigns.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { stat: '2M+', label: 'Leads Generated' },
                { stat: '3,000+', label: 'Campaigns Run' },
                { stat: '$0.03', label: 'Per AI Email' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-white">{item.stat}</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-600">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <button onClick={() => navigate('home')}>
              <img src="/logo.png" alt="Hybrid Ads" className="h-14 w-auto" width="56" height="56" />
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-gray-400">Get started with Hybrid Ads in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-11 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">{passwordStrength.label}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => navigate('sign-in')}
                className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-800/50">
            <p className="text-xs text-gray-600 text-center">
              By creating an account, you agree to our{' '}
              <button onClick={() => navigate('terms')} className="text-gray-400 hover:text-gray-300 underline underline-offset-2">
                Terms of Service
              </button>{' '}
              and{' '}
              <button onClick={() => navigate('privacy')} className="text-gray-400 hover:text-gray-300 underline underline-offset-2">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
