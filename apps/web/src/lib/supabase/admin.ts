import { createClient } from '@supabase/supabase-js'
import type { Database } from '@sport-fan/types'

// Service role client — SERVER ONLY. Never import this in client components.
// Used in server actions that require admin privileges (e.g., promoting a user to admin).
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
