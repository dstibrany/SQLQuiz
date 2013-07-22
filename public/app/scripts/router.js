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
            var modules   = app.models.modules   = new Module.Collection();
            var questions = app.models.questions = new Question.Collection();
            var relations = app.models.relations = new Relation.Collection();

            var main = app.useLayout("main-layout");
            $('#main').append(main.$el)
            
            main.setViews({
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
        },

        routes: {
            '': 'index',
            'module/:id': 'loadModule',
            'module/:id/question/:questionNumber': 'loadQuestion'
        },

        index: function() {
            console.log('index route');
        },

        loadModule: function(id) {
            // TODO handle bad ids
            app.state.module = id; 
            
            $.get('/module/' + id).done(function (data) {
                app.models.relations.setURL(id);
                app.models.relations.fetch({ reset: true });
            })
    
            app.models.questions.setURL(id);
            app.models.questions.fetch({ reset: true });
        },

        loadQuestion: function(module_id, question_number) {
            // TODO handle bad ids
            app.state.module = module_id;
            app.models.questions.setURL(module_id);
            app.models.questions.fetch({ silent: true }).done(function() {
                app.models.questions.trigger('reset', +question_number);
            });
            app.models.relations.setURL(module_id);
            app.models.relations.fetch();  
        }
    });

    return Router;
});

