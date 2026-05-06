export interface OpportunityQueryState {
  search?: string;
  educationLevel?: string;
  location?: string;
  minAmount?: string | number;
  maxAmount?: string | number;
  sort?: string;
  page?: string | number;
  pageSize?: string | number;
}

export const buildOpportunityQuery = (
  filters: OpportunityQueryState,
): string => {
  const params = new URLSearchParams();

  const entries: Array<[string, string | number | undefined]> = [
    ["search", filters.search?.trim()],
    ["educationLevel", filters.educationLevel?.trim()],
    ["location", filters.location?.trim()],
    ["minAmount", filters.minAmount],
    ["maxAmount", filters.maxAmount],
    ["sort", filters.sort?.trim()],
    ["page", filters.page],
    ["pageSize", filters.pageSize],
  ];

  entries.forEach(([key, value]) => {
    if (value === undefined) return;
    if (typeof value === "string" && value.trim() === "") return;
    params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};
