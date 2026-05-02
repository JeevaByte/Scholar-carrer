import type { Router } from "express";

export const registerProfileRoutes = (router: Router) => {
  router.get("/profile", (_req, res) => {
    res.json({
      id: "user-demo-1",
      fullName: "Alex Johnson",
      email: "alex@example.com",
      profileCompletion: 85
    });
  });
};
