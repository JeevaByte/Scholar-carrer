import { useEffect, useMemo, useState } from "react";
import type { Opportunity } from "@scholar-career/shared";
import { api } from "../lib/api";
import { buildOpportunityQuery } from "../lib/query";
import { OpportunityCard } from "../components/OpportunityCard";

const pageSize = 6;

export function OpportunitiesPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [location, setLocation] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    return buildOpportunityQuery({
      search,
      educationLevel,
      location,
      minAmount,
      maxAmount,
      sort,
      page,
      pageSize,
    });
  }, [educationLevel, location, maxAmount, minAmount, page, search, sort]);

  useEffect(() => {
    setLoading(true);
    setError("");
    setNotice("");
    api
      .listOpportunities(query)
      .then((response) => {
        setItems(response.items);
        setTotal(response.total);
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [educationLevel, location, maxAmount, minAmount, search, sort]);

  const save = async (id: string) => {
    setSavingId(id);
    setNotice("");
    try {
      await api.save(id);
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isSaved: true } : item,
        ),
      );
      setNotice("Opportunity saved.");
    } catch (err) {
      setNotice(`Failed to save opportunity: ${String(err)}`);
    } finally {
      setSavingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="two-col">
      <aside className="filters card">
        <h3 style={{ marginTop: 0 }}>Filters</h3>
        <input
          className="field"
          placeholder="Search scholarships..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
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
        <select
          className="field"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        >
          <option value="">All locations</option>
          <option value="global">Global</option>
          <option value="uk">UK</option>
          <option value="europe">Europe</option>
          <option value="north-america">North America</option>
        </select>
        <input
          className="field"
          type="number"
          min="0"
          placeholder="Minimum amount"
          value={minAmount}
          onChange={(event) => setMinAmount(event.target.value)}
        />
        <input
          className="field"
          type="number"
          min="0"
          placeholder="Maximum amount"
          value={maxAmount}
          onChange={(event) => setMaxAmount(event.target.value)}
        />
        <select
          className="field"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="relevance">Most relevant</option>
          <option value="deadline">Deadline</option>
          <option value="amount">Award amount</option>
        </select>
      </aside>

      <div className="grid cards">
        {notice ? <p>{notice}</p> : null}
        {!loading ? (
          <p>
            Showing page {page} of {totalPages} · {total} opportunities
          </p>
        ) : null}
        {loading ? <p>Loading opportunities...</p> : null}
        {error ? <p>Failed to load: {error}</p> : null}
        {!loading && items.length === 0 ? <p>No results found.</p> : null}
        {items.map((item) => (
          <OpportunityCard
            key={item.id}
            item={item}
            actionLabel={item.isSaved ? "Saved" : "Save"}
            actionPendingLabel="Saving..."
            actionDisabled={savingId === item.id || item.isSaved}
            onAction={save}
          />
        ))}
        {!loading && items.length > 0 ? (
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <button
              className="secondary-btn"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>
            <button
              className="secondary-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
