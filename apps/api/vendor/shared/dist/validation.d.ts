import { z } from "zod";
export declare const opportunityFilterSchema: z.ZodObject<{
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    educationLevel: z.ZodOptional<z.ZodEnum<["undergraduate", "graduate", "phd"]>>;
    location: z.ZodOptional<z.ZodEnum<["global", "uk", "europe", "north-america"]>>;
    minAmount: z.ZodOptional<z.ZodNumber>;
    maxAmount: z.ZodOptional<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodDefault<z.ZodEnum<["deadline", "amount", "relevance"]>>;
}, "strip", z.ZodTypeAny, {
    search: string;
    page: number;
    pageSize: number;
    sort: "deadline" | "amount" | "relevance";
    educationLevel?: "undergraduate" | "graduate" | "phd" | undefined;
    location?: "global" | "uk" | "europe" | "north-america" | undefined;
    minAmount?: number | undefined;
    maxAmount?: number | undefined;
}, {
    search?: string | undefined;
    educationLevel?: "undergraduate" | "graduate" | "phd" | undefined;
    location?: "global" | "uk" | "europe" | "north-america" | undefined;
    minAmount?: number | undefined;
    maxAmount?: number | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    sort?: "deadline" | "amount" | "relevance" | undefined;
}>;
export declare const saveOpportunitySchema: z.ZodObject<{
    opportunityId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    opportunityId: string;
}, {
    opportunityId: string;
}>;
export declare const applyOpportunitySchema: z.ZodObject<{
    opportunityId: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    opportunityId: string;
    note?: string | undefined;
}, {
    opportunityId: string;
    note?: string | undefined;
}>;
export type OpportunityFilterInput = z.infer<typeof opportunityFilterSchema>;
export type SaveOpportunityInput = z.infer<typeof saveOpportunitySchema>;
export type ApplyOpportunityInput = z.infer<typeof applyOpportunitySchema>;
//# sourceMappingURL=validation.d.ts.map