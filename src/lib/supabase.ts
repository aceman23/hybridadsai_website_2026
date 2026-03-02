import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveChatMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  model: string = 'nexus-7'
) {
  try {
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role,
      content,
      model,
    });
  } catch {
  }
}

export async function trackInteraction(feature: string, metadata: Record<string, unknown> = {}) {
  try {
    await supabase.from('demo_interactions').insert({ feature, metadata });
  } catch {
  }
}

export async function joinWaitlist(email: string, plan: string = 'starter') {
  const { data, error } = await supabase
    .from('waitlist')
    .insert({ email, plan })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}
