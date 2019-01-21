module.exports = (app) => {
  const urls = require('./urlController');
  
  // Create a new Url
  app.post('api/shorturl/new', urls.create);
  
  // Retrieve a single url
  app.get('/:shortUrl', urls.retrieve);
};