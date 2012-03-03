/**
 * @fileoverview Server side list.
 */

var Backbone = require('backbone');
var settings = require('../local');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var List = require('../../list');

      var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
      var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;


Backbone.sync = function(method, model, options) {
  if (!(model instanceof List.List)) {
    return;
  }
  var db = new Db(
    'list',
    new Server(
      settings.db.host,
      (typeof settings.db.port === 'undefined') ? Connection.DEFAULT_PORT : settings.db.port,
      {}
    ),
    { native_parser: ture}
  );

  if (method === 'read') {
  }
};

exports.attach = function(options) {
  this.load = function(id, callback) {
    
  };
};

exports.init = function(done) {
  return done();
};
