import { useState } from 'react';
import { Loader2, Zap, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import type { BrandData } from './types';
import PostCard from './PostCard';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const TEMPLATES = [
  { id: 'hook_story_insight_cta', name: 'Hook + Story + Insight + CTA', desc: 'Personal narrative with a takeaway' },
  { id: 'stat_question_framework', name: 'Stat + Question + Framework', desc: 'Lead with data, teach a method' },
  { id: 'contrarian_proof_reframe', name: 'Contrarian Take + Proof + Reframe', desc: 'Challenge assumptions boldly' },
  { id: 'before_after_lesson', name: 'Before/After + Lesson', desc: 'Transformation story with the moral' },
  { id: 'listicle_value_bomb', name: 'Listicle Value Bomb', desc: 'Numbered tips that deliver fast value' },
  { id: 'question_stack_reveal', name: 'Question Stack + Reveal', desc: 'Build tension with questions, then answer' },
];

const PLATFORMS = [
  { id: 'LinkedIn', label: 'LinkedIn' },
  { id: 'X', label: 'X / Twitter' },
  { id: 'Instagram', label: 'Instagram' },
];

interface ViralPostEngineProps {
  brand: BrandData;
}

interface MainPost {
  post: string;
  hook_type: string;
  engagement_score: number;
  reasoning: string;
}

interface Variation {
  type: string;
  label: string;
  post: string;
  engagement_score: number;
}

type Step = 'configure' | 'main_post' | 'variations';

async function callEdgeFunction(body: object) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-viral-posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export default function ViralPostEngine({ brand }: ViralPostEngineProps) {
  const [step, setStep] = useState<Step>('configure');
  const [template, setTemplate] = useState(TEMPLATES[0].id);
  const [platform, setPlatform] = useState('LinkedIn');
  const [voice, setVoice] = useState('Direct, no-BS, slightly sarcastic, founder energy');
  const [customInstructions, setCustomInstructions] = useState('');

  const [generating, setGenerating] = useState(false);
  const [generatingVariations, setGeneratingVariations] = useState(false);
  const [refiningId, setRefiningId] = useState<string | null>(null);

  const [mainPost, setMainPost] = useState<MainPost | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);

  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const selectedTemplate = TEMPLATES.find((t) => t.id === template);
      const result = await callEdgeFunction({
        action: 'generate_main',
        brand: { ...brand, voice },
        template: selectedTemplate?.name || template,
        platform,
        customInstructions: customInstructions || undefined,
      });
      setMainPost(result as MainPost);
      setVariations([]);
      setStep('main_post');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!mainPost) return;
    setGeneratingVariations(true);
    try {
      const result = await callEdgeFunction({
        action: 'generate_variations',
        brand: { ...brand, voice },
        existingPost: mainPost.post,
        platform,
      });
      setVariations((result as { variations: Variation[] }).variations || []);
      setStep('variations');
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingVariations(false);
    }
  };

  const handleRefine = async (post: string, id: string) => {
    setRefiningId(id);
    try {
      const result = await callEdgeFunction({
        action: 'refine',
        brand: { ...brand, voice },
        existingPost: post,
      });
      const refined = result as { refined_post: string; engagement_score: number; reasoning: string };

      if (id === 'main') {
        setMainPost((prev) =>
          prev
            ? { ...prev, post: refined.refined_post, engagement_score: refined.engagement_score, reasoning: refined.reasoning }
            : prev
        );
      } else {
        setVariations((prev) =>
          prev.map((v, i) =>
            `var-${i}` === id
              ? { ...v, post: refined.refined_post, engagement_score: refined.engagement_score }
              : v
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefiningId(null);
    }
  };

  const handleCopyAll = async () => {
    const allPosts = [
      mainPost ? `--- MAIN POST ---\n${mainPost.post.replace(/\\n/g, '\n')}` : '',
      ...variations.map((v, i) => `--- ${v.label?.toUpperCase() || `VARIATION ${i + 1}`} ---\n${v.post.replace(/\\n/g, '\n')}`),
    ]
      .filter(Boolean)
      .join('\n\n');
    await navigator.clipboard.writeText(allPosts);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const allPosts = [mainPost, ...variations].filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Viral Post Engine</h3>
          <p className="text-sm text-gray-500">Grok-powered content generation with proven viral frameworks</p>
        </div>
        {allPosts.length > 1 && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {copiedAll ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copiedAll ? 'Copied All' : 'Copy All Posts'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold">
        {(['configure', 'main_post', 'variations'] as Step[]).map((s, i) => {
          const labels = ['1. Configure', '2. Generate', '3. Variations'];
          const isActive = step === s;
          const isPast = ['configure', 'main_post', 'variations'].indexOf(step) > i;
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300" />}
              <button
                onClick={() => {
                  if (isPast || isActive) setStep(s);
                }}
                disabled={!isPast && !isActive}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? 'text-white'
                    : isPast
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-gray-100 text-gray-400'
                }`}
                style={isActive ? { backgroundColor: brand.primaryColor } : undefined}
              >
                {labels[i]}
              </button>
            </div>
          );
        })}
      </div>

      {step === 'configure' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Post Settings</h4>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Platform</label>
              <div className="flex gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      platform === p.id ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={platform === p.id ? { backgroundColor: brand.primaryColor } : undefined}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Brand Voice</label>
              <input
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Direct, witty, founder-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Additional Instructions</label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Optional: specific topic, recent wins, story seeds..."
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Template</h4>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                    template === t.id
                      ? 'border-current shadow-sm'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  style={template === t.id ? { borderColor: brand.primaryColor } : undefined}
                >
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating with Grok...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Generate Viral Post
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'main_post' && mainPost && (
        <div className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <PostCard
              post={mainPost.post}
              label="Main Post"
              score={mainPost.engagement_score}
              hookType={mainPost.hook_type}
              reasoning={mainPost.reasoning}
              brand={brand}
              onRefine={(p) => handleRefine(p, 'main')}
              refining={refiningId === 'main'}
              onUpdate={(p) => setMainPost({ ...mainPost, post: p })}
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setStep('configure')}
              className="px-5 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Settings
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Regenerate
            </button>
            <button
              onClick={handleGenerateVariations}
              disabled={generatingVariations}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {generatingVariations ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating 7 Variations...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate 7 Variations
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'variations' && (
        <div className="space-y-6">
          {mainPost && (
            <div className="max-w-2xl mx-auto">
              <PostCard
                post={mainPost.post}
                label="Main Post"
                score={mainPost.engagement_score}
                hookType={mainPost.hook_type}
                reasoning={mainPost.reasoning}
                brand={brand}
                onRefine={(p) => handleRefine(p, 'main')}
                refining={refiningId === 'main'}
                onUpdate={(p) => setMainPost({ ...mainPost, post: p })}
              />
            </div>
          )}

          {variations.length > 0 && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">7 Variations</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variations.map((v, i) => (
                  <PostCard
                    key={i}
                    post={v.post}
                    label={v.label || v.type?.replace(/_/g, ' ')}
                    score={v.engagement_score}
                    brand={brand}
                    onRefine={(p) => handleRefine(p, `var-${i}`)}
                    refining={refiningId === `var-${i}`}
                    onUpdate={(p) => {
                      const updated = [...variations];
                      updated[i] = { ...updated[i], post: p };
                      setVariations(updated);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setStep('main_post')}
              className="px-5 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Main Post
            </button>
            <button
              onClick={() => {
                setMainPost(null);
                setVariations([]);
                setStep('configure');
              }}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-xl shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <Zap className="h-4 w-4" />
              Start New Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
