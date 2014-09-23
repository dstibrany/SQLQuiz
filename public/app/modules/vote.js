define([
  "app"
],

function (app) {

    var Vote = app.module();

    Vote.Views.Layout = Backbone.View.extend({
        className: 'alert alert-block vote',
        template:  'vote',

        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);

            this.listenTo(this.collection, 'all_correct', function (m) {
                this.$el.css('display', 'block');
            }, this);
        },

        afterRender: function() {
            this.$('.rating').rateify({
                url: '/api/vote/'
                     + this.collection.at(this.collection.getCurrentQuestion()).get('problem_set_id')
            })
        }
    });

    return Vote;
});
