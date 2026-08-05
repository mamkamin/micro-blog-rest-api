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

async function registerAndLogin(agent, username) {
    await agent.post('/api/v1/users').send({
        username,
        email: `${username}@example.com`,
        password: 'password123'
    }).expect(201);

    await agent.post('/api/v1/users/login').send({
        username,
        password: 'password123'
    }).expect(200);
}

test('cannot delete another user\'s post', async () => {
    const alice = request.agent(app);
    const bob = request.agent(app);

    await registerAndLogin(alice, 'alice');
    await registerAndLogin(bob, 'bob');

    const post = await alice
        .post('/api/v1/posts')
        .send({ body: 'Only Alice can delete this' })
        .expect(201);

    await bob
        .delete(`/api/v1/posts/${post.body.post.id}`)
        .expect(404);
});

test('cannot delete non existent post', async () => {
    const alice = request.agent(app);

    await registerAndLogin(alice, 'alice');

    await alice
        .post('/api/v1/posts')
        .send({ body: 'This is Alice\'s post' })
        .expect(201);

    await alice
        .delete(`/api/v1/posts/2`)
        .expect(404);
});

test('creates, retrieves, updates, and deletes an owned post', async () => {
    const agent = request.agent(app);

    await registerAndLogin(agent, 'foo');

    const created = await agent
        .post('/api/v1/posts')
        .send({ body: 'My first test post' })
        .expect(201);

    assert.equal(created.body.message, 'Added post successfully');
    assert.equal(created.body.post.body, 'My first test post');

    const posts = await agent.get('/api/v1/posts/foo').expect(200);

    assert.equal(posts.body.message, 'Retrieved posts successfully');
    assert.equal(posts.body.posts.length, 1);
    assert.equal(posts.body.posts[0].body, 'My first test post');

    const updated = await agent
        .patch(`/api/v1/posts/${created.body.post.id}`)
        .send({ body: 'My updated test post' })
        .expect(200);

    assert.equal(updated.body.message, 'Update post successfully');
    assert.equal(updated.body.post.body, 'My updated test post');

    await agent.delete(`/api/v1/posts/${created.body.post.id}`).expect(204);

    const remainingPosts = await agent.get('/api/v1/posts/foo').expect(200);
    assert.equal(remainingPosts.body.posts.length, 0);
});
