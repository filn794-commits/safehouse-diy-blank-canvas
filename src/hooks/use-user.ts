import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppUser = {
  email: string | null;
  displayName: string;
  initials: string;
};

const GUEST: AppUser = { email: null, displayName: "Friend", initials: "?" };

function toUser(email: string | null | undefined, name?: string | null): AppUser {
  if (!email && !name) return GUEST;
  const displayName =
    (name && name.trim()) ||
    (email ? email.split("@")[0]!.replace(/[._-]+/g, " ") : "Friend");
  const pretty = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join(" ");
  const initials = pretty
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return { email: email ?? null, displayName: pretty, initials: initials || "?" };
}

export function useUser(): AppUser {
  const [user, setUser] = useState<AppUser>(GUEST);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setUser(toUser(u?.email, (u?.user_metadata?.["full_name"] as string) ?? null));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setUser(toUser(u?.email, (u?.user_metadata?.["full_name"] as string) ?? null));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return user;
}
