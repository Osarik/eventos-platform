import Link from "next/link";
import { CalendarDays, User } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { createSupabaseServerPageClient } from "@/services/supabase/server";

export async function PublicNavbar() {
  const supabase = await createSupabaseServerPageClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CalendarDays className="h-5 w-5" />
          </span>
          La Jugada
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/eventos" className="hover:text-foreground">
            Eventos
          </Link>
          {isLoggedIn && (
            <Link
              href="/mi-cuenta"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Mi Cuenta
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <Button asChild variant="outline">
              <Link href="/mi-cuenta">
                <User className="mr-2 h-4 w-4" />
                Mis Entradas
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Iniciar sesion</Link>
              </Button>
              <Button asChild>
                <Link href="/registro">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
