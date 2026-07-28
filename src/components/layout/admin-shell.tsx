import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  QrCode,
  Settings,
  Ticket,
  Users
} from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/dashboard/tickets", label: "Tickets", icon: Ticket },
  { href: "/scanner", label: "Scanner", icon: QrCode },
  { href: "/dashboard/ventas", label: "Ventas", icon: Users },
  { href: "/dashboard/configuracion", label: "Config", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:block">
        <div className="flex h-16 items-center border-b px-6 font-semibold">
          Eventos Admin
        </div>
        <nav className="space-y-1 p-3">
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
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-sm text-muted-foreground">
              Panel administrativo
            </p>
            <h1 className="text-base font-semibold">Operacion de eventos</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
