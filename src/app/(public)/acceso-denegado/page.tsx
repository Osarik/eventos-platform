import { ShieldOff } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Acceso Denegado"
};

export default function ForbiddenPage() {
  return (
    <main className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldOff className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Acceso denegado
        </h1>
        <p className="mt-3 text-muted-foreground">
          No tienes permisos para acceder a esta pagina. Si crees que esto es un
          error, contacta al administrador.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
