import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CalendarDays className="h-5 w-5" />
          </span>
          Eventos Platform
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/eventos" className="hover:text-foreground">
            Eventos
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild>
            <Link href="/eventos">Comprar entradas</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
