import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { authApi } from "../../api/auth";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import { TextInput } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR59-FR60: instructor/admin accounts land here automatically when 2FA setup is mandatory but missing. */
export default function SecuritySettingsPage() {
  const location = useLocation();
  const { push } = useToast();
  const [qr, setQr] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);

  const startSetup = async () => {
    setLoading(true);
    try {
      const { data } = await authApi.setup2fa();
      setQr(data);
    } catch (err) {
      push(getErrorMessage(err, "Could not start 2FA setup."), "error");
    } finally {
      setLoading(false);
    }
  };

  const activate = async () => {
    setLoading(true);
    try {
      await authApi.activate2fa(code);
      setActivated(true);
      push("Two-factor authentication enabled.", "success");
    } catch (err) {
      push(getErrorMessage(err, "Invalid code."), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-violet-pale)] text-[var(--color-violet)]">
        <ShieldCheck size={22} />
      </div>
      <h1 className="font-display text-2xl font-bold">Security &amp; 2FA</h1>
      {location.state?.forceSetup && (
        <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Instructor and Admin accounts require two-factor authentication before logging in.
        </p>
      )}

      {activated ? (
        <p className="mt-6 text-sm text-[var(--color-success)]">2FA is active on your account. Log in again to use it.</p>
      ) : !qr ? (
        <Button onClick={startSetup} loading={loading} className="mt-6">
          Set up authenticator app
        </Button>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <img src={qr.qrCodeDataUri} alt="2FA QR code" className="h-48 w-48 rounded-xl border border-[var(--color-line)]" />
          <p className="text-xs text-[var(--color-ink-soft)]">
            Can't scan? Enter this key manually:{" "}
            <span className="font-mono-stat">{qr.secret}</span>
          </p>
          <TextInput
            placeholder="6-digit code"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
          <Button onClick={activate} loading={loading}>Activate</Button>
        </div>
      )}
    </div>
  );
}
