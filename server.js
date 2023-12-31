const express = require('express');
const app = express();
const authRoute = require("./routers/auth/auth")
const postsRoute = require("./routers/posts/posts")
const usersRoute = require("./routers/users/users")
const cors = require("cors");

require("dotenv").config();

const PORT = 5050

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);

app.listen(PORT);

