<template>
  <div class="bg-white rounded-2xl shadow-md p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Crea account</h2>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Nome</label
          >
          <input
            v-model="form.first_name"
            type="text"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Cognome</label
          >
          <input
            v-model="form.last_name"
            type="text"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="tu@esempio.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Password</label
        >
        <input
          v-model="form.password"
          type="password"
          required
          minlength="8"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Min. 8 caratteri"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Slug operatore</label
        >
        <input
          v-model="form.tenant_slug"
          type="text"
          required
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="es. acme-parking"
        />
        <p class="text-xs text-gray-400 mt-1">
          Lo slug del tuo operatore di parcheggio.
        </p>
      </div>

      <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {{ loading ? "Creazione account…" : "Crea account" }}
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-500">
      Hai già un account?
      <NuxtLink to="/login" class="text-indigo-600 font-medium hover:underline"
        >Accedi</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });

const { register, loading, error } = useAuth();

const form = reactive({
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  tenant_slug: "",
});

async function handleRegister() {
  await register({ ...form });
}
</script>
