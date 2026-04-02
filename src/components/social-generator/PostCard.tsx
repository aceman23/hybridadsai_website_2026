import { useState } from 'react';
import { Copy, Check, RefreshCw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import type { BrandData } from './types';

interface PostCardProps {
  post: string;
  label?: string;
  score?: number;
  hookType?: string;
  reasoning?: string;
  brand: BrandData;
  onRefine?: (post: string) => void;
  refining?: boolean;
  editable?: boolean;
  onUpdate?: (post: string) => void;
}

export default function PostCard({
  post,
  label,
  score,
  hookType,
  reasoning,
  brand,
  onRefine,
  refining,
  editable = true,
  onUpdate,
}: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onUpdate?.(editText);
    setEditing(false);
  };

  const scoreColor =
    score && score >= 8
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : score && score >= 6
        ? 'text-amber-600 bg-amber-50 border-amber-200'
        : 'text-gray-600 bg-gray-50 border-gray-200';

  const formattedPost = post.replace(/\\n/g, '\n');

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {label && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-md text-white"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {label}
              </span>
            )}
            {hookType && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                {hookType.replace(/_/g, ' ')}
              </span>
            )}
          </div>
          {score !== undefined && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreColor}`}>
              <span>{score}/10</span>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed font-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(post); }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-sm text-gray-800 leading-relaxed whitespace-pre-line cursor-pointer"
            onClick={() => editable && setEditing(true)}
            title={editable ? 'Click to edit' : undefined}
          >
            {formattedPost}
          </div>
        )}

        {reasoning && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? 'Hide reasoning' : 'Why this works'}
          </button>
        )}
        {expanded && reasoning && (
          <p className="mt-2 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-3">
            {reasoning}
          </p>
        )}
      </div>

      <div className="flex items-center border-t border-gray-100 divide-x divide-gray-100">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
        {onRefine && (
          <button
            onClick={() => onRefine(post)}
            disabled={refining}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {refining ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Refine
          </button>
        )}
      </div>
    </div>
  );
}
