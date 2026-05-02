import { saveOpportunitySchema } from "@scholar-career/shared";
import type { Router } from "express";

const mockUserId = "user-demo-1";

export const registerSavedRoutes = (router: Router) => {
  router.get("/saved", async (_req, res, next) => {
    try {
      const items = await _req.repo.listSavedOpportunities(mockUserId);
      res.json({ items });
    } catch (error) {
      next(error);
    }
  });

  router.post("/saved", async (req, res, next) => {
    try {
      const payload = saveOpportunitySchema.parse(req.body);
      await req.repo.saveOpportunity(mockUserId, payload.opportunityId);
      res.status(201).json({ message: "Saved" });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/saved/:id", async (req, res, next) => {
    try {
      await req.repo.unsaveOpportunity(mockUserId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
};
