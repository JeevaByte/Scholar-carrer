import { useEffect, useState } from "react";
import type { Opportunity } from "@scholar-career/shared";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

export function OpportunityDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Opportunity | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<"apply" | "save" | null>(
    null,
  );
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    api
      .getOpportunity(id)
      .then(setItem)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const apply = async () => {
    if (!id) return;
    setPendingAction("apply");
    try {
      await api.apply(id);
      setStatus("Application submitted.");
    } catch (err) {
      setStatus(`Failed to submit application: ${String(err)}`);
    } finally {
      setPendingAction(null);
    }
  };

  const save = async () => {
    if (!id) return;
    setPendingAction("save");
    try {
      await api.save(id);
      setItem((current) => (current ? { ...current, isSaved: true } : current));
      setStatus("Opportunity saved.");
    } catch (err) {
      setStatus(`Failed to save opportunity: ${String(err)}`);
    } finally {
      setPendingAction(null);
    }
  };

  if (loading) return <p>Loading details...</p>;
  if (error) return <p>Failed to load details: {error}</p>;
  if (!item) return <p>Opportunity not found.</p>;

  return (
    <section
      className="grid"
      style={{ gridTemplateColumns: "2fr 1fr", gap: "1rem" }}
    >
      <article className="card">
        <h2>{item.title}</h2>
        <p>{item.provider}</p>
        <p>{item.summary}</p>
        <h3>Eligibility Criteria</h3>
        <ul>
          <li>Strong academic profile</li>
          <li>Motivated career goals</li>
          <li>Meets scholarship-specific requirements</li>
        </ul>
      </article>
      <aside className="card">
        <p className="badge">Award</p>
        <h3>{item.amountLabel}</h3>
        <p>Deadline: {item.deadlineISO}</p>
        <button
          className="primary-btn"
          disabled={pendingAction !== null}
          onClick={apply}
        >
          {pendingAction === "apply" ? "Submitting..." : "Apply Now"}
        </button>
        <button
          className="secondary-btn"
          disabled={pendingAction !== null || item.isSaved}
          onClick={save}
          style={{ marginTop: "0.75rem" }}
        >
          {pendingAction === "save"
            ? "Saving..."
            : item.isSaved
              ? "Saved"
              : "Save for Later"}
        </button>
        {status ? <p>{status}</p> : null}
      </aside>
    </section>
  );
}
