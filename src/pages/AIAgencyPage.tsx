import {
  Bot,
  Brain,
  Mic,
  Video,
  Smartphone,
  Code2,
  Layers,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Github,
  Zap,
  Globe,
  Database,
  MessageSquare,
  Search,
} from 'lucide-react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';

interface AIAgencyPageProps {
  navigate: (page: Page) => void;
}

const services = [
  {
    icon: Bot,
    title: 'AI Agent Architectures',
    description:
      'Custom autonomous agent systems with secure tool integration, persistent memory, multi-modal reasoning, and multi-provider model support. Built for production scale.',
    tags: ['LangChain', 'AutoGen', 'Groq', 'OpenAI', 'Anthropic'],
  },
  {
    icon: Database,
    title: 'RAG Pipelines & Vector DBs',
    description:
      'Retrieval-Augmented Generation systems with semantic search, hybrid retrieval, evaluation frameworks, and custom embeddings over your proprietary data.',
    tags: ['Pinecone', 'Weaviate', 'pgvector', 'Chroma', 'Qdrant'],
  },
  {
    icon: Mic,
    title: 'Voice & Conversational Agents',
    description:
      'Real-time voice AI with low-latency speech-to-speech, structured conversation flows using Pipecat, and custom orchestration for live customer interactions.',
    tags: ['Pipecat', 'Voiceflow', 'ElevenLabs', 'Deepgram', 'Twilio'],
  },
  {
    icon: Video,
    title: 'Video Generation Pipelines',
    description:
      'Open-weights video generation using Hunyuan, Stable Video Diffusion, and custom training frameworks for large-scale, brand-aligned content creation.',
    tags: ['Hunyuan', 'SVD', 'ComfyUI', 'Diffusers', 'CUDA'],
  },
  {
    icon: Smartphone,
    title: 'On-Device ML & Mobile AI',
    description:
      'Ship AI directly on Android and iOS devices. Real-time ML inference with MediaPipe, TensorFlow Lite, and Core ML — zero cloud dependency, maximum privacy.',
    tags: ['TensorFlow Lite', 'MediaPipe', 'Core ML', 'Kotlin', 'Swift'],
  },
  {
    icon: Brain,
    title: 'LLM Fine-Tuning & Quantization',
    description:
      'Domain-specific model adaptation using LoRA, QLoRA, and GGUF quantization. Deploy custom models that outperform general-purpose LLMs on your specific tasks.',
    tags: ['LoRA', 'QLoRA', 'GGUF', 'Unsloth', 'Ollama'],
  },
  {
    icon: Layers,
    title: 'Full-Stack AI Applications',
    description:
      'Production-ready AI products with React/Next.js frontends, FastAPI backends, Gradio/Streamlit interfaces, and Dockerized deployments on any cloud.',
    tags: ['FastAPI', 'Next.js', 'Docker', 'Gradio', 'Supabase'],
  },
  {
    icon: Code2,
    title: 'iOS & Android Apps',
    description:
      'High-quality native mobile apps with beautiful UI, ML integration, and App Store delivery. Contributed to MotorTrend (56K+ ratings) and multiple production apps.',
    tags: ['Swift', 'Kotlin', 'React Native', 'SwiftUI', 'Jetpack Compose'],
  },
];

const techStack = [
  { name: 'Python', cat: 'Core' },
  { name: 'LLMs / GPT-4o', cat: 'AI' },
  { name: 'Groq', cat: 'Inference' },
  { name: 'Ollama', cat: 'Local AI' },
  { name: 'React / Next.js', cat: 'Frontend' },
  { name: 'TypeScript', cat: 'Frontend' },
  { name: 'FastAPI', cat: 'Backend' },
  { name: 'Docker', cat: 'DevOps' },
  { name: 'Swift / SwiftUI', cat: 'iOS' },
  { name: 'Kotlin', cat: 'Android' },
  { name: 'TensorFlow Lite', cat: 'On-Device' },
  { name: 'MediaPipe', cat: 'On-Device' },
  { name: 'Pipecat', cat: 'Voice' },
  { name: 'Supabase', cat: 'Database' },
  { name: 'Tailwind CSS', cat: 'UI' },
  { name: 'Hunyuan', cat: 'Video AI' },
];

const openSourceProjects = [
  {
    emoji: '🚀',
    name: 'agent-runner_xai',
    desc: 'Model-agnostic agent harness with secure tools, workspace management, and multi-provider support.',
    tags: ['Agents', 'Multi-Provider'],
  },
  {
    emoji: '📓',
    name: 'open-notebook-ai-app',
    desc: 'Flexible open-source NotebookLM implementation with easy Docker deployment.',
    tags: ['RAG', 'Docker'],
  },
  {
    emoji: '🎥',
    name: 'HunyuanVideoAI-Generator',
    desc: 'Open weights and training framework for large-scale video generation.',
    tags: ['Video AI', 'Open Weights'],
  },
  {
    emoji: '🗣️',
    name: 'pipecat-flows-ai_editor',
    desc: 'Visual editor + framework for structured AI conversations using Pipecat.',
    tags: ['Voice AI', 'Pipecat'],
  },
  {
    emoji: '🤖',
    name: 'Persona-AI_Groq',
    desc: 'Multi-chat with specialized AI IT personas powered by Groq for blazing-fast inference.',
    tags: ['Groq', 'Chat AI'],
  },
  {
    emoji: '📱',
    name: 'google_AI_Edge_Android',
    desc: 'On-device ML/GenAI showcase for Android using MediaPipe and TensorFlow Lite.',
    tags: ['Android', 'On-Device'],
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery & Architecture',
    desc: 'We map your data, workflows, and goals to design the right AI system — no over-engineering, no black boxes.',
  },
  {
    step: '02',
    title: 'Prototype & Validate',
    desc: 'Rapid prototyping with real evaluation metrics. We validate that it works before we build it at scale.',
  },
  {
    step: '03',
    title: 'Build & Integrate',
    desc: 'Production-grade implementation with your existing stack. APIs, webhooks, mobile, web — whatever you need.',
  },
  {
    step: '04',
    title: 'Deploy & Optimize',
    desc: 'Dockerized deployments, monitoring, and continuous improvement loops powered by real usage data.',
  },
];

export default function AIAgencyPage({ navigate }: AIAgencyPageProps) {
  return (
    <div className="bg-white">
      <section className="relative bg-gray-950 text-white overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium rounded-full px-4 py-1.5 mb-8">
              <Zap className="h-4 w-4" />
              Agentic AI — Built for Production
            </div>
          </AnimateIn>
          <AnimateIn delay={120}>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              We Build
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Agentic AI Systems
              </span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={240}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              From autonomous agent pipelines and RAG systems to voice AI, on-device ML, and
              full-stack AI products — we architect and ship intelligent systems that scale.
              Humans + AI working together, end to end.
            </p>
          </AnimateIn>
          <AnimateIn delay={360}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('about')}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-xl shadow-blue-900/30"
              >
                Work With Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a
                href="https://github.com/aceman23"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border-2 border-white/15 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition-colors"
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub Portfolio
              </a>
            </div>
          </AnimateIn>

          <AnimateIn delay={480}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: '50+', label: 'AI Systems Shipped' },
                { value: '8', label: 'Platforms Supported' },
                { value: '2M+', label: 'Users Reached' },
                { value: 'B2B + B2C', label: 'Enterprise & Consumer' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl py-5 px-4">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-4xl font-black text-gray-900 mb-3">What We Build</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500 max-w-xl mx-auto">
                End-to-end AI solutions across every layer of the stack — from inference to interface
              </p>
            </AnimateIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-200 hover:shadow-lg rounded-2xl p-6 transition-all"
                >
                  <div className="bg-blue-600 w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-3">
                <Github className="h-4 w-4" />
                Open Source
              </div>
              <h2 className="text-4xl font-black mb-3">Active Open-Source Projects</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-400 max-w-xl mx-auto">
                We build in the open. Explore our tools and frameworks on GitHub.
              </p>
            </AnimateIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {openSourceProjects.map((proj) => (
              <div
                key={proj.name}
                className="bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-white/8 rounded-2xl p-6 transition-all"
              >
                <div className="text-3xl mb-3">{proj.emoji}</div>
                <h3 className="font-black text-white mb-2 font-mono text-sm">{proj.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-500/15 text-blue-400 font-medium px-2 py-0.5 rounded-full border border-blue-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://github.com/aceman23"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              <Github className="mr-2 h-4 w-4" />
              View all repos on GitHub
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-4xl font-black text-gray-900 mb-3">Tech Stack</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500">The tools we use to build production AI systems</p>
            </AnimateIn>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <div key={tech.name} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                <span className="text-xs text-gray-400 font-medium">{tech.cat}</span>
                <span className="w-px h-3 bg-gray-200"></span>
                <span className="text-sm font-bold text-gray-800">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <AnimateIn>
              <h2 className="text-4xl font-black text-gray-900 mb-3">How We Work</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500 max-w-xl mx-auto">
                A lean, fast, and transparent process — from first call to production deployment
              </p>
            </AnimateIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step) => (
              <div key={step.step} className="relative">
                <div className="text-6xl font-black text-gray-100 mb-4 leading-none">{step.step}</div>
                <h3 className="font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-4xl font-black text-gray-900 mb-3">What We Deliver</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500 max-w-xl mx-auto">Built for Enterprise (B2B) and Consumer (B2C) clients worldwide</p>
            </AnimateIn>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: 'SaaS Platforms',
                items: ['AI-powered web apps', 'Multi-tenant architectures', 'API-first backends', 'Real-time dashboards'],
              },
              {
                icon: MessageSquare,
                title: 'Conversational AI',
                items: ['Voice agents (24/7)', 'Customer support bots', 'Sales automation', 'Structured flows'],
              },
              {
                icon: Search,
                title: 'Intelligent Search & RAG',
                items: ['Enterprise knowledge bases', 'Document Q&A systems', 'Semantic search', 'Custom embeddings'],
              },
              {
                icon: Cpu,
                title: 'On-Device & Edge AI',
                items: ['iOS & Android ML apps', 'Offline-first AI', 'Privacy-first inference', 'MediaPipe / TFLite'],
              },
              {
                icon: Video,
                title: 'Generative Media',
                items: ['AI video pipelines', 'Image generation APIs', 'Brand content at scale', 'Fine-tuned models'],
              },
              {
                icon: Bot,
                title: 'Autonomous Agents',
                items: ['Multi-agent orchestration', 'Tool-using AI systems', 'Long-horizon planning', 'Memory & context'],
              },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2.5 rounded-xl">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-black text-gray-900">{cat.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimateIn>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Let's Build Your AI System
            </h2>
          </AnimateIn>
          <AnimateIn delay={150}>
            <p className="text-gray-400 text-lg mb-10">
              AI Architect with 12+ years in digital — building the next generation of intelligent,
              autonomous systems for clients worldwide. Book a free discovery call to get started.
            </p>
          </AnimateIn>
          <AnimateIn delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/hybridadsai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-xl shadow-green-900/30"
            >
              Book a Free Call
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/antonansalmar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-white/15 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition-colors"
            >
              Connect on LinkedIn
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
