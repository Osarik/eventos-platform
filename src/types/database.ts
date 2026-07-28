export type UserRole = "super_admin" | "admin" | "staff" | "customer";

export type EventStatus = "draft" | "active" | "paused" | "finished";

export type TicketStatus = "valid" | "used" | "cancelled";

export type PurchaseStatus = "pending" | "paid" | "failed" | "refunded";

export type ValidationResult = "accepted" | "rejected";

export type PaymentProvider = "wompi" | "mercadopago" | "epayco" | "stripe";

export type PaymentStatus =
  "pending" | "processing" | "approved" | "declined" | "voided" | "error";

export type LogAction =
  | "event.created"
  | "event.updated"
  | "event.deleted"
  | "event.published"
  | "event.paused"
  | "ticket.validated"
  | "ticket.rejected"
  | "purchase.completed"
  | "payment.approved"
  | "payment.declined"
  | "payment.refunded"
  | "user.invited"
  | "user.removed"
  | "organization.created"
  | "organization.updated"
  | "settings.updated";

export interface DatabaseUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  logo_path: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationUser {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  owner_id: string;
  organization_id: string | null;
  slug: string;
  title: string;
  description: string;
  category: string | null;
  venue: string;
  city: string;
  address: string;
  starts_at: string;
  ends_at: string | null;
  image_path: string | null;
  cover_image_path: string | null;
  gallery: string[];
  price_cop: number;
  capacity: number;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  evento_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  quantity: number;
  amount_cop: number;
  status: PurchaseStatus;
  wompi_transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  compra_id: string | null;
  evento_id: string;
  purchase_id: string | null;
  code: string;
  secure_token: string;
  token_salt: string;
  attendee_name: string;
  attendee_email: string;
  status: TicketStatus;
  checked_in_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  purchase_id: string;
  provider: PaymentProvider;
  provider_transaction_id: string | null;
  provider_status: string | null;
  amount_cop: number;
  status: PaymentStatus;
  request_payload: Record<string, unknown> | null;
  response_payload: Record<string, unknown> | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Validation {
  id: string;
  ticket_id: string;
  validated_by: string | null;
  result: ValidationResult;
  reason: string | null;
  created_at: string;
}

export interface Scan {
  id: string;
  ticket_id: string;
  event_id: string;
  scanned_by: string | null;
  device_info: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
  result: ValidationResult;
  reason: string | null;
  scanned_at: string;
}

export interface Log {
  id: string;
  organization_id: string | null;
  actor_id: string | null;
  action: LogAction;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface OrganizationSettings {
  id: string;
  organization_id: string;
  support_email: string | null;
  support_phone: string | null;
  ticket_prefix: string;
  currency: string;
  timezone: string;
  primary_color: string;
  logo_url: string | null;
  favicon_url: string | null;
  email_config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
