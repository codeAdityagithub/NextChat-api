import { Response } from "express";
// import { onlineUsers } from "../../utils/socketHandler";
// import { IoType } from "../../types";
import sql from "../../utils/db";
import { IoType, RequestwUser, UserCardInfo } from "../../types";

export default async function (req: RequestwUser, res: Response) {
    const { invitation_id } = req.body;
    console.log(invitation_id);
    if (!invitation_id) return res.status(400).send("No invitationId provided");
    try {
        await sql`update invitation set status='rejected' where invitation_id=${invitation_id}`;

        // const inviteSender =
        //     await sql`select name, username from users where id=${sender_id}`;
        // const { username } = inviteSender[0];
        // if (onlineUsers.has(username)) {
        //     const io: IoType = req.app.get("io");
        //     console.log("user is online sending reject");
        //     io.to(username).emit("invite_reject", { invitation_id });
        // }

        return res.status(200).send("rejected");
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send("Couldn't accept invite!");
    }
}
