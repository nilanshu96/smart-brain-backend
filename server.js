const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
let knex;

const { DB_USER, DB_PASSWORD, DB_NAME, PORT, NODE_ENV } = process.env;

if (NODE_ENV === 'development') {
    knex = require('knex')({
        client: 'pg',
        connection: {
            host: '127.0.0.1',
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

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res, next) => {
    res.send('work in progress');
})

app.post('/register', register.handleRegister(knex, bcrypt));

app.post('/signin', signin.handleSignIn(knex, bcrypt));

app.get('/profile/:id', profile.handleProfileGet(knex));

app.put('/image', image.handleImage(knex));

app.post('/imageurl', image.handleImageUrl);

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})