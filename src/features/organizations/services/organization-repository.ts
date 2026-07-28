import type {
  Organization,
  OrganizationUser,
  OrganizationSettings,
  OrganizationWithRole,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  AddMemberInput
} from "@/features/organizations/types";

export interface OrganizationRepository {
  listByUserId(userId: string): Promise<OrganizationWithRole[]>;
  getById(id: string): Promise<Organization | null>;
  getBySlug(slug: string): Promise<Organization | null>;
  create(input: CreateOrganizationInput): Promise<Organization>;
  update(id: string, input: UpdateOrganizationInput): Promise<Organization>;
  deactivate(id: string): Promise<void>;

  getMembers(organizationId: string): Promise<OrganizationUser[]>;
  addMember(input: AddMemberInput): Promise<OrganizationUser>;
  removeMember(organizationId: string, userId: string): Promise<void>;
  updateMemberRole(
    organizationId: string,
    userId: string,
    role: OrganizationUser["role"]
  ): Promise<void>;

  getSettings(organizationId: string): Promise<OrganizationSettings | null>;
  updateSettings(
    organizationId: string,
    settings: Partial<OrganizationSettings>
  ): Promise<OrganizationSettings>;
}
