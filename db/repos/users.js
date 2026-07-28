const { users: sql } = require('../sql');

class UsersRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(username, email, password) {
        return this.db.one(sql.add, [username, email, password]);
    }

    findByNameOrEmail(username, email) {
        return this.db.oneOrNone(sql.findByNameOrEmail, [username, email]);
    }

    findById(id) {
        return this.db.oneOrNone(sql.findById, id);
    }

    delete(id) {
        this.db.none(sql.delete, id);
    }
}

module.exports = UsersRepository;