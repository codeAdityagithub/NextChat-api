import { Message } from "../dbtypes";
import { IoType, SocketType } from "../types";
import sql from "./db";

export const onlineUsers = new Map<string, string>();
// const messages= new Map<string, Array<>>();

export default function (io: IoType, socket: SocketType) {
    const username = JSON.parse(socket.data.user.name).username;
    const userId = socket.data.user.sub;
    if (!onlineUsers.has(userId)) {
        console.log("user added to set!", socket.data.user);
        onlineUsers.set(userId, username);
        socket.join(userId);
    }
    socket.on(
        "join_conversation",
        (conversation_id: string, otherPersonId: string) => {
            socket.join(conversation_id);
            if (onlineUsers.has(otherPersonId))
                socket
                    .to(otherPersonId)
                    .emit(
                        "read_messages",
                        socket.data.user.sub,
                        conversation_id
                    );
        }
    );
    socket.on("leave_conversation", (conversation_id: string) => {
        socket.leave(conversation_id);
    });
    socket.on("get_status", (id: string, conversation_id: string) => {
        const status = onlineUsers.has(id) ? "online" : "offline";
        // console.log(status);
        io.to(conversation_id).emit("online_status", status);
    });
    socket.on("message", async (message, otherPersonId, conversation_id) => {
        if (!message || !conversation_id || !otherPersonId) return;
        const cur_user = socket.data.user;
        const names = JSON.parse(cur_user.name);

        const message_object = {
            conversation_id: conversation_id,
            sender_id: cur_user.sub,
            content: message,
            status: onlineUsers.has(otherPersonId) ? "read" : "delivered",
        };
        try {
            const inserted = await sql<Message[]>`insert into message ${sql(
                message_object
            )} returning *`;

            io.to(cur_user.sub).emit("recieve_message", inserted[0]);
            if (onlineUsers.has(otherPersonId)) {
                // console.log("message to ", otherPersonId, inserted[0]);
                io.to(otherPersonId).emit("recieve_message", inserted[0]);
            }
        } catch (error: any) {
            console.log(error.message);
            io.to(cur_user.sub).emit("message_error", error.message, message);
        }
    });

    socket.on("disconnect", () => {
        console.log(socket.id, " disconnected removed from set");
        socket.leave(userId);
        onlineUsers.delete(userId);
        // console.log(onlineUsers)
    });
}
