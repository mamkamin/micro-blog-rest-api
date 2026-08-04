const { posts: sql } = require('../sql');

class PostsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(body, user_id) {
        return this.db.one(sql.add, [body, user_id]);
    }

    view(user_id, limit, page) {
        return this.db.manyOrNone(sql.view, [user_id, limit, page]);
    }

    delete(id, user_id) {
        return this.db.result(sql.delete, [id, user_id]);
    }

    update(id, user_id, text) {
        return this.db.oneOrNone(sql.update, [id, user_id, text]);
    }

    findLatest(limit, page) {
        return this.db.manyOrNone(sql.findLatest, [limit, page]);
    }

    findByIdAndUserId(id, user_id) {
        return this.db.oneOrNone(sql.findByIdAndUserId, [id, user_id]);
    }
}

module.exports = PostsRepository;