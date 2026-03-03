import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import AIAgencyPage from './pages/AIAgencyPage';
import AIScorePage from './pages/AIScorePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';

export type Page = 'home' | 'dashboard' | 'about' | 'ai-agency' | 'ai-score' | 'privacy' | 'terms';

const KNOWN_PAGES: Page[] = ['home', 'dashboard', 'about', 'ai-agency', 'ai-score', 'privacy', 'terms'];

const SEO: Record<Page, { title: string; description: string; path: string }> = {
  home: {
    title: 'Hybrid Ads – AI-Powered Paid Ads Agency | 12 Yrs PPC',
    description:
      'Hybrid Ads combines human expertise with AI to manage your paid ads on Google, Meta, TikTok & more. 2M+ leads generated, $400k/month in e-commerce sales.',
    path: '',
  },
  'ai-agency': {
    title: 'AI Systems – Custom Agentic AI Systems | Hybrid Ads',
    description:
      'Build production-ready AI: autonomous agents, RAG pipelines, voice AI, on-device ML & LLM fine-tuning. 50+ systems shipped to 2M+ users. Enterprise & consumer.',
    path: 'ai-agency',
  },
  dashboard: {
    title: 'Ad Performance Dashboard – Multi-Platform Analytics',
    description:
      'Centralize your Google, Meta, LinkedIn & TikTok ad data in one dashboard. Eliminate data silos, surface AI insights, and optimize toward 3x+ ROAS in real time.',
    path: 'dashboard',
  },
  about: {
    title: 'About Hybrid Ads – 12-Year Ad Experts + AI Engineers',
    description:
      'Meet the team behind 2M+ leads and 3000+ campaigns. 12 years PPC experience combined with AI automation. Real results: 602% click growth, $476k/month revenue.',
    path: 'about',
  },
  'ai-score': {
    title: 'AI Publisher Score – Free Business Visibility Audit | Hybrid Ads',
    description: 'Check how accurately ChatGPT, Gemini, Copilot, Grok, and Perplexity describe your business. Get your free AI Publisher Score in seconds.',
    path: 'ai-score',
  },
  privacy: {
    title: 'Privacy Policy – HybridAds.ai',
    description: 'Learn how HybridAds.ai collects, uses, and protects your personal data. GDPR & CCPA compliant.',
    path: 'privacy',
  },
  terms: {
    title: 'Terms of Service – HybridAds.ai',
    description: 'Read the Terms of Service for HybridAds.ai, including DMCA policy, intellectual property rights, and service conditions.',
    path: 'terms',
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
      case 'ai-agency': return <AIAgencyPage navigate={navigate} />;
      case 'ai-score': return <AIScorePage navigate={navigate} />;
      case 'privacy': return <PrivacyPolicyPage navigate={navigate} />;
      case 'terms': return <TermsOfServicePage navigate={navigate} />;
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
          {renderPage()}
        </main>
        <Footer navigate={navigate} />
        <CookieConsent navigate={navigate} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
