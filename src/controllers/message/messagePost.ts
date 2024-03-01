import { Response } from "express";
import { Message } from "../../dbtypes";
import { IoType, RequestwUser } from "../../types";
import sql from "../../utils/db";
import { onlineUsers } from "../../utils/socketHandler";

export default async function (req: RequestwUser, res: Response) {
    const { message, conversation_id, otherPersonId } = req.body;

    if (!message || !conversation_id || !otherPersonId)
        return res.status(401).json("Missing dependencies");

    const cur_user = req.user!;
    // const names = JSON.parse(cur_user.name);

    const message_object = {
        conversation_id: conversation_id,
        sender_id: cur_user.sub,
        content: message,
        status: onlineUsers.has(otherPersonId) ? "read" : "delivered",
    };
    const io: IoType = req.app.get("io");

    try {
        const inserted = await sql<Message[]>`insert into message ${sql(
            message_object
        )} returning *`;
        io.to(cur_user.sub).emit("recieve_message", inserted[0]);
        if (onlineUsers.has(otherPersonId)) {
            // console.log("message to ", otherPersonId, inserted[0]);
            io.to(otherPersonId).emit("recieve_message", inserted[0]);
        }
        res.status(200).json("message sent");
    } catch (error: any) {
        console.log(error.message);
        // io.to(cur_user.sub).emit("message_error", error.message, message);
        res.status(500).json("Something went wrong! Try again later");
    }
}
