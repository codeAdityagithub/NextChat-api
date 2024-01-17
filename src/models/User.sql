CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR,
    PRIMARY KEY (id)
);

-- Conversations table to store information about chat conversations
CREATE TABLE conversation (
    conversation_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_contacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latest_message VARCHAR(101);
    -- Add more conversation-related fields as needed
);

CREATE TYPE message_status AS ENUM ('read', 'delivered');

-- Messages table to store individual messages
CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversation(conversation_id) ON DELETE CASCADE,
    sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    status message_status DEFAULT 'delivered'
    -- Add more message-related fields as needed
);

-- middle join table to associate users with conversations (many-to-many relationship)
CREATE TABLE conversation_users (
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    conversation_id INT REFERENCES conversation(conversation_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, conversation_id)
);

CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'rejected');

-- Invitations table
CREATE TABLE invitation (
    invitation_id SERIAL PRIMARY KEY,
    sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
    recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
    status invitation_status DEFAULT 'pending',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Add more invitation-related fields as needed
    UNIQUE (sender_id, recipient_id)
);

CREATE
OR REPLACE FUNCTION update_conversation() RETURNS TRIGGER AS $$ 
BEGIN
UPDATE
    conversation
SET
    last_contacted_at = NEW.created_at,
    latest_message = LEFT(NEW.content, GREATEST(length(NEW.content), 100))
WHERE
    conversation_id = NEW.conversation_id;

RETURN NEW;

END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_trigger
AFTER
INSERT
    ON message FOR EACH ROW EXECUTE FUNCTION update_conversation();