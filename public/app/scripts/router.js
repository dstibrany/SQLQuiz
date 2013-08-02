define([
    'app',
    'backbone',
    '../modules/problem_set',
    '../modules/question',
    '../modules/relation',
    '../modules/header'
],

function (app, Backbone, Problem_Set, Question, Relation, Header) {
    'use strict';
    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        initialize: function() {
            app.models.problem_sets = new Problem_Set.Collection();
            app.models.problem_sets.fetch({ reset: true });
        },

        routes: {
            '': 'index',
            'problem_sets': 'index',
            'problem_set/:id': 'loadProblemSet',
            'problem_set/:id/question/:questionNumber': 'loadQuestion'
        },

        index: function() {
            app.state.problem_set = null;
            
            app.useLayout("main-layout")
            .setViews({
                '#header': new Header.Views.Layout(),
                "#problem_sets": new Problem_Set.Views.Layout({
                    collection: app.models.problem_sets
                })
            })
            .render();
        },

        loadProblemSet: function(id) {
            // TODO handle bad ids
            app.state.problem_set = id;

            var questions = app.models.questions = new Question.Collection();
            var relations = app.models.relations = new Relation.Collection();

            app.useLayout("problemset-layout")
            .setViews({
                '#header': new Header.Views.Layout(),
                "#question": new Question.Views.Layout({
                    collection: questions
                }),
                "#relations": new Relation.Views.List({
                    collection: relations
                })
            })
            .render();
            
            // load problem set
            $.get(app.apiRoot + '/problem_set/' + id).done(function (data) {
                relations.setURL(id);
                relations.fetch({ reset: true });
            })
    
            questions.setURL(id);
            questions.fetch({ reset: true });
        },

        loadQuestion: function(problem_set_id, question_number) {
            // TODO handle bad ids
            app.state.problem_set = problem_set_id;

            var questions = app.models.questions = new Question.Collection();
            var relations = app.models.relations = new Relation.Collection();
            questions.currentQuestion = question_number;

            app.useLayout("problemset-layout")
            .setViews({
                '#header': new Header.Views.Layout(),
                "#question": new Question.Views.Layout({
                    collection: questions
                }),
                "#relations": new Relation.Views.List({
                    collection: relations
                })
            })
            .render();

            // load problem set
            $.get(app.apiRoot + '/problem_set/' + problem_set_id).done(function (data) {
                relations.setURL(problem_set_id);
                relations.fetch({ reset: true });
            })
    
            questions.setURL(problem_set_id);
            questions.fetch({ reset: true }); 
        }
    });

    return Router;
});

