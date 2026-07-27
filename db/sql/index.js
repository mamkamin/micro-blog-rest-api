const { QueryFile } = require('pg-promise');
const { join } = require('path');

module.exports = {
    users: {
        add: sql('users/add.sql'),
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