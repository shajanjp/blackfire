const config = require('./config/env');
const mongoose = require('./config/mongoose');
const express = require('./config/express');

mongoose();
const app = express();

app.listen(config.app.port, () => {
  console.log(`Server started at http://localhost:${config.app.port} using ${process.env.NODE_ENV || 'default'} config file`);
});
