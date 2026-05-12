import type { CustomerSummary, PaginatedResponse } from "~/types";

export const useAdminCustomers = () => {
  const api = useApi();

  const customers = ref<CustomerSummary[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCustomers(page = 1, search = "") {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      const data = await api<PaginatedResponse<CustomerSummary>>(
        `/admin/customers/?${params.toString()}`,
      );
      customers.value = data.results;
      total.value = data.count;
    } catch {
      error.value = "Impossibile caricare i clienti.";
    } finally {
      loading.value = false;
    }
  }

  return { customers, total, loading, error, fetchCustomers };
};
