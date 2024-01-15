import { IoType, SocketType } from "../types";

export default function (io: IoType, socket: SocketType) {
    const username = JSON.parse(socket.data.user.name).username;

    socket.on("message", (message) => {
        console.log(message);
    });
    socket.on("joined_user", (userId: string) => {
        console.log(userId);
    });
    // socket.emit("hi", "hi");
    socket.on("disconnect", () => {
        console.log(socket.id, " disconnected removed from set");
    });
}
