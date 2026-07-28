import type {
  Organization as DBOrganization,
  OrganizationUser as DBOrganizationUser,
  OrganizationSettings as DBOrganizationSettings,
  UserRole
} from "@/types/database";

export type Organization = DBOrganization;
export type OrganizationUser = DBOrganizationUser;
export type OrganizationSettings = DBOrganizationSettings;

export type OrganizationWithRole = Organization & { role: UserRole };

export type CreateOrganizationInput = {
  name: string;
  slug: string;
  description?: string;
};

export type UpdateOrganizationInput = Partial<
  Pick<Organization, "name" | "description" | "is_active">
>;

export type AddMemberInput = {
  organizationId: string;
  userId: string;
  role: UserRole;
};
