import type { Booking, BookingCreate, PaginatedResponse } from "~/types";

export const useBookings = () => {
  const api = useApi();
  const store = useBookingStore();

  const loading = ref(false);
  const error = ref<string | null>(null);
  const checkoutUrl = ref<string | null>(null);

  async function fetchBookings() {
    loading.value = true;
    error.value = null;
    try {
      const data = await api<PaginatedResponse<Booking>>("/bookings/");
      store.setBookings(data.results);
    } catch {
      error.value = "Failed to load bookings.";
    } finally {
      loading.value = false;
    }
  }

  async function createBooking(
    payload: BookingCreate,
  ): Promise<Booking | null> {
    loading.value = true;
    error.value = null;
    try {
      const booking = await api<Booking>("/bookings/", {
        method: "POST",
        body: payload,
      });
      store.upsertBooking(booking);
      store.setCurrentBooking(booking);
      return booking;
    } catch (err: unknown) {
      error.value = extractError(err, "Failed to create booking.");
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function initiateCheckout(bookingId: string): Promise<string | null> {
    loading.value = true;
    error.value = null;
    checkoutUrl.value = null;
    try {
      const data = await api<{ checkout_url: string }>(
        `/payments/checkout/${bookingId}/`,
        { method: "POST" },
      );
      checkoutUrl.value = data.checkout_url;
      return data.checkout_url;
    } catch {
      error.value = "Failed to initiate payment.";
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function initiatePayPalPayment(
    bookingId: string,
  ): Promise<string | null> {
    loading.value = true;
    error.value = null;
    try {
      const data = await api<{ order_id: string; approve_url: string }>(
        `/payments/paypal/create-order/${bookingId}/`,
        { method: "POST" },
      );
      return data.approve_url;
    } catch {
      error.value = "Failed to initiate PayPal payment.";
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function capturePayPalPayment(
    bookingId: string,
    orderId: string,
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await api(`/payments/paypal/capture/${bookingId}/`, {
        method: "POST",
        body: { order_id: orderId },
      });
      return true;
    } catch {
      error.value = "Failed to capture PayPal payment.";
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function cancelBooking(bookingId: string): Promise<Booking | null> {
    loading.value = true;
    error.value = null;
    try {
      const booking = await api<Booking>(`/bookings/${bookingId}/cancel/`, {
        method: "POST",
      });
      store.upsertBooking(booking);
      return booking;
    } catch {
      error.value = "Failed to cancel booking.";
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    checkoutUrl,
    fetchBookings,
    createBooking,
    initiateCheckout,
    initiatePayPalPayment,
    capturePayPalPayment,
    cancelBooking,
  };
};

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data: Record<string, unknown> }).data;
    if (typeof data.error === "string") return data.error;
    const first = Object.values(data)[0];
    if (Array.isArray(first)) return first[0] as string;
    if (typeof first === "string") return first;
  }
  return fallback;
}
