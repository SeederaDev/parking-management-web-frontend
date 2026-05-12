import { defineStore } from "pinia";
import type { Booking, BookingCreate } from "~/types";

export type { Booking, BookingCreate };

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
