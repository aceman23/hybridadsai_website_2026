import type { AnalysisReport, BusinessInfo, FieldStatus, PlatformResult } from './types';
import { FIELDS, PLATFORMS } from './types';

const DEMO_GROUND_TRUTH: BusinessInfo = {
  name: 'Hybrid Ads',
  address: '1234 Wilshire Blvd, Los Angeles, CA 90025',
  phone: '(485) 555-0192',
  primary_category: 'Digital Marketing Agency',
  secondary_category: 'AI Advertising Technology',
  website: 'hybridads.ai',
};

const NOT_AVAILABLE: BusinessInfo = {
  name: 'Not Available',
  address: 'Not Available',
  phone: 'Not Available',
  primary_category: 'Not Available',
  secondary_category: 'Not Available',
  website: 'Not Available',
};

const GROK_RESPONSE: BusinessInfo = {
  name: 'Hybrid Ads',
  address: '1234 Wilshire Blvd, Los Angeles, CA 90025',
  phone: 'Not Available',
  primary_category: 'Digital Marketing Agency',
  secondary_category: 'Not Available',
  website: 'hybridads.ai',
};

function scoreResponse(aiData: BusinessInfo, ground: BusinessInfo): Record<keyof BusinessInfo, FieldStatus> {
  const result = {} as Record<keyof BusinessInfo, FieldStatus>;
  for (const field of FIELDS) {
    const aiVal = (aiData[field] || '').trim().toLowerCase();
    const gtVal = (ground[field] || '').trim().toLowerCase();
    const aiNA = aiVal === 'not available' || aiVal === '';
    const gtNA = gtVal === 'not available' || gtVal === '';
    if (aiNA && gtNA) {
      result[field] = 'consistent';
    } else if (aiNA && !gtNA) {
      result[field] = 'not_available';
    } else if (!aiNA && !gtNA && aiVal === gtVal) {
      result[field] = 'consistent';
    } else {
      result[field] = 'inconsistent';
    }
  }
  return result;
}

function calcPercentage(scores: Record<keyof BusinessInfo, FieldStatus>): number {
  const consistent = FIELDS.filter(f => scores[f] === 'consistent').length;
  return Math.round((consistent / FIELDS.length) * 100);
}

export function getDemoReport(url: string): AnalysisReport {
  const aiResponses: Record<string, BusinessInfo> = {
    openai: NOT_AVAILABLE,
    gemini: NOT_AVAILABLE,
    copilot: NOT_AVAILABLE,
    grok: GROK_RESPONSE,
    perplexity: NOT_AVAILABLE,
  };

  const results: PlatformResult[] = PLATFORMS.map((platform) => {
    const data = aiResponses[platform];
    const scores = scoreResponse(data, DEMO_GROUND_TRUTH);
    const percentage = calcPercentage(scores);
    return { platform, data, scores, percentage };
  });

  const overallScore = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);

  return {
    url,
    groundTruth: DEMO_GROUND_TRUTH,
    results,
    overallScore,
    generatedAt: new Date().toISOString(),
    isDemo: true,
  };
}
