import { User } from "lucide-react";
import Link from "next/link";

import { createSupabaseServerPageClient } from "@/services/supabase/server";
import { LogoutButton } from "@/features/auth/components/logout-button";

export default async function MiCuentaLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerPageClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("usuarios")
    .select("full_name, email")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  return (
    <main className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Mi Cuenta</h1>
            <p className="text-sm text-muted-foreground">
              {profile?.full_name ?? profile?.email ?? user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/eventos"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Ver eventos
          </Link>
          <LogoutButton />
        </div>
      </div>
      {children}
    </main>
  );
}
