import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { notificationApi } from "../../api/admin";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";

export default function NotificationsPage() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    notificationApi.list().then((res) => setItems(res.data)).catch(() => setItems([]));
  }, []);

  const markRead = async (id) => {
    await notificationApi.markRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Notifications</h1>
      <div className="mt-8">
        {items === null ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : items.length === 0 ? (
          <EmptyState icon={Bell} title="You're all caught up" description="Nothing new right now." />
        ) : (
          <div className="flex flex-col divide-y divide-[var(--color-line)] rounded-2xl border border-[var(--color-line)] bg-white">
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-3 p-4 text-left text-sm transition hover:bg-[var(--color-canvas)] ${!n.read ? "bg-[var(--color-violet-pale)]/40" : ""}`}
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.read ? "bg-[var(--color-violet)]" : "bg-transparent"}`} />
                <span>{n.message}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
