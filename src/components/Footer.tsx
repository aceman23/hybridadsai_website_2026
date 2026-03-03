import { Mail, Linkedin, Twitter, Instagram } from 'lucide-react';
import type { Page } from '../App';

interface FooterProps {
  navigate: (page: Page) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-400" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap gap-3 mb-10" aria-label="Advertising platforms">
          {[
            { label: 'Meta Ads', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
            { label: 'X Ads', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
            { label: 'TikTok Ads', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
            { label: 'Google Ads', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
          ].map(({ label, color }) => (
            <span key={label} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${color} tracking-wide`}>
              {label}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <button
              onClick={() => navigate('home')}
              className="mb-4 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
              aria-label="Go to homepage"
            >
              <img src="/logo.png" alt="HybridAds.ai" className="h-[120px] w-auto brightness-0 invert" />
            </button>
            <p className="text-sm leading-relaxed max-w-sm mt-2">
              Experts in Paid Ads powered by Humans & AI. Saving businesses $$$ on digital
              labor costs while maximizing returns across every platform.
            </p>
            <div className="mt-4 text-sm">
              <a
                href="mailto:hello@hybridads.ai"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Email us at hello@hybridads.ai"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                hello@hybridads.ai
              </a>
            </div>
            <div className="flex space-x-4 mt-5" aria-label="Social media links">
              <a href="https://twitter.com/hybridadsai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded" aria-label="Follow us on X (Twitter)">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com/company/hybridadsai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded" aria-label="Connect on LinkedIn">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/hybridadsai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Site navigation">
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('home')} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-white">Home</button></li>
              <li><button onClick={() => navigate('ai-agency')} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-white">AI Systems</button></li>
              <li><button onClick={() => navigate('dashboard')} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-white">Ad Performance</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-white">About Us</button></li>
              <li><a href="https://calendly.com/hybridadsai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-white">Book a Call</a></li>
            </ul>
          </nav>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Google Ads Management</li>
              <li>Meta / Facebook Ads</li>
              <li>TikTok Advertising</li>
              <li>Shopify & E-Commerce</li>
              <li>AI-Powered Optimization</li>
              <li><button onClick={() => navigate('ai-agency')} className="hover:text-white transition-colors">SaaS Platforms</button></li>
              <li><button onClick={() => navigate('ai-agency')} className="hover:text-white transition-colors">Conversational AI</button></li>
              <li><button onClick={() => navigate('ai-agency')} className="hover:text-white transition-colors">Intelligent Search & RAG</button></li>
              <li><button onClick={() => navigate('ai-agency')} className="hover:text-white transition-colors">On-Device & Edge AI</button></li>
              <li><button onClick={() => navigate('ai-agency')} className="hover:text-white transition-colors">Autonomous Agents</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <p>© {new Date().getFullYear()} HybridAds.ai. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <button
              onClick={() => navigate('privacy')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-white"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('terms')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-white"
            >
              Terms of Service
            </button>
            <a
              href="mailto:dmca@hybridads.ai"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-white"
            >
              DMCA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
