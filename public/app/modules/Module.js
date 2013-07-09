define([
  "app"
],

function(app) {

    var Module = app.module();

    Module.Model = Backbone.Model.extend({});

    Module.Collection = Backbone.Collection.extend({
        model: Module.Model,
        url: '/modules'
    });

    Module.Views.Layout = Backbone.Layout.extend({
        template: "module",

        initialize: function() {
            this.collection.on('reset', this.render, this);
        },

        serialize: function() {
            return this.collection.toJSON();
        }
    });

    return Module;
});
