require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connect = require('./config/db');
const login = require('./routes/auth/login');
const signup = require('./routes/auth/signup');
const item = require('./routes/item/item');
const cart = require('./routes/cart/cart');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Gebeya E-commerce API',
      version: '1.0.0',
      description: 'Gebeya E-commerce API',
    },
    components: {
      securitySchemes: {
        Auth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Api authentication token',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['routes/auth/*.js', 'routes/item/*.js', 'routes/cart/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 5000;
const baseUrl = '/api/v1';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.send({message: 'Welcome User'});
});

// Connect to db
connect();

// Routes
app.use(baseUrl, login);
app.use(baseUrl, signup);
app.use(baseUrl, item);
app.use(baseUrl, cart);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
