// Module module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

    // Create a new module.
    var Module = app.module();

    // Default Model.
    Module.Model = Backbone.Model.extend({});

    // Default Collection.
    Module.Collection = Backbone.Collection.extend({
        model: Module.Model,
        url: '/modules'
    });

    // Default View.
    Module.Views.Layout = Backbone.Layout.extend({
        template: "module",

        initialize: function() {
            this.collection.on('reset', this.render, this);
        },

        serialize: function() {
            return this.collection.toJSON();
        }
    });

    // Return the module for AMD compliance.
    return Module;

});
