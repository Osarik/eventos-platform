import { AdminShell } from "@/features/dashboard/components/admin-shell";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
