import type { Router } from "express";

export const registerProfileRoutes = (router: Router) => {
  router.get("/profile", async (req, res, next) => {
    try {
      const profile = await req.repo.getProfile(req.userId);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });
};
