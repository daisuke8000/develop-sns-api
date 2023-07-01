const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const PORT = 5050

const prisma = new PrismaClient();

app.use(express.json());

// User SignUp
app.post("/api/auth/signup",async  (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user= await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });

    return res.json({user});
})

// User LogIn
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(!user) {
        return res.status(401).json({error: "Invalid email or password"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(401).json({error: "Invalid email or password"});
    }

    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
        expiresIn: "1d",
    });

    return res.json({token});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

