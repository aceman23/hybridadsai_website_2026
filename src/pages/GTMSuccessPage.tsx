import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Loader2, Zap, ArrowRight } from 'lucide-react';
import type { Page } from '../App';
import { supabase } from '../lib/supabase';

interface Props {
  navigate: (page: Page) => void;
}

type Stage = 'confirming' | 'provisioning' | 'ready' | 'failed';

export default function GTMSuccessPage({ navigate }: Props) {
  const [stage, setStage] = useState<Stage>('confirming');
  const [customerName, setCustomerName] = useState('');
  const [tier, setTier] = useState('starter');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_attempts, setAttempts] = useState(0);
  const provisionedRef = useRef(false);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('gtm-service'); return; }

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gtm-status`,
      { headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' } }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.customer?.payment_status === 'paid') {
        setCustomerName(data.customer.full_name || '');
        setTier(data.customer.tier || 'starter');
        triggerProvisioning(session.access_token, data.customer);
        return;
      }
    }

    setAttempts(prev => {
      const next = prev + 1;
      if (next < 20) {
        setTimeout(checkPaymentStatus, 3000);
      } else {
        setStage('failed');
      }
      return next;
    });
  };

  const triggerProvisioning = async (accessToken: string, customer: Record<string, unknown>) => {
    if (provisionedRef.current) return;
    provisionedRef.current = true;

    // If already provisioned, skip straight to redirect
    if (customer.explee_status === 'active' && customer.explee_api_key) {
      redirectToWorkspace();
      return;
    }

    setStage('provisioning');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/provision-explee`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tier: (customer.tier as string) || tier,
            icp_description: customer.icp_description || customer.icp_definition || undefined,
          }),
        }
      );

      if (res.ok) {
        setStage('ready');
        setTimeout(() => redirectToWorkspace(), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        // If it needs a manual key, still redirect — workspace has the key input
        if (data.requires_manual_key) {
          setStage('ready');
          setTimeout(() => redirectToWorkspace(), 2000);
        } else {
          // Non-critical failure; redirect anyway
          setStage('ready');
          setTimeout(() => redirectToWorkspace(), 2000);
        }
      }
    } catch {
      // Provisioning failure is non-blocking; user can connect key in workspace
      setStage('ready');
      setTimeout(() => redirectToWorkspace(), 2000);
    }
  };

  const redirectToWorkspace = () => {
    // Store toast flag for workspace to pick up
    sessionStorage.setItem('gtm_toast', JSON.stringify({
      type: 'success',
      message: 'Your AI Sales Team is live! Configure your target audience to get started.',
    }));
    navigate('gtm-workspace');
  };

  const stageMessages: Record<Stage, { title: string; sub: string }> = {
    confirming: { title: 'Confirming payment...', sub: 'This usually takes a few seconds' },
    provisioning: { title: 'Setting up your workspace...', sub: 'Connecting AI agents and sales infrastructure' },
    ready: { title: 'All set!', sub: 'Redirecting to your workspace...' },
    failed: { title: 'Taking longer than expected', sub: 'Your payment was received but confirmation is delayed' },
  };

  const { title, sub } = stageMessages[stage];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Progress indicator */}
        {stage !== 'failed' && stage !== 'ready' && (
          <div className="mb-8">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-gray-800" />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                {stage === 'confirming' && <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />}
                {stage === 'provisioning' && <Zap className="w-6 h-6 text-cyan-400" />}
              </div>
            </div>
          </div>
        )}

        {stage === 'ready' && (
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        )}

        <h1 className="text-2xl font-black text-white mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">{sub}</p>

        {/* Progress steps */}
        {stage !== 'failed' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {['Payment', 'Provisioning', 'Ready'].map((step, i) => {
              const stepIndex = ['confirming', 'provisioning', 'ready'].indexOf(stage);
              const isComplete = i <= stepIndex;
              const isCurrent = i === stepIndex;
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all ${
                    isComplete ? 'bg-cyan-400' : 'bg-gray-700'
                  } ${isCurrent ? 'w-6 rounded-full' : ''}`} />
                </div>
              );
            })}
          </div>
        )}

        {customerName && stage === 'ready' && (
          <p className="text-gray-400 text-sm mb-6">
            Welcome aboard, <span className="text-white font-semibold">{customerName.split(' ')[0]}</span>
          </p>
        )}

        {stage === 'failed' && (
          <div className="space-y-3 mt-4">
            <button
              onClick={() => { setStage('confirming'); setAttempts(0); checkPaymentStatus(); }}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors"
            >
              <Loader2 className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => redirectToWorkspace()}
              className="flex items-center justify-center gap-2 mx-auto text-sm text-gray-400 hover:text-gray-200 font-medium transition-colors"
            >
              Go to Workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
