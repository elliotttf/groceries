var _ = require('lodash');
var config = require('./config');
var ObjectID = require('../node_modules/mongous/bson/objectid')

var coll = config.db.db + '.' + config.db.collection;
var db = require('mongous').Mongous;
db().open(config.db.host, config.db.port);
var auth = function (cb) {
  cb();
};

if (!_.isEmpty(config.db.username) && !_.isEmpty(config.db.password)) {
  auth = function (cb) {
    db(coll).auth(config.db.username, config.db.password, function (err) {
      cb(err);
    });
  };
}

module.exports = {
  auth: auth,
  load: function (id, cb) {
    db('list.lists').find({}, function (reply) {
      if (reply.documents.length == 0) {
        cb(false, {});
        return;
      }
      // NOTE - mongous doesn't support sorting natively :(
      reply.documents.sort(function (a, b) {
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

      cb(false, reply.documents[0]);
    });
  },
  save: function (data, cb) {
    // Tag the save time.
    data.changed = new Date();

    // Make this a mongo id again.
    if (typeof data.id !== 'undefined') {
      data._id = new ObjectID.ObjectID(data.id);
      delete data.id;
      if (!db('list.lists').update({ _id: data._id }, data)) {
        cb(true);
        return;
      }
      data.id = data._id;
      delete data._id;
      cb(false, data);
      return;
    }
    else {
      if (!db('list.lists').insert(data)) {
        cb(true);
        return;
      }
    }
    // HACK :(
    db('list.lists').find(1, { changed: data.changed }, function (reply) {
      if (typeof reply.documents[0] !== 'undefined') {
        // Massage the reply a bit...
        reply.documents[0].id = reply.documents[0]._id;
        delete reply.documents[0]._id;
        cb(false, reply.documents[0]);
      }
      else {
        cb(true);
      }
    });
  }
};

