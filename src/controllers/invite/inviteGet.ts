import { Response } from "express";
import { onlineUsers } from "../../utils/socketHandler";
import { IoType, RequestwUser } from "../../types";
import sql from "../../utils/db";

export default async function (req: RequestwUser, res: Response) {
    if (!req.query["userId"]) return res.status(401).send("No userId provided");
    if (!req.user) return res.status(403).send("You are unauthorized");

    const userId = req.query["userId"] as string;
    if (req.user.sub == userId)
        return res.status(400).send("Cannot send request to self!");
    // console.log(userId);
    if (onlineUsers.has(userId) && onlineUsers) {
        console.log("user is online, sending invite");
        const io: IoType = req.app.get("io");
        io.to(userId).emit("invite_request", req.user?.name);
        res.status(200).send("Invite sent successfully");
    } else {
        console.log("user not online");
        try {
            const user = await sql`select * from users where user_id=${userId}`;
            // console.log(user)
            if (user.length == 0)
                return res.status(401).send("No such user exists");

            const invitation =
                await sql`insert into invitation (sender_id, recipient_id) values (${req.user.sub}, ${userId}) returning *`;
            console.log(invitation);
            if (invitation.length == 0)
                throw new Error("Couldn't send invite. Try again later!");

            res.status(200).send("Invite sent sucessfully");
        } catch (error: any) {
            console.log(error.message);
            return res.status(500).send("Something went wrong!");
        }
    }
}
