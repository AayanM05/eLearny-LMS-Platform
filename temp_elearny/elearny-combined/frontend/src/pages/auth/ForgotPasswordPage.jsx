import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import Button from "../../components/Button";
import FormField, { TextInput } from "../../components/FormField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
    } finally {
      setLoading(false);
      setSent(true); // always show the same confirmation, regardless of whether the email exists
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-bold">Reset your password</h1>
      {sent ? (
        <p className="mt-4 rounded-xl bg-[var(--color-violet-pale)] p-4 text-sm text-[var(--color-violet-deep)]">
          If an account exists for {email}, we've sent a reset link. It expires in 15 minutes.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <FormField label="Email">
            <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <Button type="submit" loading={loading} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        <Link to="/login" className="font-semibold text-[var(--color-violet)] hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
