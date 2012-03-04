(function($) {
  /**
   * Override sync behavior.
   */
  Backbone.sync = function(method, model, options) {
    if (!(model instanceof List)) {
      return;
    }
    if (method == 'create') {
      $.ajax({
        url: 'app',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(model.toJSON()),
        dataType: 'json',
        success: function(data) {
          if (data.status == 'ok') {
            model.set(data.list);
          }
          else {
            alert('huh?');
          }
        },
      });
    }
    else if (method == 'update') {
      $.ajax({
        url: 'app/' + model.id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(model.toJSON()),
        dataType: 'json',
        success: function(data) {
          if (data.status == 'ok') {
            model.set(data.list);
          }
          else {
            alert('huh?');
          }
        },
      });
    }
  };

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
    },
    deleteList: function() {
    }
  });

  var list = window.list = new window.List();
  var listView = window.listView = new ListView({
    model: list
  });

  listView.render();
})(jQuery);
