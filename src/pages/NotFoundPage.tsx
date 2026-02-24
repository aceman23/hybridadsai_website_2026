import { ArrowRight, Home } from 'lucide-react';
import type { Page } from '../App';

interface Props {
  navigate: (page: Page) => void;
}

export default function NotFoundPage({ navigate }: Props) {
  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="text-[120px] font-black text-gray-100 leading-none select-none" aria-hidden="true">
          404
        </div>
        <div className="-mt-6">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Page not found</h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            The page you were looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </button>
            <a
              href="https://calendly.com/hybridadsai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Book a Call
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
