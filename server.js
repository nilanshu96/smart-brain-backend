const express = require('express');
const cors = require('cors');
// const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '1',
            name: 'John',
            email: 'john@email.com',
            password: 'berry',
            entries: 0,
            createdAt: new Date()
        }
    ]
}

app.get('/', (req, res, next) => {
    res.send(database.users);
})

app.post('/register', (req, res, next) => {

    const newUser = {
        id: '2',
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        entries: 0,
        createdAt: new Date()
    }

    database.users.push(newUser);

    const newUserResponse = {...newUser};
    delete newUserResponse.password;

    res.send(newUserResponse);
})

app.post('/signin', (req, res, next) => {

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('signin failed');
    }
})

app.get('/profile/:id', (req, res) => {

    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });

    if (!found) {
        res.status(400).send('user not found');
    }
})

app.put('/image', (req, res) => {

    const { id } = req.body;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })

    if (!found) {
        res.status(400).json('user not found');
    }

})

app.listen(3000, () => {
    console.log('listening to port 3000');
})