<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <!-- Search -->
    <div class="flex gap-3 mb-6">
      <input
        v-model="search"
        type="search"
        placeholder="Cerca per nome o email…"
        class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        @input="debouncedFetch"
      />
      <span class="text-sm text-gray-500 self-center">{{ total }} clienti</span>
    </div>

    <div v-if="loading" class="text-center py-16 text-gray-400">
      Caricamento…
    </div>
    <div v-else-if="!customers.length" class="text-center py-16 text-gray-400">
      Nessun cliente trovato.
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs text-gray-500 border-b border-gray-100">
            <th class="pb-3 font-medium">Nome</th>
            <th class="pb-3 font-medium">Email</th>
            <th class="pb-3 font-medium text-right">Prenotazioni</th>
            <th class="pb-3 font-medium text-right">Spesa totale</th>
            <th class="pb-3 font-medium">Ultima prenotazione</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="c in customers" :key="c.id" class="hover:bg-gray-50">
            <td class="py-3 font-medium text-gray-900">
              {{ c.first_name }} {{ c.last_name }}
            </td>
            <td class="py-3 text-gray-500">{{ c.email }}</td>
            <td class="py-3 text-right">{{ c.booking_count }}</td>
            <td class="py-3 text-right font-medium">€{{ c.total_spent }}</td>
            <td class="py-3 text-gray-500">
              {{ c.last_booking ? formatDate(c.last_booking) : "—" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center gap-3 mt-6" v-if="total > pageSize">
      <button
        :disabled="page === 1"
        class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
        @click="changePage(page - 1)"
      >
        ← Precedente
      </button>
      <span class="text-sm text-gray-500 self-center">{{ page }}</span>
      <button
        :disabled="page * pageSize >= total"
        class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
        @click="changePage(page + 1)"
      >
        Successivo →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const { customers, total, loading, fetchCustomers } = useAdminCustomers();

const search = ref("");
const page = ref(1);
const pageSize = 20;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function debouncedFetch() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    page.value = 1;
    fetchCustomers(1, search.value);
  }, 350);
}

function changePage(n: number) {
  page.value = n;
  fetchCustomers(n, search.value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

onMounted(() => fetchCustomers());
</script>
