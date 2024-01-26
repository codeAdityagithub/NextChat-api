import { Message } from "../dbtypes";
import { IoType, SocketType } from "../types";
import sql from "./db";

export const onlineUsers = new Map<string, string>();
// const messages= new Map<string, Array<>>();

export default function (io: IoType, socket: SocketType) {
    const username = JSON.parse(socket.data.user.name).username;
    if (!onlineUsers.has(username)) {
        console.log("user added to set!", socket.data.user);
        onlineUsers.set(username, socket.data.user?.sub);
        socket.join(username);
    }
    socket.on("join_conversation", (conversation_id: string) => {
        socket.join(conversation_id);
        socket.to(conversation_id).emit("read_messages", socket.data.user.sub);
    });
    socket.on("leave_conversation", (conversation_id: string) => {
        socket.leave(conversation_id);
    });
    socket.on("get_status", (username: string, conversation_id: string) => {
        const status = onlineUsers.has(username) ? "online" : "offline";
        // console.log(status);
        io.to(conversation_id).emit("online_status", status);
    });
    socket.on("message", async (message, username, conversation_id) => {
        if (!message || !conversation_id || !username) return;
        const cur_user = socket.data.user;
        const names = JSON.parse(cur_user.name);

        const message_object = {
            conversation_id: conversation_id,
            sender_id: cur_user.sub,
            content: message,
            status: onlineUsers.has(username) ? "read" : "delivered",
        };
        try {
            const inserted = await sql<Message[]>`insert into message ${sql(
                message_object
            )} returning *`;

            io.to(names.username).emit("recieve_message", inserted[0]);
            if (onlineUsers.has(username)) {
                // console.log("message to ", username, inserted[0]);
                io.to(username).emit("recieve_message", inserted[0]);
            }
        } catch (error: any) {
            console.log(error.message);
            io.to(names.username).emit("message_error", error.message, message);
        }
    });

    socket.on("disconnect", () => {
        console.log(socket.id, " disconnected removed from set");
        const username = JSON.parse(socket.data.user.name).username;
        socket.leave(username);
        onlineUsers.delete(username);
        // console.log(onlineUsers)
    });
}
