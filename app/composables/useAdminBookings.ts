import type {
  Booking,
  AdminBookingCreate,
  AdminBookingFilters,
  CalendarBooking,
  PaginatedResponse,
} from "~/types";

export const useAdminBookings = () => {
  const api = useApi();

  const bookings = ref<Booking[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBookings(filters: AdminBookingFilters = {}) {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(
            ([, v]) => v !== undefined && v !== "",
          ),
        ),
      ).toString();
      const url = params ? `/admin/bookings/?${params}` : "/admin/bookings/";
      const data = await api<PaginatedResponse<Booking>>(url);
      bookings.value = data.results;
      total.value = data.count;
    } catch {
      error.value = "Impossibile caricare le prenotazioni.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchBooking(id: string): Promise<Booking | null> {
    try {
      return await api<Booking>(`/admin/bookings/${id}/`);
    } catch {
      return null;
    }
  }

  async function createManualBooking(
    payload: AdminBookingCreate,
  ): Promise<Booking | null> {
    loading.value = true;
    error.value = null;
    try {
      const booking = await api<Booking>("/admin/bookings/", {
        method: "POST",
        body: payload,
      });
      bookings.value.unshift(booking);
      total.value += 1;
      return booking;
    } catch (err: unknown) {
      error.value = extractApiError(err, "Impossibile creare la prenotazione.");
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function cancelBooking(
    id: string,
    refund = false,
  ): Promise<Booking | null> {
    loading.value = true;
    error.value = null;
    try {
      const booking = await api<Booking>(`/admin/bookings/${id}/cancel/`, {
        method: "POST",
        body: { refund },
      });
      const idx = bookings.value.findIndex((b) => b.id === id);
      if (idx >= 0) bookings.value[idx] = booking;
      return booking;
    } catch (err: unknown) {
      error.value = extractApiError(
        err,
        "Impossibile annullare la prenotazione.",
      );
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    bookings,
    total,
    loading,
    error,
    fetchBookings,
    fetchBooking,
    createManualBooking,
    cancelBooking,
  };
};

export const useAdminCalendar = () => {
  const api = useApi();

  const calendarBookings = ref<CalendarBooking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCalendar(
    dateFrom: string,
    dateTo: string,
    locationId?: string,
  ) {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams({
        date_from: dateFrom,
        date_to: dateTo,
      });
      if (locationId) params.set("location_id", locationId);
      const data = await api<CalendarBooking[]>(
        `/admin/bookings/calendar/?${params.toString()}`,
      );
      calendarBookings.value = data;
    } catch {
      error.value = "Impossibile caricare il calendario.";
    } finally {
      loading.value = false;
    }
  }

  return { calendarBookings, loading, error, fetchCalendar };
};

function extractApiError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data: Record<string, unknown> }).data;
    const first = Object.values(data)[0];
    if (Array.isArray(first)) return first[0] as string;
    if (typeof first === "string") return first;
  }
  return fallback;
}
