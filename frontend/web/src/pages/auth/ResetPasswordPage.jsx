import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/auth";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import FormField, { TextInput } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errorMessage";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const [token, setToken] = useState(params.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword });
      push("Password updated — please log in.", "success");
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "This reset link is invalid or has expired."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-bold">Set a new password</h1>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <FormField label="Reset token">
          <TextInput required value={token} onChange={(e) => setToken(e.target.value)} />
        </FormField>
        <FormField label="New password" hint="At least 8 characters.">
          <TextInput type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </FormField>
        {error && <p className="text-sm font-medium text-[var(--color-coral-deep)]">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Update password
        </Button>
      </form>
    </div>
  );
}
