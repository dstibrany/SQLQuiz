define([
  "app"
],

function (app) {

    var Vote = app.module();

    Vote.Views.Layout = Backbone.View.extend({
        className: 'alert alert-block vote',
        template:  'vote',

        initialize: function() {
            this.listenTo(this.collection, 'all_correct', function (m) {
                this.show();
            }, this);

        },

        afterRender: function() {
            this.$('.rating').rateify({
            
            })
        },

        show: function() {
            this.$el.removeClass('hide');
        }

    });

    return Vote;
});
