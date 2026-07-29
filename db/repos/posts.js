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
        return this.db.none(sql.delete, [id, user_id]);
    }

    update(id, user_id, text) {
        return this.db.oneOrNone(sql.update, [id, user_id, text]);
    }
}

module.exports = PostsRepository;