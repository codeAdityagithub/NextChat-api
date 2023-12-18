import { IoType, SocketType } from "../types";

export default function (io: IoType, socket: SocketType) {
    console.log(socket.id, " connected");
    // socket.on("test", (test) => {
    //     console.log(test);
    // });
    // socket.emit("hi", "hi");
    socket.on("disconnect", () => {
        console.log(socket.id, " disconnected");
    });
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
}
