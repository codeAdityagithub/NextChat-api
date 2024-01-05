import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { RequestwUser } from "../types"

export default async function (
    req: RequestwUser,
    res: Response,
    next: NextFunction
) {
    const token:string = req.cookies['next-auth.session-token'];
    if(!token) next(new Error("No access token!"));

    
    jwt.verify(token, process.env.AUTH_SECRET!, (err, decoded) => {
        if (err) next(err);
        if(!decoded) next(new Error("Token is not Valid!"))
        // @ts-expect-error
        req.user = decoded
    });

    next();
}
