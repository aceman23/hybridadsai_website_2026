import type { Page } from '../App';

export async function getAuthDestination(accessToken: string): Promise<Page> {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-gtm-status`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.customer?.payment_status === 'paid') {
        return 'gtm-workspace';
      }
    }
  } catch {
    // Fall through to default
  }
  return 'gtm-service';
}
