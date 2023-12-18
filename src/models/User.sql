CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id uuid DEFAULT uuid_generate_v4(),
    user_username VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL,
    user_password VARCHAR NOT NULL,
    PRIMARY KEY (user_id)
);

INSERT INTO
    users
VALUES
    ("test", "test@gmail.com", "password");