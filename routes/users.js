const express = require('express');
const router = express.Router();

const { db } = require('../db');
const bcrypt = require('bcrypt');

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

module.exports = router;