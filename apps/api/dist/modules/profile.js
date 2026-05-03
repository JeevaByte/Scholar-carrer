export const registerProfileRoutes = (router) => {
    router.get("/profile", (_req, res) => {
        res.json({
            id: "user-demo-1",
            fullName: "Alex Johnson",
            email: "alex@example.com",
            profileCompletion: 85
        });
    });
};
