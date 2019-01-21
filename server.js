const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start Express Server
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(process.cwd() + '/public'));

// call url.routes, passing it the app
require('./url.routes.js')(app);

// connect to database
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

// Serve html file
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Listen
app.listen(port, () => {
  console.log('Node.js listening on port ' + port);
});