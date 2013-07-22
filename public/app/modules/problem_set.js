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

        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
        },

        serialize: function() {
            return this.collection.toJSON();
        }
    });

    return Problem_Set;
});
