import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Models', href: '#models' },
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/95 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max section-padding">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Nexus<span className="text-primary-400">AI</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium px-4 py-2"
            >
              Sign In
            </a>
            <a
              href="#pricing"
              className="btn-primary text-sm py-2 px-5"
            >
              Get Started
            </a>
          </div>

          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-dark-800/98 backdrop-blur-xl border-t border-white/5 animate-fade-in">
          <div className="section-padding py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 hover:text-white hover:bg-white/5 transition-all rounded-lg px-4 py-3 font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-white/5 mt-2 pt-4 flex flex-col gap-2">
              <a href="#" className="text-slate-400 hover:text-white text-center py-2 transition-colors">
                Sign In
              </a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="btn-primary text-center">
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
