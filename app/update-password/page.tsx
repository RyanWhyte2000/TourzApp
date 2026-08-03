import AuthForm from "../auth/AuthForm";
import AuthShell from "../auth/AuthShell";
import { updatePassword } from "../auth/actions";

export default function UpdatePasswordPage() {
  return <AuthShell title="Choose a new password" description="Use at least 8 characters.">
    <AuthForm action={updatePassword} fields={[{ name: "password", label: "New password", type: "password", autoComplete: "new-password" }, { name: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password" }]} submitLabel="Update password" />
  </AuthShell>;
}
