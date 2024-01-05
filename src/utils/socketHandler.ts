import { IoType, SocketType } from "../types";

export const onlineUsers = new Set();
// const messages= new Map<string, Array<>>();

export default function (io: IoType, socket: SocketType) {
    if (!onlineUsers.has(socket.data.user?.sub)) {
        console.log("user added to set!", socket.data.user);
        onlineUsers.add(socket.data.user?.sub);
        socket.join(socket.data.user.sub);
    }

    socket.on("message", (message) => {
        console.log(message);
    });
    socket.on("joined_user", (userId: string) => {
        console.log(userId);
    });
    // socket.emit("hi", "hi");
    socket.on("disconnect", () => {
        console.log(socket.id, " disconnected removed from set");
        socket.leave(socket.data.user.sub)
        onlineUsers.delete(socket.data.user.sub);
        // console.log(onlineUsers)
    });
}
