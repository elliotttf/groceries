/**
 * @fileoverview Backbone definitions for lists.
 */
(function($) {

  /**
   * Override sync behavior.
   */
  Backbone.sync = function(method, model, options) {
    if (!(model instanceof List)) {
      return;
    }
  };

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
   * Defines an item view.
   */
  var ItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'change .check-item': 'updateStatus',
    },
    template: _.template($('#item-template').html()),
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));

      return this;
    },
    updateStatus: function(e) {
      this.model.set('inBasket', e.currentTarget.checked);
      listView.updateRemaining();
    },
  });

  /**
   * Defines the list.
   */
  var List = Backbone.Model.extend({
    initialize: function() {
      this.items = new Items();
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
   * Defines the list view.
   */
  var ListView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#list-template').html()),
    events: {
      'click #add-item': 'addNewItem',
      'click #save-list': 'saveList',
      'click #delete-list': 'deleteList',
    },
    initialize: function() {
      this.model.items.bind('add', this.addOne, this);
      this.model.items.bind('reset', this.addAll, this);
    },
    render: function() {
      $(this.el).html(this.template({
        total: this.model.items.length,
        remaining: this.model.remaining(),
      }));
      return this;
    },
    addOne: function(item) {
      var view = new ItemView({ model: item });
      $('#list').append(view.render().el);
    },
    addAll: function() {
      var self = this;
      self.model.items.each(function(item) {
        self.addOne(item);
      });
    },
    updateCount: function() {
      this.updateTotal();
      this.updateRemaining();
    },
    updateTotal: function() {
      $('#list-total').html(this.model.items.length);
    },
    updateRemaining: function() {
      $('#list-remaining').html(this.model.remaining());
    },
    addNewItem: function(e) {
      var newItem = new Item({
        id: list.items.length,
        name: $('#new-item').val(),
        type: $('#new-item-cat').val(),
      });
      list.items.add(newItem);
      this.updateCount();

      $('#new-item').val('');
      $('#new-item-cat').val('');

      return false;
    },
    saveList: function() {
      this.model.save();
    }
  });

  var list = window.list = new List();
  var listView = window.listView = new ListView({
    model: list
  });

  listView.render();
})(jQuery);
