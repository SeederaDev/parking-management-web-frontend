<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Nuova password</h1>
      <p class="text-sm text-gray-500 mt-1.5">Scegli una nuova password per il tuo account.</p>
    </div>

    <template v-if="!done">
      <div v-if="invalidLink" class="bg-red-50 border border-red-100 rounded-xl p-5 text-center mb-6">
        <p class="text-sm font-semibold text-red-700 mb-1">Link non valido o scaduto</p>
        <p class="text-xs text-red-600">Richiedi un nuovo link dalla pagina password dimenticata.</p>
      </div>

      <form v-else class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Nuova password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/10 focus:border-[#1B2A6B] transition-colors"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Conferma password</label>
          <input
            v-model="password2"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/10 focus:border-[#1B2A6B] transition-colors"
          />
        </div>

        <div v-if="mismatch" class="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          Le password non corrispondono.
        </div>

        <div v-if="error" class="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg p-3">
          <svg class="h-4 w-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p class="text-xs text-red-600">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#1B2A6B] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0E1840] disabled:opacity-50 transition-colors"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Salvataggio…
          </span>
          <span v-else>Salva nuova password</span>
        </button>
      </form>
    </template>

    <template v-else>
      <div class="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <div class="text-3xl mb-3">✅</div>
        <p class="text-sm font-semibold text-green-800 mb-1">Password aggiornata</p>
        <p class="text-xs text-green-700">Puoi ora accedere con la tua nuova password.</p>
      </div>
    </template>

    <p class="mt-6 text-xs text-gray-400 text-center">
      <NuxtLink to="/login" class="text-[#1B2A6B] font-medium hover:text-[#0E1840]">← Torna al login</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });
useHead({ title: "Nuova password — Palmieri & Treglia" });

const route = useRoute();
const { confirmPasswordReset, loading, error } = useAuth();

const uid      = computed(() => route.query.uid as string || "");
const token    = computed(() => route.query.token as string || "");
const invalidLink = computed(() => !uid.value || !token.value);

const password  = ref("");
const password2 = ref("");
const mismatch  = ref(false);
const done      = ref(false);

async function handleSubmit() {
  mismatch.value = false;
  if (password.value !== password2.value) {
    mismatch.value = true;
    return;
  }
  const ok = await confirmPasswordReset(uid.value, token.value, password.value);
  if (ok) done.value = true;
}
</script>
