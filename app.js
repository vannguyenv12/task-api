const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config({ path: `${__dirname}/.env` });
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// API DOCUMENTS

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// ROUTER
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const authRouter = require('./routes/auth');

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/auth', authRouter);

// Not found routes
const notFound = require('./utils/not-found');

app.use(notFound);

module.exports = app;
