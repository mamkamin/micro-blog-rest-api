const { users: sql } = require('../sql');

class UsersRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;

        this.updateColumnSet = new pgp.helpers.ColumnSet(
            [
                '?id',
                {
                    name: 'username',
                    skip(col) {
                        return !Object.hasOwn(col.source, 'username');
                    }
                },
                {
                    name: 'email',
                    skip(col) {
                        return !Object.hasOwn(col.source, 'email');
                    }
                },
                {
                    name: 'password',
                    skip(col) {
                        return !Object.hasOwn(col.source, 'password');
                    }
                }
            ],
            {
                table: 'users'
            }
        );
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

    update(id, changes) {
        console.log('[DEBUG]:', changes);
        console.log('[DEBUG]:', this.updateColumnSet);
        console.log('[DEBUG]:', this.pgp.helpers.update(changes, this.updateColumnSet));
        const query = 
        this.pgp.helpers.update(changes, this.updateColumnSet) +
        `
        , updated_at = CURRENT_TIMESTAMP
        WHERE id = $/id/
        RETURNING
            id,
            username,
            email,
            created_at,
            updated_at
        `;
        return this.db.oneOrNone(query, {
            ...changes,
            id
        });
    }
}

module.exports = UsersRepository;