import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AIAgencyPage = lazy(() => import('./pages/AIAgencyPage'));
const AIScorePage = lazy(() => import('./pages/AIScorePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const NemoClawPage = lazy(() => import('./pages/NemoClawPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const SocialMediaGeneratorPage = lazy(() => import('./pages/SocialMediaGeneratorPage'));
const GTMServicePage = lazy(() => import('./pages/GTMServicePage'));

export type Page = 'home' | 'dashboard' | 'about' | 'case-studies' | 'ai-agency' | 'ai-score' | 'privacy' | 'terms' | 'nemo-claw' | 'social-generator' | 'gtm-service';

const KNOWN_PAGES: Page[] = ['home', 'dashboard', 'about', 'case-studies', 'ai-agency', 'ai-score', 'privacy', 'terms', 'nemo-claw', 'social-generator', 'gtm-service'];

const SEO: Record<Page, { title: string; description: string; path: string }> = {
  home: {
    title: 'Hybrid Ads – AI Systems Integrator & Paid Ads Agency',
    description:
      'Hybrid Ads builds AI systems and manages paid ads on Google, Meta, TikTok & more. Cut digital labor costs, scale smarter. 2M+ leads generated.',
    path: '',
  },
  'ai-agency': {
    title: 'AI Systems Integrator – Agents, RAG & Voice AI | Hybrid Ads',
    description:
      'Custom AI systems built for production: autonomous agents, RAG pipelines, voice AI, LLM fine-tuning & on-device ML. 50+ systems shipped to 2M+ users.',
    path: 'ai-agency',
  },
  dashboard: {
    title: 'Ad Analytics Dashboard – Google, Meta, TikTok & LinkedIn',
    description:
      'Unify Google, Meta, LinkedIn & TikTok ad data in one AI-powered dashboard. Surface insights, eliminate data silos, and optimize toward 3x+ ROAS.',
    path: 'dashboard',
  },
  about: {
    title: 'About Hybrid Ads – AI Systems Integrators & PPC Experts',
    description:
      'Meet the team behind 50+ AI systems and 3000+ ad campaigns. 15 years of Web + Mobile Dev combined with production-grade AI engineering.',
    path: 'about',
  },
  'case-studies': {
    title: 'Case Studies – Client Results & Growth Stories | Hybrid Ads',
    description:
      'See how Hybrid Ads delivers measurable results: $476K/month revenue, 602% booking increases, 101.9K Instagram views, and more. Real results for real businesses.',
    path: 'case-studies',
  },
  'ai-score': {
    title: 'AI Publisher Score – Free AI Visibility Audit | Hybrid Ads',
    description:
      'Discover how ChatGPT, Gemini, Copilot, Grok & Perplexity describe your business. Get your free AI Publisher Score and visibility report in seconds.',
    path: 'ai-score',
  },
  privacy: {
    title: 'Privacy Policy – HybridAds.ai',
    description:
      'Read the HybridAds.ai Privacy Policy. We explain how your data is collected, used, and protected. GDPR & CCPA compliant.',
    path: 'privacy',
  },
  terms: {
    title: 'Terms of Service – HybridAds.ai',
    description:
      'Review the HybridAds.ai Terms of Service covering usage rights, intellectual property, DMCA policy, and conditions for using our platform.',
    path: 'terms',
  },
  'nemo-claw': {
    title: 'NemoClaw Enterprise AI Agents | Secure Agentic AI for Marketing & Ads',
    description:
      'Deploy production-grade, sandboxed AI agents with NVIDIA NemoClaw and NeMo Agent Toolkit — built by Hybrid Ads for enterprise paid media teams.',
    path: 'nemo-claw',
  },
  'social-generator': {
    title: 'Social Media Card Generator – Auto Brand Detection | Hybrid Ads',
    description:
      'Paste any website URL to auto-extract brand colors, logo, and identity. Generate download-ready social media cards for Instagram, LinkedIn, Twitter & Facebook.',
    path: 'social-generator',
  },
  'gtm-service': {
    title: 'AI Go-To-Market Sales Team – $0.03/Email | Hybrid Ads',
    description:
      'Deploy a fully autonomous AI sales team of 7 agents. Prospect, personalize, and outreach 24/7 at $0.03 per email. No contracts, no minimums, live in 24 hours.',
    path: 'gtm-service',
  },
};

function updateMetaTag(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function updatePropertyTag(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function updateCanonical(path: string) {
  const canonical = document.getElementById('canonical-link') as HTMLLinkElement | null;
  const base = 'https://hybridads.ai/';
  if (canonical) {
    canonical.href = path ? `${base}#${path}` : base;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Page;
      if (!hash) {
        setCurrentPage('home');
        setIs404(false);
      } else if (KNOWN_PAGES.includes(hash)) {
        setCurrentPage(hash);
        setIs404(false);
      } else {
        setIs404(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (is404) return;
    const { title, description, path } = SEO[currentPage];
    document.title = title;
    updateMetaTag('description', description);
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:url', path ? `https://hybridads.ai/#${path}` : 'https://hybridads.ai/');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateCanonical(path);
  }, [currentPage, is404]);

  const navigate = (page: Page) => {
    window.location.hash = page === 'home' ? '' : page;
    setCurrentPage(page);
    setIs404(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (is404) return <NotFoundPage navigate={navigate} />;
    switch (currentPage) {
      case 'dashboard': return <DashboardPage navigate={navigate} />;
      case 'about': return <AboutPage navigate={navigate} />;
      case 'case-studies': return <CaseStudiesPage navigate={navigate} />;
      case 'ai-agency': return <AIAgencyPage navigate={navigate} />;
      case 'ai-score': return <AIScorePage navigate={navigate} />;
      case 'privacy': return <PrivacyPolicyPage navigate={navigate} />;
      case 'terms': return <TermsOfServicePage navigate={navigate} />;
      case 'nemo-claw': return <NemoClawPage navigate={navigate} />;
      case 'social-generator': return <SocialMediaGeneratorPage navigate={navigate} />;
      case 'gtm-service': return <GTMServicePage navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded-lg z-[100] font-semibold text-sm"
        >
          Skip to main content
        </a>
        <Header currentPage={currentPage} navigate={navigate} />
        <main id="main-content" className="flex-grow" tabIndex={-1}>
          <Suspense fallback={<div className="min-h-screen" />}>
            {renderPage()}
          </Suspense>
        </main>
        <Footer navigate={navigate} />
        <CookieConsent navigate={navigate} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
