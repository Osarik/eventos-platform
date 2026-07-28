import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold">Eventos Platform</h3>
            <p className="text-sm text-muted-foreground">
              Venta y validacion de entradas para eventos. Compra segura con
              codigos QR y validacion en tiempo real.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Navegacion</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Inicio
              </Link>
              <Link href="/eventos" className="hover:text-foreground">
                Eventos
              </Link>
            </nav>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              <LockKeyhole className="h-3 w-3" />
              Acceso administrador
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground/50">
          Eventos Platform &mdash; SaaS de boleteria
        </div>
      </div>
    </footer>
  );
}
