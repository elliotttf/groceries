var settings = require('./local');
var flatiron = require('flatiron');
var path = require('path');
var app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

app.use(require('./plugins/list'));

app.init(function(err) {
});

app.router.get('/', function () {
  this.res.json({ 'hello': 'world' })
});
app.router.get('/:list', function(listId) {
  app.load(listId, function(err, list) {
    if (err) {
      this.res.writeHead(404, { 'Content-Type': 'text/plain' });
      this.res.json({ status: 'Unknown list.' });
      return;
    }
    this.res.json({ status: 'ok', list: list });
  });
});

app.start(settings.port);
