require('dotenv').config();

const express = require('express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}))

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);

module.exports = app;
