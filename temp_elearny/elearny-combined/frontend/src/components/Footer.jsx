import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <span className="font-display text-lg font-extrabold">
            e<span className="text-[var(--color-violet)]">Learny</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-[var(--color-ink-soft)]">
            A marketplace for real skills — taught by instructors, tracked to completion, proven with a certificate.
          </p>
        </div>
        <FooterCol title="Learn" links={[["Browse courses", "/browse"], ["Certificates", "/verify"]]} />
        <FooterCol title="Teach" links={[["Become an instructor", "/register"], ["Instructor dashboard", "/instructor"]]} />
        <FooterCol title="Company" links={[["About", "/"], ["Support", "/"]]} />
      </div>
      <div className="border-t border-[var(--color-line)] px-4 py-4 text-center text-xs text-[var(--color-ink-soft)]">
        © {new Date().getFullYear()} eLearny. Built as a portfolio project.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[var(--color-ink)]">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-violet)]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
