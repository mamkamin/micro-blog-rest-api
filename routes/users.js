const express = require('express');
const router = express.Router();

const { db } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../jwt_helper');

const saltRounds = 10;

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({
            message: 'Username, email and password required'
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await db.users.add(username, email, hashedPassword);
        return res.status(201).json({
            message: 'Added user successfully',
            users: result
        });
    } catch (err) {
        console.log(`[SERVER ERROR]: ${err}`);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.get('/username', async (req, res) => {
    try {
        const rows = await db.users.findAllUsername();
        return res.status(200).json({
            message: `Found ${rows.length} users`,
            users: rows
        });
    } catch (error) {
        console.log(`[SERVER ERROR]: ${err}`);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.post('/login', async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username && !email) {
        return res.status(400).json({
            message: 'Username or email required'
        });
    }
    try {
        const user = await db.users.findByNameOrEmail(username, email);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const isMatched = await bcrypt.compare(password, user.password_hash);
        if (!isMatched) {
            return res.status(401).json({
                message: 'Unauthorized access'
            });
        }

        const payload = {
            id: user.id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
            path: '/'
        });

        return res.status(200).json({
            message: 'Login successfully',
            user: {
                id: user.id,
                username: user.username,
            }
        });
    } catch (err) {
        console.log(`[SERVER ERROR]: ${err}`);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    return res.sendStatus(204);
});

router.get('/me', authenticateJWT, async (req, res) => {
    const { id } = req.user;
    const user = await db.users.findById(id);
    if (!user) {
        return res.status(400).json({
            message: 'User not found'
        });
    }

    const { password_hash, ...noPassUser } = user;

    return res.status(200).json({
        message: 'User found',
        user: noPassUser
    });
});

router.delete('/me', authenticateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        db.users.delete(id);
        return res.sendStatus(204);
    } catch (err) {
        console.log('[SERVER ERROR]:', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.patch('/me', authenticateJWT, async (req, res) => {
    const { id } = req.user;
    const data = req.body;
    console.log('[LOG]:', data);

    try {
        const changes = await db.users.update(id, data);
        return res.status(200).json({
            message: 'Update user successfully',
            user: changes
        });
    } catch (err) {
        console.log('[SERVER ERROR]:', err);
        if (err.code === '23505') {
            return res.status(409).json({
                message: 'Username or email already exists'
            });
        }
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = router;
