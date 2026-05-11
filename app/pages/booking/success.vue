<template>
  <div class="max-w-2xl mx-auto px-6 py-16 text-center">
    <div class="text-6xl mb-6">✅</div>
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Pagamento confermato!</h1>
    <p class="text-gray-400 mb-10">
      La tua prenotazione è stata pagata con successo.
    </p>
    <NuxtLink
      to="/booking"
      class="inline-block bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors uppercase tracking-widest text-sm"
    >
      Vedi le mie prenotazioni
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
</script>
