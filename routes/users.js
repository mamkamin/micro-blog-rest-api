const express = require('express');
const router = express.Router();

const { db } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

        return res.status(200).json({
            message: 'Login successfully',
            token
        });
    } catch (err) {
        console.log(`[SERVER ERROR]: ${err}`);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.get('/:id',
    (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: 'Unauthorized access'
            });
        }

        const [ scheme, token ] = authHeader.split(" ");
        if (scheme?.toLowerCase() !== 'bearer' || !token) {
            return res.status(401).json({
                message: 'Unauthorized access'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json(err);
                }
                return res.status(500).json(err);
            }

            if (decoded.id !== req.params.id) {
                return res.status(403).json({
                    message: 'Forbidden'
                });
            }
            console.log("[LOG]:", decoded);
            req.payload = decoded;
            next();
        });
    },
    async (req, res) => {
        const { id } = req.params;
        const user = await db.users.findById(id);
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'User found',
            user
        });
    }
);

module.exports = router;