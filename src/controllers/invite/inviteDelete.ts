import { Response } from "express";
// import { onlineUsers } from "../../utils/socketHandler";
// import { IoType } from "../../types";
import sql from "../../utils/db";
import { IoType, RequestwUser, UserCardInfo } from "../../types";

export default async function (req: RequestwUser, res: Response) {
    const { invitation_id } = req.body;
    // console.log(username);
    if (!invitation_id) return res.status(400).send("No invitationId provided");
    try {
        const sender =
            await sql`update invitation set status='rejected' where invitation_id=${invitation_id} and recipient_id=${req
                .user?.sub!} returning sender_id`;
        const sender_id = sender[0].sender_id;
        const io: IoType = req.app.get("io");
        io.to(sender_id).emit(
            "invite_reject",
            JSON.parse(req.user?.name!).username
        );
        return res.status(200).send("rejected");
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).send("Couldn't accept invite!");
    }
}
