<script setup lang="ts">
defineProps<{
  icon: string;
  iconClass: string;
  title: string;
  text: string;
  to?: string;
  delay?: string;
}>();
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="svc-card" :data-reveal="delay || ''">
    <div class="svc-card-icon" :class="iconClass">
      <svg><use :href="`#${icon}`" /></svg>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ text }}</p>
    <div class="svc-card-arrow">
      Scopri di piu <svg width="14" height="14"><use href="#ic-arrow" /></svg>
    </div>
  </NuxtLink>
  <div v-else class="svc-card static-card" :data-reveal="delay || ''">
    <div class="svc-card-icon" :class="iconClass">
      <svg><use :href="`#${icon}`" /></svg>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ text }}</p>
  </div>
</template>
