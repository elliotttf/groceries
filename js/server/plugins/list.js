/**
 * @fileoverview Server side list.
 */

var Backbone = require('backbone');
var settings = require('../local');
var mongous = require('mongous');
var db = new mongous.Mongous('list.lists');
var ObjectID = require('../../node_modules/mongous/bson/objectid')

exports.attach = function(options) {
  this.load = function(id, callback) {
    if (id) {
      // TODO
    }
    else {
      db.find({}, function(reply) {
        if (reply.documents.length == 0) {
          callback(false, {});
          return;
        }
        // NOTE - mongous doesn't support sorting natively :(
        reply.documents.sort(function(a, b) {
          if (a.changed > b.changed) {
            return -1;
          }
          else if (a.changed < b.changed) {
            return 1;
          }
          return 0;
        });

        // Massage the data a bit.
        reply.documents[0].id = reply.documents[0]._id;
        delete reply.documents[0]._id;
        reply.documents[0];

        callback(false, reply.documents[0]);
      });
    }
  };

  this.save = function(data, callback) {
    // Tag the save time.
    data.changed = new Date();

    // Make this a mongo id again.
    if (typeof data.id !== 'undefined') {
      data._id = new ObjectID.ObjectID(data.id);
      delete data.id;
      if (!db.update({ _id: data._id }, data)) {
        callback(true);
        return;
      }
      data.id = data._id;
      delete data._id;
      callback(false, data);
      return;
    }
    else {
      if (!db.insert(data)) {
        callback(true);
        return;
      }
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
