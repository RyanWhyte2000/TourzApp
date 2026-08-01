-- Run this after changing database functions so the Supabase Data API
-- immediately discovers the new RPC signature.
notify pgrst, 'reload schema';
