import { SocketMiddleWare, SocketType } from "../types";
import parser from "cookie";
import jwt from "jsonwebtoken";

export default function (socket: SocketType, next: SocketMiddleWare) {
    if (!socket.request.headers.cookie)
        return next(new Error("No access token!"));

    const cookie = parser.parse(socket.request.headers.cookie);

    const token =
        cookie[
            process.env.NODE_ENV === "development"
                ? "next-auth.session-token"
                : "__Secure-next-auth.session-token"
        ];
    if (!token) return next(new Error("No access token!"));

    jwt.verify(token ? token : "", process.env.AUTH_SECRET!, (err, decoded) => {
        if (err) return next(err);
        if (!decoded) return next(new Error("Token is not Valid!"));
        socket.data.user = decoded;
    });

    next();
}
