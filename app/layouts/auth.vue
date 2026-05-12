<template>
  <div class="min-h-screen flex">
    <!-- Brand panel -->
    <div
      class="hidden lg:flex lg:w-5/12 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden"
    >
      <!-- Subtle dot grid -->
      <div
        class="absolute inset-0 opacity-[0.035]"
        style="
          background-image: radial-gradient(circle, #fff 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />

      <!-- Logo -->
      <div class="relative flex items-center gap-2.5">
        <div
          class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
        </div>
        <span class="text-white font-semibold text-sm tracking-tight"
          >ParkManager</span
        >
      </div>

      <!-- Center content -->
      <div class="relative">
        <h2 class="text-[2rem] font-bold text-white leading-tight mb-4">
          Gestisci il tuo<br />parcheggio<br />in modo semplice.
        </h2>
        <p class="text-slate-400 text-sm leading-relaxed max-w-xs">
          Prenotazioni, pagamenti e reportistica in un'unica piattaforma
          multi-tenant.
        </p>
        <ul class="mt-10 space-y-3.5">
          <li v-for="f in features" :key="f" class="flex items-center gap-3">
            <div
              class="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <span class="text-slate-300 text-sm">{{ f }}</span>
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <p class="relative text-slate-600 text-xs">
        © {{ new Date().getFullYear() }} ParkManager
      </p>
    </div>

    <!-- Form panel -->
    <div
      class="flex-1 flex items-center justify-center bg-white px-8 py-12 lg:px-16"
    >
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-2 mb-10">
          <div
            class="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
          <span class="font-semibold text-gray-900 text-sm tracking-tight"
            >ParkManager</span
          >
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  "Prenotazioni online e offline",
  "Pagamenti Stripe e PayPal",
  "Dashboard amministrativa completa",
  "Gestione multi-parcheggio",
];
</script>
