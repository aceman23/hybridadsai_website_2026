export type FieldStatus = 'consistent' | 'inconsistent' | 'not_available';

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  primary_category: string;
  secondary_category: string;
  website: string;
}

export const FIELDS: (keyof BusinessInfo)[] = [
  'name', 'address', 'phone', 'primary_category', 'secondary_category', 'website',
];

export const FIELD_LABELS: Record<keyof BusinessInfo, string> = {
  name: 'Name',
  address: 'Address',
  phone: 'Phone',
  primary_category: 'Primary Category',
  secondary_category: 'Secondary Category',
  website: 'Website',
};

export const FIELD_REQUIRED: Record<keyof BusinessInfo, boolean> = {
  name: true,
  address: true,
  phone: true,
  primary_category: false,
  secondary_category: false,
  website: true,
};

export type Platform = 'openai' | 'gemini' | 'copilot' | 'grok' | 'perplexity';

export const PLATFORMS: Platform[] = ['openai', 'gemini', 'copilot', 'grok', 'perplexity'];

export const PLATFORM_LABELS: Record<Platform, string> = {
  openai: 'OpenAI ChatGPT',
  gemini: 'Google Gemini',
  copilot: 'Microsoft Copilot',
  grok: 'xAI Grok',
  perplexity: 'Perplexity',
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  openai: '#10b981',
  gemini: '#3b82f6',
  copilot: '#0ea5e9',
  grok: '#eab308',
  perplexity: '#8b5cf6',
};

export interface PlatformResult {
  platform: Platform;
  data: BusinessInfo;
  scores: Record<keyof BusinessInfo, FieldStatus>;
  percentage: number;
}

export interface AnalysisReport {
  url: string;
  groundTruth: BusinessInfo;
  results: PlatformResult[];
  overallScore: number;
  generatedAt: string;
  isDemo: boolean;
}
