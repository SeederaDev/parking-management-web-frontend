import { defineStore } from "pinia";

export const useBookingSearchStore = defineStore("bookingSearch", () => {
  const startDate   = ref("");
  const endDate     = ref("");
  const vehicleType = ref("standard");
  const locationId  = ref("");

  function save(data: { start_date: string; end_date: string; vehicle_type: string; location_id: string }) {
    startDate.value   = data.start_date;
    endDate.value     = data.end_date;
    vehicleType.value = data.vehicle_type;
    locationId.value  = data.location_id;
  }

  function clear() {
    startDate.value   = "";
    endDate.value     = "";
    vehicleType.value = "standard";
    locationId.value  = "";
  }

  return { startDate, endDate, vehicleType, locationId, save, clear };
});
