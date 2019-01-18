var express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const getUrl = require('./getUrl');

// Start Express Server
var app = express();
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

// middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// get url from form submition
// save it to the db
// generate an id for it


app.listen(port, () => {
  console.log('Node.js listening on port ' + port);
});