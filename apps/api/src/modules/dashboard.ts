import type { Router } from "express";

export const registerDashboardRoutes = (router: Router) => {
  router.get("/dashboard", async (req, res, next) => {
    try {
      const payload = await req.repo.getDashboard(req.userId);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });
};
