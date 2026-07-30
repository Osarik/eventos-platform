import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hfeqmbehpuccjklyxmwa.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZXFtYmVocHVjY2prbHl4bXdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIwNTk1OCwiZXhwIjoyMTAwNzgxOTU4fQ.wVzrERR7JmU0daS-VDM8Bx6B-KEupNRsQfQS1CW_Qiw";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  // Get existing auth user by email
  const { data: users } = await supabase.auth.admin.listUsers();
  const existing = users.users.find(u => u.email === "admin@eventos.com");

  if (!existing) {
    console.error("Auth user not found - run the script again fresh");
    process.exit(1);
  }

  const userId = existing.id;
  console.log("Auth user found:", userId);

  // Upsert into usuarios
  const { error: ue } = await supabase.from("usuarios").upsert({
    id: userId,
    email: "admin@eventos.com",
    full_name: "Admin Eventos",
    role: "super_admin",
  }, { onConflict: "id" });

  if (ue) { console.error("Error usuario:", ue); process.exit(1); }
  console.log("Usuario upserted");

  // Set role in app_metadata so middleware can read it from the JWT
  const { error: ae } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { ...existing.app_metadata, role: "super_admin" }
  });
  if (ae) { console.error("Error updating app_metadata:", ae); process.exit(1); }
  console.log("App metadata updated with role");

  // Upsert organization
  const { data: org, error: oe } = await supabase
    .from("organizations")
    .upsert({ slug: "eventos-platform", name: "Eventos Platform", description: "Plataforma de gestión de eventos" }, { onConflict: "slug" })
    .select()
    .single();

  if (oe) { console.error("Error org:", oe); process.exit(1); }
  console.log("Organization ready:", org.id);

  // Upsert org membership
  const { error: oue } = await supabase.from("organization_users").upsert({
    organization_id: org.id,
    user_id: userId,
    role: "super_admin",
  }, { onConflict: "organization_id,user_id" });

  if (oue) { console.error("Error org user:", oue); process.exit(1); }
  console.log("User added to org as super_admin");

  console.log("\n✅ Admin listo!");
  console.log("   Email:    admin@eventos.com");
  console.log("   Password: Admin123!");
}

main().catch(console.error);
