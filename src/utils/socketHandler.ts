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
        io.to(conversation_id).emit("user_status", "online");
    });
    socket.on("leave_conversation", (conversation_id: string) => {
        socket.leave(conversation_id);
        io.to(conversation_id).emit("user_status", "offline");
    });
    socket.on("get_status", (username: string, conversation_id: string) => {
        const status = onlineUsers.has(username) ? "online" : "offline";
        // console.log(status);
        io.to(conversation_id).emit("online_status", status);
    });
    socket.on("message", async (message, username, conversation_id) => {
        const cur_user = socket.data.user;
        const names = JSON.parse(cur_user.name);
        try {
            const inserted = await sql`insert into message 
            (conversation_id, sender_id, content) 
            values (${conversation_id}, ${cur_user.sub}, ${message})
            returning *`;

            if (onlineUsers.has(username)) {
                // console.log("message to ", username);
                io.to(username).emit("recieve_message", inserted);
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
