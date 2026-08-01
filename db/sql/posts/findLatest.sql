SELECT
    p.*,
    u.username
FROM posts AS p
JOIN users as u
    ON p.user_id = u.id
ORDER BY created_at DESC
LIMIT $1 OFFSET ($1 * ($2 - 1));