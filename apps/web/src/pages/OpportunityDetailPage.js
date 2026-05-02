import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
export function OpportunityDetailPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [status, setStatus] = useState("");
    useEffect(() => {
        if (!id)
            return;
        api.getOpportunity(id).then(setItem);
    }, [id]);
    const apply = async () => {
        if (!id)
            return;
        await api.apply(id);
        setStatus("Application submitted");
    };
    if (!item)
        return _jsx("p", { children: "Loading details..." });
    return (_jsxs("section", { className: "grid", style: { gridTemplateColumns: "2fr 1fr", gap: "1rem" }, children: [_jsxs("article", { className: "card", children: [_jsx("h2", { children: item.title }), _jsx("p", { children: item.provider }), _jsx("p", { children: item.summary }), _jsx("h3", { children: "Eligibility Criteria" }), _jsxs("ul", { children: [_jsx("li", { children: "Strong academic profile" }), _jsx("li", { children: "Motivated career goals" }), _jsx("li", { children: "Meets scholarship-specific requirements" })] })] }), _jsxs("aside", { className: "card", children: [_jsx("p", { className: "badge", children: "Award" }), _jsx("h3", { children: item.amountLabel }), _jsxs("p", { children: ["Deadline: ", item.deadlineISO] }), _jsx("button", { className: "primary-btn", onClick: apply, children: "Apply Now" }), status ? _jsx("p", { children: status }) : null] })] }));
}
