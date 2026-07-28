import type { ValidationResult } from "@/types/database";

export type ScanResult = {
  id: string;
  ticketId: string;
  eventId: string;
  scannedBy: string | null;
  deviceInfo: Record<string, unknown>;
  result: ValidationResult;
  reason: string | null;
  scannedAt: string;
};

export type ValidationResponse = {
  valid: boolean;
  status: string;
  ticket?: {
    id: string;
    attendeeName: string;
    attendeeEmail: string;
    eventTitle?: string;
    checkedInAt?: string | null;
  };
  message: string;
};

export type ScannerDeviceInfo = {
  userAgent: string;
  platform: string;
  timestamp: string;
};
