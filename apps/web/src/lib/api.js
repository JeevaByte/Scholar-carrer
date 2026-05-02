const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const json = async (path, init) => {
    const response = await fetch(`${base}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
};
export const api = {
    listOpportunities: (query = "") => json(`/api/v1/opportunities${query}`),
    getOpportunity: (id) => json(`/api/v1/opportunities/${id}`),
    listSaved: () => json("/api/v1/saved"),
    save: (opportunityId) => json("/api/v1/saved", {
        method: "POST",
        body: JSON.stringify({ opportunityId })
    }),
    unsave: (id) => fetch(`${base}/api/v1/saved/${id}`, {
        method: "DELETE"
    }),
    apply: (opportunityId) => json("/api/v1/applications", {
        method: "POST",
        body: JSON.stringify({ opportunityId })
    }),
    dashboard: () => json("/api/v1/dashboard")
};
