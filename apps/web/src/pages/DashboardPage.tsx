import { useEffect, useState } from "react";
import type { DashboardPayload } from "@scholar-career/shared";
import { api } from "../lib/api";
import { OpportunityCard } from "../components/OpportunityCard";

export function DashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null);

  useEffect(() => {
    api.dashboard().then(setData);
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <h2>Welcome back, Alex.</h2>
      <div className="kpi-row">
        <article className="card">
          <p>In Progress</p>
          <h3>{data.stats.inProgress}</h3>
        </article>
        <article className="card">
          <p>Submitted</p>
          <h3>{data.stats.submitted}</h3>
        </article>
        <article className="card">
          <p>Awarded</p>
          <h3>{data.stats.awarded}</h3>
        </article>
        <article className="card">
          <p>Profile Completion</p>
          <h3>{data.stats.profileCompletion}%</h3>
        </article>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
        <article className="card">
          <h3>Recent Activity</h3>
          {data.activity.map((item) => (
            <div key={item.id} style={{ borderTop: "1px solid var(--line)", paddingTop: "0.7rem", marginTop: "0.7rem" }}>
              <strong>{item.title}</strong>
              <p>{item.dateLabel}</p>
              <span className="badge">{item.status}</span>
            </div>
          ))}
        </article>

        <article className="card">
          <h3>Recommended for You</h3>
          <div className="grid" style={{ gap: "0.7rem" }}>
            {data.recommended.map((item) => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
