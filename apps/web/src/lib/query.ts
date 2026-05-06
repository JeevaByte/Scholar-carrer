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
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined) return;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return;
      params.set(key, trimmed);
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};
