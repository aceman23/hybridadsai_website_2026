import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import AIAgencyPage from './pages/AIAgencyPage';

export type Page = 'home' | 'dashboard' | 'about' | 'ai-agency';

const SEO: Record<Page, { title: string; description: string }> = {
  home: {
    title: 'Hybrid Ads – AI-Powered Paid Ads Agency | 12 Yrs PPC',
    description:
      'Hybrid Ads combines human expertise with AI to manage your paid ads on Google, Meta, TikTok & more. 2M+ leads generated, $400k/month in e-commerce sales.',
  },
  'ai-agency': {
    title: 'AI Agency – Custom Agentic AI Systems | Hybrid Ads',
    description:
      'Build production-ready AI: autonomous agents, RAG pipelines, voice AI, on-device ML & LLM fine-tuning. 50+ systems shipped to 2M+ users. Enterprise & consumer.',
  },
  dashboard: {
    title: 'Ad Performance Dashboard – Multi-Platform Analytics',
    description:
      'Centralize your Google, Meta, LinkedIn & TikTok ad data in one dashboard. Eliminate data silos, surface AI insights, and optimize toward 3x+ ROAS in real time.',
  },
  about: {
    title: 'About Hybrid Ads – 12-Year Ad Experts + AI Engineers',
    description:
      'Meet the team behind 2M+ leads and 3000+ campaigns. 12 years PPC experience combined with AI automation. Real results: 602% click growth, $476k/month revenue.',
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

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'dashboard') setCurrentPage('dashboard');
      else if (hash === 'about') setCurrentPage('about');
      else if (hash === 'ai-agency') setCurrentPage('ai-agency');
      else setCurrentPage('home');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const { title, description } = SEO[currentPage];
    document.title = title;
    updateMetaTag('description', description);
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
  }, [currentPage]);

  const navigate = (page: Page) => {
    window.location.hash = page === 'home' ? '' : page;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage navigate={navigate} />;
      case 'about': return <AboutPage navigate={navigate} />;
      case 'ai-agency': return <AIAgencyPage navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPage={currentPage} navigate={navigate} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
