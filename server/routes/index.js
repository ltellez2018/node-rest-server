// * R E Q U I R E S
const express = require('express');
const app = express();

// * R O U T E S
app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;