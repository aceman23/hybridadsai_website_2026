import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import type { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

interface NavLink {
  label: string;
  page: Page;
  badge?: string;
  badgeColor?: string;
  children?: { label: string; page: Page }[];
}

const navLinks: NavLink[] = [
  { label: 'Home', page: 'home' },
  { label: 'AI Systems', page: 'ai-agency' },
  { label: 'NemoClaw', page: 'nemo-claw', badge: 'New', badgeColor: 'bg-emerald-600' },
  { label: 'AI Score', page: 'ai-score', badge: 'Free', badgeColor: 'bg-cyan-500' },
  { label: 'Social Cards', page: 'social-generator', badge: 'Free', badgeColor: 'bg-cyan-500' },
  { label: 'Ad Performance', page: 'dashboard' },
  {
    label: 'About Us',
    page: 'about',
    children: [
      { label: 'About Us', page: 'about' },
      { label: 'Case Studies', page: 'case-studies' },
    ],
  },
];

export default function Header({ currentPage, navigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const isAboutSection = currentPage === 'about' || currentPage === 'case-studies';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm animate-header-in" role="banner">
      <div className="bg-gray-900 text-gray-300 text-xs py-1.5 px-4 text-center tracking-wide" aria-label="Platform expertise">
        <span className="font-medium text-white">Expert in:</span>
        {' '}
        <span className="text-blue-400">Meta Ads</span>
        <span className="mx-2 opacity-40" aria-hidden="true">·</span>
        <span className="text-sky-400">X Ads</span>
        <span className="mx-2 opacity-40" aria-hidden="true">·</span>
        <span className="text-pink-400">TikTok Ads</span>
        <span className="mx-2 opacity-40" aria-hidden="true">·</span>
        <span className="text-yellow-400">Google Ads</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-32">
          <button
            onClick={() => navigate('home')}
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            aria-label="HybridAds.ai – go to homepage"
          >
            <img src="/logo.png" alt="HybridAds.ai" className="h-28 w-auto" />
          </button>

          <nav className="hidden md:flex items-center space-x-7" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.page}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    className={`relative inline-flex items-center gap-1 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${
                      isAboutSection
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 transition-all duration-200 origin-top ${
                      dropdownOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                    }`}
                    role="menu"
                  >
                    {link.children.map((child) => (
                      <button
                        key={child.page}
                        onClick={() => {
                          navigate(child.page);
                          setDropdownOpen(false);
                        }}
                        role="menuitem"
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                          currentPage === child.page
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={link.page}
                  onClick={() => navigate(link.page)}
                  aria-current={currentPage === link.page ? 'page' : undefined}
                  className={`relative inline-flex items-center gap-1.5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${
                    currentPage === link.page
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className={`text-xs ${link.badgeColor ?? 'bg-cyan-500'} text-white font-bold px-1.5 py-0.5 rounded-full leading-none`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              )
            )}
          </nav>

          <div className="hidden md:flex items-center">
            <a
              href="https://calendly.com/hybridadsai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white bg-green-600 px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Book a free strategy call on Calendly"
            >
              Book a Call
            </a>
          </div>

          <button
            className="md:hidden p-2 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.page}>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className={`flex items-center justify-between w-full text-left text-base font-semibold py-2.5 px-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isAboutSection ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileAboutOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {link.children.map((child) => (
                      <button
                        key={child.page}
                        onClick={() => { navigate(child.page); setMobileOpen(false); setMobileAboutOpen(false); }}
                        className={`block w-full text-left text-sm font-semibold py-2 px-2 rounded-lg ${
                          currentPage === child.page
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={link.page}
                onClick={() => { navigate(link.page); setMobileOpen(false); }}
                aria-current={currentPage === link.page ? 'page' : undefined}
                className={`flex items-center gap-2 w-full text-left text-base font-semibold py-2.5 px-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  currentPage === link.page ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className={`text-xs ${link.badgeColor ?? 'bg-cyan-500'} text-white font-bold px-1.5 py-0.5 rounded-full leading-none`}>
                    {link.badge}
                  </span>
                )}
              </button>
            )
          )}
          <div className="pt-2">
            <a
              href="https://calendly.com/hybridadsai"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm font-semibold text-white bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Book a free strategy call on Calendly"
            >
              Book a Call
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
