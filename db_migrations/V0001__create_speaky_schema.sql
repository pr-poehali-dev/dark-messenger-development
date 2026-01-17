-- Speaky Database Schema

-- Пользователи
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    enots INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'ru',
    theme VARCHAR(20) DEFAULT 'dark',
    show_online BOOLEAN DEFAULT TRUE,
    public_playlist BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Чаты (личные, группы, каналы)
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('personal', 'group', 'channel')),
    name VARCHAR(200),
    avatar_url TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Участники чатов
CREATE TABLE IF NOT EXISTS chat_members (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id),
    user_id INTEGER REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chat_id, user_id)
);

-- Сообщения
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id),
    sender_id INTEGER REFERENCES users(id),
    message_text TEXT,
    media_type VARCHAR(20) CHECK (media_type IN ('text', 'photo', 'video', 'voice', 'file')),
    media_url TEXT,
    reply_to INTEGER REFERENCES messages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Друзья
CREATE TABLE IF NOT EXISTS friendships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    friend_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

-- Черный список
CREATE TABLE IF NOT EXISTS blocked_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    blocked_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, blocked_user_id)
);

-- Звонки
CREATE TABLE IF NOT EXISTS calls (
    id SERIAL PRIMARY KEY,
    caller_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    call_type VARCHAR(20) NOT NULL CHECK (call_type IN ('audio', 'video')),
    status VARCHAR(20) DEFAULT 'calling' CHECK (status IN ('calling', 'accepted', 'rejected', 'ended', 'missed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

-- Музыка - Плейлисты
CREATE TABLE IF NOT EXISTS playlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    track_title VARCHAR(200) NOT NULL,
    track_artist VARCHAR(200) NOT NULL,
    track_duration VARCHAR(10),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Кошелек - Транзакции
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('topup', 'purchase', 'gift_sent', 'gift_received')),
    amount INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Подарки пользователей
CREATE TABLE IF NOT EXISTS user_gifts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    gift_emoji VARCHAR(10) NOT NULL,
    gift_name VARCHAR(100) NOT NULL,
    from_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_members_user_id ON chat_members(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_receiver_id ON calls(receiver_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
