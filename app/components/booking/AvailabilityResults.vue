<template>
  <div v-if="searched">

    <p v-if="searchError" style="color:var(--red);font-size:14px;margin-top:24px">
      {{ searchError }}
    </p>

    <p
      v-else-if="groupedSpots.length === 0"
      style="color:var(--gray-400);font-size:15px;margin-top:24px"
    >
      Nessun posto disponibile per il periodo selezionato.
    </p>

    <template v-else>
      <div
        v-for="group in groupedSpots"
        :key="group.type"
        class="availability-row"
        :class="{ selected: selectedType === group.type }"
        @click="$emit('select', group)"
      >
        <!-- Radio -->
        <div
          class="availability-radio"
          :style="selectedType === group.type
            ? 'border-color:var(--navy)'
            : 'border-color:var(--gray-200)'"
        >
          <div v-if="selectedType === group.type" class="availability-radio-dot" />
        </div>

        <!-- Label + count -->
        <div class="availability-label">
          <p class="availability-type">{{ group.label }}</p>
          <p class="availability-count">
            {{ group.count }} posto{{ group.count !== 1 ? "i" : "" }} disponibile{{ group.count !== 1 ? "i" : "" }}
          </p>
        </div>

        <!-- Car icon -->
        <svg
          width="56" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"
          class="availability-icon"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
          <path d="M14 17H10"/>
        </svg>

        <!-- Price -->
        <div class="availability-price">
          € {{ group.price }} <span>›</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ParkingSpot } from "~/types";

defineProps<{
  searched:      boolean;
  searchError:   string | null;
  selectedType:  string;
  groupedSpots:  Array<{
    type:  string;
    label: string;
    count: number;
    price: string;
    spots: ParkingSpot[];
  }>;
}>();

defineEmits<{
  select: [group: { type: string; spots: ParkingSpot[] }];
}>();
</script>

<style scoped>
.availability-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--gray-100);
  cursor: pointer;
  transition: background 0.15s;
}
.availability-row:hover {
  background: rgba(27, 42, 107, 0.02);
  margin: 0 -12px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 10px;
}
.availability-row.selected {
  background: rgba(27, 42, 107, 0.03);
}
.availability-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s;
}
.availability-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--navy);
}
.availability-label {
  flex: 1;
  min-width: 0;
}
.availability-type {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gray-800);
}
.availability-count {
  font-size: 12px;
  color: var(--gray-400);
  margin-top: 2px;
}
.availability-icon {
  flex-shrink: 0;
  color: var(--gray-400);
}
.availability-price {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #4caf50;
  color: white;
  font-weight: 700;
  font-size: 14px;
  padding: 8px 18px;
  border-radius: 8px;
  flex-shrink: 0;
}
.availability-price span {
  opacity: 0.7;
}
</style>
