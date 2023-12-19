import { IoType, SocketType } from "../types";

export default function (io: IoType, socket: SocketType) {
    console.log(socket.id, " connected");
    socket.on("message", (message) => {
        console.log(message);
    });
    // socket.emit("hi", "hi");
    socket.on("disconnect", () => {
        console.log(socket.id, " disconnected");
    });
    
}
