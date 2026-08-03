"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export type AuthState = { error?: string; success?: string } | undefined;

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

function safeNext(formData: FormData, fallback = "/wishlist") {
  const requested = String(formData.get("next") ?? fallback);
  return requested.startsWith("/") && !requested.startsWith("//") ? requested : fallback;
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const values = credentials(formData);
  if (!values.email || !values.password) return { error: "Enter your email and password." };
  const supabase = await createAuthSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(values);
  if (error) return { error: "The email or password is incorrect." };
  redirect(safeNext(formData));
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const values = credentials(formData);
  if (name.length < 2) return { error: "Enter your full name." };
  if (!values.email.includes("@")) return { error: "Enter a valid email address." };
  if (values.password.length < 8) return { error: "Password must be at least 8 characters." };

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createAuthSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    ...values,
    options: { data: { full_name: name }, emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: error.message };
  if (data.session) redirect("/wishlist");
  return { success: "Check your email to confirm your account." };
}

export async function requestPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) return { error: "Enter a valid email address." };
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createAuthSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });
  if (error) return { error: error.message };
  return { success: "If an account exists, a password reset link has been sent." };
}

export async function updatePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmPassword") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmation) return { error: "Passwords do not match." };
  const supabase = await createAuthSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: "Your password has been updated. You can now sign in." };
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData);
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createAuthSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
}

export async function logout() {
  const supabase = await createAuthSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
