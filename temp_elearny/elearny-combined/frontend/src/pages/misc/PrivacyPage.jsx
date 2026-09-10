import { useState } from "react";
import { ShieldQuestion, Download, Trash2 } from "lucide-react";
import { privacyApi } from "../../api/admin";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";

/** FR64-FR66: a user's own data export and account deletion (anonymization, not hard-delete —
 *  certificates must stay independently verifiable even after the holder deletes their account). */
export default function PrivacyPage() {
  const { logout } = useAuth();
  const { push } = useToast();
  const [exporting, setExporting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const exportData = async () => {
    setExporting(true);
    try {
      const { data } = await privacyApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-elearny-data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      push("Could not export your data right now.", "error");
    } finally {
      setExporting(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await privacyApi.deleteAccount();
      push("Your account has been deleted.", "success");
      logout();
      window.location.href = "/";
    } catch {
      push("Could not delete your account right now.", "error");
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-violet-pale)] text-[var(--color-violet)]">
        <ShieldQuestion size={22} />
      </div>
      <h1 className="font-display text-2xl font-bold">Privacy &amp; data</h1>

      <div className="mt-8 rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <p className="text-sm font-semibold">Download your data</p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Get a copy of your profile, enrollments, and payment history as a JSON file.
        </p>
        <Button variant="outline" onClick={exportData} loading={exporting} className="mt-3">
          <Download size={14} /> Export my data
        </Button>
      </div>

      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-semibold text-red-800">Delete account</p>
        <p className="mt-1 text-sm text-red-700">
          Your profile info is anonymized and you're logged out everywhere. Certificates you've
          earned stay independently verifiable — they just won't show your name to future viewers.
          This can't be undone.
        </p>
        {!confirming ? (
          <Button variant="danger" onClick={() => setConfirming(true)} className="mt-3">
            <Trash2 size={14} /> Delete my account
          </Button>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <Button variant="danger" onClick={deleteAccount} loading={deleting}>
              Yes, permanently delete my account
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
}
