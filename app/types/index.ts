// ─── Users ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  tenant: string | null;
  created_at: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  tenant_slug: string;
}

// ─── Tenant & Settings ────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export type PaymentMode = "online_only" | "online_or_offline";

export interface TenantSettings {
  id: string;
  hourly_rate: string;
  daily_rate: string;
  apply_daily_rate: boolean;
  enable_hourly_booking: boolean;
  cancellation_cutoff_hours: number;
  payment_mode: PaymentMode;
  updated_at: string;
}

export type TenantSettingsUpdate = Partial<
  Omit<TenantSettings, "id" | "updated_at">
>;

// ─── Parking ──────────────────────────────────────────────────────────────────

export type SpotType =
  | "standard"
  | "disabled"
  | "ev"
  | "vip"
  | "moto"
  | "camper";
export type SpotStatus = "free" | "occupied" | "reserved" | "maintenance";

export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  total_spots: number;
  available_spots: number;
  tenant: string;
  created_at: string;
}

export interface ParkingSpot {
  id: string;
  location: string;
  location_name?: string;
  identifier: string;
  spot_type: SpotType;
  status: SpotStatus;
  floor?: string;
  notes?: string;
}

export interface AvailabilityQuery {
  location_id: string;
  start_time: string;
  end_time: string;
}

// ─── Operating Hours & Closures ───────────────────────────────────────────────

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface OperatingHours {
  id: string;
  tenant: string;
  location: string | null;
  day_of_week: DayOfWeek;
  day_label: string;
  is_open: boolean;
  open_time: string | null; // "HH:MM"
  close_time: string | null; // "HH:MM"
}

export type OperatingHoursCreate = Omit<
  OperatingHours,
  "id" | "day_label" | "tenant"
>;
export type OperatingHoursUpdate = Partial<OperatingHoursCreate>;

export interface ClosurePeriod {
  id: string;
  tenant: string;
  location: string | null;
  start_date: string; // "YYYY-MM-DD"
  end_date: string; // "YYYY-MM-DD"
  reason: string;
  created_at: string;
}

export type ClosurePeriodCreate = Omit<
  ClosurePeriod,
  "id" | "tenant" | "created_at"
>;

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export interface VehicleImage {
  id: string;
  image: string;
  is_primary: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  description: string;
  price_per_day: string;
  is_available: boolean;
  images: VehicleImage[];
  created_at: string;
  updated_at: string;
}

export type VehicleCreate = Omit<
  Vehicle,
  "id" | "images" | "created_at" | "updated_at"
>;

// ─── Bookings ─────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "paid" | "cancelled" | "refunded";
export type PaymentType = "online" | "offline";

export interface Booking extends InvoiceFields {
  id: string;
  user: string;
  user_first_name: string;
  user_last_name: string;
  user_email?: string;
  spot: string;
  spot_type: SpotType;
  location_id: string;
  location_name?: string;
  vehicle: string | null;
  start_time: string;
  end_time: string;
  price: string;
  status: BookingStatus;
  payment_type: PaymentType;
  is_manual: boolean;
  notes: string;
  cancellation_token: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paypal_order_id: string | null;
  created_at: string;
}

// ─── Invoice fields (shared between Booking and BookingCreate) ────────────────

export interface InvoiceFields {
  invoice_requested: boolean;
  invoice_recipient_name?: string;
  invoice_tax_code?: string;
  invoice_vat_number?: string;
  invoice_address_street?: string;
  invoice_address_postal_code?: string;
  invoice_address_city?: string;
  invoice_address_province?: string;
  invoice_is_pa?: boolean;
  invoice_sdi_code?: string;
  invoice_pec?: string;
  invoice_cig?: string;
  invoice_cup?: string;
  // Read-only result fields
  fic_document_id?: number | null;
  fic_document_url?: string;
  fic_ei_status?: string;
}

export interface BookingCreate extends Partial<InvoiceFields> {
  spot: string;
  vehicle?: string | null;
  start_time: string;
  end_time: string;
  notes?: string;
  payment_type?: PaymentType;
}

export interface AdminBookingCreate {
  user: string;
  spot: string;
  vehicle?: string | null;
  start_time: string;
  end_time: string;
  notes?: string;
  payment_type?: PaymentType;
}

export interface AdminBookingFilters {
  status?: BookingStatus;
  location_id?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export interface CalendarBooking {
  id: string;
  user_first_name: string;
  user_last_name: string;
  spot_identifier: string;
  spot_type: SpotType;
  location_name: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  price: string;
}

// ─── Customers ────────────────────────────────────────────────────────────────

export interface CustomerSummary {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  booking_count: number;
  total_spent: string;
  last_booking: string | null;
}

// ─── API Utilities ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  status: number;
  message: string;
  detail?: unknown;
}
