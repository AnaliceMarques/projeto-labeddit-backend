-- Active: 1684779186175@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT ('NORMAL') NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, username, email, password, role)
VALUES
  -- tipo NORMAL e senha = joao123
	('u001', 'João', 'joão@email.com', '$2a$12$PjTGJscEb11/USRs3EIjQ.8h9eUvImB.MzGs2KtAF7K6llyfiY/5q', 'NORMAL'),

  -- tipo NORMAL e senha = maria123
	('u002', 'Maria', 'maria@email.com', '$2a$12$udqtqCxbTL0qnT3wxScd8Oj1CoN5Q5Pz8jWVFm.6V9loY8Kyl0csW', 'NORMAL'),

  -- tipo ADMIN e senha = 123456
	('u003', 'José', 'jose@email.com', '$2a$12$PUKHsLIJ2LHvzXRIZw5Yb./TJ5wMb7vKNHjQSpMb7aeVYdeGCGpta', 'ADMIN');


CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    comments INTEGER DEFAULT (0) NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO posts (id, user_id, content)
VALUES
    ('p001', 'u001', 'Post 1'),
    ('p002', 'u002', 'Post 2');


CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT (0),
    dislikes INTEGER NOT NULL DEFAULT (0),
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
     FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO comments (id, user_id, post_id, content)
VALUES
    ('c001', 'u002', 'p001', 'Comment 1 no Post 1'),
    ('c002', 'u003', 'p001', 'Comment 2 no Post 1'),
    ('c003', 'u001', 'p002', 'Comment 1 no Post 2');


UPDATE posts
SET comments = 2
WHERE id = 'p001';

UPDATE posts
SET comments = 1
WHERE id = 'p002';


CREATE TABLE likes_dislikes_posts (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO likes_dislikes_posts (user_id, post_id, like)
VALUES
    ('u002', 'p001', 1),
    ('u003', 'p001', 1),
    ('u001', 'p002', 1),
    ('u003', 'p002', 0);

UPDATE posts
SET likes = 2
WHERE id = 'p001';

UPDATE posts
SET likes = 1, dislikes = 1
WHERE id = 'p002';


CREATE TABLE likes_dislikes_comments (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO likes_dislikes_comments (user_id, comment_id, like)
VALUES
    ('u001', 'c001', 1),
    ('u003', 'c001', 1),
    ('u001', 'c002', 1),
    ('u002', 'c003', 0);

UPDATE comments
SET likes = 2
WHERE id = 'c001';

UPDATE comments
SET likes = 1
WHERE id = 'c002';

UPDATE comments
SET dislikes = 1
WHERE id = 'c003';


-- Queries de deleção:
DROP TABLE likes_dislikes_comments;

DROP TABLE likes_dislikes_posts;

DROP TABLE comments;

DROP TABLE posts;

DROP TABLE users;