const router = require('express').Router();
const {PrismaClient} = require("@prisma/client");
const isAuthenticated = require("../../middleware/isAuthenticated");
const prisma = new PrismaClient();

// post
router.post("/post", isAuthenticated, async (req, res) => {
    const {content} = req.body;

    if (!content) {
        return res.status(400).json({message: "content is empty"});
    }
    try {
        const newPost = await prisma.post.create({
            data: {
                content,
                authorId: req.userId
            },
            include: {
                author: true,
            }
        });
        res.status(201).json(newPost)
    } catch (err) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

// post latest
router.get("/get_latest_post", async (req, res) => {
    try {
        const latestPost = await prisma.post.findMany({
            take: 3,
            orderBy: {createdAt: "desc"},
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        profile: true,
                    }
                }
            }
        });
        res.status(200).json(latestPost);
    } catch (err) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get("/:userId", async (req, res) => {
    const {userId} = req.params;
    try {
        const userPosts = await prisma.post.findMany({
            where: {
                authorId: parseInt(userId),
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profile: true,
                    }
                }
            }
        })
        return res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

module.exports = router;