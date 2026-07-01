import { MOTION_SECTIONS } from './constants';
import type { MotionSection } from './constants';
import { callClaude } from './api';

export interface SourceSection {
  id: string;
  title: string;
  category: string;
  angle: string;
  data: string;
  sourceUrl?: string;
}

export function pickNextSection(
  usedSectionIds: string[]
): MotionSection {
  let pool = MOTION_SECTIONS.filter(s => !usedSectionIds.includes(s.id));
  if (pool.length === 0) pool = [...MOTION_SECTIONS];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickNextUrlSection(
  sections: SourceSection[],
  usedIds: string[]
): SourceSection {
  let pool = sections.filter(s => !usedIds.includes(s.id));
  if (pool.length === 0) pool = [...sections];
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function extractSourceSections(
  url: string,
  rawSummary: string
): Promise<SourceSection[]> {
  const prompt = `You are a content strategist. Given the following summary of a URL source, extract 4-8 distinct, non-overlapping content angles that could each become a separate social media post.

URL: ${url}
Summary:
${rawSummary}

Return a JSON array where each item has:
- "id": a short slug like "src-1", "src-2", etc.
- "title": a concise title for this angle (5-10 words)
- "category": one of "Stat", "Insight", "Trend", "Tactic", "Case Study", "Opinion"
- "angle": one sentence describing the hook or angle
- "data": the specific facts/stats/details for this angle (2-5 sentences)

Output ONLY the JSON array. No markdown fences, no explanation.`;

  try {
    const raw = await callClaude(prompt, 2000);
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned) as Array<{
      id: string;
      title: string;
      category: string;
      angle: string;
      data: string;
    }>;
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty');
    return parsed.map(s => ({ ...s, sourceUrl: url }));
  } catch {
    return [
      {
        id: 'src-fallback',
        title: 'Source Summary',
        category: 'Insight',
        angle: 'Key insights from the source.',
        data: rawSummary,
        sourceUrl: url,
      },
    ];
  }
}

export function buildSourceCtx(
  pickedSection: MotionSection | null,
  pickedUrlSections: Array<{ source: { note: string; domain: string; url: string }; section: SourceSection }>
): string {
  let ctx = '';
  if (pickedSection) {
    ctx += `\n\n=== SOURCE: Motion Creative Benchmarks 2026 — Section: ${pickedSection.title} ===\n${pickedSection.data}\nIMPORTANT: Write posts specifically about the above section. Do NOT default to generic talking points.`;
  }
  for (const { source, section } of pickedUrlSections) {
    ctx += `\n\n=== SOURCE: ${source.note || source.domain} (${source.url}) — Section: ${section.title} ===\n${section.data}\nIMPORTANT: Write posts specifically about the above section. Do NOT default to generic talking points.`;
  }
  return ctx;
}
