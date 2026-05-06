import { useEffect, useMemo, useState } from "react";
import type { Profile } from "@scholar-career/shared";
import { NavLink, Route, Routes } from "react-router-dom";
import { api } from "./lib/api";
import { LandingPage } from "./pages/LandingPage";
import { OpportunitiesPage } from "./pages/OpportunitiesPage";
import { OpportunityDetailPage } from "./pages/OpportunityDetailPage";
import { SavedPage } from "./pages/SavedPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TodosPage } from "./pages/TodosPage";

export function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState("");
  const showTodos = import.meta.env.VITE_ENABLE_SUPABASE_TODOS === "true";

  useEffect(() => {
    api
      .profile()
      .then(setProfile)
      .catch((err) => setProfileError(String(err)));
  }, []);

  const links = useMemo(
    () =>
      [
        { to: "/", label: "Home" },
        { to: "/opportunities", label: "Opportunities" },
        { to: "/saved", label: "Saved" },
        { to: "/dashboard", label: "Dashboard" },
        showTodos ? { to: "/todos", label: "Todos" } : null,
      ].filter(Boolean) as Array<{ to: string; label: string }>,
    [showTodos],
  );

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="container topbar-inner">
          <strong>Scholar Career</strong>
          <nav className="topnav">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div style={{ display: "grid", justifyItems: "end", gap: "0.2rem" }}>
            <button className="primary-btn">Get Started</button>
            <small>
              {profile
                ? `Signed in as ${profile.fullName}`
                : profileError
                  ? "Profile unavailable"
                  : "Loading profile..."}
            </small>
          </div>
        </div>
      </header>

      <main className="container page-area">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route
            path="/opportunities/:id"
            element={<OpportunityDetailPage />}
          />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/todos" element={<TodosPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>Scholar Career</span>
          <span>Built for high-stakes milestones.</span>
        </div>
      </footer>
    </div>
  );
}
