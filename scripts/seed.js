require('dotenv').config();

const bcrypt = require('bcrypt');
const { db, pgp } = require('../db');

const users = [
    {
        username: 'alice',
        email: 'alice@example.com',
        password: 'password123',
        posts: [
            'Building a small API one endpoint at a time.',
            'Coffee, code, and a clean test suite.'
        ]
    },
    {
        username: 'bob',
        email: 'bob@example.com',
        password: 'password123',
        posts: [
            'Today I learned that simple database constraints save time.',
            'Shipping a feature is better than polishing an idea forever.'
        ]
    }
];

async function seed() {
    await db.tx(async (transaction) => {
        for (const user of users) {
            let savedUser = await transaction.oneOrNone(
                'SELECT id FROM users WHERE username = $1',
                user.username
            );

            if (!savedUser) {
                const passwordHash = await bcrypt.hash(user.password, 10);
                savedUser = await transaction.one(
                    `INSERT INTO users(username, email, password_hash)
                     VALUES($1, $2, $3)
                     RETURNING id`,
                    [user.username, user.email, passwordHash]
                );
                console.log(`Created user: ${user.username}`);
            } else {
                console.log(`User already exists: ${user.username}`);
            }

            for (const body of user.posts) {
                const existingPost = await transaction.oneOrNone(
                    'SELECT id FROM posts WHERE user_id = $1 AND body = $2',
                    [savedUser.id, body]
                );

                if (!existingPost) {
                    await transaction.none(
                        'INSERT INTO posts(body, user_id) VALUES($1, $2)',
                        [body, savedUser.id]
                    );
                    console.log(`Created post for: ${user.username}`);
                }
            }
        }
    });
}

seed()
    .then(() => console.log('Database seed completed.'))
    .catch((error) => {
        console.error('Database seed failed:', error);
        process.exitCode = 1;
    })
    .finally(() => pgp.end());
