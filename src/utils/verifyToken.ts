import { SocketMiddleWare, SocketType } from "../types";
import jwt from "jsonwebtoken";

export default function (socket: SocketType, next: SocketMiddleWare) {
    const cookie = socket.request.headers.cookie?.split(";").filter(cookie=> cookie.trim().slice(0, 23)==="next-auth.session-token");
    // console.log(socket.handshake.headers.cookie);
    if(!cookie || cookie.length<1) next(new Error("No access token!"));

    const token = cookie?.pop()?.split("=")[1].trim();
    jwt.verify(token ? token : "", process.env.AUTH_SECRET!, (err, decoded) => {
        if (err) next(err);
        if(!decoded) next(new Error("Token is not Valid!"))
        socket.data.user = decoded;
    });
    
    next(); 
}
