import { useState, useEffect } from 'react';
import {
  Code2, Shield, CheckCircle2, ArrowRight, Loader2, AlertCircle,
  Sparkles, ChevronDown, ChevronUp, Mail, Lock, User as UserIcon,
  ClipboardCheck, BadgeCheck, Brain, DollarSign, Laptop, Clock, GraduationCap,
} from 'lucide-react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';
import EarningsCalculator from '../components/EarningsCalculator';
import { supabase } from '../lib/supabase';

interface Props {
  navigate: (page: Page) => void;
}

const howItWorks = [
  {
    step: '01',
    icon: ClipboardCheck,
    title: 'Evaluation',
    description:
      'Apply with your skills and links to your work, then complete a short assessment of AI outputs for quality, accuracy, and relevance.',
  },
  {
    step: '02',
    icon: BadgeCheck,
    title: 'Approval',
    description:
      'Our team reviews every application. Approved contributors sign a short agreement in their portal and get access to paid projects.',
  },
  {
    step: '03',
    icon: Brain,
    title: 'High-skill tasks',
    description:
      'Design better prompts, guide AI reasoning step by step, review code, and evaluate model responses in your area of expertise.',
  },
  {
    step: '04',
    icon: DollarSign,
    title: 'Income + better models',
    description:
      'Get paid for quality work while helping build smarter, more reliable frontier AI models.',
  },
];

const taskTypes = [
  {
    icon: Code2,
    title: 'Code and reasoning review',
    body: 'Read model-written code and step-by-step reasoning, find the mistakes, and write the correct solution so the model learns from it.',
  },
  {
    icon: Sparkles,
    title: 'Prompt design',
    body: 'Write challenging, realistic prompts that push models to their limits and expose where they still fall short.',
  },
  {
    icon: Brain,
    title: 'Teaching AI',
    body: 'Show models how an expert thinks through a problem, from planning to edge cases, in fields like software, data, and ML.',
  },
  {
    icon: Shield,
    title: 'Response evaluation',
    body: 'Compare and rate model answers against clear quality guidelines for accuracy, helpfulness, and safety.',
  },
];

const perks = [
  { icon: Laptop, title: 'Fully remote', body: 'Work from anywhere with a laptop and a reliable connection.' },
  { icon: Clock, title: 'Flexible hours', body: 'Pick up projects when it suits you. No fixed schedule or minimum hours.' },
  { icon: GraduationCap, title: 'Stay sharp', body: 'Work hands-on with the newest AI models before most people see them.' },
];

const whoFor = [
  'Software engineers who write and review production code.',
  'AI / ML engineers and data scientists.',
  'Developers with strong problem-solving and clear written communication.',
  'Specialists in Web, Mobile, Data, Cloud, or Math-heavy fields.',
];

const faqs = [
  {
    q: 'What kind of work will I do?',
    a: 'Tasks that help train frontier AI models: writing and reviewing code, designing prompts, explaining expert reasoning, and rating model responses. Each project comes with clear guidelines.',
  },
  {
    q: 'How much can I earn?',
    a: 'Typical rates range from $60–70/hr for developers to $80–90/hr for senior and AI/ML specialists. Pay depends on the project, your skill area, and the quality of your work. Rates are shown before you accept a project. There is no guarantee of income or a minimum amount of work.',
  },
  {
    q: 'How much time do I need to commit?',
    a: 'None is required. You choose which projects to take and when to work on them. Some contributors work a few hours a week, others much more.',
  },
  {
    q: 'What does the evaluation involve?',
    a: 'After you apply, we review your background and may ask you to complete a short skills assessment related to your field. It helps us match you to the right projects.',
  },
  {
    q: 'Am I an employee?',
    a: 'No. You take part as an independent contractor using your own equipment and tax identity, and you are free to keep doing your other work.',
  },
  {
    q: 'How and when do I get paid?',
    a: 'Once approved, the payment terms are set out in the agreement you sign in your portal. Payment is made for approved, quality work.',
  },
];

const primarySkillOptions = [
  'Frontend', 'Backend', 'Full-Stack', 'Mobile', 'AI / ML', 'Data Engineering',
  'DevOps / Cloud', 'Voice AI', 'RAG / Search', 'Web3', 'Design', 'QA',
];

const serviceOptions = [
  'Code review', 'Prompt design', 'Reasoning / step-by-step solutions',
  'Response evaluation', 'Data labeling', 'Math / science problems',
  'Technical writing', 'Safety / red-teaming',
];

interface FormState {
  fullName: string;
  legalName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  city: string;
  timezone: string;
  address: string;
  website: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  yearsExperience: string;
  primarySkills: string[];
  servicesOffered: string[];
  languages: string;
  tools: string;
  agreeTerms: boolean;
  agreeIndependent: boolean;
}

const EMPTY_FORM: FormState = {
  fullName: '', legalName: '', email: '', password: '',
  phone: '', country: '', city: '', timezone: '', address: '',
  website: '', portfolioUrl: '', linkedinUrl: '', githubUrl: '',
  yearsExperience: '', primarySkills: [], servicesOffered: [],
  languages: '', tools: '',
  agreeTerms: false, agreeIndependent: false,
};

export default function PartnersPage({ navigate }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existing, setExisting] = useState<{ status: string } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        const { data } = await supabase
          .from('partner_applications')
          .select('status')
          .maybeSingle();
        if (!cancelled && data) setExisting(data as { status: string });
      }
      if (!cancelled) setCheckingSession(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const toggleMulti = (key: 'primarySkills' | 'servicesOffered', value: string) => {
    setForm((f) => {
      const set = new Set(f[key]);
      if (set.has(value)) set.delete(value); else set.add(value);
      return { ...f, [key]: Array.from(set) };
    });
  };

  const scrollToForm = () => {
    document.getElementById('partner-application')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.agreeTerms || !form.agreeIndependent) {
      setError('Please accept both confirmations to continue.');
      return;
    }
    if (form.primarySkills.length === 0) {
      setError('Pick at least one primary skill.');
      return;
    }
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.fullName } },
        });
        if (signUpError) throw signUpError;
        if (!signUpData.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          });
          if (signInError) throw signInError;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Could not sign you in. Please try again.');

      const languages = form.languages.split(',').map((s) => s.trim()).filter(Boolean);
      const tools = form.tools.split(',').map((s) => s.trim()).filter(Boolean);

      const { error: insertError } = await supabase.from('partner_applications').insert({
        user_id: user.id,
        full_name: form.fullName,
        legal_name: form.legalName || form.fullName,
        email: form.email,
        phone: form.phone || null,
        country: form.country || null,
        city: form.city || null,
        timezone: form.timezone || null,
        address: form.address || null,
        website: form.website || null,
        portfolio_url: form.portfolioUrl || null,
        linkedin_url: form.linkedinUrl || null,
        github_url: form.githubUrl || null,
        years_experience: form.yearsExperience || null,
        primary_skills: form.primarySkills,
        services_offered: form.servicesOffered,
        languages,
        tools,
      });
      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => navigate('partner-portal'), 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      if (message.toLowerCase().includes('already registered')) {
        setError('That email is already registered. Sign in first, then submit your application.');
      } else if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
        setError('You already have an application on file. Go to your portal to check its status.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Application received</h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Thanks for applying to Hybrid Ads AI Paid Training. We&apos;ll email you once our team has reviewed your application. Taking you to your portal now.
          </p>
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-6">
              <DollarSign className="w-3.5 h-3.5" />
              Hybrid Ads AI Paid Training
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
              Get paid to train
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">the next generation of AI.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl leading-relaxed">
              A new earning path for developers and AI/ML engineers. Use your expertise to review code, design prompts, and evaluate model responses on frontier AI training projects, remotely and on your own schedule.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={scrollToForm}
                className="group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
              >
                Start making money
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              {existing && (
                <button
                  onClick={() => navigate('partner-portal')}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors border border-white/10"
                >
                  Open your portal
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="mt-6 text-xs text-gray-500 max-w-xl">
              No income guarantees. Project availability varies, and pay depends on the project and the quality of your work.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Image */}
      <section className="relative -mt-10 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-2xl shadow-gray-900/10">
              <img
                src="/HybridAds_AITraining_Platform_Final.png"
                alt="New earning path for AI/ML and developers: evaluation, approval, high-skill tasks, then income and better models"
                className="w-full h-auto"
                decoding="async"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">How it works</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">From application to your first paid task</h2>
            </div>
          </AnimateIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => (
              <AnimateIn key={step.step} delay={i * 80}>
                <div className="h-full p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 tracking-wider">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Task types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">The work</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Frontier model training work</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                AI models only get better when skilled people show them what good looks like. These are the kinds of tasks you&apos;ll take on.
              </p>
            </div>
          </AnimateIn>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {taskTypes.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 80}>
                <div className="h-full p-6 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {perks.map((perk, i) => (
              <AnimateIn key={perk.title} delay={i * 80}>
                <div className="flex items-start gap-3 p-5 rounded-xl bg-amber-50 border border-amber-100">
                  <perk.icon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{perk.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mt-1">{perk.body}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <EarningsCalculator />

      {/* Who it's for */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <AnimateIn>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Who it&apos;s for</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Developers and AI experts</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                If you can spot a subtle bug, explain your reasoning clearly, and care about getting the details right, your skills are exactly what AI training needs.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={100}>
            <ul className="space-y-3">
              {whoFor.map((item) => (
                <li key={item} className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-800 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Common questions</h2>
            </div>
          </AnimateIn>
          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 -mt-2 text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="partner-application" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Apply</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Apply for AI Paid Training</h2>
              <p className="mt-4 text-gray-600 leading-relaxed max-w-xl mx-auto">
                Applying creates a Hybrid Ads account (or signs you into your existing one) and files your application for review.
              </p>
            </div>
          </AnimateIn>

          {checkingSession ? (
            <div className="mt-12 flex justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          ) : existing ? (
            <div className="mt-12 p-6 rounded-2xl border border-blue-200 bg-blue-50 text-center">
              <p className="text-gray-800 mb-4">
                You already have an application on file (status: <span className="font-semibold">{existing.status}</span>).
              </p>
              <button
                onClick={() => navigate('partner-portal')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Open your portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 space-y-6">
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Account */}
              <fieldset className="p-6 rounded-2xl border border-gray-200 space-y-4">
                <legend className="px-2 text-sm font-semibold text-gray-900">Account</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field icon={UserIcon} label="Full name" required value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
                  <Field icon={UserIcon} label="Legal name (as on ID)" required value={form.legalName} onChange={(v) => setForm({ ...form, legalName: v })} />
                  <Field icon={Mail} label="Email" required type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field icon={Lock} label="Password" required type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} minLength={6} />
                </div>
              </fieldset>

              {/* Location & contact */}
              <fieldset className="p-6 rounded-2xl border border-gray-200 space-y-4">
                <legend className="px-2 text-sm font-semibold text-gray-900">Contact and location</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <Field label="Timezone" placeholder="e.g. America/Los_Angeles" value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} />
                  <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
                  <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                  <div className="sm:col-span-2">
                    <Field label="Address (for the agreement)" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="Street, city, region, postal code, country" />
                  </div>
                </div>
              </fieldset>

              {/* Online */}
              <fieldset className="p-6 rounded-2xl border border-gray-200 space-y-4">
                <legend className="px-2 text-sm font-semibold text-gray-900">Online presence</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
                  <Field label="Portfolio URL" value={form.portfolioUrl} onChange={(v) => setForm({ ...form, portfolioUrl: v })} />
                  <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => setForm({ ...form, linkedinUrl: v })} />
                  <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} />
                </div>
              </fieldset>

              {/* Skills */}
              <fieldset className="p-6 rounded-2xl border border-gray-200 space-y-5">
                <legend className="px-2 text-sm font-semibold text-gray-900">Skills and task types</legend>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Primary skills</p>
                  <div className="flex flex-wrap gap-2">
                    {primarySkillOptions.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleMulti('primarySkills', s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          form.primarySkills.includes(s)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Services offered</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleMulti('servicesOffered', s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          form.servicesOffered.includes(s)
                            ? 'bg-cyan-600 border-cyan-600 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-cyan-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Years of experience" placeholder="e.g. 6" value={form.yearsExperience} onChange={(v) => setForm({ ...form, yearsExperience: v })} />
                  <Field label="Languages (comma separated)" placeholder="English, Spanish" value={form.languages} onChange={(v) => setForm({ ...form, languages: v })} />
                  <div className="sm:col-span-2">
                    <Field label="Tools / stack (comma separated)" placeholder="TypeScript, Next.js, Postgres, Docker, LangChain" value={form.tools} onChange={(v) => setForm({ ...form, tools: v })} />
                  </div>
                </div>
              </fieldset>

              {/* Confirmations */}
              <fieldset className="p-6 rounded-2xl border border-gray-200 space-y-4 bg-gray-50">
                <legend className="px-2 text-sm font-semibold text-gray-900">Confirmations</legend>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeIndependent}
                    onChange={(e) => setForm({ ...form, agreeIndependent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I understand that, if accepted, I will take part as an independent contractor using my own equipment and tax identity. Hybrid Ads is not my employer.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I confirm that acceptance does not guarantee any projects and that Hybrid Ads makes no guarantee of income or work volume. I&apos;ve read the{' '}
                    <button type="button" onClick={() => navigate('terms')} className="text-blue-600 underline underline-offset-2">Terms of Service</button>{' '}
                    and{' '}
                    <button type="button" onClick={() => navigate('privacy')} className="text-blue-600 underline underline-offset-2">Privacy Policy</button>.
                  </span>
                </label>
              </fieldset>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    Submit application
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center">
                By submitting you create a Hybrid Ads account and file your application. You&apos;ll get an email once we&apos;ve reviewed it.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label, value, onChange, type = 'text', required, placeholder, minLength, icon: Icon,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string; minLength?: number;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
        />
      </div>
    </label>
  );
}
