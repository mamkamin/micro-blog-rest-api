const pgPromise = require('pg-promise');
const { Users, Posts } = require('./repos');

const initOptions = {
    extend(obj, dc) {
        obj.users = new Users(obj, pgp);
        obj.posts = new Posts(obj, pgp);
    }
};

const pgp = pgPromise(initOptions);

const CONNECTION_STRING = process.env.PSQL_CONNECTION_STRING;

if (!CONNECTION_STRING) {
    throw new Error('PSQL_CONNECTION_STRING is not defined');
}

const db = pgp(CONNECTION_STRING);

module.exports = {
    pgp,
    db
};