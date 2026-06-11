import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key'
  )
}
