import { Request, Response } from "express";
import { onlineUsers } from "../../utils/socketHandler";
import { IoType } from "../../types";
import sql from "../../utils/db";

export default async function (req: Request, res: Response) {
    const { invitation_id } = req.body;
    console.log(invitation_id);
    if (!invitation_id) return res.status(400).send("No invitationId provided");

    try {
        const invitations =
            await sql`update invitation set status='accepted' where invitation_id=${invitation_id}`;
        // console.log(invitations)
        return res.status(200).send("accepted");
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send("Couldn't accept invite!");
    }
}
