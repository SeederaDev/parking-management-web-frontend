<template>
  <div class="bg-white rounded-2xl shadow-md p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Accedi</h2>

    <form class="space-y-4" @submit.prevent="handleLogin">
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
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
        />
      </div>

      <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {{ loading ? "Accesso in corso…" : "Accedi" }}
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-500">
      Non hai un account?
      <NuxtLink
        to="/register"
        class="text-indigo-600 font-medium hover:underline"
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
