import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Loader2, Sparkles, Target, Mail, Calendar } from 'lucide-react';
import type { Page } from '../App';
import { supabase } from '../lib/supabase';
import AnimateIn from '../components/AnimateIn';

interface Props {
  navigate: (page: Page) => void;
}

export default function GTMSuccessPage({ navigate }: Props) {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
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
      if (data.customer?.payment_status === 'paid') {
        setPaid(true);
        setCustomerName(data.customer.full_name || '');
        setLoading(false);
        return;
      }
    }

    setAttempts((prev) => {
      const next = prev + 1;
      if (next < 20) {
        setTimeout(checkStatus, 3000);
      } else {
        setLoading(false);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Confirming your payment...</p>
        <p className="text-sm text-gray-400 mt-1">This may take a few seconds</p>
      </div>
    );
  }

  if (!paid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-3">Payment Processing</h1>
          <p className="text-gray-500 mb-6">
            Your payment was received. It may take a moment for confirmation to arrive.
          </p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => { setLoading(true); setAttempts(0); checkStatus(); }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Check Again
            </button>
            <button
              onClick={() => navigate('gtm-workspace')}
              className="text-blue-600 font-semibold hover:text-blue-700 text-sm"
            >
              Go to Workspace Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { icon: Target, title: 'Define Your ICP', description: 'Tell us who your ideal customers are', done: false },
    { icon: Mail, title: 'Set Daily Budget', description: 'Choose how many emails to send per day', done: false },
    { icon: Calendar, title: 'Connect Calendar', description: 'Sync your calendar for meeting bookings', done: false },
    { icon: Sparkles, title: 'Launch Campaign', description: 'Review and activate your first AI campaign', done: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <AnimateIn>
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Welcome{customerName ? `, ${customerName.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-lg text-gray-500">
              Your AI Sales Team is ready. You have <span className="font-bold text-gray-900">5,000 email credits</span> loaded.
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={200}>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Next Steps</h2>
            <div className="space-y-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                      {i + 1}/4
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={400}>
          <div className="text-center">
            <button
              onClick={() => navigate('gtm-workspace')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-blue-600/25"
            >
              Go to Your Workspace
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
