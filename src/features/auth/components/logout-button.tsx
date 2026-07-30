"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/services/supabase/client";

export function LogoutButton({
  variant = "outline"
}: {
  variant?: "outline" | "ghost" | "default";
}) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant={variant} size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Cerrar sesion
    </Button>
  );
}
