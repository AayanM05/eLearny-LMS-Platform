import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import FormField, { TextInput } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR59-FR60: 6-digit TOTP challenge, shown after password check succeeds for 2FA-enabled accounts. */
export default function TwoFactorChallenge({ challengeToken, onSuccess }) {
  const { complete2fa } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await complete2fa(challengeToken, code);
      if (data.status === "OK") onSuccess(data.user);
    } catch (err) {
      setError(getErrorMessage(err, "Invalid code. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-violet-pale)] text-[var(--color-violet)]">
        <ShieldCheck size={22} />
      </div>
      <h1 className="font-display text-2xl font-bold">Two-factor verification</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Enter the 6-digit code from your authenticator app.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <FormField label="Authentication code">
          <TextInput
            inputMode="numeric"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="text-center font-mono-stat text-lg tracking-[0.4em]"
          />
        </FormField>
        {error && <p className="text-sm font-medium text-[var(--color-coral-deep)]">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Verify &amp; continue
        </Button>
      </form>
    </div>
  );
}
