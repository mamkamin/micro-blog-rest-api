const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../app');
const { db, pgp } = require('../db');

test.beforeEach(async () => {
    await db.none('TRUNCATE users, posts RESTART IDENTITY CASCADE');
});

test.after(() => {
    pgp.end();
});

test('register a user without exposing password hash', async () => {
    const response = await request(app)
        .post('/api/v1/users')
        .send({
            username: 'alice',
            email: 'alice@example.com',
            password: 'password123'
        })
        .expect(201);

    assert.equal(response.body.message, 'Added user successfully');
    assert.equal(response.body.users.username, 'alice');
    assert.equal(response.body.users.password_hash, undefined);
});

test('rejects a registration missing required fields', async () => {
    const response = await request(app)
        .post('/api/v1/users')
        .send({
            username: 'alice',
            email: 'alice@example.com',
        })
        .expect(400);

    assert.equal(
        response.body.message,
        'Username, email and password required',
    );
});