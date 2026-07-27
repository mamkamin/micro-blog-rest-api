require('dotenv').config();

const express = require('express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);


app.listen(port, () => {
    console.log(`Listening on port:${port}`);
});