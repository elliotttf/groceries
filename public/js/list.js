/**
 * @fileoverview Backbone definitions for lists.
 */

if (typeof require !== 'undefined') {
  var Backbone = require('backbone');
}

/**
 * Defines a list item.
 */
var Item = Backbone.Model.extend({
  defaults: {
    name: 'beer',
    type: 'adult beverage',
    inBasket: false,
  },
});

/**
 * Defines an items collection.
 */
var Items = Backbone.Collection.extend({
  model: Item,
});

/**
 * Defines the list.
 */
var List = Backbone.Model.extend({
  initialize: function() {
    this.items = new Items();
    this.items.bind('add', this.update, this);
    this.items.bind('remove', this.update, this);
  },
  update: function() {
    this.save();
  },
  toJSON: function() {
    var json = _.clone(this.attributes);
    json.items = this.items.toJSON();
    return json;
  },
  /**
   * Returns the number of remaining items on the list.
   */
  remaining: function() {
    remaining = this.items.length;
    this.items.each(function(item) {
      if (item.get('inBasket')) {
        remaining--;
      }
    });
    return remaining;
  }
});

/**
 * Export the definitions to the proper scope.
 */
if (typeof exports === 'undefined') {
  var exp = window;
}
else {
  var exp = exports;
}
exp.Item = Item;
exp.Items = Items;
exp.List = List;

