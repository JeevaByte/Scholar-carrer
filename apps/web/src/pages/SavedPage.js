import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { OpportunityCard } from "../components/OpportunityCard";
export function SavedPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const load = () => {
        setLoading(true);
        api
            .listSaved()
            .then((response) => setItems(response.items))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        load();
    }, []);
    return (_jsxs("section", { children: [_jsx("h2", { children: "Saved Opportunities" }), loading ? _jsx("p", { children: "Loading saved opportunities..." }) : null, !loading && items.length === 0 ? _jsx("p", { children: "You have no saved opportunities yet." }) : null, _jsx("div", { className: "grid cards", children: items.map((item) => (_jsx(OpportunityCard, { item: item }, item.id))) })] }));
}
