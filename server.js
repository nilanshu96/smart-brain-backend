const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

const knex = require('./database/postgres-client');
const { requireAuth } = require('./middlewares/authorization');

const { PORT, NODE_ENV } = process.env;


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

if (NODE_ENV === 'development') {
    app.use(morgan('combined'));
}

app.use(express.json());
app.use(cors());

app.get('/', (req, res, next) => {
    res.send('hello');
})

app.post('/register', register.handleRegister(knex, bcrypt));

app.post('/signin', signin.signinAuthentication(knex, bcrypt));

app.get('/signout', signout.handleSignOut);

app.get('/profile/:id', requireAuth, profile.handleProfileGet(knex));

app.post('/profile/:id', requireAuth, profile.handleProfileEdit(knex));

app.put('/image', requireAuth, image.handleImage(knex));

app.post('/imageurl', requireAuth, image.handleImageUrl);

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})