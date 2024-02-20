import { SocketMiddleWare, SocketType } from "../types";
import parser from "cookie";
import jwt from "jsonwebtoken";

export default function (socket: SocketType, next: SocketMiddleWare) {
    // if (!socket.request.headers.cookie)
    //     return next(new Error("No access token!"));

    // const cookie = parser.parse(socket.request.headers.cookie);

    // console.log(cookie);
    const token: string = socket.handshake.auth.apiAccessToken;
    if (!token) return next(new Error("No access token!"));

    jwt.verify(token, process.env.AUTH_SECRET!, (err, decoded) => {
        if (err) return next(err);
        if (!decoded) return next(new Error("Token is not Valid!"));
        console.log(decoded);
        socket.data.user = decoded;
    });

    next();
}
