/* global define */

define([
    'app',
    'backbone',
    '../modules/module',
    '../modules/question'
],

function(app, Backbone, Module, Question) {
    'use strict';
    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        initialize: function() {
            // Use main layout and set Views.
            var modules = app.models.modules = new Module.Collection();
            var questions = app.models.questions = new Question.Collection();

            app.useLayout("main-layout").setViews({
                "#module": new Module.Views.Layout({
                    collection: modules
                }),
                "#question": new Question.Views.Layout({
                    collection: questions
                })
            }).render();

            modules.fetch();
            questions.fetch();
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

