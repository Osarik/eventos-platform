import type { ValidationResponse } from "@/features/scanner/types";

export class MockValidationService {
  private validTokens = new Set([
    "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1",
    "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"
  ]);

  private usedTokens = new Set([
    "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1"
  ]);

  async validateByToken(token: string): Promise<ValidationResponse> {
    if (!this.validTokens.has(token)) {
      return {
        valid: false,
        status: "invalid",
        message: "Ticket no encontrado"
      };
    }

    if (this.usedTokens.has(token)) {
      return {
        valid: false,
        status: "used",
        ticket: {
          id: "tic_002",
          attendeeName: "Carlos Rios",
          attendeeEmail: "carlos@example.com",
          eventTitle: "Neon Sessions Medellin",
          checkedInAt: "2026-09-12T22:08:00-05:00"
        },
        message: "Esta entrada ya fue utilizada"
      };
    }

    return {
      valid: true,
      status: "valid",
      ticket: {
        id: "tic_001",
        attendeeName: "Laura Gomez",
        attendeeEmail: "laura@example.com",
        eventTitle: "Neon Sessions Medellin"
      },
      message: "Entrada válida"
    };
  }
}
