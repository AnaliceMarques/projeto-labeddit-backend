-- Active: 1684779186175@@127.0.0.1@3306

-- Table users {
--   id text [primary key, unique, not null]
--   username text [not null]
--   email text [unique, not null]
--   password text [not null]
--   role text [default: "NORMAL", not null]
--   created_at text [default: "DATETIME()", not null]
--   updated_at text [default: "DATETIME()", not null]
-- }

-- Table posts {
--   id text [primary key, unique, not null]
--   user_id text [not null, ref: > users.id ]
--   content text [not null]
--   comments integer [not null, default: 0]
--   likes integer [not null, default: 0]
--   dislikes integer [default: 0, not null]
--   created_at text [default: "DATETIME()", not null]
--   updated_at text [default: "DATETIME()", not null]
-- }

-- Table comments {
--   id text [primary key, unique, not null]
--   user_id text [not null, ref: > users.id]
--   post_id text [not null, ref: > posts.id]
--   content text [not null]
--   likes integer [not null, default: 0]
--   dislikes integer [not null, default: 0]
--   created_at text [default: "DATETIME()", not null]
--   updated_at text [default: "DATETIME()", not null]
-- }

-- Table likes_dislikes_posts {
--   user_id text [not null, ref: <> users.id]
--   post_id text [not null, ref: <> posts.id]
--   like integer [not null]
-- }

-- Table likes_dislikes_comments {
--   user_id text [not null, ref: <> users.id]
--   comment_id text [not null, ref: <> comments.id]
--   like integer [not null]
-- }