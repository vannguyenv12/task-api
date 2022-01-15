const mongoose = require('mongoose');
const express = require('express');
const app = require('./app');


// LISTEN SERVER
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connect DB'))
  .catch((e) => console.log(e));

app.listen(port, () => console.log(`Connect to port ${port}`));
