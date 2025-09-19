import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC__SUPABASE_URL!, process.env.NEXT_PUBLIC__SUPABASE_ANON_KEY!)
}
