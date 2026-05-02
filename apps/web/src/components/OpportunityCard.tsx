import type { Opportunity } from "@scholar-career/shared";
import { Link } from "react-router-dom";

interface Props {
  item: Opportunity;
  onSave?: (id: string) => void;
}

export function OpportunityCard({ item, onSave }: Props) {
  return (
    <article className="card">
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
        {item.tags.map((tag) => (
          <span key={tag} className="badge">
            {tag}
          </span>
        ))}
      </div>
      <h3 style={{ margin: "0.2rem 0" }}>{item.title}</h3>
      <p style={{ marginTop: 0 }}>{item.provider}</p>
      <p>{item.summary}</p>
      <p>
        <strong>{item.amountLabel}</strong>
      </p>
      <p>Deadline: {item.deadlineISO}</p>
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <Link className="secondary-btn" to={`/opportunities/${item.id}`}>
          View Details
        </Link>
        {onSave ? (
          <button className="primary-btn" onClick={() => onSave(item.id)}>
            Save
          </button>
        ) : null}
      </div>
    </article>
  );
}
