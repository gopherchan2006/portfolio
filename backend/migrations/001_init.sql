CREATE TABLE IF NOT EXISTS articles (
    id         SERIAL PRIMARY KEY,
    slug       TEXT        NOT NULL UNIQUE,
    title      TEXT        NOT NULL,
    summary    TEXT        NOT NULL,
    tags       TEXT[]      NOT NULL DEFAULT '{}',
    accent     TEXT        NOT NULL DEFAULT 'cyan',
    read_time  INTEGER     NOT NULL DEFAULT 5,
    content    JSONB       NOT NULL DEFAULT '[]',
    published  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id          SERIAL PRIMARY KEY,
    article_id  INTEGER     NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author      TEXT        NOT NULL,
    text        TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS replies (
    id          SERIAL PRIMARY KEY,
    comment_id  INTEGER     NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    author      TEXT        NOT NULL,
    text        TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_replies_comment_id  ON replies(comment_id);
