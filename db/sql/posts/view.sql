SELECT * FROM posts
WHERE user_id = $1
LIMIT $2 OFFSET ($2 * ($3 - 1));