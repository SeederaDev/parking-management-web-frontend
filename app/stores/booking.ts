import { defineStore } from "pinia";

export interface Booking {
  id: string;
  tenant: string;
  user: string;
  user_email: string;
  spot: string;
  spot_identifier: string;
  location_name: string;
  vehicle: string | null;
  start_time: string;
  end_time: string;
  price: string;
  status: "pending" | "paid" | "cancelled";
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingCreate {
  spot: string;
  vehicle?: string | null;
  start_time: string;
  end_time: string;
}

export const useBookingStore = defineStore("booking", () => {
  const bookings = ref<Booking[]>([]);
  const currentBooking = ref<Booking | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function setBookings(data: Booking[]) {
    bookings.value = data;
  }

  function setCurrentBooking(data: Booking | null) {
    currentBooking.value = data;
  }

  function upsertBooking(data: Booking) {
    const idx = bookings.value.findIndex((b) => b.id === data.id);
    if (idx >= 0) {
      bookings.value[idx] = data;
    } else {
      bookings.value.unshift(data);
    }
  }

  return {
    bookings,
    currentBooking,
    loading,
    error,
    setBookings,
    setCurrentBooking,
    upsertBooking,
  };
});
