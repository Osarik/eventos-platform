import type { UserRole } from "@/types/database";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  avatarUrl?: string;
};

export type AuthSession = {
  user: AuthUser | null;
  isLoading: boolean;
  organizationId?: string;
  organizationRole?: UserRole;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
};

export type AuthError = {
  message: string;
  code?: string;
};
