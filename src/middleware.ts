import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type SupabaseCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

const ADMIN_ROUTES = ["/dashboard", "/scanner"];
const USER_ROUTES = ["/mi-cuenta"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: SupabaseCookie[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isUserRoute = USER_ROUTES.some((r) => pathname.startsWith(r));

  if (isAdminRoute && !user) {
    return redirectTo(request, "/login");
  }

  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from("usuarios")
      .select("role")
      .eq("id", user.id)
      .single();

    const allowed = ["super_admin", "admin", "staff"];
    if (!profile || !allowed.includes(profile.role)) {
      return redirectTo(request, "/acceso-denegado");
    }
  }

  if (isUserRoute && !user) {
    return redirectTo(request, "/login");
  }

  return response;
}

function redirectTo(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scanner/:path*",
    "/mi-cuenta/:path*",
    "/mi-cuenta"
  ]
};
