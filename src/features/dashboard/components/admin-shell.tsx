import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  Circle,
  Menu,
  QrCode,
  Settings,
  Ticket,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { createSupabaseServerPageClient } from "@/services/supabase/server";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/dashboard/tickets", label: "Tickets", icon: Ticket },
  { href: "/scanner", label: "Scanner", icon: QrCode },
  { href: "/dashboard/ventas", label: "Ventas", icon: Users },
  { href: "/dashboard/configuracion", label: "Config", icon: Settings }
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerPageClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("usuarios")
    .select("full_name, email, role")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const displayName =
    profile?.full_name ?? profile?.email ?? user?.email ?? "Admin";
  const roleLabel =
    profile?.role === "super_admin"
      ? "Super Administrador"
      : profile?.role === "admin"
        ? "Administrador"
        : "Staff";

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b px-6 font-semibold">
          Eventos Admin
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Circle className="h-2 w-2 fill-accent text-accent" />
                En linea
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              href="/"
              className="block rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Mi perfil
            </Link>
            <div className="px-3 py-1.5 text-xs text-muted-foreground">
              <LogoutButton variant="ghost" />
            </div>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="flex h-16 flex-row items-center border-b px-6">
                  <SheetTitle className="text-base">Eventos Admin</SheetTitle>
                </SheetHeader>
                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm text-muted-foreground">{roleLabel}</p>
              <h1 className="text-base font-semibold">Panel administrativo</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:block">
              {displayName}
            </span>
            <ThemeToggle />
          </div>
        </header>
        <main className="px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
