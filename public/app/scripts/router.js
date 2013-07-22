define([
    'app',
    'backbone',
    '../modules/problem_set',
    '../modules/question',
    '../modules/relation'
],

function (app, Backbone, Problem_Set, Question, Relation) {
    'use strict';
    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        initialize: function() {
            var problem_sets = app.models.problem_sets = new Problem_Set.Collection();
            var questions    = app.models.questions    = new Question.Collection();
            var relations    = app.models.relations    = new Relation.Collection();

            var main = app.useLayout("main-layout");
            $('#main').append(main.$el)
            
            main.setViews({
                "#problem_set": new Problem_Set.Views.Layout({
                    collection: problem_sets
                }),
                "#question": new Question.Views.Layout({
                    collection: questions
                }),
                "#relations": new Relation.Views.List({
                    collection: relations
                })
            }).render();

            problem_sets.fetch();
        },

        routes: {
            '': 'index',
            'problem_set/:id': 'loadProblemSet',
            'problem_set/:id/question/:questionNumber': 'loadQuestion'
        },

        index: function() {
            console.log('index route');
        },

        loadProblemSet: function(id) {
            // TODO handle bad ids
            app.state.module = id; 
            
            // load problem set
            $.get(app.apiRoot + '/problem_set/' + id).done(function (data) {
                app.models.relations.setURL(id);
                app.models.relations.fetch({ reset: true });
            })
    
            app.models.questions.setURL(id);
            app.models.questions.fetch({ reset: true });
        },

        loadQuestion: function(problem_set_id, question_number) {
            // TODO handle bad ids
            app.state.module = problem_set_id;
            app.models.questions.setURL(problem_set_id);
            app.models.questions.fetch({ silent: true }).done(function() {
                app.models.questions.trigger('reset', +question_number);
            });
            app.models.relations.setURL(problem_set_id);
            app.models.relations.fetch();  
        }
    });

    return Router;
});

