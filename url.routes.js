module.exports = (app) => {
  const urls = require('./urlController');
  
  // Greeting api
  app.get("/api/hello", urls.greeting);
  
  // Create a new Url
  app.post('api/shorturl/new', urls.create);
  
  // Retrieve a single url
  app.get('/api/shorturl/:shortUrl', urls.goToShortUrl);
};