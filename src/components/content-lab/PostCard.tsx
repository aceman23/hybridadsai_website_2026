import { useState, useRef } from 'react';
import {
  Copy, Check, RefreshCw, Loader2, ChevronRight, Sparkles, Image,
} from 'lucide-react';
import { CHAR_LIMITS, PLATFORM_COLORS, PLATFORM_ASPECT, TONES, FORMATS, BRAND, PLATFORM_NOTES } from './constants';
import { callClaude } from './api';
import type { GeneratingPost } from './types';

interface PostCardProps {
  post: GeneratingPost;
  tone: string;
  format: string;
  sourceCtx: string;
  onUpdate: (post: GeneratingPost) => void;
}

export default function PostCard({ post, tone, format, sourceCtx, onUpdate }: PostCardProps) {
  const [imgOpen, setImgOpen] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedImg, setCopiedImg] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const imgRef = useRef<HTMLDivElement>(null);

  const limit = CHAR_LIMITS[post.platform] || 3000;
  const textLen = (post.text || '').length;
  const over = textLen > limit;
  const platformColor = PLATFORM_COLORS[post.platform] || '#3b82f6';

  async function regenPost() {
    onUpdate({ ...post, loading: true, imgLoading: true });
    const prompt = `Social media writer for Hybrid Ads.\n${BRAND}\n\nSOURCE MATERIAL:\n${sourceCtx}\n\nWrite a NEW, DIFFERENT post for ${post.platform}.\nTone: ${TONES[tone]}\nFormat: ${FORMATS[format]}\nPlatform: ${PLATFORM_NOTES[post.platform]}\nChar limit: ${limit}\nOutput ONLY the post text.`;
    try {
      const text = await callClaude(prompt);
      const imgPrompt = await genImgPrompt(text, post.platform);
      onUpdate({ ...post, text, imgPrompt, loading: false, imgLoading: false });
    } catch (err) {
      onUpdate({ ...post, text: `Error: ${err instanceof Error ? err.message : 'Unknown'}`, loading: false, imgLoading: false });
    }
  }

  async function regenImg() {
    onUpdate({ ...post, imgLoading: true });
    const currentText = editing ? editText : (post.text || '');
    const imgPrompt = await genImgPrompt(currentText, post.platform);
    onUpdate({ ...post, imgPrompt, imgLoading: false });
  }

  async function genImgPrompt(postText: string, platform: string) {
    try {
      return await callClaude(
        `Expert Grok Aurora image prompt engineer. Write ONE prompt for this ${platform} post:\n"""${postText}"""\nBrand: Hybrid Ads — clean, modern, professional. Light/white backgrounds with blue (#2563eb) and teal (#0d9488) accents.\nThink modern SaaS marketing, editorial photography, clean data visualization.\nAvoid: dark/gloomy aesthetics, stock clichés.\nAspect: ${PLATFORM_ASPECT[platform] || '16:9'}\nOutput ONLY the prompt text. 2-4 sentences. No labels.`,
        300
      );
    } catch {
      return 'Error generating image prompt.';
    }
  }

  async function copyText(text: string, setter: (v: boolean) => void) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  function startEditing() {
    setEditText(post.text || '');
    setEditing(true);
  }

  function saveEdit() {
    onUpdate({ ...post, text: editText });
    setEditing(false);
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3 bg-gray-800/40">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: platformColor }} />
        <span className="text-xs font-bold text-gray-200 tracking-wide">{post.platform}</span>
        <span className="ml-auto text-[10px] font-semibold text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
          {format.replace(/-/g, ' ')}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 min-h-[120px]">
        {post.loading ? (
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Writing for {post.platform}...
          </div>
        ) : editing ? (
          <div>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[120px]"
              rows={6}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={saveEdit}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-xs font-semibold text-gray-400 hover:text-gray-300 px-3 py-1.5"
              >
                Cancel
              </button>
              <span className={`ml-auto text-xs font-medium ${editText.length > limit ? 'text-red-400' : 'text-gray-500'}`}>
                {editText.length}/{limit}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap cursor-text"
            onClick={startEditing}
            title="Click to edit"
          >
            {post.text}
          </div>
        )}
      </div>

      {/* Footer */}
      {!editing && (
        <div className="px-4 py-2.5 border-t border-gray-800 flex items-center gap-2 bg-gray-800/30">
          <button
            onClick={() => copyText(post.text || '', setCopiedPost)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            {copiedPost ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedPost ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={startEditing}
            className="text-xs font-medium text-gray-400 hover:text-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={regenPost}
            disabled={post.loading}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
          <span className={`ml-auto text-xs font-medium ${over ? 'text-red-400' : 'text-gray-500'}`}>
            {textLen}/{limit}
          </span>
        </div>
      )}

      {/* Aurora image prompt */}
      <div className="border-t border-gray-800">
        <button
          onClick={() => setImgOpen(o => !o)}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${imgOpen ? 'rotate-90' : ''}`} />
          <Image className="w-3 h-3" />
          Grok Aurora Prompt
          <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            Aurora
          </span>
        </button>
        {imgOpen && (
          <div className="px-4 py-3 bg-gray-800/30 border-t border-gray-800">
            {post.imgLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" /> Generating image prompt...
              </div>
            ) : (
              <>
                <div
                  ref={imgRef}
                  className="text-xs text-gray-300 leading-relaxed mb-3"
                >
                  {post.imgPrompt}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyText(post.imgPrompt || '', setCopiedImg)}
                    className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-200 px-2.5 py-1.5 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {copiedImg ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                    {copiedImg ? 'Copied' : 'Copy prompt'}
                  </button>
                  <button
                    onClick={regenImg}
                    className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-200 px-2.5 py-1.5 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> New prompt
                  </button>
                  <span className="ml-auto text-[10px] text-gray-600">
                    <Sparkles className="w-2.5 h-2.5 inline mr-1" />Aurora HD
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
