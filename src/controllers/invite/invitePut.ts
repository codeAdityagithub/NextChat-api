import { Response } from "express";
// import { onlineUsers } from "../../utils/socketHandler";
// import { IoType } from "../../types";
import sql from "../../utils/db";
import { IoType, RequestwUser, UserCardInfo } from "../../types";
import { onlineUsers } from "../../utils/socketHandler";
import { Conversation } from "../../dbtypes";

export default async function (req: RequestwUser, res: Response) {
    const { invitation_id } = req.body;
    console.log(invitation_id);
    if (!invitation_id) return res.status(400).send("No invitationId provided");
    const cur_user = JSON.parse(req.user?.name!);
    try {
        const users =
            await sql`update invitation set status='accepted' where invitation_id=${invitation_id} returning sender_id, recipient_id`;
        const sender_id = users[0].sender_id;
        const recipient_id = users[0].recipient_id;

        const conversation: Omit<Conversation, "created_at">[] =
            await sql`INSERT INTO conversation DEFAULT VALUES RETURNING conversation_id, last_contacted_at`;

        // if(conversation.length==0) throw new Error("database error")
        const conversation_id = conversation[0].conversation_id;

        await sql`INSERT INTO conversation_users (user_id, conversation_id)
        VALUES (${recipient_id}, ${conversation_id}),
               (${sender_id}, ${conversation_id});`;

        // ****** this req is sent by the reciever*****
        const sender =
            await sql`select name as sender_name, username as sender_username from users where id=${sender_id}`;
        const { sender_name, sender_username } = sender[0];
        const data: UserCardInfo = {
            conversation_id: conversation_id,
            last_contacted_at: conversation[0].last_contacted_at,
            name: cur_user.name,
            username: cur_user.username,
        };
        const io: IoType = req.app.get("io");
        if (onlineUsers.has(sender_username)) {
            console.log("user is online sending conv", data);
            io.to(sender_username).emit("add_conversation", data);
        }
        data.name = sender_name;
        data.username = sender_username;
        io.to(cur_user.username).emit("add_conversation", data);

        return res.status(200).send("accepted");
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send("Couldn't accept invite!");
    }
}
