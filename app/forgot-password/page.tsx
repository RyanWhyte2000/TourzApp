import AuthForm from "../auth/AuthForm";
import AuthShell from "../auth/AuthShell";
import { requestPasswordReset } from "../auth/actions";

export default function ForgotPasswordPage() {
  return <AuthShell title="Reset your password" description="We’ll email you a secure password reset link.">
    <AuthForm action={requestPasswordReset} fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]} submitLabel="Send reset link" footer={{ text: "Remembered it?", label: "Back to sign in", href: "/login" }} />
  </AuthShell>;
}
