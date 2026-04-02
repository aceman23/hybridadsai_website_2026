import { useState } from 'react';
import { Search, Loader2, CreditCard as Edit3, Check } from 'lucide-react';
import type { BrandData } from './types';
import { getContrastColor } from './utils';

interface BrandInputProps {
  brand: BrandData | null;
  onBrandExtracted: (brand: BrandData) => void;
  onBrandUpdate: (brand: BrandData) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export default function BrandInput({ brand, onBrandExtracted, onBrandUpdate, loading, setLoading }: BrandInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleExtract = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/extract-brand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        onBrandExtracted(data as BrandData);
      }
    } catch {
      setError('Failed to connect. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = (field: string) => {
    if (brand) {
      onBrandUpdate({ ...brand, [field]: editValue });
    }
    setEditingField(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
            placeholder="Paste any website URL to extract brand identity..."
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <button
          onClick={handleExtract}
          disabled={loading || !url.trim()}
          className="px-6 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Extracting...
            </>
          ) : (
            'Extract Brand'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {brand && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-5">
            <div className="h-12 w-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              {editingField === 'name' ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-lg font-bold border-b-2 border-blue-500 outline-none bg-transparent"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit('name')}
                  />
                  <button onClick={() => saveEdit('name')} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{brand.name}</h3>
                  <button onClick={() => startEdit('name', brand.name)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {editingField === 'tagline' ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-sm text-gray-500 border-b-2 border-blue-500 outline-none bg-transparent w-full"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit('tagline')}
                  />
                  <button onClick={() => saveEdit('tagline')} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-sm text-gray-500 truncate">{brand.tagline || 'No tagline detected'}</p>
                  <button onClick={() => startEdit('tagline', brand.tagline)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded flex-shrink-0">
                    <Edit3 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium">Primary</label>
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => onBrandUpdate({ ...brand, primaryColor: e.target.value })}
                  className="h-8 w-8 rounded-lg border border-gray-200 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium">Secondary</label>
                <input
                  type="color"
                  value={brand.secondaryColor}
                  onChange={(e) => onBrandUpdate({ ...brand, secondaryColor: e.target.value })}
                  className="h-8 w-8 rounded-lg border border-gray-200 cursor-pointer"
                />
              </div>
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: brand.primaryColor,
                  color: getContrastColor(brand.primaryColor),
                }}
              >
                {brand.domain}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
