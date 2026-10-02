"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

/**
 * No server-side session/cookie exists yet (tokens live in localStorage,
 * set on login) — so this is a client-only guard, not real route
 * protection. The actual security boundary is the backend's JWT
 * validation; this just gives logged-out users a redirect to /auth/login
 * instead of a page full of failed API calls. Revisit if/when the app
 * needs real SSR auth (middleware + cookies) rather than this.
 */
export function useRequireAuth(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setChecked(true);
    }
  }, [router, pathname]);

  return checked;
}
