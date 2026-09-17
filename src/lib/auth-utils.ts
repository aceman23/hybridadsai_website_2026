import { supabase } from './supabase';
import type { Page } from '../App';

export async function getAuthDestination(accessToken: string): Promise<Page> {
  try {
    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('user_id')
      .maybeSingle();
    if (adminRow) return 'admin';
  } catch {
    // Ignore and fall through.
  }

  try {
    const { data: application } = await supabase
      .from('partner_applications')
      .select('id')
      .maybeSingle();
    if (application) return 'partner-portal';
  } catch {
    // Ignore and fall through.
  }

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
    // Fall through to default.
  }
  sessionStorage.setItem('gtm_scroll_pricing', '1');
  return 'gtm-service';
}
