import { useState } from 'react';
import { Layers, MessageSquareQuote, Quote, Megaphone, Star, Sparkles, Zap } from 'lucide-react';
import type { Page } from '../App';
import type { BrandData, CardTab } from '../components/social-generator/types';
import BrandInput from '../components/social-generator/BrandInput';
import FeatureCards from '../components/social-generator/FeatureCards';
import TestimonialCards from '../components/social-generator/TestimonialCards';
import QuoteCards from '../components/social-generator/QuoteCards';
import CustomQuoteCard from '../components/social-generator/CustomQuoteCard';
import PromotionalCard from '../components/social-generator/PromotionalCard';
import ViralPostEngine from '../components/social-generator/ViralPostEngine';

interface SocialMediaGeneratorPageProps {
  navigate: (page: Page) => void;
}

const TABS: { id: CardTab; label: string; icon: typeof Layers }[] = [
  { id: 'features', label: 'Feature Cards', icon: Layers },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'quotes', label: 'Quote Cards', icon: MessageSquareQuote },
  { id: 'custom-quote', label: 'Custom Quote', icon: Quote },
  { id: 'promotional', label: 'Promotional', icon: Megaphone },
  { id: 'viral-posts', label: 'Viral Posts', icon: Zap },
];

const DEFAULT_BRAND: BrandData = {
  name: 'Your Brand',
  logoUrl: '',
  primaryColor: '#2563eb',
  secondaryColor: '#06b6d4',
  tagline: 'Paste a website URL above to auto-detect your brand identity',
  domain: 'yourbrand.com',
};

export default function SocialMediaGeneratorPage({ navigate }: SocialMediaGeneratorPageProps) {
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [activeTab, setActiveTab] = useState<CardTab>('features');
  const [loading, setLoading] = useState(false);

  const activeBrand = brand || DEFAULT_BRAND;

  void navigate;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'features':
        return <FeatureCards brand={activeBrand} />;
      case 'testimonials':
        return <TestimonialCards brand={activeBrand} />;
      case 'quotes':
        return <QuoteCards brand={activeBrand} />;
      case 'custom-quote':
        return <CustomQuoteCard brand={activeBrand} />;
      case 'promotional':
        return <PromotionalCard brand={activeBrand} />;
      case 'viral-posts':
        return <ViralPostEngine brand={activeBrand} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-[128px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-cyan-500 rounded-full filter blur-[128px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-300 mb-6 border border-white/10">
              <Sparkles className="h-4 w-4" />
              Free Social Media Tool
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Social Media Card
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Generator</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Paste any website URL to auto-detect brand colors, logo, and identity.
              Generate download-ready social media cards in seconds.
            </p>
          </div>

          <div className="mt-10 max-w-4xl mx-auto">
            <BrandInput
              brand={brand}
              onBrandExtracted={setBrand}
              onBrandUpdate={setBrand}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={
                activeTab === id
                  ? { backgroundColor: activeBrand.primaryColor }
                  : undefined
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[600px]">
          {renderActiveTab()}
        </div>
      </section>

      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Paste Your URL', desc: 'Enter any website URL and we automatically extract your brand colors, logo, name, and tagline.' },
              { step: '2', title: 'Choose a Card Type', desc: 'Select from feature cards, testimonials, quote cards, custom quotes, or promotional designs.' },
              { step: '3', title: 'Customize & Download', desc: 'Edit all text inline, adjust colors, then download as high-resolution PNG images.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-4"
                  style={{ backgroundColor: activeBrand.primaryColor }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Supported Card Sizes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { type: 'Feature Cards', size: '400 x 280', use: 'Instagram, Twitter feed' },
              { type: 'Testimonials', size: '380 x 480', use: 'Instagram Stories, LinkedIn' },
              { type: 'Quote Cards', size: '1200 x 628', use: 'LinkedIn, Twitter cards' },
              { type: 'Custom Quote', size: '1200 x 628', use: 'LinkedIn, Twitter cards' },
              { type: 'Promotional', size: '600 x 600', use: 'Instagram, Facebook' },
            ].map((card) => (
              <div key={card.type} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <h4 className="text-sm font-bold text-gray-900">{card.type}</h4>
                <p className="text-lg font-bold mt-1" style={{ color: activeBrand.primaryColor }}>{card.size}</p>
                <p className="text-xs text-gray-500 mt-1">{card.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
