const { posts: sql } = require('../sql');

class PostsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(body, user_id) {
        return this.db.one(sql.add, [body, user_id]);
    }

    delete(id, user_id) {
        return this.db.none(sql.delete, [id, user_id]);
    }
}

module.exports = PostsRepository;