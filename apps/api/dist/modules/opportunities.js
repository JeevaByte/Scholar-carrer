import { opportunityFilterSchema } from "@scholar-career/shared";
export const registerOpportunityRoutes = (router) => {
    router.get("/opportunities", async (req, res, next) => {
        try {
            const filters = opportunityFilterSchema.parse(req.query);
            const data = await req.repo.listOpportunities(filters);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    });
    router.get("/opportunities/:id", async (req, res, next) => {
        try {
            const data = await req.repo.getOpportunityById(req.params.id);
            if (!data) {
                res.status(404).json({ message: "Opportunity not found" });
                return;
            }
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    });
};
