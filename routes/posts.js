const express = require('express');
const router = express.Router();

const authenticateJWT = require('../jwt_helper');
const { db } = require('../db');

router.post('/', authenticateJWT, async (req, res) => {
    const { body } = req.body;
    const { id } = req.user;

    try {
        const returning = await db.posts.add(body, id);
        return res.status(201).json({
            message: 'Added post successfully',
            post: returning
        })
    } catch (error) {
        console.log('[SERVER ERROR]:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.get('/:username', async (req, res) => {
    const { username } = req.params;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
        Math.max(parseInt(req.query.limit, 10) || 10, 1),
        100
    );

    try {
        const { id: user_id } = await db.users.findByUsername(username);
        const results = await db.posts.view(user_id, limit, page);
        return res.status(200).json({
            message: 'Retrieved posts successfully',
            posts: results
        });
    } catch (error) {
        console.log('[SERVER ERROR]:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.get('/', async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
        Math.max(parseInt(req.query.limit, 10) || 10, 1),
        100
    );

    try {
        const results = await db.posts.findLatest(limit, page);
        return res.status(200).json({
            message: 'Retrieved posts successfully',
            posts: results
        });
    } catch (error) {
        console.log('[SERVER ERROR]', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.patch('/:post_id', authenticateJWT, async (req, res) => {
    const { body } = req.body;
    const { post_id } = req.params;
    const { id: user_id } = req.user;

    try {
        const updated = await db.posts.update(post_id, user_id, body);
        return res.status(200).json({
            message: 'Update post successfully',
            post: updated
        });
    } catch (error) {
        console.log('[SERVER ERROR]:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.delete('/:post_id', authenticateJWT, async (req, res) => {
    const { post_id } = req.params;
    const { id: user_id } = req.user;

    try {
        await db.posts.delete(post_id, user_id);
        return res.sendStatus(204);
    } catch (error) {
        console.log('[SERVER ERROR]:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = router;
