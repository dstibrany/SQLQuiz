define([
    'app',
    'backbone',
    '../modules/module',
    '../modules/question',
    '../modules/relation'
],

function (app, Backbone, Module, Question, Relation) {
    'use strict';
    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        initialize: function() {
            var modules = app.models.modules = new Module.Collection();
            var questions = app.models.questions = new Question.Collection();
            var relations = app.models.relations = new Relation.Collection();

            app.useLayout("main-layout").setViews({
                "#module": new Module.Views.Layout({
                    collection: modules
                }),
                "#question": new Question.Views.Layout({
                    collection: questions
                }),
                "#relations": new Relation.Views.List({
                    collection: relations
                })
            }).render();

            modules.fetch();
            questions.fetch();
            relations.fetch();
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

