import { NavLink, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { OpportunitiesPage } from "./pages/OpportunitiesPage";
import { OpportunityDetailPage } from "./pages/OpportunityDetailPage";
import { SavedPage } from "./pages/SavedPage";
import { DashboardPage } from "./pages/DashboardPage";

const links = [
  { to: "/", label: "Home" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/saved", label: "Saved" },
  { to: "/dashboard", label: "Dashboard" }
];

export function App() {
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
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button className="primary-btn">Get Started</button>
        </div>
      </header>

      <main className="container page-area">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
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
