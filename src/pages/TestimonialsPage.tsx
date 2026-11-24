import { ArrowRight, ExternalLink, Quote, Sparkles } from 'lucide-react';
import type { Page } from '../App';
import AnimateIn from '../components/AnimateIn';
import { projectHighlights, recentProjects, testimonials } from '../data/portfolio';

interface TestimonialsPageProps {
  navigate: (page: Page) => void;
}

const linkedQuoteNames = new Set(
  Object.values(projectHighlights).map((h) => h.quoteFrom).filter(Boolean),
);
const moreClientQuotes = testimonials.filter((t) => !linkedQuoteNames.has(t.name));

export default function TestimonialsPage({ navigate }: TestimonialsPageProps) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gray-950 text-white pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.25),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(16,185,129,0.15),transparent_50%)]" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-blue-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Testimonials
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">Results our clients talk about</h1>
          </AnimateIn>
          <AnimateIn delay={120}>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Every project we've built and what it delivered, newest first, plus what business owners say about working with us.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Project by project</h2>
            <p className="text-gray-500 mb-10">Ordered from our most recent work.</p>
          </AnimateIn>
          <div className="space-y-6">
            {recentProjects.map((project, i) => {
              const highlight = projectHighlights[project.name];
              const clientQuote = highlight?.quoteFrom
                ? testimonials.find((t) => t.name === highlight.quoteFrom)
                : undefined;
              const shownQuote = clientQuote
                ? { text: clientQuote.quote, author: clientQuote.name }
                : highlight?.ceoQuote?.approved
                  ? { text: highlight.ceoQuote.text, author: `CEO, ${project.name}` }
                  : undefined;
              return (
                <AnimateIn key={project.name} delay={Math.min(i, 3) * 60}>
                  <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 grid md:grid-cols-[280px_1fr]">
                    <div className="h-48 md:h-full bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={project.img}
                        alt={project.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 sm:p-8 flex flex-col">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${project.tagColor}`}>{project.tag}</span>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                          aria-label={`Visit ${project.name}`}
                        >
                          Visit
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">{project.name}</h3>
                      {highlight && <p className="text-blue-700 font-semibold mb-3">{highlight.headline}</p>}
                      <p className="text-gray-600 leading-relaxed mb-5">{highlight?.summary ?? project.desc}</p>
                      {shownQuote && (
                        <blockquote className="relative bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-5">
                          <Quote className="absolute -top-3 left-4 h-6 w-6 text-emerald-600 bg-white rounded-full p-1 border border-emerald-100" aria-hidden="true" />
                          <p className="text-gray-700 leading-relaxed">"{shownQuote.text}"</p>
                          <footer className="mt-2 text-sm font-semibold text-emerald-700">{shownQuote.author}</footer>
                        </blockquote>
                      )}
                      <div className="mt-auto flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <span key={tech} className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="text-3xl font-black text-gray-900 mb-2 text-center">More from our clients</h2>
            <p className="text-gray-500 mb-10 text-center">In their own words.</p>
          </AnimateIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreClientQuotes.map((t) => (
              <figure key={t.name} className="bg-slate-50 rounded-2xl border border-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <blockquote className="text-gray-600 text-sm leading-relaxed mb-6">"{t.quote}"</blockquote>
                <figcaption>
                  <div className="font-black text-gray-800 text-sm whitespace-pre-line mb-0.5">{t.logo}</div>
                  {t.logoSub && <div className="text-xs text-blue-600 font-medium mb-1">{t.logoSub}</div>}
                  <div className="text-xs text-gray-600">{t.name}</div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-14 text-center">
            <p className="text-gray-500 mb-5">Want results like these?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://calendly.com/hybridadsai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Book a Free Strategy Call
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
              <button
                onClick={() => navigate('case-studies')}
                className="inline-flex items-center justify-center border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                Read Case Studies
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
