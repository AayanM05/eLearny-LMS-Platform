import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, GraduationCap, BookOpen, IndianRupee, CheckCircle2, XCircle, Ticket, ReceiptText, FileSpreadsheet, Tag } from "lucide-react";
import { adminApi } from "../../api/admin";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { getErrorMessage } from "../../utils/errorMessage";

export default function AdminDashboard() {
  const { push } = useToast();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState(null);

  const load = () => {
    adminApi.dashboard().then((res) => setStats(res.data)).catch(() => {});
    adminApi.pendingInstructors().then((res) => setPending(res.data)).catch(() => setPending([]));
  };

  useEffect(load, []);

  const decide = async (id, approve) => {
    try {
      await adminApi.decideInstructor(id, approve);
      push(approve ? "Instructor approved." : "Instructor rejected.", "success");
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not process this request."), "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Admin dashboard</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/admin/coupons" className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold hover:border-[var(--color-violet)]">
          <Ticket size={14} /> Coupons
        </Link>
        <Link to="/admin/refunds" className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold hover:border-[var(--color-violet)]">
          <ReceiptText size={14} /> Refund requests
        </Link>
        <Link to="/admin/reports" className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold hover:border-[var(--color-violet)]">
          <FileSpreadsheet size={14} /> Reports
        </Link>
        <Link to="/admin/categories" className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold hover:border-[var(--color-violet)]">
          <Tag size={14} /> Categories
        </Link>
      </div>

      {!stats ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Users} label="Students" value={stats.totalStudents} />
          <StatCard icon={GraduationCap} label="Instructors" value={stats.totalInstructors} />
          <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses} />
          <StatCard icon={IndianRupee} label="Revenue" value={`₹${stats.totalRevenue}`} />
        </div>
      )}

      <h2 className="mt-12 font-display text-xl font-bold">Pending instructor approvals</h2>
      <div className="mt-4 flex flex-col gap-3">
        {pending === null ? (
          <div className="flex justify-center py-10"><Spinner size={24} /></div>
        ) : pending.length === 0 ? (
          <EmptyState title="All caught up" description="No instructor applications waiting for review." />
        ) : (
          pending.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-white p-4">
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-[var(--color-ink-soft)]">{p.email}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => decide(p.id, true)}>
                  <CheckCircle2 size={14} /> Approve
                </Button>
                <Button variant="danger" onClick={() => decide(p.id, false)}>
                  <XCircle size={14} /> Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
      <Icon size={18} className="text-[var(--color-violet)]" />
      <p className="mt-3 font-mono-stat text-2xl font-bold">{value}</p>
      <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
    </div>
  );
}
