import type { Router } from "express";

const mockUserId = "user-demo-1";

export const registerDashboardRoutes = (router: Router) => {
  router.get("/dashboard", async (req, res, next) => {
    try {
      const payload = await req.repo.getDashboard(mockUserId);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });
};
