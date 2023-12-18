import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import "dotenv/config";
import sql from "./utils/db";
import authRouter from "./routers/authRouter";
import { Server } from "socket.io";
import cors from "cors";

import socketHandler from "./utils/socketHandler";
import verifyToken from "./utils/verifyToken";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000", credentials: true },
});

// Use Helmet!
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("short"));
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use("/auth", authRouter);
// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
// app.use((req, res, next) => {
//     console.log(req.cookies)
//     next()
// })

// app.get("/", async (req, res) => {
//     // const users = await sql`select * from users`;
//     // console.log(users);
//     console.log(req.headers.cookie)
//     res.status(200).send("hi");
// });

io.use(verifyToken);

io.on("connection", (socket) => {
    socketHandler(io, socket);
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`app running on http://127.0.0.1:${PORT}`);
});
