import { useEffect, useState } from "react";
import type { Opportunity } from "@scholar-career/shared";
import { api } from "../lib/api";
import { OpportunityCard } from "../components/OpportunityCard";

export function SavedPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .listSaved()
      .then((response) => setItems(response.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <h2>Saved Opportunities</h2>
      {loading ? <p>Loading saved opportunities...</p> : null}
      {!loading && items.length === 0 ? <p>You have no saved opportunities yet.</p> : null}
      <div className="grid cards">
        {items.map((item) => (
          <OpportunityCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
