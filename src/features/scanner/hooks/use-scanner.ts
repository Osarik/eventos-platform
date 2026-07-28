"use client";

import { useState } from "react";
import { MockValidationService } from "@/features/scanner/services/validation-service";
import type { ValidationResponse } from "@/features/scanner/types";

const validationService = new MockValidationService();

export function useScanner() {
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  async function validateToken(token: string) {
    setIsValidating(true);
    try {
      const res = await validationService.validateByToken(token);
      setResult(res);
      return res;
    } finally {
      setIsValidating(false);
    }
  }

  function reset() {
    setResult(null);
  }

  return { result, isValidating, validateToken, reset };
}
