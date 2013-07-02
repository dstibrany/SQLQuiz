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
    Module.Model = Backbone.Model.extend({

    });

    // Default Collection.
    Module.Collection = Backbone.Collection.extend({
        model: Module.Model,
        url: '/module'
    });

    // Default View.
    Module.Views.Layout = Backbone.Layout.extend({
        template: "Module"
    });

    // Return the module for AMD compliance.
    return Module;

});
