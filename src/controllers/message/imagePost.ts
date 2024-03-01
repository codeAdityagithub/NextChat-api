import { NextFunction, Response } from "express";
import { IoType, RequestwUser } from "../../types";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import sql from "../../utils/db";
import { onlineUsers } from "../../utils/socketHandler";
import { Message } from "../../dbtypes";

const location = path.join(__dirname, "../", "../", "../", "chatImages");

export default async function (
    req: RequestwUser,
    res: Response,
    next: NextFunction
) {
    // const { conversation_id, otherPersonId } = req.body;
    // if (!conversation_id || !otherPersonId)
    // return res.status(401).json("Missing dependencies");
    const form = formidable({ uploadDir: location });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        if (
            !fields.conversation_id ||
            !fields.otherPersonId ||
            !fields.conversation_id[0] ||
            !fields.otherPersonId[0]
        )
            return res.status(401).json("Missing dependencies");

        const conversation_id = fields.conversation_id[0];
        const otherPersonId = fields.otherPersonId[0];

        if (!files.image) return res.status(400).json("No file Uploaded");
        const image = files.image[0];
        // const ext = pp.originalFilename?.split(".").pop();
        const oldPath = image.filepath;
        const fileName = Date.now() + "_" + req.user?.sub!;
        const newPath = path.join(location, `${fileName}.jpg`);

        // console.log(image.size);
        try {
            await fs.rename(oldPath, newPath);
            const cur_user = req.user!;
            // const names = JSON.parse(cur_user.name);

            const message_object = {
                conversation_id: conversation_id,
                sender_id: cur_user.sub,
                content: `${process.env.API_URL}/upload/${fileName}.jpg`,
                status: onlineUsers.has(otherPersonId) ? "read" : "delivered",
                type: "image",
            };
            const inserted = await sql<Message[]>`insert into message ${sql(
                message_object
            )} returning *`;
            console.log(inserted[0]);
            const io: IoType = req.app.get("io");
            io.to(cur_user.sub).emit("recieve_message", inserted[0]);
            if (onlineUsers.has(otherPersonId)) {
                // console.log("message to ", otherPersonId, inserted[0]);
                io.to(otherPersonId).emit("recieve_message", inserted[0]);
            }
            return res.status(200).json("File Uploaded Succesfuly");
        } catch (error: any) {
            console.log(error?.message);
            return res.status(500).json("Something went wrong");
        }
    });
}
