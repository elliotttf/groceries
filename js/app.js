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
            model.items.reset(data.list.items);
          }
          else {
            alert('huh?');
          }
        },
      });
    }
    else if (method == 'read') {
      $.ajax({
        url: 'app',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          if (data.status == 'ok') {
            model.set(data.list);
            model.items.reset(data.list.items);
          }
          else if (typeof model.id === 'undefined') {
            model.set(model.defaults);
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
            model.items.reset(data.list.items);
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
      'click .remove-button': 'removeItem',
    },
    template: _.template($('#item-template').html()),
    initialize: function() {
      this.model.view = this;
    },
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    updateStatus: function(e) {
      $('#label-item' + this.model.id).toggleClass('checked');
      this.model.set('inBasket', e.currentTarget.checked);
      listView.updateRemaining();
      list.save();
    },
    removeItem: function(e) {
      list.items.remove(this.model);
      return false;
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
      'click #new-list': 'newList',
    },
    initialize: function() {
      this.model.items.bind('add', this.addOne, this);
      this.model.items.bind('remove', this.removeOne, this);
      this.model.items.bind('reset', this.addAll, this);
      this.model.items.bind('reset', this.updateTotal, this);
      this.model.items.bind('reset', this.updateRemaining, this);
      this.model.bind('change', this.toggleListButtons, this);
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
      if (item.get('inBasket')) {
        $('#check-item' + item.id).attr('checked', true);
        $('#label-item' + item.id).addClass('checked');
      }

    },
    removeOne: function(item) {
      $(item.view.el).remove();
    },
    addAll: function() {
      var self = this;
      $('#list').html('');
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
        id: _.uniqueId(),
        name: $('#new-item').val(),
        type: $('#new-item-cat').val(),
      });
      list.items.add(newItem);
      this.updateCount();

      $('#new-item').val('');
      $('#new-item-cat').val('');

      return false;
    },
    toggleListButtons: function() {
      if (typeof this.model.id !== 'undefined') {
        $('#new-list').show();
      }
      else {
        $('#new-list').hide();
      }
    },
    newList: function() {
      this.model.clear({ silent: true });
      this.model.items.reset();
      this.toggleListButtons();
      return false;
    },
  });

  var list = window.list = new window.List();
  list.fetch();
  var listView = window.listView = new ListView({
    model: list
  });

  listView.render();
})(jQuery);
