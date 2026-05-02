import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { OpportunityCard } from "../components/OpportunityCard";
export function OpportunitiesPage() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const query = useMemo(() => {
        const params = new URLSearchParams();
        if (search)
            params.set("search", search);
        if (educationLevel)
            params.set("educationLevel", educationLevel);
        return `?${params.toString()}`;
    }, [search, educationLevel]);
    useEffect(() => {
        setLoading(true);
        setError("");
        api
            .listOpportunities(query)
            .then((response) => setItems(response.items))
            .catch((err) => setError(String(err)))
            .finally(() => setLoading(false));
    }, [query]);
    const save = async (id) => {
        await api.save(id);
    };
    return (_jsxs("section", { className: "two-col", children: [_jsxs("aside", { className: "filters card", children: [_jsx("h3", { style: { marginTop: 0 }, children: "Filters" }), _jsx("input", { className: "field", placeholder: "Search scholarships...", value: search, onChange: (event) => setSearch(event.target.value) }), _jsxs("select", { className: "field", value: educationLevel, onChange: (event) => setEducationLevel(event.target.value), children: [_jsx("option", { value: "", children: "All education levels" }), _jsx("option", { value: "undergraduate", children: "Undergraduate" }), _jsx("option", { value: "graduate", children: "Graduate" }), _jsx("option", { value: "phd", children: "PhD" })] })] }), _jsxs("div", { className: "grid cards", children: [loading ? _jsx("p", { children: "Loading opportunities..." }) : null, error ? _jsxs("p", { children: ["Failed to load: ", error] }) : null, !loading && items.length === 0 ? _jsx("p", { children: "No results found." }) : null, items.map((item) => (_jsx(OpportunityCard, { item: item, onSave: save }, item.id)))] })] }));
}
