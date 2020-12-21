require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const connect = require('./config/db');

const port = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.send({message: 'Welcome User'})
});

// Connect to db
connect();

app.listen(port, () => {console.log(`Server running on port ${port}`)});

