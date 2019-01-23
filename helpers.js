const dns = require('dns');
const urlModel = require('./urlModel');


function isValidUrl(url) {
  const urlWithOutProtocol = url.replace(/^(http(s)?:\/\/)/, "");
  
  dns.lookup(urlWithOutProtocol, (err, address) => {
    return err ? false : true;
  });
}

function checkIfExists(originalUrl) {
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

module.exports = {
  isValidUrl, 
  checkIfExists,
  getNewShortUrl,
  saveUrlDocToDatabase
};