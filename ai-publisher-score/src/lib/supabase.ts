import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveReport(report: {
  url: string;
  overall_score: number;
  platform_scores: Record<string, number>;
  is_demo: boolean;
  generated_at: string;
}) {
  const { error } = await supabase.from('aps_reports').insert([report]);
  if (error) console.error('Failed to save report:', error.message);
}
