import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import FormField, { TextInput } from "../../components/FormField";
import TwoFactorChallenge from "./TwoFactorChallenge";
import { getErrorMessage } from "../../utils/errorMessage";

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [challenge, setChallenge] = useState(null); // { challengeToken }

  const redirectAfterLogin = (user) => {
    const dest = location.state?.from?.pathname ||
      (user.role === "ADMIN" ? "/admin" : user.role === "INSTRUCTOR" ? "/instructor" : user.role === "TEACHING_ASSISTANT" ? "/ta" : "/dashboard");
    navigate(dest, { replace: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.status === "OK") {
        push(`Welcome back, ${data.user.name}`, "success");
        redirectAfterLogin(data.user);
      } else if (data.status === "2FA_REQUIRED") {
        setChallenge({ challengeToken: data.challengeToken });
      } else if (data.status === "2FA_SETUP_REQUIRED") {
        navigate("/settings/security", { state: { forceSetup: true, email: form.email } });
      }
    } catch (err) {
      setError(getErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  if (challenge) {
    return <TwoFactorChallenge challengeToken={challenge.challengeToken} onSuccess={redirectAfterLogin} />;
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Log in to keep learning.</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <FormField label="Email">
          <TextInput
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </FormField>
        <FormField label="Password">
          <TextInput
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </FormField>
        {error && <p className="text-sm font-medium text-[var(--color-coral-deep)]">{error}</p>}
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-[var(--color-violet)] hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        New to eLearny?{" "}
        <Link to="/register" className="font-semibold text-[var(--color-violet)] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
