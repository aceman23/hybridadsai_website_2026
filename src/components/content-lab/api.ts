const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function callClaude(
  prompt: string,
  maxTokens = 1500,
  useWebSearch = false
): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      max_tokens: maxTokens,
      use_web_search: useWebSearch,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  const data = await res.json();
  return data.text || '';
}
