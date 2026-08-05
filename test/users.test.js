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

test('logs in, retrieves the authenticated user, and deletes the account', async () => {
    const agent = request.agent(app);

    await agent
        .post('/api/v1/users')
        .send({
            username: 'foo',
            email: 'foo@example.com',
            password: 'abcd1234'
        })
        .expect(201);

    const login = await agent
        .post('/api/v1/users/login')
        .send({
            username: 'foo',
            password: 'abcd1234'
        })
        .expect(200);

    assert.equal(login.body.message, 'Login successfully');
    assert.equal(login.body.user.username, 'foo');
    assert.match(login.headers['set-cookie'][0], /access_token=/);

    const profile = await agent.get('/api/v1/users/me').expect(200);

    assert.equal(profile.body.message, 'User found');
    assert.equal(profile.body.user.username, 'foo');
    assert.equal(profile.body.user.password_hash, undefined);

    await agent.delete('/api/v1/users/me').expect(204);

    const deletedProfile = await agent.get('/api/v1/users/me').expect(400);
    assert.equal(deletedProfile.body.message, 'User not found');
});
