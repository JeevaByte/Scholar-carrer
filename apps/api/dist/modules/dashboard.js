const mockUserId = "00000000-0000-0000-0000-000000000001";
export const registerDashboardRoutes = (router) => {
    router.get("/dashboard", async (req, res, next) => {
        try {
            const payload = await req.repo.getDashboard(mockUserId);
            res.json(payload);
        }
        catch (error) {
            next(error);
        }
    });
};
