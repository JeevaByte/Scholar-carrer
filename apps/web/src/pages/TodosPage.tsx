import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

type Todo = {
  id: string;
  name: string;
};

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const enabled = import.meta.env.VITE_ENABLE_SUPABASE_TODOS === "true";

  if (!enabled) {
    return (
      <section className="card" style={{ maxWidth: 640 }}>
        <h2>Supabase Todos</h2>
        <p>
          This demo page is disabled by default. Set
          `VITE_ENABLE_SUPABASE_TODOS=true` to enable it.
        </p>
      </section>
    );
  }

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("todos").select("id, name");
        if (error) throw error;
        setTodos((data ?? []) as Todo[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <section className="card" style={{ maxWidth: 640 }}>
      <h2>Supabase Todos</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p style={{ color: "#b91c1c" }}>Error: {error}</p>}
      {!loading && !error && todos.length === 0 && <p>No todos found.</p>}
      {!loading && !error && todos.length > 0 && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
