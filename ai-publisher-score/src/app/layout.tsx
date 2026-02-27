import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Publisher Score | Hybridads',
  description: 'Check how accurately your business information appears across top AI platforms like ChatGPT, Gemini, Copilot, Grok, and Perplexity.',
  openGraph: {
    title: 'AI Publisher Score | Hybridads',
    description: 'Get your free AI Publisher Score and see how AI platforms describe your business.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
