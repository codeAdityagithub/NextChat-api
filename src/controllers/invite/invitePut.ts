import { Request, Response } from "express";
// import { onlineUsers } from "../../utils/socketHandler";
// import { IoType } from "../../types";
import sql from "../../utils/db";

export default async function (req: Request, res: Response) {
    const { invitation_id } = req.body;
    console.log(invitation_id);
    if (!invitation_id) return res.status(400).send("No invitationId provided");

    try {
        const users =
            await sql`update invitation set status='accepted' where invitation_id=${invitation_id} returning sender_id, recipient_id`;
        const sender_id = users[0].sender_id;
        const recipient_id = users[0].recipient_id;

        const conversation =
            await sql`INSERT INTO conversation DEFAULT VALUES RETURNING conversation_id`;

        // if(conversation.length==0) throw new Error("database error")
        const conversation_id = conversation[0].conversation_id;

        await sql`INSERT INTO conversation_users (user_id, conversation_id)
        VALUES (${recipient_id}, ${conversation_id}),
               (${sender_id}, ${conversation_id});`;

        return res.status(200).send("accepted");
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send("Couldn't accept invite!");
    }
}
