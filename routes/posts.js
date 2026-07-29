const express = require('express');
const router = express.Router();

const authenticateJWT = require('../jwt_helper');
const { db } = require('../db');

router.post('/:user_id', authenticateJWT, async (req, res) => {
    const { body } = req.body;
    const { user_id: id } = req.params;

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

router.patch('/:user_id/:post_id', authenticateJWT, async (req, res) => {
    const { body } = req.body;
    const { user_id, post_id } = req.params;

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

router.delete('/:user_id/:post_id', authenticateJWT, async (req, res) => {
    const { user_id, post_id } = req.params;

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