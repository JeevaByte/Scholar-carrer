import { useEffect, useState } from "react";
import type { Opportunity } from "@scholar-career/shared";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

export function OpportunityDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Opportunity | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!id) return;
    api.getOpportunity(id).then(setItem);
  }, [id]);

  const apply = async () => {
    if (!id) return;
    await api.apply(id);
    setStatus("Application submitted");
  };

  if (!item) return <p>Loading details...</p>;

  return (
    <section className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
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
        <button className="primary-btn" onClick={apply}>
          Apply Now
        </button>
        {status ? <p>{status}</p> : null}
      </aside>
    </section>
  );
}
