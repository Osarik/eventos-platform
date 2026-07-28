import type {
  ScanResult,
  ValidationResponse,
  ScannerDeviceInfo
} from "@/features/scanner/types";

export interface ScanRepository {
  recordScan(params: {
    ticketId: string;
    eventId: string;
    scannedBy: string;
    deviceInfo: ScannerDeviceInfo;
    result: "accepted" | "rejected";
    reason?: string;
  }): Promise<ScanResult>;
  getRecentScans(eventId: string, limit?: number): Promise<ScanResult[]>;
  getScansByUser(userId: string, limit?: number): Promise<ScanResult[]>;
}

export interface ValidationService {
  validateByToken(token: string): Promise<ValidationResponse>;
}
