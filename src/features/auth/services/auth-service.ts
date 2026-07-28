import { createSupabaseBrowserClient } from "@/services/supabase/client";

export interface AuthService {
  login(
    email: string,
    password: string
  ): Promise<{
    user: import("@/features/auth/types").AuthUser | null;
    error: string | null;
  }>;
  logout(): Promise<void>;
  getSession(): Promise<import("@/features/auth/types").AuthUser | null>;
}

export function createAuthService(): AuthService {
  return {
    async login(email: string, password: string) {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: "Usuario no encontrado" };
      return {
        user: {
          id: data.user.id,
          email: data.user.email ?? "",
          fullName: data.user.user_metadata?.full_name ?? null,
          role:
            (data.user.user_metadata
              ?.role as import("@/types/database").UserRole) ?? "customer"
        },
        error: null
      };
    },
    async logout() {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    },
    async getSession() {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      return {
        id: data.user.id,
        email: data.user.email ?? "",
        fullName: data.user.user_metadata?.full_name ?? null,
        role:
          (data.user.user_metadata
            ?.role as import("@/types/database").UserRole) ?? "customer"
      };
    }
  };
}
