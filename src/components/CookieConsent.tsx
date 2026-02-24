import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Page } from '../App';

interface Props {
  navigate: (page: Page) => void;
}

const STORAGE_KEY = 'hybridads_cookie_consent';

export default function CookieConsent({ navigate }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/10 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-1">We use cookies</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            We use cookies and similar technologies to analyze site traffic, improve your experience, and deliver relevant advertising. See our{' '}
            <button
              onClick={() => { navigate('privacy'); decline(); }}
              className="text-blue-600 hover:underline font-medium"
            >
              Privacy Policy
            </button>{' '}
            for details.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Decline cookies"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            aria-label="Accept cookies"
          >
            Accept All
          </button>
          <button
            onClick={decline}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Dismiss cookie notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
