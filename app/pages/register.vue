<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">
        Crea account
      </h1>
      <p class="text-sm text-gray-500 mt-1.5">
        Compila i campi per iniziare a usare ParkManager.
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label
            class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
            >Nome</label
          >
          <input
            v-model="form.first_name"
            type="text"
            required
            autocomplete="given-name"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/10 focus:border-[#1B2A6B] transition-colors"
          />
        </div>
        <div>
          <label
            class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
            >Cognome</label
          >
          <input
            v-model="form.last_name"
            type="text"
            required
            autocomplete="family-name"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/10 focus:border-[#1B2A6B] transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
          >Email</label
        >
        <input
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/10 focus:border-[#1B2A6B] transition-colors"
        />
      </div>

      <div>
        <label
          class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
          >Password</label
        >
        <input
          v-model="form.password"
          type="password"
          required
          minlength="8"
          autocomplete="new-password"
          class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/10 focus:border-[#1B2A6B] transition-colors"
        />
      </div>

      <div
        v-if="error"
        class="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-red-500 shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <p class="text-xs text-red-600">{{ error }}</p>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-[#1B2A6B] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0E1840] active:bg-[#0E1840] disabled:opacity-50 transition-colors"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg
            class="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Creazione account…
        </span>
        <span v-else>Crea account</span>
      </button>
    </form>

    <p class="mt-4 text-xs text-gray-400 text-center">
      Creando un account accetti la nostra
      <NuxtLink
        to="/privacy"
        class="text-[#1B2A6B] underline"
        >Privacy Policy</NuxtLink
      >.
    </p>

    <p class="mt-3 text-xs text-gray-400 text-center">
      Hai già un account?
      <NuxtLink
        to="/login"
        class="text-[#E3001B] font-medium hover:text-[#C5001A]"
        >Accedi</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });

const config = useRuntimeConfig();
const siteKey = config.public.recaptchaSiteKey as string;

if (siteKey) {
  useHead({
    script: [{ src: `https://www.google.com/recaptcha/api.js?render=${siteKey}`, defer: true }],
  });
}

const { register, loading, error } = useAuth();

const form = reactive({
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  tenant_slug: "palmieri-treglia",
});

async function handleRegister() {
  let recaptcha_token = "";
  if (siteKey && typeof window !== "undefined" && (window as any).grecaptcha) {
    try {
      recaptcha_token = await (window as any).grecaptcha.execute(siteKey, { action: "register" });
    } catch { /* skip if reCAPTCHA not ready */ }
  }
  await register({ ...form, recaptcha_token });
}
</script>
