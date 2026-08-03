import Link from "next/link";
import AuthForm from "../auth/AuthForm";
import AuthShell from "../auth/AuthShell";
import { login, signInWithGoogle } from "../auth/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const requestedNext = (await searchParams).next ?? "/wishlist";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/wishlist";
  return <AuthShell title="Welcome back" description="Sign in to access your saved trips and bookings.">
    <form action={signInWithGoogle}><input type="hidden" name="next" value={next} /><button className="mb-5 h-12 w-full rounded-xl border border-slate-200 font-semibold transition hover:bg-slate-50">Continue with Google</button></form>
    <div className="mb-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />OR<span className="h-px flex-1 bg-slate-200" /></div>
    <AuthForm action={login} hiddenFields={{ next }} fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }, { name: "password", label: "Password", type: "password", autoComplete: "current-password" }]} submitLabel="Sign in" footer={{ text: "New to Tourz?", label: "Create account", href: "/signup" }} />
    <Link href="/forgot-password" className="mt-4 block text-center text-sm font-medium text-violet-700">Forgot password?</Link>
  </AuthShell>;
}
