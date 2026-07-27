const { users: sql } = require('../sql');

class UsersRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(username, email, password) {
        return this.db.one(sql.add, [username, email, password]);
    }
}

module.exports = UsersRepository;