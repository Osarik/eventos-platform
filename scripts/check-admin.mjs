import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hfeqmbehpuccjklyxmwa.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZXFtYmVocHVjY2prbHl4bXdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIwNTk1OCwiZXhwIjoyMTAwNzgxOTU4fQ.wVzrERR7JmU0daS-VDM8Bx6B-KEupNRsQfQS1CW_Qiw";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  // Check auth users
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const admin = authUsers.users.find(u => u.email === "admin@eventos.com");
  
  if (!admin) {
    console.log("❌ Auth user 'admin@eventos.com' NOT FOUND");
    return;
  }
  console.log("✅ Auth user found:", admin.id, "| confirmed:", admin.email_confirmed_at);

  // Check usuarios table
  const { data: usuario, error: ue } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", "admin@eventos.com")
    .single();

  if (ue) {
    console.log("❌ Error querying usuarios:", ue.message);
    return;
  }
  console.log("✅ Usuario in DB:", usuario.role, "|", usuario.full_name);

  // Check org membership
  const { data: orgUser } = await supabase
    .from("organization_users")
    .select("*, organizations(name)")
    .eq("user_id", admin.id);

  console.log("✅ Org memberships:", orgUser?.length ?? 0);
  if (orgUser?.length) {
    console.log("   Role:", orgUser[0].role, "| Org:", orgUser[0].organizations?.name);
  }
}

main().catch(console.error);
