import { ArrowRight, Plus, ChevronUp, Bot, Mic, Smartphone, Globe, Brain, ExternalLink, Search, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';
import StatsTicker from '../components/StatsTicker';

const PROJECT_CATEGORIES = ['All', 'SaaS', 'Mobile App', 'iOS App', 'Open Source', 'AI Platform'] as const;

const recentProjects = [
  {
    name: 'DapperLimoLax',
    url: 'https://dapperlimolax.com',
    category: 'SaaS',
    tag: 'SaaS',
    tagColor: 'bg-sky-100 text-sky-700',
    desc: 'Premium luxury limousine booking platform for LAX transfers — real-time availability, fleet management, and targeted paid ad campaigns driving direct bookings.',
    stack: ['React', 'Node.js', 'Google Ads', 'Meta Ads'],
    img: '/DapperLimoLax.png',
    screenshot: true,
  },
  {
    name: 'AsterionDB',
    url: 'https://asteriondb.com',
    category: 'SaaS',
    tag: 'SaaS',
    tagColor: 'bg-sky-100 text-sky-700',
    desc: 'Enterprise database platform built for converged, secure, and simple data management. Handles unstructured content at scale without data duplication.',
    stack: ['Database', 'Cloud', 'Security', 'APIs'],
    img: '/AsterionDB.png',
    screenshot: true,
  },
  {
    name: 'Inference Learning Hub',
    url: 'https://github.com/aceman23',
    category: 'SaaS',
    tag: 'SaaS',
    tagColor: 'bg-sky-100 text-sky-700',
    desc: 'AI education platform covering disaggregated inference, LLM serving architectures, and hands-on machine learning curriculum for engineers and researchers.',
    stack: ['Next.js', 'AI/ML', 'Education', 'LLMs'],
    img: '/InferenceLearningHub.png',
    screenshot: true,
  },
  {
    name: 'mySomaLabs',
    url: 'https://mysomalabs.com',
    category: 'SaaS',
    tag: 'SaaS',
    tagColor: 'bg-sky-100 text-sky-700',
    desc: 'Biohacking and body recovery lab combining fitness science, red light therapy, cold plunge, and AI-driven personalized wellness coaching programs.',
    stack: ['React', 'Supabase', 'Meta Ads', 'Google Ads'],
    img: '/mySomaLabs.png',
    screenshot: true,
  },
  {
    name: 'OpenTranslateAI',
    url: 'https://github.com/aceman23/OpenTranslateAI-OpenSourceWebsiteTranslator',
    category: 'Open Source',
    tag: 'Open Source',
    tagColor: 'bg-orange-100 text-orange-700',
    desc: 'Open-source React translation widget with smart DOM translation, 10+ languages, local caching, batch processing, and a beautiful animated UI. Privacy-first alternative to paid tools.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    img: '/OpenTranslateAI.png',
    screenshot: true,
  },
  {
    name: 'LimoLogic',
    url: 'https://limologic.io/',
    category: 'AI Platform',
    tag: 'AI Platform',
    tagColor: 'bg-blue-100 text-blue-700',
    desc: 'AI-powered platform with turnkey websites, instant online booking, intelligent chatbots, CRM integration, and targeted Google/Meta/TikTok ads — built for luxury transportation operators.',
    stack: ['Next.js', 'AI Chatbot', 'Google Ads', 'Meta Ads'],
    img: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
    screenshot: false,
  },
  {
    name: 'SnapScanAI',
    url: 'https://github.com/aceman23/snapscan-landing',
    category: 'Mobile App',
    tag: 'Mobile AI App',
    tagColor: 'bg-green-100 text-green-700',
    desc: 'AI-powered document scanner with Gemini File Search, cloud sync, local LLM chat, smooth animations, and clean UX. Built for privacy-conscious professionals and remote workers.',
    stack: ['Next.js 13', 'TypeScript', 'Gemini AI', 'Local LLM'],
    img: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=600',
    screenshot: false,
  },
  {
    name: 'AI Agent Pals',
    url: 'https://ai-agent-pals-26.aura.build/',
    category: 'Mobile App',
    tag: 'On-Device AI',
    tagColor: 'bg-pink-100 text-pink-700',
    desc: 'Mobile app for fully offline, privacy-first AI companions using open-source LLMs (Llama, Mistral, DeepSeek) with local inference, personalized prompts, and zero data leaving your phone.',
    stack: ['Swift', 'Local LLM', 'Llama', 'Mistral'],
    img: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=600',
    screenshot: false,
  },
  {
    name: 'Car Spotting by MotorTrend',
    url: 'https://apps.apple.com/us/app/car-spotting-by-motortrend/id1447901560',
    category: 'iOS App',
    tag: 'iOS App',
    tagColor: 'bg-gray-100 text-gray-700',
    desc: 'Augmented reality car recognition game powered by machine learning — point your camera at real cars to identify, capture, and collect them in a virtual garage with detailed specs.',
    stack: ['iOS', 'ARKit', 'Core ML', 'Swift'],
    img: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600',
    screenshot: false,
  },
  {
    name: 'MotorTrend App',
    url: 'https://apps.apple.com/us/app/motortrend/id1039264027',
    category: 'iOS App',
    tag: 'iOS App',
    tagColor: 'bg-gray-100 text-gray-700',
    desc: 'Official MotorTrend app featuring streaming shows, news, buyer\'s guides, marketplace, and digital magazine archives. 4.8 stars from 56K+ ratings on the App Store.',
    stack: ['iOS', 'Swift', 'Streaming', 'Swift UI'],
    img: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=600',
    screenshot: false,
  },
];

const expertise = [
  {
    icon: Bot,
    title: 'Agentic AI & LLMs',
    desc: 'Autonomous agent architectures, RAG pipelines, multi-provider LLM integration, and tool-using AI systems built for enterprise scale.',
  },
  {
    icon: Mic,
    title: 'Voice & Conversational AI',
    desc: 'Real-time voice agents, structured conversation flows with Pipecat, and 24/7 customer-facing AI for bookings, support, and sales.',
  },
  {
    icon: Smartphone,
    title: 'On-Device ML & Mobile',
    desc: 'Fully offline AI on iOS and Android using TensorFlow Lite, MediaPipe, and Core ML. Privacy-first, zero cloud dependency.',
  },
  {
    icon: Globe,
    title: 'Paid Advertising & Growth',
    desc: 'Google, Meta, TikTok, and LinkedIn campaigns managed by humans and optimized by AI. Performance Max + 12 years of PPC expertise.',
  },
  {
    icon: Brain,
    title: 'LLM Fine-Tuning',
    desc: 'Domain-specific model fine-tuning with LoRA / QLoRA, quantization (GGUF), and custom embeddings for specialized tasks.',
  },
  {
    icon: Globe,
    title: 'Full-Stack AI Products',
    desc: 'React / Next.js frontends, FastAPI backends, Supabase, Docker deployments — complete AI products from zero to production.',
  },
];

interface HomePageProps {
  navigate: (page: Page) => void;
}

const platforms = [
  { name: 'YouTube', bg: 'bg-red-500', text: 'YT' },
  { name: 'Facebook', bg: 'bg-blue-600', text: 'f' },
  { name: 'Instagram', bg: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400', text: 'IG' },
  { name: 'LinkedIn', bg: 'bg-blue-700', text: 'in' },
  { name: 'X / Twitter', bg: 'bg-gray-900', text: 'X' },
  { name: 'Google Ads', bg: 'bg-blue-500', text: 'G' },
  { name: 'TikTok', bg: 'bg-black', text: 'TT' },
  { name: 'Meta', bg: 'bg-blue-500', text: 'M' },
];

const testimonials = [
  {
    quote: 'Hybrid Ads team setup our Shopify Store in 14 days with the latest e-com features available. The site looks amazing, we are thrilled with the results.',
    name: 'Owner – Bond & Stitch Company',
    logo: 'Bond&Stitch\ncompany',
  },
  {
    quote: "What's especially encouraging is the quality of these leads. We're seeing more and more interest from larger enterprises, including companies with billion-dollar+ revenues and many in the $100 million+ range.",
    name: 'Founder – Comerit.com',
    logo: 'COMERIT',
    logoSub: 'Data | AI | Cloud | Analytics',
  },
  {
    quote: 'Hybrid Ads redesigned our website, setup their paid ads strategy. We saw 602.6% increase in "Book Now" clicks (driven by targeted ads and a user-friendly website) that\'s over 490 bookings a month with a 70% conversion rate.',
    name: 'Owners of NewportBodyWorks.com',
    logo: 'NEWPORT\nBODY WORKS',
  },
  {
    quote: 'Hybrid Ads team setup our Shopify Store and our Amazon listing for our brand and got our first sales.',
    name: 'Owner – Gains Haus Athletic Apparel',
    logo: 'Gains Haus\nATHLETIC APPAREL',
  },
  {
    quote: 'A milestone this week that Pivet has enjoyed is that we have had a new B2C order every day. As a business, we have NEVER had orders daily. THANK YOU',
    name: 'Founder – mypivet.com',
    logo: 'pivot',
  },
  {
    quote: "Hybrid Ad's website redesign, SEO optimizations & paid ad campaigns delivered a jaw-dropping 3X increase in monthly conversions & bookings for us.",
    name: 'Owner of mySomaLabs.com',
    logo: 'SOMALAB',
  },
  {
    quote: 'Hybrid Ads setup our brand website, wholesale management platform with integration into State compliance system',
    name: 'Owner – Roll It Up Inc',
    logo: 'ROLL IT UP',
  },
  {
    quote: 'Hybrid Ads grew our website engagement to over 1.6k users in 60 days and ranked us on the first page of google',
    name: 'Owner – Brooklynz Pizza Artesia',
    logo: 'BROOKLYNZ\nPIZZA',
  },
  {
    quote: 'With the setup of Google Ads, Facebook Ads and Shopify pixel tracking, we were able to see a complete dashboard of our ad spend, performance & attributed purchases by channels and audience type',
    name: 'Owner – TerraRosaWines Family Office',
    logo: 'TERRA ROSA\nWINES',
  },
  {
    quote: 'Setting up a shopify landing page helped us convert around 60% better from our original site',
    name: 'Founder – Paradise Club',
    logo: 'PARADISE\nCLUB',
  },
  {
    quote: 'Hybrid Ads AI manages the ad space through the creatives and gives outperforming ads that bring value',
    name: 'Owner – Don Wapo Hot Sauce',
    logo: 'DON WAPO\nHOT SAUCE',
  },
  {
    quote: 'We saw Month over Month of Revenue Growth as we increased our daily ad spend and watched our organic search increase',
    name: 'Owner – Delivery E-commerce',
    logo: 'DELIVERY\nE-COMMERCE',
  },
];

const deployItems = [
  {
    title: 'Deploy, manage and measure your ads to Google, TikTok, Facebook, YouTube and Instagram!',
    body: 'We use machine learning, human intuition to find the best audiences for your business or brand, so you can make more impact on recognition and sales growth.',
    open: true,
  },
  {
    title: 'Optimize The Best Content For Every Platform',
    body: "Videos, stills, promotions, influencer marketing, oh my. It's a tricky game, let us help you get an upper hand.",
    open: false,
  },
];

const revenueItems = [
  {
    title: 'Increase ROAS by 30% On Average',
    body: 'Our AI reduces the workload for our agents, allowing you to spend that money growing your business!\n\nLet our AI optimize your ad at speed, while your competitor 😴',
  },
  {
    title: 'Eliminate Agency Fees',
    body: 'We use machine learning, human intuition to find the best audiences for your business or brand, so you can make more impact on recognition and sales growth across all channels.',
  },
];

function AccordionItem({ title, body, defaultOpen = false }: { title: string; body?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="flex items-center justify-between w-full px-5 py-4 text-left font-semibold text-gray-800 bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" /> : <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && body && (
        <div className="px-5 pb-4 text-sm text-gray-600 bg-white whitespace-pre-line">
          {body}
        </div>
      )}
    </div>
  );
}

function ProjectsSection({ navigate }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visible, setVisible] = useState(true);
  const [displayedCategory, setDisplayedCategory] = useState<string>('All');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCategory = (cat: string) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDisplayedCategory(cat);
      setVisible(true);
    }, 180);
  };

  const filtered = displayedCategory === 'All'
    ? recentProjects
    : recentProjects.filter((p) => p.category === displayedCategory);

  const counts = PROJECT_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === 'All' ? recentProjects.length : recentProjects.filter((p) => p.category === cat).length;
    return acc;
  }, {});

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <AnimateIn>
            <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Recent Projects
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">What We've Built</h2>
          </AnimateIn>
          <AnimateIn delay={120}>
            <p className="text-gray-500 max-w-xl mx-auto">
              From AI-powered mobile apps to open-source tools and high-traffic iOS apps with millions of users
            </p>
          </AnimateIn>
        </div>

        <AnimateIn delay={200}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  activeCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {counts[cat]}
                </span>
              </button>
            ))}
          </div>
        </AnimateIn>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 180ms ease, transform 180ms ease' }}
        >
          {filtered.map((project, i) => (
            <div
              key={project.name}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className={`overflow-hidden ${project.screenshot ? 'h-48 bg-gray-50' : 'h-44'}`}>
                <img
                  src={project.img}
                  alt={project.name}
                  className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                    project.screenshot ? 'object-cover object-top' : 'object-cover'
                  }`}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${project.tagColor}`}>
                    {project.tag}
                  </span>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <h3 className="font-black text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span key={tech} className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <AnimateIn>
            <button
              onClick={() => navigate('ai-agency')}
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View full AI Systems portfolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ navigate }: HomePageProps) {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <div className="inline-flex items-center bg-blue-100 text-blue-700 text-sm font-medium rounded-full px-4 py-1.5 mb-6">
              Meta Ads · X Ads · TikTok Ads · Google Ads · 12 Years Experience
            </div>
          </AnimateIn>
          <AnimateIn delay={120}>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              <span className="text-blue-600">Humans</span>
              <span className="text-gray-900"> + </span>
              <span className="text-pink-500">AI</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={240}>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              <span className="text-blue-600 font-semibold">Hybrid Ads</span> builds AI systems that eliminate costly manual processes — from autonomous ad management to custom agentic workflows — so your business scales smarter, not harder. We cut{' '}
              <span className="text-green-600 font-semibold">digital labor costs</span> while maximizing returns across every platform.
            </p>
          </AnimateIn>
          <AnimateIn delay={360}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/hybridadsai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Book a Free Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <button
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                View Ad Performance
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('ai-score')}
                className="inline-flex items-center justify-center border-2 border-cyan-400 text-cyan-600 px-8 py-4 rounded-xl text-base font-semibold hover:bg-cyan-50 transition-colors gap-2"
              >
                <span className="text-xs bg-cyan-500 text-white font-bold px-1.5 py-0.5 rounded-full">Free</span>
                AI Publisher Score
              </button>
            </div>
          </AnimateIn>
          <AnimateIn delay={480}>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: '2M+', label: 'Leads Generated' },
                { value: '$400k', label: 'Monthly E-com Sales' },
                { value: '3000+', label: 'Google Campaigns' },
                { value: '12 yrs', label: 'PPC Experience' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 py-5 px-4">
                  <div className="text-2xl md:text-3xl font-black text-blue-600">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      <StatsTicker />

      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <AnimateIn>
              <div className="inline-flex items-center bg-cyan-50 text-cyan-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                AI Publisher Score — Free Tool
              </div>
            </AnimateIn>
            <AnimateIn delay={80}>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                Is Your Business Visible to AI?
              </h2>
            </AnimateIn>
            <AnimateIn delay={180}>
              <p className="text-gray-500 max-w-2xl mx-auto">
                ChatGPT, Gemini, and Perplexity are now where customers search for businesses.
                <br />
                If AI gets your name, address, or category wrong — you're losing customers without knowing it.
              </p>
            </AnimateIn>
          </div>
          <AnimateIn delay={200}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Search,
                  color: 'bg-blue-50 text-blue-600',
                  title: 'AI is the New Search',
                  desc: 'Millions of people ask ChatGPT and Gemini to recommend local businesses, restaurants, and services every day.',
                },
                {
                  icon: AlertTriangle,
                  color: 'bg-amber-50 text-amber-600',
                  title: 'Wrong Info Costs You',
                  desc: 'AI models often hallucinate outdated phone numbers, wrong addresses, or misclassified business categories — sending customers elsewhere.',
                },
                {
                  icon: TrendingUp,
                  color: 'bg-green-50 text-green-600',
                  title: 'Score Across 5 Platforms',
                  desc: 'We check ChatGPT, Gemini, Copilot, Grok, and Perplexity instantly and show you exactly what each one says about your business.',
                },
                {
                  icon: CheckCircle,
                  color: 'bg-cyan-50 text-cyan-600',
                  title: 'Fix It Before It Hurts',
                  desc: 'Know your AI visibility score in seconds — and get actionable steps to ensure AI models represent your business accurately.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-md transition-all duration-200">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2 text-sm">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </AnimateIn>
          <AnimateIn delay={320}>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('ai-score')}
                className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors shadow-lg shadow-cyan-100 gap-2"
              >
                <span className="text-xs bg-white/20 font-bold px-1.5 py-0.5 rounded-full">Free</span>
                Check Your AI Score Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {platforms.map((p) => (
                  <div key={p.name} className="flex flex-col items-center gap-1">
                    <div className={`${p.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md`}>
                      {p.text}
                    </div>
                    <span className="text-xs text-gray-500 text-center">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <AnimateIn>
                <h2 className="text-4xl font-black text-gray-900 mb-2">Create Once Deploy</h2>
                <h2 className="text-4xl font-black text-blue-600 mb-8">Everywhere</h2>
              </AnimateIn>
              <div className="space-y-3">
                {deployItems.map((item) => (
                  <AccordionItem key={item.title} title={item.title} body={item.body} defaultOpen={item.open} />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-16 pt-16">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <AnimateIn>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">Let Hybrid Ads Grow</h2>
                  <h2 className="text-4xl font-black mb-8">
                    <span className="text-blue-600">Your</span> Revenue
                  </h2>
                </AnimateIn>
                <div className="space-y-3">
                  {revenueItems.map((item) => (
                    <AccordionItem key={item.title} title={item.title} body={item.body} />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="text-xs text-gray-500 mb-1">Return on Ad Spend</div>
                <div className="text-2xl font-black text-blue-600 mb-4">3.08x</div>
                <div className="relative h-32 flex items-end gap-1">
                  {[40, 55, 35, 60, 45, 70, 55, 80, 65, 90, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-100 rounded-t-sm relative"
                      style={{ height: `${h}%` }}
                    >
                      {i === 11 && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Track recent sales</div>
                  {['Organic Search', 'Paid Search', 'Social'].map((src) => (
                    <div key={src} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                      <span className="text-xs text-gray-600">{src}</span>
                      <div className="w-16 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-100 rounded-2xl overflow-hidden">
              <img
                src="/hybridAds_testimonial.png"
                alt="HybridAds case study"
                className="w-full object-cover"
              />
              <div className="p-6 bg-slate-50">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="text-xl font-black text-gray-900">42,345</div>
                    <div className="text-xs text-gray-500">Total Sessions</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="text-xl font-black text-gray-900">10.36%</div>
                    <div className="text-xs text-gray-500">Conversion Rate</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="text-xl font-black text-gray-900">4,386</div>
                    <div className="text-xs text-gray-500">Transactions</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="text-xl font-black text-green-600">$476,109</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-block bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Case Study
              </div>
              <AnimateIn>
                <h2 className="text-4xl font-black text-blue-600 mb-5 leading-tight">
                  We increased online sales revenue over 50% to $476,109 per month by driving up organic search.
                </h2>
              </AnimateIn>
              <AnimateIn delay={150}>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Learn how we grew online sales by driving organic search for a delivery brand in Sacramento, CA 😎
                </p>
              </AnimateIn>
              <AnimateIn delay={280}>
                <button
                  onClick={() => navigate('about')}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Case Study on growth
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Customer Testimonials</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-500">Join our clients in saving hundreds of hours per year on digital marketing</p>
            </AnimateIn>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <div className="font-black text-gray-800 text-sm whitespace-pre-line mb-0.5">{t.logo}</div>
                  {t.logoSub && <div className="text-xs text-blue-600 font-medium mb-1">{t.logoSub}</div>}
                  <div className="text-xs text-gray-400">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <AnimateIn>
              <p className="text-gray-500 mb-5 text-base">Ready to see results like these?</p>
            </AnimateIn>
            <AnimateIn delay={150}>
              <a
                href="https://calendly.com/hybridadsai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-10 py-4 rounded-xl text-base font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Book a Free Strategy Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </AnimateIn>
          </div>
        </div>
      </section>

      <ProjectsSection navigate={navigate} />

      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateIn>
              <h2 className="text-4xl font-black text-white mb-3">Core Expertise</h2>
            </AnimateIn>
            <AnimateIn delay={120}>
              <p className="text-gray-400 max-w-xl mx-auto">
                Ads. AI. Apps. We cover the full spectrum of modern digital growth.
              </p>
            </AnimateIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {expertise.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition-colors">
                  <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-black text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <AnimateIn>
              <button
                onClick={() => navigate('ai-agency')}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Explore AI Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimateIn>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
              Ready to Grow Your Business?
            </h2>
          </AnimateIn>
          <AnimateIn delay={150}>
            <p className="text-gray-500 text-lg mb-8">
              Paid ads, AI systems, mobile apps, or full-stack products — Hybrid Ads delivers results with humans and AI working together.
            </p>
          </AnimateIn>
          <AnimateIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/hybridadsai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Book a Free Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <button
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                View Ad Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('ai-agency')}
                className="inline-flex items-center justify-center border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-base font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                Explore AI Services
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
