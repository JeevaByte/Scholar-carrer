import { z } from "zod";

export const opportunityFilterSchema = z.object({
  search: z.string().optional().default(""),
  educationLevel: z.enum(["undergraduate", "graduate", "phd"]).optional(),
  location: z.enum(["global", "uk", "europe", "north-america"]).optional(),
  minAmount: z.coerce.number().nonnegative().optional(),
  maxAmount: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(10),
  sort: z.enum(["deadline", "amount", "relevance"]).default("relevance"),
});

export const saveOpportunitySchema = z.object({
  opportunityId: z.string().min(1),
});

export const applyOpportunitySchema = z.object({
  opportunityId: z.string().min(1),
  note: z.string().max(500).optional(),
});

export type OpportunityFilterInput = z.infer<typeof opportunityFilterSchema>;
export type SaveOpportunityInput = z.infer<typeof saveOpportunitySchema>;
export type ApplyOpportunityInput = z.infer<typeof applyOpportunitySchema>;
