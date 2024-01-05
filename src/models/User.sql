CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id uuid DEFAULT uuid_generate_v4(),
    user_name VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL,
    user_password VARCHAR NOT NULL,
    PRIMARY KEY (user_id)
);

-- Conversations table to store information about chat conversations
CREATE TABLE conversation (
    conversation_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Add more conversation-related fields as needed
);

-- Messages table to store individual messages
CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversation(conversation_id) ON DELETE CASCADE,
    sender_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    -- Add more message-related fields as needed
);

-- middle join table to associate users with conversations (many-to-many relationship)
CREATE TABLE conversation_users (
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    conversation_id INT REFERENCES conversation(conversation_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, conversation_id)
);

CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'rejected');

-- Invitations table
CREATE TABLE invitation (
    invitation_id SERIAL PRIMARY KEY,
    sender_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    status invitation_status DEFAULT 'pending', -- or use an enum for 'pending', 'accepted', 'rejected', etc.
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- Add more invitation-related fields as needed
);