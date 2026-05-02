import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "app-root", children: [_jsx("header", { className: "topbar", children: _jsxs("div", { className: "container topbar-inner", children: [_jsx("strong", { children: "Scholar Career" }), _jsx("nav", { className: "topnav", children: links.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => (isActive ? "nav-link active" : "nav-link"), children: link.label }, link.to))) }), _jsx("button", { className: "primary-btn", children: "Get Started" })] }) }), _jsx("main", { className: "container page-area", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/opportunities", element: _jsx(OpportunitiesPage, {}) }), _jsx(Route, { path: "/opportunities/:id", element: _jsx(OpportunityDetailPage, {}) }), _jsx(Route, { path: "/saved", element: _jsx(SavedPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) })] }) }), _jsx("footer", { className: "footer", children: _jsxs("div", { className: "container footer-inner", children: [_jsx("span", { children: "Scholar Career" }), _jsx("span", { children: "Built for high-stakes milestones." })] }) })] }));
}
