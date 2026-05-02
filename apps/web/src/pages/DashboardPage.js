import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { OpportunityCard } from "../components/OpportunityCard";
export function DashboardPage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        api.dashboard().then(setData);
    }, []);
    if (!data)
        return _jsx("p", { children: "Loading dashboard..." });
    return (_jsxs("section", { className: "grid", style: { gap: "1rem" }, children: [_jsx("h2", { children: "Welcome back, Alex." }), _jsxs("div", { className: "kpi-row", children: [_jsxs("article", { className: "card", children: [_jsx("p", { children: "In Progress" }), _jsx("h3", { children: data.stats.inProgress })] }), _jsxs("article", { className: "card", children: [_jsx("p", { children: "Submitted" }), _jsx("h3", { children: data.stats.submitted })] }), _jsxs("article", { className: "card", children: [_jsx("p", { children: "Awarded" }), _jsx("h3", { children: data.stats.awarded })] }), _jsxs("article", { className: "card", children: [_jsx("p", { children: "Profile Completion" }), _jsxs("h3", { children: [data.stats.profileCompletion, "%"] })] })] }), _jsxs("div", { className: "grid", style: { gridTemplateColumns: "2fr 1fr", gap: "1rem" }, children: [_jsxs("article", { className: "card", children: [_jsx("h3", { children: "Recent Activity" }), data.activity.map((item) => (_jsxs("div", { style: { borderTop: "1px solid var(--line)", paddingTop: "0.7rem", marginTop: "0.7rem" }, children: [_jsx("strong", { children: item.title }), _jsx("p", { children: item.dateLabel }), _jsx("span", { className: "badge", children: item.status })] }, item.id)))] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "Recommended for You" }), _jsx("div", { className: "grid", style: { gap: "0.7rem" }, children: data.recommended.map((item) => (_jsx(OpportunityCard, { item: item }, item.id))) })] })] })] }));
}
