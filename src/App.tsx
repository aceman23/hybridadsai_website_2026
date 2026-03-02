import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import AIModels from './components/AIModels';
import ChatDemo from './components/ChatDemo';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900 font-sans">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <AIModels />
        <Features />
        <ChatDemo />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
