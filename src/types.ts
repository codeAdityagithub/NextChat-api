import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type IoType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export type SocketType = Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
>;
export type SocketMiddleWare = (err?: ExtendedError | undefined) => void