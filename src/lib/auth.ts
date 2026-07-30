import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type SupabaseCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

type AllowedRole = "super_admin" | "admin" | "staff";

export async function requireRole(allowedRoles: AllowedRole[]) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: SupabaseCookie[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      error: new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "content-type": "application/json" }
      })
    };
  }

  const { data: profile } = await supabase
    .from("usuarios")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role as AllowedRole)) {
    return {
      user: null,
      error: new NextResponse(JSON.stringify({ error: "Permiso denegado" }), {
        status: 403,
        headers: { "content-type": "application/json" }
      })
    };
  }

  return { user, error: null };
}
