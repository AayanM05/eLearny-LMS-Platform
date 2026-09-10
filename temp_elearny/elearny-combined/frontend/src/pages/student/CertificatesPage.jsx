import { useEffect, useState } from "react";
import { Award, Download, CheckCircle2 } from "lucide-react";
import { certificateApi } from "../../api/enrollment";
import { useToast } from "../../components/Toast";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import { getErrorMessage } from "../../utils/errorMessage";

export default function CertificatesPage() {
  const { push } = useToast();
  const [certs, setCerts] = useState(null);

  useEffect(() => {
    certificateApi.mine().then((res) => setCerts(res.data)).catch(() => setCerts([]));
  }, []);

  const download = async (id) => {
    try {
      const res = await certificateApi.download(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank");
    } catch (err) {
      push(getErrorMessage(err, "Certificate PDF isn't ready yet — try again shortly."), "error");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Your certificates</h1>
      <div className="mt-8">
        {certs === null ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : certs.length === 0 ? (
          <EmptyState icon={Award} title="No certificates yet" description="Finish a course to earn your first certificate." />
        ) : (
          <div className="flex flex-col gap-3">
            {certs.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-violet-pale)] text-[var(--color-violet)]">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{c.courseTitle}</p>
                    <p className="flex items-center gap-1 font-mono-stat text-xs text-[var(--color-ink-soft)]">
                      <CheckCircle2 size={12} className="text-[var(--color-success)]" /> {c.certificateCode}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => download(c.id)}>
                  <Download size={14} /> Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
