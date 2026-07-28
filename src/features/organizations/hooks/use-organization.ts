"use client";

import { useState, useEffect } from "react";
import type { Organization } from "@/features/organizations/types";
import { OrganizationMockRepository } from "@/features/organizations/services/organization-mock-repository";

const orgRepo = new OrganizationMockRepository();

export function useOrganization(organizationId?: string) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!organizationId) {
      setIsLoading(false);
      return;
    }
    orgRepo.getById(organizationId).then((org) => {
      setOrganization(org);
      setIsLoading(false);
    });
  }, [organizationId]);

  return { organization, isLoading };
}
