// library-inventory-system\src\lib\supabase\server-client.ts


import { createClient } from '@supabase/supabase-js';



// This client uses the service role key which bypasses RLS policies
// IMPORTANT: This should ONLY be used in server-side code
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for server client');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);