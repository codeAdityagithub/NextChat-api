import { SocketMiddleWare, SocketType } from "../types";
import jwt from "jsonwebtoken";
export default function (socket: SocketType, next: SocketMiddleWare) {
    const cookie = socket.request.headers.cookie?.split(";");
    const token = cookie?.pop()?.split("=")[1].trim();
    console.log(token);
    jwt.verify(token ? token : "", process.env.AUTH_SECRET!, (err, decoded) => {
        if (err) next(err);

        console.log("data", decoded);
    });
    next();
}
