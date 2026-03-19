import {
  Shield,
  Terminal,
  BarChart3,
  Lock,
  Cpu,
  Globe,
  ArrowRight,
  CheckCircle2,
  Layers,
  Activity,
  Eye,
  GitBranch,
  Zap,
  Target,
  TrendingUp,
  Brain,
  DollarSign,
  Search,
  ClipboardList,
} from 'lucide-react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';

interface NemoClawPageProps {
  navigate: (page: Page) => void;
}

const stackLayers = [
  {
    icon: Shield,
    label: 'Sandbox Layer',
    color: 'emerald',
    items: ['OpenShell (Landlock + seccomp)', 'Strict network egress policies', 'Filesystem isolation & drop privileges', 'Immutable read-only root filesystem'],
  },
  {
    icon: Cpu,
    label: 'Inference Layer',
    color: 'blue',
    items: ['Nemotron 3 Super 120B', 'Local NIM endpoints', 'vLLM for high-throughput routing', 'Reproducible versioned blueprints'],
  },
  {
    icon: Activity,
    label: 'Observability Layer',
    color: 'amber',
    items: ['OpenTelemetry tracing', 'NeMo Agent Toolkit profiling', 'Latency & token metrics', 'YAML-defined evaluation workflows'],
  },
  {
    icon: Globe,
    label: 'Integration Layer',
    color: 'sky',
    items: ['Meta Ads API connector', 'Google Ads API connector', 'TikTok & X Ads routing', 'Hybrid Ads orchestration SDK'],
  },
];

const benefits = [
  {
    icon: Lock,
    title: 'Zero-Trust Sandboxing',
    desc: 'Every agent runs inside an OpenShell sandbox enforced by Landlock LSM, seccomp system-call filters, and strict egress-only network policies. No agent can reach data it was not explicitly authorized to access.',
  },
  {
    icon: Eye,
    title: 'Full Observability',
    desc: 'End-to-end OpenTelemetry tracing surfaces latency, token consumption, and failure points across every tool call. NeMo Agent Toolkit dashboards give your security and ops teams complete visibility.',
  },
  {
    icon: Shield,
    title: 'Compliance-Ready',
    desc: 'Immutable audit trails, reproducible execution blueprints, and cryptographically versioned agent setups satisfy SOC 2, HIPAA, and enterprise information security requirements out of the box.',
  },
  {
    icon: GitBranch,
    title: 'Reproducible & Auditable',
    desc: 'Every agent configuration is declarative YAML — version-controlled, diff-able, and rollback-ready. Blueprints pin model versions, tool schemas, and prompt templates for deterministic replay.',
  },
  {
    icon: Cpu,
    title: 'Privacy-First Inference',
    desc: 'Run Nemotron 3 Super 120B on-premises via local NIM endpoints or vLLM. No proprietary client data ever leaves your environment unless you explicitly configure an external endpoint.',
  },
  {
    icon: Zap,
    title: '10x Faster Time-to-Production',
    desc: 'Pre-built marketing agent blueprints, Hybrid Ads connector SDKs, and one-command deployment cut the path from proof-of-concept to live production agent from months to days.',
  },
];

const useCases = [
  {
    icon: TrendingUp,
    title: 'Autonomous Campaign Optimizer',
    desc: 'Continuously analyzes impression-share, CPA trends, and auction signals across Google, Meta, and TikTok. Generates and queues bid adjustments, budget shifts, and ad-copy variants — awaiting a single human approval before deploying.',
    tags: ['Google Ads API', 'Meta Marketing API', 'NeMo Profiler'],
  },
  {
    icon: Brain,
    title: 'Creative Testing Agent',
    desc: 'Generates headline and visual hypothesis sets grounded in your brand guidelines, routes them to a sandboxed Meta sandbox account for A/B testing, and surfaces statistically significant winners with full attribution reasoning.',
    tags: ['Meta Creative Hub API', 'OpenTelemetry', 'Nemotron 120B'],
  },
  {
    icon: ClipboardList,
    title: 'Lead Qualification & Scoring Agent',
    desc: 'Processes inbound CRM records in real time, enriches them with firmographic data, scores against ICP criteria defined in YAML, and routes high-intent leads to sales sequences — without touching a production CRM until scoring is complete.',
    tags: ['Salesforce API', 'HubSpot API', 'YAML Workflows'],
  },
  {
    icon: Search,
    title: 'Competitive Intelligence Agent',
    desc: 'Monitors competitor ad libraries on Meta and Google Ads Transparency, extracts messaging themes using structured LLM extraction, and delivers a weekly brief ranked by estimated spend and creative freshness.',
    tags: ['Ad Library API', 'Structured Extraction', 'vLLM'],
  },
  {
    icon: DollarSign,
    title: 'Budget Allocation Agent',
    desc: 'Ingests cross-channel ROAS signals daily, runs a constrained optimization routine across your active portfolio, and produces an allocation recommendation with explainability traces — ready for one-click approval.',
    tags: ['Google Ads', 'Meta Ads', 'OpenTelemetry Traces'],
  },
];

const installSteps = [
  {
    step: 1,
    title: 'Clone & Install',
    commands: [
      'git clone https://github.com/NVIDIA/NemoClaw.git',
      'cd NemoClaw',
      './install.sh',
    ],
    note: 'The installer validates kernel capabilities, configures Landlock LSM, and sets up seccomp profiles automatically.',
  },
  {
    step: 2,
    title: 'Onboard Your Environment',
    commands: [
      'nemoclaw init --env production',
      'nemoclaw validate --strict',
    ],
    note: 'Verifies sandbox integrity, network egress rules, and writes a signed environment manifest for audit logs.',
  },
  {
    step: 3,
    title: 'Explore Available Commands',
    commands: [
      'nemoclaw --help',
      'nemoclaw blueprints list',
    ],
    note: 'Browse pre-built marketing agent blueprints or import your own YAML workflow definitions.',
  },
  {
    step: 4,
    title: 'Connect NeMo Agent Toolkit',
    commands: [
      'pip install nvidia-nat',
      'nat init --otel-endpoint http://localhost:4317',
      'nat profile --agent marketing-optimizer',
    ],
    note: 'nvidia-nat wires OpenTelemetry tracing and the NeMo Agent Toolkit evaluation harness into your NemoClaw runtime.',
  },
  {
    step: 5,
    title: 'Launch Your First Marketing Agent',
    commands: [
      'nemoclaw run --blueprint hybrid-ads/campaign-optimizer',
      'nemoclaw status --watch',
    ],
    note: 'The agent boots inside the OpenShell sandbox, connects to approved ad platform APIs, and begins emitting traces to your observability stack.',
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'bg-emerald-600' },
  blue:    { border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    text: 'text-blue-400',    icon: 'bg-blue-600' },
  amber:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   text: 'text-amber-400',   icon: 'bg-amber-600' },
  sky:     { border: 'border-sky-500/30',     bg: 'bg-sky-500/10',     text: 'text-sky-400',     icon: 'bg-sky-600' },
};

export default function NemoClawPage({ navigate }: NemoClawPageProps) {
  return (
    <div className="bg-gray-950 text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(14,165,233,0.08) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              NVIDIA NemoClaw · NeMo Agent Toolkit · GTC 2026
            </div>
          </AnimateIn>
          <AnimateIn delay={80}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white mb-6">
              Secure Agentic AI Agents<br />
              <span className="text-emerald-400">for Enterprise Marketing</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={160}>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Jensen announced it at GTC 2026. We're now deploying it for clients. Production-grade, sandboxed AI agents powered by NVIDIA NemoClaw and the NeMo Agent Toolkit — built by Hybrid Ads for the teams who can't afford to fail.
            </p>
          </AnimateIn>
          <AnimateIn delay={240} variant="fade">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/hybridadsai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl text-base font-semibold transition-colors shadow-lg shadow-emerald-900/40"
              >
                Book a Strategy Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="https://docs.nvidia.com/nemoclaw/latest/about/overview.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-white/15 text-gray-300 hover:text-white hover:border-white/30 px-8 py-4 rounded-xl text-base font-semibold transition-colors"
              >
                View Technical Overview
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </AnimateIn>
        </div>

        {/* GitHub screenshot visual */}
        <AnimateIn delay={320} variant="fade">
          <div className="relative max-w-4xl mx-auto mt-16">
            <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              <div className="bg-gray-800 border-b border-white/10 px-5 py-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="ml-4 text-xs text-gray-500 font-mono">github.com/NVIDIA/NemoClaw</span>
              </div>
              <div className="p-8 font-mono text-sm space-y-3">
                <p className="text-emerald-400 font-bold text-base"># NVIDIA NemoClaw</p>
                <p className="text-gray-400">Secure sandbox plugin for OpenClaw — production-grade agentic AI with OpenShell isolation, Landlock LSM, seccomp filtering, and reproducible execution blueprints.</p>
                <div className="mt-6 space-y-2">
                  <p className="text-gray-500">## Quick Start</p>
                  <div className="bg-black/50 border border-white/8 rounded-lg p-4 space-y-1.5">
                    <p><span className="text-gray-500">$</span> <span className="text-white">git clone https://github.com/NVIDIA/NemoClaw.git</span></p>
                    <p><span className="text-gray-500">$</span> <span className="text-white">cd NemoClaw &amp;&amp; ./install.sh</span></p>
                    <p><span className="text-gray-500">$</span> <span className="text-white">nemoclaw --help</span></p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Python', 'YAML', 'OpenTelemetry', 'NIM', 'vLLM', 'Landlock'].map(t => (
                    <span key={t} className="bg-white/5 border border-white/10 text-gray-400 text-xs px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ── Overview ── */}
      <section className="py-20 bg-gray-900 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="text-4xl font-black text-white mb-4 text-center">What Is NemoClaw?</h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-14 leading-relaxed">
              OpenClaw is NVIDIA's open agentic execution runtime. NemoClaw hardens it for enterprise production by adding an OpenShell sandbox with kernel-level isolation, then pairs it with the NeMo Agent Toolkit for world-class observability and evaluation.
            </p>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                badge: 'OpenClaw',
                color: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
                title: 'The Agentic Runtime',
                body: 'An open-source agentic execution engine that manages tool calls, memory, and multi-step reasoning chains across any LLM backend. OpenClaw provides the scaffolding; NemoClaw makes it enterprise-safe.',
              },
              {
                badge: 'NemoClaw',
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
                title: 'The Security Hardening Layer',
                body: 'An official NVIDIA plugin that wraps every agent in an OpenShell sandbox enforced by Landlock LSM and seccomp system-call filters. Network egress is allowlist-only; filesystem access is strictly scoped. Blueprints are signed and versioned.',
              },
              {
                badge: 'NeMo Agent Toolkit',
                color: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
                title: 'The Observability Layer',
                body: 'nvidia-nat adds OpenTelemetry-native tracing, latency profiling, token-level evaluation, and YAML-defined test harnesses. Every agent run produces a reproducible trace your security and ops teams can audit.',
              },
            ].map(({ badge, color, title, body }) => (
              <AnimateIn key={badge} delay={120}>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-7 h-full">
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-5 ${color}`}>{badge}</span>
                  <h3 className="text-white font-black text-lg mb-3">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-4xl font-black text-white mb-4">Enterprise-Grade Architecture</h2>
            </AnimateIn>
            <AnimateIn delay={100}>
              <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                Four interlocking layers deliver security, inference, observability, and marketing platform integration in a single coherent stack.
              </p>
            </AnimateIn>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {stackLayers.map(({ icon: Icon, label, color, items }, i) => {
              const c = colorMap[color];
              return (
                <AnimateIn key={label} delay={i * 80}>
                  <div className={`border ${c.border} rounded-2xl p-7 h-full bg-white/[0.03] hover:bg-white/[0.06] transition-colors`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`${c.icon} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{label}</span>
                    </div>
                    <ul className="space-y-2.5">
                      {items.map(item => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${c.text}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              );
            })}
          </div>

          <AnimateIn delay={200} variant="fade">
            <div className="mt-8 bg-white/[0.03] border border-white/8 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="h-5 w-5 text-gray-400" />
                <span className="text-white font-semibold">Combined Stack: OpenClaw → NemoClaw → NeMo Agent Toolkit → Hybrid Ads Integration Layer</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {[
                  { label: 'Landlock LSM', color: 'text-emerald-400 bg-emerald-500/10' },
                  { label: 'seccomp BPF', color: 'text-emerald-400 bg-emerald-500/10' },
                  { label: 'Nemotron 120B', color: 'text-blue-400 bg-blue-500/10' },
                  { label: 'vLLM', color: 'text-blue-400 bg-blue-500/10' },
                  { label: 'OpenTelemetry', color: 'text-amber-400 bg-amber-500/10' },
                  { label: 'nvidia-nat', color: 'text-amber-400 bg-amber-500/10' },
                  { label: 'Meta Ads API', color: 'text-sky-400 bg-sky-500/10' },
                  { label: 'Google Ads API', color: 'text-sky-400 bg-sky-500/10' },
                  { label: 'TikTok Ads', color: 'text-sky-400 bg-sky-500/10' },
                ].map(({ label, color }) => (
                  <span key={label} className={`px-2.5 py-1 rounded-full border border-white/10 ${color}`}>{label}</span>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Setup & Installation ── */}
      <section className="py-20 bg-gray-900 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-4xl font-black text-white mb-4">Setup & Installation</h2>
            </AnimateIn>
            <AnimateIn delay={100}>
              <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                From zero to a production-running marketing agent in five steps. Commands sourced from official NVIDIA documentation.
              </p>
            </AnimateIn>
          </div>

          <div className="space-y-6">
            {installSteps.map(({ step, title, commands, note }, i) => (
              <AnimateIn key={step} delay={i * 60}>
                <div className="flex gap-5">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-black text-white text-sm">
                    {step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold mb-3">{title}</h3>
                    <div className="bg-black/60 border border-white/8 rounded-xl p-5 font-mono text-sm space-y-2 mb-3">
                      {commands.map(cmd => (
                        <p key={cmd} className="text-gray-200">
                          <span className="text-emerald-500 select-none mr-2">$</span>{cmd}
                        </p>
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed flex gap-2">
                      <Terminal className="h-4 w-4 shrink-0 mt-0.5 text-gray-600" />
                      {note}
                    </p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={360} variant="fade">
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              <a
                href="https://docs.nvidia.com/nemoclaw/latest/about/overview.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4 hover:border-emerald-500/40 hover:bg-white/[0.03] transition-colors group"
              >
                <div>
                  <p className="text-white font-semibold text-sm">NemoClaw Docs</p>
                  <p className="text-gray-500 text-xs">docs.nvidia.com/nemoclaw</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </a>
              <a
                href="https://docs.nvidia.com/nemo/agent-toolkit/latest/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4 hover:border-blue-500/40 hover:bg-white/[0.03] transition-colors group"
              >
                <div>
                  <p className="text-white font-semibold text-sm">NeMo Agent Toolkit Docs</p>
                  <p className="text-gray-500 text-xs">docs.nvidia.com/nemo/agent-toolkit</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Key Benefits ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-4xl font-black text-white mb-4">Key Benefits for Enterprise Clients</h2>
            </AnimateIn>
            <AnimateIn delay={100}>
              <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                Built for marketing orgs that operate at scale — where compliance, reproducibility, and performance are non-negotiable.
              </p>
            </AnimateIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 70}>
                <div className="bg-white/[0.03] border border-white/8 hover:border-emerald-500/20 rounded-2xl p-7 transition-colors h-full">
                  <div className="bg-emerald-700/40 border border-emerald-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-black mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="py-20 bg-gray-900 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-4xl font-black text-white mb-4">Real-World Marketing Use Cases</h2>
            </AnimateIn>
            <AnimateIn delay={100}>
              <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                Five production-ready agent blueprints that enterprise paid media teams deploy today.
              </p>
            </AnimateIn>
          </div>
          <div className="space-y-5">
            {useCases.map(({ icon: Icon, title, desc, tags }, i) => (
              <AnimateIn key={title} delay={i * 60}>
                <div className="bg-white/[0.03] border border-white/8 hover:border-sky-500/20 rounded-2xl p-7 transition-colors">
                  <div className="flex items-start gap-5">
                    <div className="bg-sky-700/40 border border-sky-500/20 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-5 w-5 text-sky-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-black mb-2">{title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <span key={tag} className="text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Hybrid Ads ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateIn>
              <div>
                <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-4 block">Why Hybrid Ads</span>
                <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                  Humans + AI.<br />The Only Way It Works.
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  NemoClaw agents are extraordinary at execution — they run 24/7, never miss a signal, and scale to thousands of simultaneous optimizations. But marketing strategy still requires human judgment: understanding brand risk, reading cultural context, and knowing when <em>not</em> to automate.
                </p>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Hybrid Ads designs the strategy. The agents execute it. You approve the decisions that matter. That's the only architecture that survives contact with real enterprise marketing conditions.
                </p>
                <div className="space-y-3">
                  {[
                    'Hybrid Ads handles marketing strategy & oversight',
                    'NemoClaw agents execute 24/7 across all channels',
                    'Every significant action requires human approval',
                    'Full audit trail — every decision is explainable',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
            <AnimateIn delay={150} variant="fade">
              <div className="space-y-4">
                {[
                  { label: 'AI Systems Shipped', value: '50+', icon: Layers },
                  { label: 'Leads Generated for Clients', value: '2M+', icon: Target },
                  { label: 'Enterprise Marketing Orgs Served', value: '30+', icon: BarChart3 },
                  { label: 'Avg. ROAS Improvement', value: '3x+', icon: TrendingUp },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-5 bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                    <div className="bg-emerald-700/30 border border-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white">{value}</p>
                      <p className="text-gray-500 text-sm">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 bg-emerald-950 border-t border-emerald-900/60">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimateIn>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Ready to Deploy NemoClaw<br />in Your Marketing Stack?
            </h2>
          </AnimateIn>
          <AnimateIn delay={120}>
            <p className="text-emerald-200/70 text-lg mb-10 leading-relaxed">
              Book a strategy call with the Hybrid Ads team. We'll assess your current ad stack, identify the highest-impact agent blueprints, and map out a compliant, production-ready deployment plan.
            </p>
          </AnimateIn>
          <AnimateIn delay={240} variant="fade">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/hybridadsai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-xl text-base font-semibold transition-colors shadow-xl shadow-emerald-900/50"
              >
                Book a Strategy Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <button
                onClick={() => navigate('ai-agency')}
                className="inline-flex items-center justify-center border border-emerald-700 text-emerald-300 hover:text-white hover:border-emerald-500 px-10 py-4 rounded-xl text-base font-semibold transition-colors"
              >
                Explore All AI Services
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
