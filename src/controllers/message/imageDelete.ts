import { Response } from "express";
// import { Message } from "../../dbtypes";
import { IoType, RequestwUser } from "../../types";
import sql from "../../utils/db";
import { onlineUsers } from "../../utils/socketHandler";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const location = path.join(__dirname, "../", "../", "../", "chatImages");

export default async function (req: RequestwUser, res: Response) {
    const { message_id, otherPersonId } = req.body;

    if (!message_id || !otherPersonId)
        return res.status(401).json("No message id");
    const cur_user = req.user!;
    // const names = JSON.parse(cur_user.name);

    const io: IoType = req.app.get("io");

    try {
        const fileUrl: string = (
            await sql`select content from message where message_id=${message_id}`
        )[0].content;
        const fileName = fileUrl.split("/").pop();
        const filePath = path.join(location, fileName!);
        if (existsSync(filePath)) await fs.unlink(filePath);

        await sql`delete from message where message_id=${message_id}`;
        io.to(cur_user.sub).emit("delete_message", message_id);
        if (onlineUsers.has(otherPersonId)) {
            // console.log("message to ", otherPersonId, inserted[0]);
            io.to(otherPersonId).emit("delete_message", message_id);
        }
        res.status(200).json("message deleted");
    } catch (error: any) {
        console.log(error.message);
        // io.to(cur_user.sub).emit("message_error", error.message, message);
        res.status(500).json("Something went wrong! Try again later");
    }
}
