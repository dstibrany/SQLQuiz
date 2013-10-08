define([
    'app',
    'backbone',
    '../modules/problem_set',
    '../modules/question',
    '../modules/relation',
    '../modules/header',
    '../modules/vote'
],

function (app, Backbone, Problem_Set, Question, Relation, Header, Vote) {
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

        loadProblemSet: function(problem_set_id ) {
            this._loadApp(problem_set_id);
        },

        loadQuestion: function(problem_set_id, question_number) {
            this._loadApp(problem_set_id, question_number)
        },

        _loadApp: function(id, question_number) {
            // TODO handle bad ids
            app.state.problem_set = id;

            var questions = app.models.questions = new Question.Collection();
            var relations = app.models.relations = new Relation.Collection();

            if (question_number) questions.currentQuestion = question_number;

            var layout = app.useLayout("problemset-layout");
            layout.setViews({
                '#header': new Header.Views.Layout(),
                '#question-nav-hook': new Question.Views.Nav({
                    collection: questions
                }),
                "#relations": new Relation.Views.List({
                    collection: relations
                }),
                "#vote": new Vote.Views.Layout({
                    collection: questions
                })
            }).render();

            layout.insertViews({
                "#question": new Question.Views.Question({
                    collection: questions
                })
            });
            
            // load problem set
            $.get(app.apiRoot + '/problem_set/' + id).done(function (data) {
                relations.setURL(id);
                relations.fetch({ reset: true });
            })
    
            questions.setURL(id);
            questions.fetch({ reset: true });
        }
    });

    return Router;
});

