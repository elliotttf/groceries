var settings = require('./local');
var flatiron = require('flatiron');
var path = require('path');
var app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

app.use(require('./plugins/list'));

app.init(function(err) {
  if (err) {
    console.error(err);
  }
});

/**
 * Gets the latest list.
 */
app.router.get('/', function () {
  var self = this;
  app.load(false, function(err, list) {
    if (err) {
      self.res.writeHead(404, { 'Content-Type': 'application/json' });
      self.res.json({ status: 'Unknown list.' });
      return;
    }
    self.res.json({ status: 'ok', list: list });
  });
});

/**
 * Saves a new list.
 */
app.router.post('/', function() {
  var self = this;
  app.save(self.req.body, function(err, list) {
    if (err) {
      self.res.writeHead(500, { 'Content-Type': 'application/json' });
      self.res.json({ status: 'Error saving.' });
    }
    self.res.json({ status: 'ok', list: list });
  });
});


/**
 * Updates a list.
 */
app.router.put('/:id', function(id) {
  var self = this;
  app.save(self.req.body, function(err, list) {
    if (err) {
      self.res.writeHead(500, { 'Content-Type': 'application/json' });
      self.res.json({ status: 'Error saving.' });
    }
    self.res.json({ status: 'ok', list: list });
  });
});

app.start(settings.port);

