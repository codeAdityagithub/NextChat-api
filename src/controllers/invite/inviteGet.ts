import { Response } from "express";
import { onlineUsers } from "../../utils/socketHandler";
import { InviteNotification, IoType, RequestwUser } from "../../types";
import sql from "../../utils/db";
import { User } from "../../dbtypes";

// user for sendInvite
export default async function (req: RequestwUser, res: Response) {
    if (!req.query["username"])
        return res.status(401).send("No username provided");
    if (!req.user) return res.status(403).send("You are unauthorized");
    const names = JSON.parse(req.user.name);

    const username = req.query["username"] as string;
    console.log(names.username);
    if (names.username === username)
        return res.status(400).send("Cannot send request to self!");
    // console.log(email);

    try {
        const user: User[] =
            await sql`select * from users where username=${username}`;
        // console.log(user)
        if (user.length == 0)
            return res.status(401).send("No such user exists");

        const invitation =
            await sql`insert into invitation (sender_id, recipient_id) values (${
                req.user.sub
            }, ${user[0].id!}) returning *`;
        console.log(invitation);

        if (invitation.length == 0)
            throw new Error("Couldn't send invite. Try again later!");
        const data: InviteNotification = {
            invitation_id: invitation[0].invitation_id,
            name: names.name,
            username: names.username,
            sent_at: invitation[0].sent_at,
        };
        if (onlineUsers.has(username)) {
            console.log("user is online, sending invite");
            const io: IoType = req.app.get("io");
            // const userId = onlineUsers.get(username) as string;
            io.to(username).emit("invite_request", data);
        }
        res.status(200).send("Invite sent sucessfully");
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send("Something went wrong!");
    }
}
