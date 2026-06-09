import { useState, useMemo } from 'react';
import { X, Eye, EyeOff, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  onClose: () => void;
  onSuccess: (accessToken: string) => void;
}

function generateChallenge() {
  const a = Math.floor(Math.random() * 10) + 2;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b}`, answer: a + b };
}

export default function SignupModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const challenge = useMemo(() => generateChallenge(), []);

  const validate = () => {
    if (mode === 'signup' && !fullName.trim()) return 'Full name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (mode === 'signup' && parseInt(challengeAnswer) !== challenge.answer) return 'Incorrect verification answer.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: signupErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (signupErr) throw signupErr;
        if (!data.session) throw new Error('Account created. Please check your email to confirm, then sign in.');
        onSuccess(data.session.access_token);
      } else {
        const { data, error: loginErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (loginErr) throw loginErr;
        if (!data.session) throw new Error('Unable to create session.');
        onSuccess(data.session.access_token);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-gray-900">
              {mode === 'signup' ? 'Get Your AI Sales Team' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'signup'
                ? 'Create your account to proceed to payment'
                : 'Sign in to access your workspace'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Verification: What is {challenge.question}?
                </label>
                <input
                  type="text"
                  value={challengeAnswer}
                  onChange={(e) => setChallengeAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold px-6 py-4 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/25"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account & Pay $149' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {mode === 'signup' && (
            <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-gray-100">
              {['Secure payment', 'No spam'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield className="w-3 h-3" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
