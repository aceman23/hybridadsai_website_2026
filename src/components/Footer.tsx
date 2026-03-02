import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

const FOOTER_LINKS = {
  Product: ['Models', 'API Reference', 'Playground', 'Changelog', 'Status'],
  Platform: ['Documentation', 'SDKs', 'Integrations', 'Enterprise', 'Security'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Processing'],
};

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-white/5">
      <div className="container-max section-padding py-16">
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Nexus<span className="text-primary-400">AI</span>
              </span>
            </a>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Advanced AI systems for developers and enterprises. Build smarter, faster.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-500 hover:text-white hover:border-primary-500/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} NexusAI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
