/* global define */

define([
    'app',
    'backbone',
    '../modules/Module'
],

function(app, Backbone, Module) {
    'use strict';
    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        initialize: function() {
            // Use main layout and set Views.
            var modules = window.modules = new Module.Collection();

            app.useLayout("main-layout").setViews({
                "#module": new Module.Views.Layout()
            }).render();

            modules.fetch();
        },

        routes: {
            '': 'index'
        },

        index: function() {
            console.log('index route');
        }
    });

    return Router;

});

