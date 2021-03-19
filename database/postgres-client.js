const { DB_USER, DB_HOST, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;

let knex;

if (NODE_ENV === 'development') {
    knex = require('knex')({
        client: 'pg',
        connection: {
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        }
    });
} else if (NODE_ENV === 'production') {
    knex = require('knex')({
        client: 'pg',
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        }
    });
}

module.exports = knex;