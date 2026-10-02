import { useEffect, useState } from "react";
import { useRouter, usePathname } from "expo-router";
import { isLoggedIn } from "@/lib/auth";

export function useRequireAuth(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isLoggedIn().then((loggedIn) => {
      if (cancelled) return;
      if (!loggedIn) {
        router.replace({ pathname: "/auth/login", params: { redirect: pathname } });
      } else {
        setChecked(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  return checked;
}
