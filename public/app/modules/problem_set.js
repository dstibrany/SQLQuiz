define([
  "app"
],

function (app) {

    var Problem_Set = app.module();

    Problem_Set.Model = Backbone.Model.extend({});

    Problem_Set.Collection = Backbone.Collection.extend({
        model: Problem_Set.Model,
        url: app.apiRoot + '/problem_set'
    });

    Problem_Set.Views.Layout = Backbone.Layout.extend({
        template: "problem_set",

        events: {
            "click .problem_set": function(e) {
                var $target = $(e.target).closest('li');
                var id = $target.data('id');
                Backbone.history.navigate('problem_set/' + id, true);
            }
        },

        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
        },

        serialize: function() {
            return this.collection.toJSON();
        },

        afterRender: function() {
            this.collection.each(function (problem_set, i) {
                this.$('.rating').eq(i).rateify({
                    readOnly: problem_set.get('rating')
                })
            }, this);
        }
    });

    return Problem_Set;
});
