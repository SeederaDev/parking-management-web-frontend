<template>
  <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
    <!-- Search bar -->
    <div class="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
      <input
        v-model="search"
        type="search"
        class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
        @input="debouncedFetch"
      />
      <span class="text-sm text-gray-400 shrink-0">{{ total }} clienti</span>
    </div>

    <div v-if="loading" class="text-center py-16 text-sm text-gray-400">Caricamento…</div>
    <div v-else-if="!customers.length" class="text-center py-16 text-sm text-gray-400">Nessun cliente trovato.</div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-[11px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <th class="px-6 pb-3 pt-4 font-semibold">Nome</th>
            <th class="px-4 pb-3 pt-4 font-semibold">Email</th>
            <th class="px-4 pb-3 pt-4 font-semibold text-right">Prenotazioni</th>
            <th class="px-4 pb-3 pt-4 font-semibold text-right">Spesa totale</th>
            <th class="px-6 pb-3 pt-4 font-semibold">Ultima prenotazione</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="c in customers" :key="c.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-3.5 font-semibold text-navy-deep whitespace-nowrap">
              {{ c.first_name }} {{ c.last_name }}
            </td>
            <td class="px-4 py-3.5 text-gray-500">{{ c.email }}</td>
            <td class="px-4 py-3.5 text-right font-medium text-navy-deep">{{ c.booking_count }}</td>
            <td class="px-4 py-3.5 text-right font-semibold text-navy-deep">€{{ c.total_spent }}</td>
            <td class="px-6 py-3.5 text-gray-400">
              {{ c.last_booking ? formatDate(c.last_booking) : "—" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="total > pageSize" class="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-100">
      <button
        :disabled="page === 1"
        class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 text-gray-600 transition-colors"
        @click="changePage(page - 1)"
      >
        ← Precedente
      </button>
      <span class="text-sm text-gray-400">Pagina {{ page }}</span>
      <button
        :disabled="page * pageSize >= total"
        class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 text-gray-600 transition-colors"
        @click="changePage(page + 1)"
      >
        Successiva →
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
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

onMounted(() => fetchCustomers());
</script>
