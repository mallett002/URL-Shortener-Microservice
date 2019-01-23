const dns = require('dns');
const {
  isValidUrl,
  checkIfExistsInDb,
  getNewShortUrl,
  saveUrlDocToDatabase
} = require('./helpers');
const urlModel = require('./urlModel');

// Handle POST to "api/shorturl/new"
exports.create = (req, res) => { 
  const originalUrl = req.body.url;
  
  try {
    
     isValidUrl(originalUrl)
      
      .then((address) => {  // if valid, check if already in db  
        return checkIfExistsInDb(originalUrl); // returns {status:bool, short_url:if status}
      })
    
    .then((dbResponse) => {  // if so, send json data for already existing url
      if (dbResponse.status) {
        
        res.json({ original_url: originalUrl, short_url: dbResponse.short_url });
        res.end();

      } else { // otherwise, db does not include this url

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
    
    .then((data) => {
      res.json(data);
    });
    
  } catch(err) {
    
    res.json({ error: err, message:  "invalid URL" });
  }
};

// handl GET to "/shorturl/:shorturl
exports.goToShortUrl = (req, res) => {
  const shortUrl = req.params.shorturl;
};
