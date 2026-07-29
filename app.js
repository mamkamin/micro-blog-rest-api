require('dotenv').config();

const express = require('express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);


app.listen(port, () => {
    console.log(`Listening on port:${port}`);
});