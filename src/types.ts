import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { Request } from "express";

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
        sub: string;
        iat?: number;
    };
}

export type InviteNotification = {
    name: string;
    username: string;
    sent_at: Date;
    invitation_id: number;
    sender_id: string;
    dp: string;
};

export type UserCardInfo = {
    conversation_id: number;
    last_contacted_at: Date;
    name: string;
    id?: string;
    latest_message: string;
    unread_message?: boolean;
    dp?: string;
    latest_message_sender_id?: string;
};
