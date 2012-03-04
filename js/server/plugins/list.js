/**
 * @fileoverview Server side list.
 */

var Backbone = require('backbone');
var settings = require('../local');
var mongous = require('mongous');
var db = new mongous.Mongous('list.lists');
var List = require('../../list');

Backbone.sync = function(method, model, options) {
  if (!(model instanceof List.List)) {
    return;
  }
  if (method === 'read') {
    db.find(1, { id: model.id }, function(reply) {
      if (typeof reply.documents !== 'undefined' && typeof reply.documents[0] !== 'undefined') {
        options.success(reply.documents[0], true);
      }
      else {
        options.error(404);
      }
    });
  }
};

exports.attach = function(options) {
  this.load = function(id, callback) {
    var model = new List.List({ id: id });
    model.fetch({
      succes: function(loadedModel) {
        callback(false, model.toJSON());
      },
      error: function(error) {
        callback(error, null);
      }
    })
  };

  this.save = function(data, callback) {
    // Make this a mongo id again.
    if (typeof data.id !== 'undefined') {
      data._id = data.id;
      delete data.id;
    }
    // Tag the save time.
    data.changed = new Date();
    if (!db.save(data)) {
      callback(true);
      return;
    }
    // HACK :(
    db.find(1, { changed: data.changed }, function(reply) {
      if (typeof reply.documents[0] !== 'undefined') {
        // Massage the reply a bit...
        reply.documents[0].id = reply.documents[0]._id;
        delete reply.documents[0]._id;
        callback(false, reply.documents[0]);
      }
      else {
        callback(true);
      }
    });
  };
};

exports.init = function(done) {
  db.open(settings.db.host);
  return done();
};
