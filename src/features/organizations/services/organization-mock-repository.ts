import type {
  Organization,
  OrganizationUser,
  OrganizationSettings,
  OrganizationWithRole,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  AddMemberInput
} from "@/features/organizations/types";
import type { OrganizationRepository } from "./organization-repository";

const mockOrgs: Organization[] = [
  {
    id: "org_001",
    slug: "demo-org",
    name: "Organización Demo",
    logo_path: null,
    description: "Organización de demostración",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockOrgUsers: OrganizationUser[] = [
  {
    id: "ou_001",
    organization_id: "org_001",
    user_id: "user_demo",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockSettings: OrganizationSettings = {
  id: "os_001",
  organization_id: "org_001",
  support_email: "soporte@demo.com",
  support_phone: null,
  ticket_prefix: "TKT",
  currency: "COP",
  timezone: "America/Bogota",
  primary_color: "#000000",
  logo_url: null,
  favicon_url: null,
  email_config: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export class OrganizationMockRepository implements OrganizationRepository {
  async listByUserId(_userId: string): Promise<OrganizationWithRole[]> {
    void _userId;
    return mockOrgs.map((org) => {
      const membership = mockOrgUsers.find(
        (ou) => ou.organization_id === org.id
      );
      return { ...org, role: membership?.role ?? "customer" };
    });
  }

  async getById(id: string): Promise<Organization | null> {
    return mockOrgs.find((o) => o.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Organization | null> {
    return mockOrgs.find((o) => o.slug === slug) ?? null;
  }

  async create(input: CreateOrganizationInput): Promise<Organization> {
    const org: Organization = {
      id: `org_${Date.now()}`,
      slug: input.slug,
      name: input.name,
      description: input.description ?? null,
      logo_path: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockOrgs.push(org);
    return org;
  }

  async update(
    id: string,
    input: UpdateOrganizationInput
  ): Promise<Organization> {
    const idx = mockOrgs.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Organization not found");
    mockOrgs[idx] = {
      ...mockOrgs[idx],
      ...input,
      updated_at: new Date().toISOString()
    };
    return mockOrgs[idx];
  }

  async deactivate(id: string): Promise<void> {
    const idx = mockOrgs.findIndex((o) => o.id === id);
    if (idx !== -1) mockOrgs[idx].is_active = false;
  }

  async getMembers(organizationId: string): Promise<OrganizationUser[]> {
    return mockOrgUsers.filter((ou) => ou.organization_id === organizationId);
  }

  async addMember(input: AddMemberInput): Promise<OrganizationUser> {
    const ou: OrganizationUser = {
      id: `ou_${Date.now()}`,
      organization_id: input.organizationId,
      user_id: input.userId,
      role: input.role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockOrgUsers.push(ou);
    return ou;
  }

  async removeMember(organizationId: string, userId: string): Promise<void> {
    const idx = mockOrgUsers.findIndex(
      (ou) => ou.organization_id === organizationId && ou.user_id === userId
    );
    if (idx !== -1) mockOrgUsers.splice(idx, 1);
  }

  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: OrganizationUser["role"]
  ): Promise<void> {
    const member = mockOrgUsers.find(
      (ou) => ou.organization_id === organizationId && ou.user_id === userId
    );
    if (member) {
      member.role = role;
      member.updated_at = new Date().toISOString();
    }
  }

  async getSettings(
    organizationId: string
  ): Promise<OrganizationSettings | null> {
    return mockSettings.organization_id === organizationId
      ? mockSettings
      : null;
  }

  async updateSettings(
    organizationId: string,
    settings: Partial<OrganizationSettings>
  ): Promise<OrganizationSettings> {
    Object.assign(mockSettings, settings, { organization_id: organizationId });
    return mockSettings;
  }
}
