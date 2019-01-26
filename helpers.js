const dns = require('dns');
const urlModel = require('./urlModel');

function isValidUrl(url) {
  const urlWithOutProtocol = url.replace(/^(http(s)?:\/\/)/, "");
  
  return new Promise((resolve, reject) => {
    dns.lookup(urlWithOutProtocol, (err, address) => {
      if (err) reject(err);
      else resolve(address);
    });
  });
  
}

function checkIfExistsInDb(originalUrl) {
  return new Promise((resolve, reject) => {
      urlModel.findOne({ original_url: originalUrl }, (err, data) => {
        if (data === null || err) resolve({ status: false });
        else resolve({ status: true, short_url: data.short_url });
      });
    });
}


let shortUrls = [];

function getNewShortUrl() {
  let n;
  
  if (!shortUrls.length) n = 1;
  else n = shortUrls[shortUrls.length - 1] + 1;
  
  shortUrls.push(n);
  
  return String(n);
}

function saveUrlDocToDatabase(urlDoc) {
  return new Promise((resolve, reject) => {
    urlDoc.save((err, data) => {
      if (err) reject(err);
      else resolve(null, data);
    }); 
  });
}

function redirectToOriginalUrl(shortUrl) {
  return new Promise((resolve, reject) => {
    urlModel.findOne({ short_url: shortUrl }, (err, doc) => {
      if (err || doc === null) return reject (err);
      else return resolve(doc.original_url);
    });
  });
}

module.exports = {
  isValidUrl, 
  checkIfExistsInDb,
  getNewShortUrl,
  saveUrlDocToDatabase,
  redirectToOriginalUrl
};