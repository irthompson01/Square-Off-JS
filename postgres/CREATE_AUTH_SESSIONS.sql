CREATE TABLE auth.sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
