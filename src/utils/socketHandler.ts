import { Message } from "../dbtypes";
import { IoType, SocketType } from "../types";
import sql from "./db";

export const onlineUsers = new Set<string>();
// const messages= new Map<string, Array<>>();

export default function (io: IoType, socket: SocketType) {
    const username = JSON.parse(socket.data.user?.name).username;
    const userId = socket.data.user?.sub;
    if (!onlineUsers.has(userId)) {
        // console.log("user added to set!", username);
        onlineUsers.add(userId);
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
                        socket.data.user?.sub,
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

    socket.on("disconnect", () => {
        console.log(socket.id, " disconnected removed from set");
        socket.leave(userId);
        onlineUsers.delete(userId);
        // console.log(onlineUsers)
    });
}
