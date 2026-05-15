<template>
  <div class="min-h-screen flex">
    <!-- Brand panel -->
    <div
      class="hidden lg:flex lg:w-5/12 bg-[#0E1840] flex-col justify-between p-12 relative overflow-hidden"
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
        <img
          src="/logo.avif"
          alt="Palmieri &amp; Treglia"
          class="h-10 w-auto"
        />
        <span class="text-white font-semibold text-sm tracking-tight"
          >Palmieri &amp; Treglia</span
        >
      </div>

      <!-- Center content -->
      <div class="relative">
        <h2 class="text-[2rem] font-bold text-white leading-tight mb-4">
          Il parcheggio<br />di fiducia<br />dal 1966.
        </h2>
        <ul class="mt-10 space-y-3.5">
          <li v-for="f in features" :key="f" class="flex items-center gap-3">
            <div
              class="w-5 h-5 rounded-full bg-[#E3001B]/20 flex items-center justify-center shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 text-[#E3001B]"
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
        © {{ new Date().getFullYear() }} Palmieri &amp; Treglia s.r.l.
      </p>
    </div>

    <!-- Form panel -->
    <div
      class="flex-1 flex items-center justify-center bg-white px-8 py-12 lg:px-16"
    >
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-2 mb-10">
          <img
            src="/logo.avif"
            alt="Palmieri &amp; Treglia"
            class="h-9 w-auto"
          />
          <span class="font-semibold text-gray-900 text-sm tracking-tight"
            >Palmieri &amp; Treglia</span
          >
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  "Soccorso stradale h24",
  "Noleggio auto a Formia",
  "Parcheggio Isole Pontine",
  "Pagamenti online sicuri",
];
</script>
