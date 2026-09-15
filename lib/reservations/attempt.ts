import type { SupabaseClient } from "@supabase/supabase-js";

export function isReservationAttempt(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function findReservationAttempt(client: SupabaseClient, id: string, userId: string, listingId: string) {
  const { data, error } = await client.from("reservations").select("id")
    .eq("id", id).eq("user_id", userId).eq("listing_id", listingId).maybeSingle();
  if (error) throw new Error("Unable to verify reservation outcome.");
  return data?.id as string | undefined;
}
