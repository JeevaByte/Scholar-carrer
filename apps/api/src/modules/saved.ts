import { saveOpportunitySchema } from "@scholar-career/shared";
import type { Router } from "express";

export const registerSavedRoutes = (router: Router) => {
  router.get("/saved", async (req, res, next) => {
    try {
      const items = await req.repo.listSavedOpportunities(req.userId);
      res.json({ items });
    } catch (error) {
      next(error);
    }
  });

  router.post("/saved", async (req, res, next) => {
    try {
      const payload = saveOpportunitySchema.parse(req.body);
      await req.repo.saveOpportunity(req.userId, payload.opportunityId);
      res.status(201).json({ message: "Saved" });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/saved/:id", async (req, res, next) => {
    try {
      await req.repo.unsaveOpportunity(req.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
};
