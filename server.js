const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start Express Server
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

// call url.routes, passing it the app
require('./url.routes.js')(app);

// Connect to db
mongoose.connect(process.env.DB_URI, { 
  useNewUrlParser: true 
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

// Serve html file
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Listen
app.listen(port, () => {
  console.log('Node.js listening on port ' + port);
});