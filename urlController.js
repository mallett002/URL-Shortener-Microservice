const dns = require('dns');
const {
  isValidUrl,
  checkIfExistsInDb,
  getNewShortUrl,
  saveUrlDocToDatabase,
  redirectToOriginalUrl
} = require('./helpers');
const urlModel = require('./urlModel');

// Handle POST to "api/shorturl/new"
exports.create = (req, res) => { 
  const originalUrl = req.body.url;
  let newShortUrl;
    
   const dnsLookup = isValidUrl(originalUrl)

   dnsLookup
    .then(() => {  // if valid, check if already in db  
      return checkIfExistsInDb(originalUrl); // returns {status:bool, short_url:if status}
    })

  .then((dbResponse) => {  // if so, send json data for already existing url
    if (dbResponse.status) {
      return res.json({ original_url: originalUrl, short_url: dbResponse.short_url });

    } else { // otherwise, db does not include this url

      // generate new short url
     newShortUrl = getNewShortUrl();

      // save the document to the db
      const urlDoc = new urlModel({
        original_url: originalUrl,
        short_url: newShortUrl
      });

      return saveUrlDocToDatabase(urlDoc); // returns promise, will be passed to next "then" handler
    } 
  })

  .then((original_url) => {
     return res.json({ original_url: originalUrl, short_url: newShortUrl });
   });
  
  dnsLookup.catch((reason) => {
    return res.json({ error: "invalid URL" });
  });
};

// handle GET to "/shorturl/:shorturl
exports.goToShortUrl = (req, res) => {
  const shortUrl = req.params.shorturl;
  
  // find the original url from given short url
  const redirectPromise = redirectToOriginalUrl(shortUrl); 
  
  redirectPromise
    .then((original_url) => {
      return res.redirect(original_url);
    })
  
  redirectPromise
    .catch(reason => {
      return res.json({error: "invalid URL"});
    });
};
