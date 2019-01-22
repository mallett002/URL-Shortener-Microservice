const dns = require('dns');
const {
  checkUrl,
  checkIfExists,
  getNewShortUrl,
  saveUrlDocToDatabase
} = require('./helpers');
const urlModel = require('./urlModel');

// Handle POST to "api/shorturl/new"
exports.create = (req, res) => { 
  const originalUrl = req.body.url;
  
  // check if is valid url
  const dnsLookup = checkUrl(originalUrl);
  
  // check if already in db
  dnsLookup
    .then(() => checkIfExists(originalUrl))
    
    // if so, send json data for already existing url
  .then((dbResponse) => {
    if (dbResponse.status) {
      res.json({ original_url: originalUrl, short_url: dbResponse.short_url });
      res.end();

    } else { 
    // otherwise, db does not include this url

      // generate new short url
      const shortUrl = getNewShortUrl();

      // save the document to the db
      const urlDoc = new urlModel({
        original_url: originalUrl,
        short_url: shortUrl
      });

      return saveUrlDocToDatabase(urlDoc); // returns promise, will be passed to next "then" handler
    } 
  })
  
  // send new json response
  .then((data) => {
    res.json(data);
  })
  
  // if not valid url
  .catch(err => {
    res.json({"error":"invalid URL"});
  });
  
};

exports.goToShortUrl = (req, res) => {
  const shortUrl = req.params.shortUrl;
};