import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Loader2, ChevronDown, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../types';
import { AI_CHAT_RESPONSES } from '../data';
import { saveChatMessage, trackInteraction } from '../lib/supabase';

const SESSION_ID = `demo-${Math.random().toString(36).slice(2)}`;

const MODELS = ['nexus-7', 'nexus-swift', 'nexus-code'];

const SUGGESTED = [
  'Write a binary search tree in Python',
  'Analyze this data pattern for anomalies',
  'What can you help me with?',
  'Explain transformer architecture',
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('code') || lower.includes('python') || lower.includes('function') || lower.includes('binary') || lower.includes('tree')) {
    return AI_CHAT_RESPONSES.code;
  }
  if (lower.includes('analyz') || lower.includes('data') || lower.includes('pattern') || lower.includes('anomal')) {
    return AI_CHAT_RESPONSES.analysis;
  }
  if (lower.includes('help') || lower.includes('what can') || lower.includes('capability') || lower.includes('capabilities')) {
    return AI_CHAT_RESPONSES.help;
  }
  return AI_CHAT_RESPONSES.default;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function ChatDemo() {
  const { ref, inView } = useInView();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: AI_CHAT_RESPONSES.default,
      timestamp: new Date(),
      model: 'nexus-7',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('nexus-7');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const sendMessage = async (text: string = input.trim()) => {
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamingText('');

    saveChatMessage(SESSION_ID, 'user', text, selectedModel);
    trackInteraction('chat_message', { model: selectedModel });

    const responseText = getResponse(text);
    const delay = 600 + Math.random() * 400;

    await new Promise((r) => setTimeout(r, delay));

    let i = 0;
    const chunkSize = 3;
    const stream = setInterval(() => {
      i += chunkSize;
      const chunk = responseText.slice(0, i);
      setStreamingText(chunk);
      if (i >= responseText.length) {
        clearInterval(stream);
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          model: selectedModel,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setStreamingText('');
        setLoading(false);
        saveChatMessage(SESSION_ID, 'assistant', responseText, selectedModel);
      }
    }, 18);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3).split('\n');
        const lang = lines[0];
        const code = lines.slice(1, -1).join('\n');
        return (
          <div key={i} className="my-3">
            <div className="bg-dark-800 rounded-lg overflow-hidden border border-white/8">
              {lang && (
                <div className="px-4 py-2 bg-white/5 text-xs text-slate-400 font-mono border-b border-white/5">
                  {lang}
                </div>
              )}
              <pre className="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        );
      }
      return (
        <span key={i}>
          {part.split(/(\*\*.*?\*\*)/g).map((seg, j) => {
            if (seg.startsWith('**') && seg.endsWith('**')) {
              return <strong key={j} className="text-white font-semibold">{seg.slice(2, -2)}</strong>;
            }
            return <span key={j}>{seg}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <section id="demo" className="py-28 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="container-max section-padding relative z-10">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          ref={ref}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            Live Demo
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Experience Nexus AI
            <br />
            <span className="gradient-text">in real time.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Chat with our models directly. No signup required to try the demo.
          </p>
        </div>

        <div
          className={`max-w-3xl mx-auto transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-600/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-300" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">NexusAI Playground</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
                    <span className="text-xs text-slate-500">Connected</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowModelMenu(!showModelMenu)}
                  className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span className="font-mono">{selectedModel}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
                </button>

                {showModelMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-dark-700 border border-white/10 rounded-xl overflow-hidden shadow-xl z-10 min-w-[140px] animate-fade-in">
                    {MODELS.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setSelectedModel(m); setShowModelMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-mono transition-colors ${
                          m === selectedModel
                            ? 'bg-primary-600/20 text-primary-300'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="h-80 overflow-y-auto p-5 space-y-4 flex flex-col">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-primary-600/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary-300" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary-600/30 text-white border border-primary-500/30'
                        : 'bg-white/5 text-slate-300 border border-white/5'
                    }`}
                  >
                    {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}

              {loading && streamingText === '' && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-primary-600/30 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary-300" />
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {streamingText && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-primary-600/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Loader2 className="w-3.5 h-3.5 text-primary-300 animate-spin" />
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300 leading-relaxed max-w-[80%]">
                    {renderContent(streamingText)}
                    <span className="animate-blink text-primary-400">▌</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-5 pb-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-primary-600/20 hover:border-primary-500/30 border border-white/8 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="px-5 pb-5 pt-2">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  disabled={loading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-primary-500/50 focus:bg-white/8 transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:bg-white/5 disabled:text-slate-600 text-white flex items-center justify-center transition-all disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/20 shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
