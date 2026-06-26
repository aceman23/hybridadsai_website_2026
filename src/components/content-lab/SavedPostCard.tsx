import { useState } from 'react';
import { Copy, Check, ChevronRight, Image, Sparkles } from 'lucide-react';
import { CHAR_LIMITS, PLATFORM_COLORS } from './constants';
import type { ContentPost } from './types';

interface SavedPostCardProps {
  post: ContentPost;
}

export default function SavedPostCard({ post }: SavedPostCardProps) {
  const [imgOpen, setImgOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedImg, setCopiedImg] = useState(false);

  const limit = CHAR_LIMITS[post.platform] || 3000;
  const platformColor = PLATFORM_COLORS[post.platform] || '#3b82f6';

  async function copy(text: string, setter: (v: boolean) => void) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3 bg-gray-800/40">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: platformColor }} />
        <span className="text-xs font-bold text-gray-200 tracking-wide">{post.platform}</span>
        <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          saved
        </span>
      </div>
      <div className="p-4 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap min-h-[100px]">
        {post.text}
      </div>
      <div className="px-4 py-2.5 border-t border-gray-800 flex items-center gap-2 bg-gray-800/30">
        <button
          onClick={() => copy(post.text, setCopied)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <span className="ml-auto text-xs text-gray-500">
          {(post.text || '').length}/{limit}
        </span>
      </div>
      {post.imgPrompt && (
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
              <div className="text-xs text-gray-300 leading-relaxed mb-3">{post.imgPrompt}</div>
              <button
                onClick={() => copy(post.imgPrompt, setCopiedImg)}
                className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-200 px-2.5 py-1.5 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {copiedImg ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                {copiedImg ? 'Copied' : 'Copy prompt'}
              </button>
              <span className="ml-2 text-[10px] text-gray-600">
                <Sparkles className="w-2.5 h-2.5 inline mr-1" />Aurora HD
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
