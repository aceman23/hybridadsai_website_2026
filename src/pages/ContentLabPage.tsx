import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Loader2, FolderOpen, Link2, CheckCircle2,
  Sparkles, Clock, ChevronDown, ExternalLink, X, FileText, LogIn,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { callClaude } from '../components/content-lab/api';
import PostCard from '../components/content-lab/PostCard';
import SavedPostCard from '../components/content-lab/SavedPostCard';
import {
  BUILTIN_DATA, BRAND, TONES, FORMATS,
  PLATFORM_NOTES, CHAR_LIMITS, PLATFORM_ASPECT,
  ALL_PLATFORMS,
} from '../components/content-lab/constants';
import type {
  ContentProject, ContentSource, ContentSession, GeneratingPost,
} from '../components/content-lab/types';
import type { Page } from '../App';
import type { User } from '@supabase/supabase-js';

interface Props { navigate: (page: Page) => void; }

export default function ContentLabPage({ navigate }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) loadProjects(); }, [user]);

  async function loadProjects() {
    const { data } = await supabase
      .from('content_projects')
      .select('*')
      .order('updated_at', { ascending: false });
    const ps = data || [];
    setProjects(ps);
    if (ps.length > 0) setCurrentId(ps[0].id);
    setLoaded(true);
  }

  async function createProject() {
    const name = newName.trim() || 'New Project';
    setCreating(true);
    const { data, error } = await supabase
      .from('content_projects')
      .insert({ name, user_id: user!.id })
      .select()
      .single();
    if (!error && data) {
      setProjects(prev => [data, ...prev]);
      setCurrentId(data.id);
    }
    setCreating(false);
    setShowNewModal(false);
    setNewName('');
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project and all its history?')) return;
    await supabase.from('content_projects').delete().eq('id', id);
    const next = projects.filter(p => p.id !== id);
    setProjects(next);
    setCurrentId(next[0]?.id || null);
  }

  const current = projects.find(p => p.id === currentId) || null;

  if (!authChecked || (!loaded && user)) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-sm mx-4">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Sign in to AI Content Lab</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Create an account or sign in to start generating social media content.
          </p>
          <button
            onClick={() => navigate('home')}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Project sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-gray-800/60 bg-gray-900 pt-5 pb-3 px-2.5 fixed bottom-0 left-0 z-30" style={{ top: '161px' }}>
        <div className="px-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">AI Content Lab</p>
              <p className="text-[10px] text-gray-500">Social Generator</p>
            </div>
          </div>
        </div>

        <div className="px-2 mb-2">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Projects</div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0.5 px-1">
          {projects.length === 0 && (
            <p className="text-xs text-gray-500 px-2 py-4 text-center leading-relaxed">
              No projects yet. Create one to get started.
            </p>
          )}
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setCurrentId(p.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                p.id === currentId
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 text-left truncate">{p.name}</span>
              {p.id === currentId && (
                <button
                  onClick={e => { e.stopPropagation(); deleteProject(p.id); }}
                  className="text-gray-500 hover:text-red-400 transition-colors p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </button>
          ))}
        </div>

        <div className="px-1 pt-3 border-t border-gray-800">
          <button
            onClick={() => setShowNewModal(true)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Project
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 lg:ml-56 flex flex-col overflow-hidden">
        {!current ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-5 p-8">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Create your first project</h2>
            <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed">
              Organize content generation by campaign, client, or topic.
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>

            {/* Mobile project list */}
            {projects.length > 0 && (
              <div className="lg:hidden w-full max-w-sm mt-4 space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase">Or select a project:</p>
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentId(p.id)}
                    className="w-full text-left px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-200 hover:border-gray-700 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ProjectWorkspace key={currentId} project={current} />
        )}
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-1">New Project</h3>
            <p className="text-sm text-gray-400 mb-5">Name it by campaign, client, or content theme.</p>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !creating && createProject()}
              placeholder="e.g. Q3 Campaign, Client X, Hook Testing..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={createProject}
                disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Project
              </button>
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2.5 border border-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Project Workspace ───────────────────────────────────────────
function ProjectWorkspace({ project }: { project: ContentProject }) {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [activeSourceIds, setActiveSourceIds] = useState<string[]>(['__builtin__']);
  const [sessions, setSessions] = useState<ContentSession[]>([]);
  const [tab, setTab] = useState<'generate' | 'history'>('generate');
  const [addingSource, setAddingSource] = useState(false);
  const [srcUrl, setSrcUrl] = useState('');
  const [srcNote, setSrcNote] = useState('');
  const [fetchingSrc, setFetchingSrc] = useState(false);
  const [srcError, setSrcError] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(true);

  useEffect(() => {
    loadSources();
    loadSessions();
  }, [project.id]);

  async function loadSources() {
    const { data } = await supabase
      .from('content_sources')
      .select('*')
      .eq('project_id', project.id)
      .order('added_at', { ascending: false });
    setSources(data || []);
  }

  async function loadSessions() {
    const { data } = await supabase
      .from('content_sessions')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false });
    setSessions(data || []);
  }

  async function addSource() {
    const url = srcUrl.trim();
    if (!url) return;
    setFetchingSrc(true);
    setSrcError('');
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const finalUrl = urlObj.toString();
      const summary = await callClaude(
        `Fetch and extract key facts, statistics, insights and main arguments from this URL that would be useful for social media content writing: ${finalUrl}\n\nStructured summary:\n1. One-sentence description\n2. Key data points & statistics (bullets)\n3. Main themes/topics\n4. Content tone/angle\n\nBe thorough. If you cannot access the page, say so clearly.`,
        1500,
        true
      );

      const { data, error } = await supabase
        .from('content_sources')
        .insert({
          project_id: project.id,
          url: finalUrl,
          domain: urlObj.hostname.replace('www.', ''),
          note: srcNote.trim(),
          summary,
        })
        .select()
        .single();

      if (!error && data) {
        setSources(prev => [data, ...prev]);
        setActiveSourceIds(prev => [...prev, data.id]);
      }
      setSrcUrl('');
      setSrcNote('');
      setAddingSource(false);
    } catch (err) {
      setSrcError(err instanceof Error ? err.message : 'Failed to fetch source.');
    }
    setFetchingSrc(false);
  }

  async function removeSource(sid: string) {
    await supabase.from('content_sources').delete().eq('id', sid);
    setSources(prev => prev.filter(s => s.id !== sid));
    setActiveSourceIds(prev => prev.filter(id => id !== sid));
  }

  function toggleSource(sid: string) {
    setActiveSourceIds(prev =>
      prev.includes(sid) ? prev.filter(id => id !== sid) : [...prev, sid]
    );
  }

  async function saveSession(session: Omit<ContentSession, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('content_sessions')
      .insert(session)
      .select()
      .single();
    if (!error && data) {
      setSessions(prev => [data, ...prev]);
      setCurrentSessionId(data.id);
      setTab('history');
    }
  }

  async function deleteSession(sid: string) {
    await supabase.from('content_sessions').delete().eq('id', sid);
    setSessions(prev => prev.filter(s => s.id !== sid));
    if (currentSessionId === sid) setCurrentSessionId(null);
  }

  const activeSources = sources.filter(s => activeSourceIds.includes(s.id));
  const hasBuiltin = activeSourceIds.includes('__builtin__');

  const buildSourceCtx = useCallback(() => {
    let ctx = '';
    if (hasBuiltin) ctx += `\n\n=== SOURCE: Motion Creative Benchmarks 2026 ===\n${BUILTIN_DATA}`;
    activeSources.forEach(src => {
      ctx += `\n\n=== SOURCE: ${src.note || src.domain} (${src.url}) ===\n${src.summary}`;
    });
    return ctx;
  }, [activeSources, hasBuiltin]);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sources panel */}
      <div className={`${sourcesOpen ? 'w-64' : 'w-0'} bg-gray-900 border-r border-gray-800/60 flex flex-col shrink-0 transition-all overflow-hidden hidden md:flex`}>
        <div className="px-3 py-3 border-b border-gray-800 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Sources</span>
          <button
            onClick={() => setAddingSource(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 border border-cyan-500/20 rounded-md bg-cyan-500/5 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {/* Built-in source */}
          <SourceCard
            active={hasBuiltin}
            onClick={() => toggleSource('__builtin__')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">BUILT-IN</span>
              {hasBuiltin && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </div>
            <p className="text-xs font-semibold text-gray-200 leading-tight">Motion Creative Benchmarks 2026</p>
            <p className="text-[10px] text-gray-500 mt-0.5">$1.29B spend -- 578K creatives</p>
          </SourceCard>

          {sources.map(src => (
            <SourceCard
              key={src.id}
              active={activeSourceIds.includes(src.id)}
              onClick={() => toggleSource(src.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-cyan-400 truncate max-w-[100px]">{src.domain}</span>
                <div className="flex items-center gap-1">
                  {activeSourceIds.includes(src.id) && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  <button
                    onClick={e => { e.stopPropagation(); removeSource(src.id); }}
                    className="text-gray-600 hover:text-red-400 transition-colors p-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-200 truncate">
                {src.note || src.url.replace(/^https?:\/\//, '').slice(0, 36)}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {new Date(src.added_at).toLocaleDateString()}
              </p>
            </SourceCard>
          ))}

          {sources.length === 0 && !addingSource && (
            <p className="text-xs text-gray-500 px-1 py-3 leading-relaxed">
              Add any URL -- reports, articles, blog posts -- and Claude will extract key insights for content generation.
            </p>
          )}
        </div>

        {/* Add source form */}
        {addingSource && (
          <div className="p-3 border-t border-gray-800 bg-gray-800/30">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Add Source URL</div>
            {srcError && (
              <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg mb-2">
                {srcError}
              </div>
            )}
            <input
              value={srcUrl}
              onChange={e => setSrcUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !fetchingSrc && addSource()}
              placeholder="https://example.com/article"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-2"
              autoFocus
            />
            <input
              value={srcNote}
              onChange={e => setSrcNote(e.target.value)}
              placeholder="Label (optional)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={addSource}
                disabled={fetchingSrc}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {fetchingSrc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />}
                {fetchingSrc ? 'Fetching...' : 'Add'}
              </button>
              <button
                onClick={() => { setAddingSource(false); setSrcError(''); }}
                className="px-3 py-2 border border-gray-700 text-gray-400 text-xs rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        {!addingSource && (
          <div className="p-2 border-t border-gray-800">
            <button
              onClick={() => setAddingSource(true)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-700 text-gray-400 hover:text-gray-200 text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Link2 className="w-3 h-3" /> Add URL Source
            </button>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
        {/* Tab bar */}
        <div className="bg-gray-900 border-b border-gray-800 flex items-center shrink-0">
          <button
            onClick={() => setTab('generate')}
            className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
              tab === 'generate'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />Generate
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
              tab === 'history'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 inline mr-1.5" />History ({sessions.length})
          </button>

          {/* Mobile source toggle */}
          <button
            onClick={() => setSourcesOpen(o => !o)}
            className="md:hidden ml-auto mr-3 text-xs text-gray-400 hover:text-gray-200 px-3 py-1.5 border border-gray-700 rounded-lg"
          >
            <Link2 className="w-3 h-3 inline mr-1" />{activeSources.length + (hasBuiltin ? 1 : 0)} sources
          </button>
        </div>

        {tab === 'generate' && (
          <GenerateTab
            project={project}
            activeSources={activeSources}
            hasBuiltin={hasBuiltin}
            sourceCtx={buildSourceCtx()}
            onSessionSaved={saveSession}
          />
        )}
        {tab === 'history' && (
          <HistoryTab
            sessions={sessions}
            currentId={currentSessionId}
            onSelect={setCurrentSessionId}
            onDelete={deleteSession}
          />
        )}
      </div>
    </div>
  );
}

// ── Source Card ──────────────────────────────────────────────────
function SourceCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        active
          ? 'border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_0_1px_rgba(6,182,212,0.1)]'
          : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
      }`}
    >
      {children}
    </div>
  );
}

// ── Generate Tab ────────────────────────────────────────────────
function GenerateTab({
  project,
  activeSources,
  hasBuiltin,
  sourceCtx,
  onSessionSaved,
}: {
  project: ContentProject;
  activeSources: ContentSource[];
  hasBuiltin: boolean;
  sourceCtx: string;
  onSessionSaved: (session: Omit<ContentSession, 'id' | 'created_at'>) => void;
}) {
  const [platforms, setPlatforms] = useState<string[]>(['LinkedIn', 'Twitter/X', 'Instagram']);
  const [tone, setTone] = useState('authoritative');
  const [format, setFormat] = useState('stat-hook');
  const [postCount, setPostCount] = useState(2);
  const [topic, setTopic] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState<GeneratingPost[]>([]);
  const [error, setError] = useState('');

  function togglePlatform(p: string) {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  }

  async function generate() {
    if (platforms.length === 0) { setError('Select at least one platform.'); return; }
    if (activeSources.length === 0 && !hasBuiltin) { setError('Select at least one source.'); return; }
    setError('');
    setGenerating(true);
    setPosts([]);

    const topicStr = topic.trim() || 'key insights from the selected sources';
    const jobs: Array<{ platform: string; index: number; id: string }> = [];
    platforms.forEach(platform => {
      for (let i = 0; i < postCount; i++) {
        jobs.push({ platform, index: i, id: `${platform}-${i}` });
      }
    });

    setPosts(jobs.map(j => ({ ...j, text: null, imgPrompt: null, loading: true, imgLoading: true })));

    const results = await Promise.all(
      jobs.map(async job => {
        const prompt = `Social media writer for Hybrid Ads.\n${BRAND}\n\nSOURCE MATERIAL:\n${sourceCtx}\n\nTASK: Write post #${job.index + 1} of ${postCount} for ${job.platform}.\nTopic: ${topicStr}\nTone: ${TONES[tone]}\nFormat: ${FORMATS[format]}\nPlatform: ${PLATFORM_NOTES[job.platform]}\nChar limit: ${CHAR_LIMITS[job.platform]}\n${postCount > 1 ? 'Make this post distinct — different angle and hook from others in this batch.' : ''}\n\nOutput ONLY the post text. No labels.`;
        try {
          const text = await callClaude(prompt);
          return { ...job, text, loading: false };
        } catch (err) {
          return { ...job, text: `Error: ${err instanceof Error ? err.message : 'Unknown'}`, loading: false };
        }
      })
    );

    setPosts(results.map(r => ({ ...r, imgPrompt: null, imgLoading: true })));
    setGenerating(false);

    const imgResults = await Promise.all(
      results.map(async (r, i) => {
        try {
          const imgPrompt = await callClaude(
            `Expert Grok Aurora image prompt engineer. Write ONE prompt for this ${r.platform} post:\n"""${r.text}"""\nBrand: Hybrid Ads — clean, modern, professional. Light/white backgrounds with blue (#2563eb) and teal (#0d9488) accents.\nThink modern SaaS marketing, editorial photography, clean data visualization.\nAvoid: dark/gloomy aesthetics, stock clichés.\nAspect: ${PLATFORM_ASPECT[r.platform] || '16:9'}\nOutput ONLY the prompt text. 2-4 sentences. No labels.`,
            300
          );
          return { idx: i, imgPrompt };
        } catch {
          return { idx: i, imgPrompt: 'Error generating image prompt.' };
        }
      })
    );

    setPosts(prev =>
      prev.map((p, i) => {
        const f = imgResults.find(r => r.idx === i);
        return f ? { ...p, imgPrompt: f.imgPrompt, imgLoading: false } : { ...p, imgLoading: false };
      })
    );

    const sessionData: Omit<ContentSession, 'id' | 'created_at'> = {
      project_id: project.id,
      name: sessionName.trim() || `${topicStr.slice(0, 40)} -- ${new Date().toLocaleDateString()}`,
      tone,
      format,
      topic: topicStr,
      platforms: [...platforms],
      post_count: postCount,
      source_refs: [
        ...(hasBuiltin ? [{ id: '__builtin__', label: 'Motion Benchmarks 2026', url: '' }] : []),
        ...activeSources.map(s => ({ id: s.id, label: s.note || s.domain, url: s.url })),
      ],
      posts: results.map((r, i) => ({
        platform: r.platform,
        text: r.text || '',
        imgPrompt: imgResults.find(ir => ir.idx === i)?.imgPrompt || '',
      })),
    };
    onSessionSaved(sessionData);
  }

  const noSources = activeSources.length === 0 && !hasBuiltin;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Active source chips */}
      {!noSources && (
        <div className="flex gap-2 flex-wrap mb-5 items-center">
          <span className="text-xs text-gray-500 font-medium">Generating from:</span>
          {hasBuiltin && (
            <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Benchmarks 2026
            </span>
          )}
          {activeSources.map(s => (
            <span key={s.id} className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {s.note || s.domain}
            </span>
          ))}
        </div>
      )}
      {noSources && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg mb-5">
          No sources selected. Toggle sources in the panel on the left.
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Session Label <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              value={sessionName}
              onChange={e => setSessionName(e.target.value)}
              placeholder="e.g. LinkedIn Week 12, Hook Tests..."
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Topic / Focus <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. winner rarity, creative volume, hook tactics..."
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Platforms */}
        <div className="mb-5">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Platforms</label>
          <div className="flex gap-2 flex-wrap">
            {ALL_PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                  platforms.includes(p)
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tone, Format, Count */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Tone</label>
            <div className="relative">
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer pr-8"
              >
                <option value="authoritative">Authoritative & Data-Led</option>
                <option value="provocative">Provocative / Contrarian</option>
                <option value="educational">Educational / Explainer</option>
                <option value="conversational">Conversational</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Post Format</label>
            <div className="relative">
              <select
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer pr-8"
              >
                <option value="stat-hook">Stat Hook + Insight</option>
                <option value="myth-bust">Myth Bust</option>
                <option value="listicle">Numbered List</option>
                <option value="question">Question Opener</option>
                <option value="story">Short Story / Case</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className="min-w-[130px]">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Posts / Platform</label>
            <div className="relative">
              <select
                value={postCount}
                onChange={e => setPostCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer pr-8"
              >
                <option value={1}>1 post</option>
                <option value={2}>2 posts</option>
                <option value={3}>3 posts</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={generate}
            disabled={generating || noSources}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      {/* Post cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {posts.map((p, i) => (
          <PostCard
            key={p.id}
            post={p}
            tone={tone}
            format={format}
            sourceCtx={sourceCtx}
            onUpdate={updated => setPosts(prev => prev.map((x, xi) => (xi === i ? updated : x)))}
          />
        ))}
      </div>

      {posts.length === 0 && !generating && (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Ready to generate</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Select your sources, configure options, and click Generate Content.
          </p>
        </div>
      )}
    </div>
  );
}

// ── History Tab ─────────────────────────────────────────────────
function HistoryTab({
  sessions,
  currentId,
  onSelect,
  onDelete,
}: {
  sessions: ContentSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const current = sessions.find(s => s.id === currentId);

  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8">
        <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-sm font-bold text-white">No history yet</h3>
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Generate some content and sessions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Session list */}
      <div className="w-64 border-r border-gray-800 overflow-y-auto bg-gray-900 shrink-0 hidden sm:block">
        {sessions.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full text-left px-4 py-3.5 border-b border-gray-800 transition-all ${
              s.id === currentId
                ? 'bg-cyan-500/5 border-l-2 border-l-cyan-400'
                : 'border-l-2 border-l-transparent hover:bg-gray-800/50'
            }`}
          >
            <p className={`text-xs font-semibold truncate ${s.id === currentId ? 'text-cyan-400' : 'text-gray-200'}`}>
              {s.name}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              {new Date(s.created_at).toLocaleString()}
            </p>
            <div className="flex gap-1 flex-wrap mt-2">
              {s.platforms?.map(p => (
                <span key={p} className="text-[9px] font-semibold text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
                  {p}
                </span>
              ))}
              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {s.posts?.length || 0} posts
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile session select */}
      <div className="sm:hidden w-full p-4 border-b border-gray-800 bg-gray-900">
        <div className="relative">
          <select
            value={currentId || ''}
            onChange={e => onSelect(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 appearance-none cursor-pointer pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select a session...</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
        {!current ? (
          <p className="text-center text-sm text-gray-500 py-16">Select a session from the list to review.</p>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-1">{current.name}</h2>
                <p className="text-xs text-gray-500">
                  {new Date(current.created_at).toLocaleString()} -- {current.tone} -- {current.format?.replace(/-/g, ' ')}
                </p>
              </div>
              <button
                onClick={() => onDelete(current.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 px-3 py-2 border border-red-500/20 rounded-lg hover:bg-red-500/5 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Sources Used</p>
              <div className="flex gap-2 flex-wrap">
                {(current.source_refs || []).map((s: { id: string; label: string; url: string }) => (
                  <a
                    key={s.id}
                    href={s.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors inline-flex items-center gap-1"
                  >
                    {s.label}
                    {s.url && <ExternalLink className="w-2.5 h-2.5" />}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {(current.posts || []).map((p, i) => (
                <SavedPostCard key={i} post={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
