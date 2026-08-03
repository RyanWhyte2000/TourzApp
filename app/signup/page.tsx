import AuthForm from "../auth/AuthForm";
import AuthShell from "../auth/AuthShell";
import { signup } from "../auth/actions";

export default function SignupPage() {
  return <AuthShell title="Create your account" description="Save favorites and keep your travel plans together.">
    <AuthForm action={signup} fields={[{ name: "name", label: "Full name", autoComplete: "name" }, { name: "email", label: "Email", type: "email", autoComplete: "email" }, { name: "password", label: "Password", type: "password", autoComplete: "new-password" }]} submitLabel="Create account" footer={{ text: "Already have an account?", label: "Sign in", href: "/login" }} />
  </AuthShell>;
}
