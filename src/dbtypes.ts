// user.ts
export type User = {
    id?: string;
    name: string;
    username: string;
    email: string;
    password?: string;
};

// conversation.ts
export type Conversation = {
    conversation_id: number;
    created_at: Date;
    last_contacted_at: Date;
    latest_message: string;
    // Add more conversation-related fields as needed
};

// message.ts
export type Message = {
    message_id: number;
    conversation_id: number;
    sender_id: string;
    created_at: Date;
    content: string;
    status: "read" | "delivered";
    // Add more message-related fields as needed
};

// conversationUsers.ts
export type ConversationUsers = {
    user_id: string;
    conversation_id: number;
};

// invitation.ts
export type Invitation = {
    invitation_id: number;
    sender_id: string;
    recipient_id: string;
    status: "pending" | "accepted" | "rejected";
    sent_at: Date;
    // Add more invitation-related fields as needed
};
