import { useState } from "react";
import { useParams } from "react-router-dom";
import { FileSpreadsheet, Download } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";

/** FR68: Admin/Instructor export of enrollments (per course, XLSX) and platform revenue (Admin, CSV). */
export default function ReportsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { push } = useToast();
  const [downloading, setDownloading] = useState(null);

  const download = async (path, filename) => {
    setDownloading(path);
    try {
      const res = await api.get(path, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      push("Could not generate this report.", "error");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Reports</h1>

      <div className="mt-6 flex flex-col gap-3">
        {courseId && (
          <ReportRow
            icon={FileSpreadsheet}
            title="Enrollments (this course)"
            description="Every student enrolled, with sign-up date and status — XLSX."
            loading={downloading === `/reports/courses/${courseId}/enrollments.xlsx`}
            onClick={() => download(`/reports/courses/${courseId}/enrollments.xlsx`, "enrollments.xlsx")}
          />
        )}
        {user?.role === "ADMIN" && (
          <ReportRow
            icon={FileSpreadsheet}
            title="Platform revenue"
            description="Every payment across the platform, by course and status — CSV."
            loading={downloading === "/reports/revenue.csv"}
            onClick={() => download("/reports/revenue.csv", "revenue.csv")}
          />
        )}
      </div>
    </div>
  );
}

function ReportRow({ icon: Icon, title, description, loading, onClick }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-violet-pale)] text-[var(--color-violet)]">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-[var(--color-ink-soft)]">{description}</p>
        </div>
      </div>
      <Button variant="outline" onClick={onClick} loading={loading}>
        <Download size={14} /> Export
      </Button>
    </div>
  );
}
