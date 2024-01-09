import { IoType, SocketType } from "../types";

export const onlineUsers = new Map<string, string>();
// const messages= new Map<string, Array<>>();

export default function (io: IoType, socket: SocketType) {
    const username = JSON.parse(socket.data.user.name).username;
    if (!onlineUsers.has(username)) {
        console.log("user added to set!", socket.data.user);
        onlineUsers.set(username, socket.data.user?.sub);
        socket.join(username);
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
        const username = JSON.parse(socket.data.user.name).username;
        socket.leave(username);
        onlineUsers.delete(username);
        // console.log(onlineUsers)
    });
}
