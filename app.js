const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = reuqire('cors');

dotenv.config({ path: `${__dirname}/.env` });
app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
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
