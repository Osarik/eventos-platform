import { UserPlus } from "lucide-react";
import Link from "next/link";

import { RegisterForm } from "@/features/auth/components/register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Crear Cuenta"
};

export default function RegisterPage() {
  return (
    <main className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <UserPlus className="h-5 w-5" />
          </div>
          <CardTitle>Crear tu cuenta</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Registrate para comprar entradas y gestionarlas desde tu panel.
          </p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia sesion
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
