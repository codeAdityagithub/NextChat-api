import { Response } from "express";
import { onlineUsers } from "../../utils/socketHandler";
import { InvitationType, IoType, RequestwUser, UserType } from "../../types";
import sql from "../../utils/db";

export default async function (req: RequestwUser, res: Response) {
    if (!req.query["email"]) return res.status(401).send("No email provided");
    if (!req.user) return res.status(403).send("You are unauthorized");

    const email = req.query["email"] as string;
    if (req.user.email == email)
        return res.status(400).send("Cannot send request to self!");
    // console.log(email);

    try {
        const user: UserType[] =
            await sql`select * from users where user_email=${email}`;
        // console.log(user)
        if (user.length == 0)
            return res.status(401).send("No such user exists");

        const invitation =
            await sql`insert into invitation (sender_id, recipient_id) values (${req.user.sub}, ${user[0].user_id}) returning *`;
        console.log(invitation);

        if (invitation.length == 0)
            throw new Error("Couldn't send invite. Try again later!");
        const data: InvitationType = {
            invitation_id: invitation[0].invitation_id,
            user_name: req.user?.name,
            user_email: req.user?.email,
            sent_at: invitation[0].sent_at,
        };
        if (onlineUsers.has(email)) {
            console.log("user is online, sending invite");
            const io: IoType = req.app.get("io");
            io.to(email).emit("invite_request", data);
        }
        res.status(200).send("Invite sent sucessfully");
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send("Something went wrong!");
    }
}
