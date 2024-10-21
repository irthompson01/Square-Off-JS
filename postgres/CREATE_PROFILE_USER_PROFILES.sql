CREATE TABLE profile.user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    theme_color VARCHAR(7),  -- e.g., HEX color like #ffffff
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
