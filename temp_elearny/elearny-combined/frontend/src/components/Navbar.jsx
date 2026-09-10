import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Search, Heart, Bell, ChevronDown, Menu, X, Award, ShieldCheck, Settings,
  Plus, CalendarOff, Ticket, ReceiptText, FileSpreadsheet, Tag, GraduationCap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * Every role sees the same shell (logo, search, notifications, account menu), but the actual
 * work-related links differ — a Wishlist icon or "Certificates" link is meaningless (and 403s
 * server-side) for anyone who isn't a Student, the same way "Refund requests" only makes sense
 * for an Admin. This table is the single source of truth for that, so the desktop menu, the
 * mobile menu, and the account dropdown can't drift out of sync with each other.
 */
const ROLE_NAV = {
  STUDENT: {
    quickLink: { to: "/wishlist", icon: Heart, label: "Wishlist" },
    menuItems: [
      { to: "/dashboard", icon: GraduationCap, label: "My Learning" },
      { to: "/dashboard/certificates", icon: Award, label: "Certificates" },
      { to: "/wishlist", icon: Heart, label: "Wishlist" },
    ],
  },
  INSTRUCTOR: {
    quickLink: { to: "/instructor/courses/new", icon: Plus, label: "New course" },
    menuItems: [
      { to: "/instructor", icon: GraduationCap, label: "Instructor Dashboard" },
      { to: "/instructor/availability", icon: CalendarOff, label: "Mark unavailable" },
    ],
  },
  TEACHING_ASSISTANT: {
    quickLink: null,
    menuItems: [
      { to: "/ta", icon: GraduationCap, label: "TA Dashboard" },
    ],
  },
  ADMIN: {
    quickLink: null,
    menuItems: [
      { to: "/admin", icon: GraduationCap, label: "Admin Dashboard" },
      { to: "/admin/coupons", icon: Ticket, label: "Coupons" },
      { to: "/admin/refunds", icon: ReceiptText, label: "Refund requests" },
      { to: "/admin/reports", icon: FileSpreadsheet, label: "Reports" },
      { to: "/admin/categories", icon: Tag, label: "Categories" },
    ],
  },
};

const ACCOUNT_ITEMS = [
  { to: "/settings/security", icon: ShieldCheck, label: "Security & 2FA" },
  { to: "/settings/privacy", icon: Settings, label: "Privacy & data" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
  };

  const roleNav = user ? ROLE_NAV[user.role] : null;
  const allMenuItems = roleNav ? [...roleNav.menuItems, ...ACCOUNT_ITEMS] : [];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl font-extrabold tracking-tight text-[var(--color-ink)]">
            e<span className="text-[var(--color-violet)]">Learny</span>
          </span>
          {user && (
            <span className="hidden rounded-full bg-[var(--color-violet-pale)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-violet-deep)] sm:inline">
              {roleLabel(user.role)}
            </span>
          )}
        </Link>

        <form onSubmit={submitSearch} className="hidden flex-1 max-w-xl md:flex">
          <div className="flex w-full items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-canvas)] px-4 py-2">
            <Search size={16} className="text-[var(--color-ink-soft)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, instructors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-ink-soft)]"
            />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-5 md:flex">
          <Link to="/browse" className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-violet)]">
            Browse
          </Link>
          {user ? (
            <>
              {roleNav.quickLink && (
                <Link
                  to={roleNav.quickLink.to}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold hover:border-[var(--color-violet)]"
                >
                  <roleNav.quickLink.icon size={14} /> {roleNav.quickLink.label}
                </Link>
              )}
              <Link to="/notifications" className="text-[var(--color-ink)] hover:text-[var(--color-violet)]" aria-label="Notifications">
                <Bell size={19} />
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] py-1 pl-1 pr-2.5 text-sm font-medium hover:border-[var(--color-violet)]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-violet-pale)] text-xs font-bold text-[var(--color-violet-deep)]">
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {menuOpen && (
                  <div
                    onMouseLeave={() => setMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-1.5 shadow-lg"
                  >
                    <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                      {roleLabel(user.role)}
                    </p>
                    {roleNav.menuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--color-canvas)]"
                      >
                        <item.icon size={15} className="text-[var(--color-ink-soft)]" /> {item.label}
                      </Link>
                    ))}
                    <div className="my-1.5 border-t border-[var(--color-line)]" />
                    {ACCOUNT_ITEMS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--color-canvas)]"
                      >
                        <item.icon size={15} className="text-[var(--color-ink-soft)]" /> {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                      className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--color-coral-deep)] hover:bg-[var(--color-canvas)]"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-[var(--color-violet)]">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[var(--color-violet)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-violet-deep)]"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        <button className="ml-auto md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--color-line)] px-4 py-3 md:hidden">
          <form onSubmit={submitSearch} className="mb-3 flex items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2">
            <Search size={16} className="text-[var(--color-ink-soft)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="flex flex-col gap-1">
            <Link to="/browse" className="rounded-lg px-2 py-2 text-sm hover:bg-[var(--color-canvas)]">Browse</Link>
            {user ? (
              <>
                <p className="px-2 pt-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                  {roleLabel(user.role)}
                </p>
                {allMenuItems.map((item) => (
                  <Link key={item.to} to={item.to} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-[var(--color-canvas)]">
                    <item.icon size={15} className="text-[var(--color-ink-soft)]" /> {item.label}
                  </Link>
                ))}
                <Link to="/notifications" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-[var(--color-canvas)]">
                  <Bell size={15} className="text-[var(--color-ink-soft)]" /> Notifications
                </Link>
                <button onClick={() => { logout(); navigate("/"); }} className="rounded-lg px-2 py-2 text-left text-sm text-[var(--color-coral-deep)]">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-2 py-2 text-sm hover:bg-[var(--color-canvas)]">Log in</Link>
                <Link to="/register" className="rounded-lg px-2 py-2 text-sm font-semibold text-[var(--color-violet)]">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function roleLabel(role) {
  switch (role) {
    case "ADMIN": return "Admin";
    case "INSTRUCTOR": return "Instructor";
    case "TEACHING_ASSISTANT": return "Teaching Assistant";
    default: return "Student";
  }
}
