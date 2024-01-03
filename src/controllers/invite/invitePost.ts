import { Request, Response } from "express";
import { onlineUsers } from "../../utils/socketHandler";
import { IoType } from "../../types";

export default function (req: Request, res: Response) {
    const userId: string = req.body.userId;
    if (onlineUsers.has(userId) && onlineUsers) {
        console.log("user is online, sending invite");
        const io: IoType = req.app.get("io");
        
    } else {
        console.log("user not online");
    }
    // console.log(req.body, "body");
    console.log(req.cookies, "cookies");
    res.send("hi");
}
