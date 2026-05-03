import { applyOpportunitySchema } from "@scholar-career/shared";
const mockUserId = "00000000-0000-0000-0000-000000000001";
export const registerApplicationRoutes = (router) => {
    router.post("/applications", async (req, res, next) => {
        try {
            const payload = applyOpportunitySchema.parse(req.body);
            await req.repo.applyToOpportunity(mockUserId, payload.opportunityId, payload.note);
            res.status(201).json({ message: "Application submitted" });
        }
        catch (error) {
            next(error);
        }
    });
};
