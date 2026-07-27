const express = require('express');
const router = express.Router();

const { db } = require('../db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

router.post('/', async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await db.users.add(username, email, hashedPassword);
        return res.status(200).json({
            message: 'Added user successfully',
            users: result
        });
    } catch (err) {
        console.log(`Something went wrong: ${err}`);
        next(err);
    }
});

module.exports = router;