const { QueryFile } = require('pg-promise');
const { join } = require('path');

module.exports = {
    users: {
        add: sql('users/add.sql'),
        findByNameOrEmail: sql('users/findByNameOrEmail.sql'),
        findById: sql('users/findById.sql'),
        delete: sql('users/delete.sql'),
        findByUsername: sql('users/findByUsername.sql')
    },
    posts: {
        add: sql('posts/add.sql'),
        view: sql('posts/view.sql'),
        update: sql('posts/update.sql'),
        delete: sql('posts/delete.sql')
    }
};

function sql(file) {

    const fullPath = join(__dirname, file);

    const options = {
        minify: true
    };

    const qf = new QueryFile(fullPath, options);

    if (qf.error) {
        console.error(qf.error);
    }

    return qf;
}