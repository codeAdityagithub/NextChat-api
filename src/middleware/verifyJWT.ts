import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestwUser } from "../types";

export default async function (
    req: RequestwUser,
    res: Response,
    next: NextFunction
) {
    if (req.url.startsWith("/static")) return next();
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    // console.log(token, "token");
    if (!token) return next(new Error("You dont have access token!"));

    jwt.verify(token, process.env.AUTH_SECRET!, (err, decoded) => {
        if (err) return next(err);
        if (!decoded) return next(new Error("Token is not Valid!"));
        // @ts-expect-error
        req.user = decoded;
        console.log(decoded);
    });

    next();
}
