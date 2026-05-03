export type OpportunityTag = "full-ride" | "stem" | "leadership" | "research" | "need-based";
export interface Opportunity {
    id: string;
    title: string;
    provider: string;
    summary: string;
    amountLabel: string;
    amountValue: number;
    educationLevel: "undergraduate" | "graduate" | "phd";
    location: "global" | "uk" | "europe" | "north-america";
    deadlineISO: string;
    tags: OpportunityTag[];
    isSaved?: boolean;
}
export interface DashboardStats {
    inProgress: number;
    submitted: number;
    awarded: number;
    profileCompletion: number;
}
export interface ActivityItem {
    id: string;
    title: string;
    status: "awarded" | "in-progress" | "submitted";
    dateLabel: string;
}
export interface DashboardPayload {
    stats: DashboardStats;
    activity: ActivityItem[];
    recommended: Opportunity[];
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
//# sourceMappingURL=types.d.ts.map