<script setup lang="ts">
defineProps<{
  label: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <section class="sub-hero">
    <div class="container">
      <div class="sec-label" data-reveal>{{ label }}</div>
      <h1 data-reveal v-html="title" />
      <p data-reveal="delay-1">{{ description }}</p>
    </div>
  </section>
</template>
