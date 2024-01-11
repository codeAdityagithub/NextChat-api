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
    const cur_user = JSON.parse(req.user.name);

    const username = req.query["username"] as string;
    // console.log(cur_user.username);
    if (cur_user.username === username)
        return res.status(400).send("Cannot send request to self!");
    // console.log(email);

    try {
        const user: User[] =
            await sql`select * from users where username=${username}`;
        // console.log(user)
        if (user.length == 0)
            return res.status(401).send("No such user exists");

        const rev_inv = await sql`select invitation_id from invitation 
            where sender_id=${user[0].id!} and recipient_id=${
            req.user.sub
        } and status in ('pending', 'accepted')`;

        if (rev_inv.length != 0)
            return res
                .status(400)
                .send("Invitation or Conversation already exists");
        const invitation =
            await sql`insert into invitation (sender_id, recipient_id) values (${
                req.user.sub
            }, ${user[0].id!}) returning *`;
        console.log(invitation);

        if (invitation.length == 0)
            throw new Error("Couldn't send invite. Try again later!");
        if (onlineUsers.has(username)) {
            const data: InviteNotification = {
                invitation_id: invitation[0].invitation_id,
                name: cur_user.name,
                username: cur_user.username,
                sent_at: invitation[0].sent_at,
            };
            // console.log("user is online, sending invite");
            const io: IoType = req.app.get("io");
            // const userId = onlineUsers.get(username) as string;
            io.to(username).emit("invite_request", data);
        }
        res.status(200).send("Invite sent sucessfully");
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send("Couldn't send the invite!");
    }
}
