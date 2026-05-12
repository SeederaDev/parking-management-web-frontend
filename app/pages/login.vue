<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">
        Bentornato
      </h1>
      <p class="text-sm text-gray-500 mt-1.5">
        Inserisci le tue credenziali per accedere.
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleLogin">
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
          class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          placeholder="tu@esempio.com"
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
          autocomplete="current-password"
          class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          placeholder="••••••••"
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
        class="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors"
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
          Accesso in corso…
        </span>
        <span v-else>Accedi</span>
      </button>
    </form>

    <p class="mt-6 text-xs text-gray-400 text-center">
      Non hai un account?
      <NuxtLink
        to="/register"
        class="text-blue-600 font-medium hover:text-blue-700"
        >Registrati</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });

const { login, loading, error } = useAuth();

const form = reactive({
  email: "",
  password: "",
});

async function handleLogin() {
  await login({ email: form.email, password: form.password });
}
</script>
