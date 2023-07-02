const router = require('express').Router();
const {PrismaClient} = require("@prisma/client");
const isAuthenticated = require("../../middleware/isAuthenticated");
const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            }
        });
        if (!user) return res.status(404).json({message: "User not found"});
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
})

module.exports = router;