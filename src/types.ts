import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import {Request} from "express"

export type IoType = Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
>;
export type SocketType = Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
>;
export type SocketMiddleWare = (err?: ExtendedError | undefined) => void;

export interface RequestwUser extends Request {
    user?: {
        name: string;
        email: string;
        picture?: string;
        sub: string;
        iat: number;
    };
}
