require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connect = require('./config/db');
const login = require('./routes/auth/login');
const signup = require('./routes/auth/signup');
const item = require('./routes/item/item');

const app = express();

const port = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
    res.send({message: 'Welcome User'})
});

// Connect to db
connect();

// Routes
app.use('/api/v1', login);
app.use('/api/v1', signup);
app.use('/api/v1', item);

app.listen(port, () => {console.log(`Server running on port ${port}`)});

