import { useEffect, useMemo, useState } from "react";
import type { Opportunity } from "@scholar-career/shared";
import { api } from "../lib/api";
import { OpportunityCard } from "../components/OpportunityCard";

export function OpportunitiesPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (educationLevel) params.set("educationLevel", educationLevel);
    return `?${params.toString()}`;
  }, [search, educationLevel]);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .listOpportunities(query)
      .then((response) => setItems(response.items))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [query]);

  const save = async (id: string) => {
    await api.save(id);
  };

  return (
    <section className="two-col">
      <aside className="filters card">
        <h3 style={{ marginTop: 0 }}>Filters</h3>
        <input
          className="field"
          placeholder="Search scholarships..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="field"
          value={educationLevel}
          onChange={(event) => setEducationLevel(event.target.value)}
        >
          <option value="">All education levels</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
          <option value="phd">PhD</option>
        </select>
      </aside>

      <div className="grid cards">
        {loading ? <p>Loading opportunities...</p> : null}
        {error ? <p>Failed to load: {error}</p> : null}
        {!loading && items.length === 0 ? <p>No results found.</p> : null}
        {items.map((item) => (
          <OpportunityCard key={item.id} item={item} onSave={save} />
        ))}
      </div>
    </section>
  );
}
