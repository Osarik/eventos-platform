"use client";

import { LogIn } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/services/supabase/client";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const name = String(formData.get("name"));

    const supabase = createSupabaseBrowserClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.user?.identities?.length === 0) {
      setError("Este correo ya esta registrado. Inicia sesion.");
      return;
    }

    setMessage("Cuenta creada. Redirigiendo...");
    window.location.href = "/mi-cuenta";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" name="name" placeholder="Tu nombre" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tu@correo.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contrasena</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Minimo 6 caracteres"
          minLength={6}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-accent">{message}</p>}
      <Button className="w-full" disabled={isLoading}>
        <LogIn className="h-4 w-4" />
        Crear cuenta
      </Button>
    </form>
  );
}
