import { useEffect, useState } from "react";
import type { Opportunity } from "@scholar-career/shared";
import { api } from "../lib/api";
import { OpportunityCard } from "../components/OpportunityCard";

export function SavedPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError("");
    api
      .listSaved()
      .then((response) => setItems(response.items))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const unsave = async (id: string) => {
    setPendingId(id);
    setNotice("");
    try {
      await api.unsave(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setNotice("Opportunity removed from saved list.");
    } catch (err) {
      setError(String(err));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section>
      <h2>Saved Opportunities</h2>
      {notice ? <p>{notice}</p> : null}
      {loading ? <p>Loading saved opportunities...</p> : null}
      {!loading && error ? (
        <p>Failed to load saved opportunities: {error}</p>
      ) : null}
      {!loading && items.length === 0 ? (
        <p>You have no saved opportunities yet.</p>
      ) : null}
      <div className="grid cards">
        {items.map((item) => (
          <OpportunityCard
            key={item.id}
            item={item}
            actionLabel="Remove"
            actionPendingLabel="Removing..."
            actionDisabled={pendingId === item.id}
            onAction={unsave}
          />
        ))}
      </div>
    </section>
  );
}
