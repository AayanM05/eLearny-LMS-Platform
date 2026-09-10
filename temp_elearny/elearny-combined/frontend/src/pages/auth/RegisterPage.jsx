import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import FormField, { TextInput, Select } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errorMessage";

const CURRENT_TOS_VERSION = "1.0";

export default function RegisterPage() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", role: "STUDENT",
    isUnder18: false, parentalConsent: false, acceptedTos: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.acceptedTos) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }
    if (form.isUnder18 && !form.parentalConsent) {
      setError("Parental consent is required for users under 18."); // mirrors backend FR
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        tosVersion: CURRENT_TOS_VERSION,
        isUnder18: form.isUnder18,
        parentalConsent: form.parentalConsent,
      });
      push("Account created — log in to continue.", "success");
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed. Please check your details."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Start learning, or start teaching.</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <FormField label="Full name">
          <TextInput required value={form.name} onChange={update("name")} />
        </FormField>
        <FormField label="Email">
          <TextInput type="email" required value={form.email} onChange={update("email")} />
        </FormField>
        <FormField label="Phone">
          <TextInput required placeholder="+91XXXXXXXXXX" value={form.phone} onChange={update("phone")} />
        </FormField>
        <FormField label="Password" hint="At least 8 characters.">
          <TextInput type="password" required minLength={8} value={form.password} onChange={update("password")} />
        </FormField>
        <FormField label="I want to">
          <Select value={form.role} onChange={update("role")}>
            <option value="STUDENT">Learn (Student)</option>
            <option value="INSTRUCTOR">Teach (Instructor — subject to Admin approval)</option>
          </Select>
        </FormField>

        <label className="flex items-start gap-2 text-sm text-[var(--color-ink-soft)]">
          <input type="checkbox" className="mt-0.5" checked={form.isUnder18} onChange={update("isUnder18")} />
          I am under 18 years old
        </label>
        {form.isUnder18 && (
          <label className="flex items-start gap-2 text-sm text-[var(--color-ink-soft)]">
            <input type="checkbox" className="mt-0.5" checked={form.parentalConsent} onChange={update("parentalConsent")} />
            My parent or guardian consents to this account
          </label>
        )}
        <label className="flex items-start gap-2 text-sm text-[var(--color-ink-soft)]">
          <input type="checkbox" className="mt-0.5" checked={form.acceptedTos} onChange={update("acceptedTos")} />
          I accept the Terms of Service (v{CURRENT_TOS_VERSION})
        </label>

        {error && <p className="text-sm font-medium text-[var(--color-coral-deep)]">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[var(--color-violet)] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
