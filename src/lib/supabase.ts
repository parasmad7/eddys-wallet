import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const CHILD_TOKEN_KEY = 'eddy_child_token';

/** Default client: used for parent Supabase Auth (signUp/signIn/session) and as the base for data access. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let childClient: SupabaseClient | null = null;
let childClientToken: string | null = null;

export function getChildToken(): string | null {
  return localStorage.getItem(CHILD_TOKEN_KEY);
}

export function setChildToken(token: string) {
  localStorage.setItem(CHILD_TOKEN_KEY, token);
  childClient = null;
}

export function clearChildToken() {
  localStorage.removeItem(CHILD_TOKEN_KEY);
  childClient = null;
}

/**
 * Children authenticate via a custom JWT from the child-login Edge Function rather than a
 * Supabase Auth session, so they can't rely on the default client's built-in session. This
 * returns a client carrying that token as a bearer header when a child session is active,
 * so RLS sees the right role/profile claims; otherwise it returns the default (parent) client.
 */
export function getDataClient(): SupabaseClient {
  const token = getChildToken();
  if (!token) return supabase;
  if (childClient && childClientToken === token) return childClient;
  childClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  childClientToken = token;
  return childClient;
}
