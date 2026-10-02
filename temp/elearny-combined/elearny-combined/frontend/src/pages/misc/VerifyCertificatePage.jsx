import { useState } from "react";
import { ShieldCheck, ShieldX, Search } from "lucide-react";
import { certificateApi } from "../../api/enrollment";
import Button from "../../components/Button";
import { TextInput } from "../../components/FormField";

export default function VerifyCertificatePage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null); // { valid, courseTitle, studentName } | { notFound: true }
  const [loading, setLoading] = useState(false);

  const check = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await certificateApi.verify(code.trim());
      setResult(data);
    } catch {
      setResult({ notFound: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-bold">Verify a certificate</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Enter the certificate code (e.g. ELN-CERT-XXXXXXXX) to confirm it's authentic.
      </p>
      <form onSubmit={check} className="mt-6 flex gap-2">
        <TextInput placeholder="ELN-CERT-..." value={code} onChange={(e) => setCode(e.target.value)} required />
        <Button type="submit" loading={loading}>
          <Search size={15} /> Verify
        </Button>
      </form>

      {result && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-2xl border p-5 ${
            result.notFound ? "border-red-200 bg-red-50" : "border-[var(--color-success)] bg-green-50"
          }`}
        >
          {result.notFound ? (
            <>
              <ShieldX size={20} className="mt-0.5 text-red-600" />
              <p className="text-sm text-red-700">No certificate found with this code.</p>
            </>
          ) : (
            <>
              <ShieldCheck size={20} className="mt-0.5 text-[var(--color-success)]" />
              <div className="text-sm">
                <p className="font-semibold text-green-800">Valid certificate</p>
                <p className="text-green-700">{result.studentName} completed "{result.courseTitle}".</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
