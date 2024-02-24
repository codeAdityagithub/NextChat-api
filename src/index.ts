import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import "dotenv/config";
import sql from "./utils/db";
import authRouter from "./routers/authRouter";
import inviteRouter from "./routers/inviteRouter";
import uploadRouter from "./routers/uploadRouter";
import messageRouter from "./routers/messageRouter";
import { Server } from "socket.io";
import cors from "cors";

import socketHandler from "./utils/socketHandler";
import verifyToken from "./utils/verifyToken";
import cookieParser from "cookie-parser";
import verifyJWT from "./middleware/verifyJWT";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
});

// Use Helmet!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("short"));
app.use(cookieParser());

app.get("/cron", async (req, res) => {
    try {
        await fetch("https://ncsify.onrender.com/cron");
    } catch (error: any) {
        console.log(error?.message);
    }

    return res.status(200).send("Cronjob executed");
});

app.use(verifyJWT);
app.use("/static", express.static(path.join(__dirname, "../public")));

app.use("/auth", authRouter);
app.use("/invite", inviteRouter);
app.use("/upload", uploadRouter);
app.use("/message", messageRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // console.error(err.stack);
    console.log("err", req.url);
    res.status(500).send(err.message ?? "Something Went Wrong");
});
io.use(verifyToken);

io.on("connection", (socket) => {
    socketHandler(io, socket);
});

app.set("io", io);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`app running on http://127.0.0.1:${PORT}`);
});
