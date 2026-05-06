import { applyOpportunitySchema } from "@scholar-career/shared";
import type { Router } from "express";

export const registerApplicationRoutes = (router: Router) => {
  router.post("/applications", async (req, res, next) => {
    try {
      const payload = applyOpportunitySchema.parse(req.body);
      await req.repo.applyToOpportunity(req.userId, payload.opportunityId, payload.note);
      res.status(201).json({ message: "Application submitted" });
    } catch (error) {
      next(error);
    }
  });
};
