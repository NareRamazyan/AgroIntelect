// history.js
const { Router } = require("express");
const { AppDataSource } = require("../data-source.js");
const { HistorySchema } = require("../entities/History.js");
const { authenticateToken } = require("../middleware/authMiddleware.js");

const router = Router();
const historyRepository = AppDataSource.getRepository(HistorySchema);

// Օգտատիրոջ պատմությունը ստանալու ռաուտ
router.get("/my-history", authenticateToken, async (req, res) => {
    try {
        // req.user-ը գալիս է authenticateToken middleware-ից
        const userId = req.user.userId; 

        const histories = await historyRepository.find({
            where: { user: { id: userId } },
            order: { created_at: "DESC" }
        });

        res.status(200).json(histories);
    } catch (error) {
        console.error("History error:", error);
        res.status(500).json({ error: "Could not fetch history" });
    }
});

module.exports = router;