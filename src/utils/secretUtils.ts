import { supabase } from "@/integrations/supabase/client";

export async function getSecret(secretName: string): Promise<string> {
  try {
    // First try to get the secret directly from the hardcoded values
    const ADMIN_PASSWORDS: Record<string, string> = {
      'ADMIN_DELETE_PASSWORD': '010203Ww@',
      'ADMIN_EXPORT_PASSWORD': '010203Ww@',
      'ADMIN_EDIT_PASSWORD': 'A010203'
    };

    if (ADMIN_PASSWORDS[secretName]) {
      return ADMIN_PASSWORDS[secretName];
    }

    // If not found in hardcoded values, try Supabase function as fallback
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { name: secretName }
    });

    if (error) {
      console.error('Error fetching secret from Supabase:', error);
      // If Supabase fails, check hardcoded values again as final fallback
      if (ADMIN_PASSWORDS[secretName]) {
        return ADMIN_PASSWORDS[secretName];
      }
      throw new Error('Unable to verify password');
    }

    if (!data || !data[secretName]) {
      throw new Error(`Secret ${secretName} not found`);
    }

    return data[secretName];
  } catch (error) {
    console.error('Error in getSecret:', error);
    throw error;
  }
}