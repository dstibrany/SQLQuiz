define([
  "app",
  "../modules/results"
],

function(app, Results) {

    var Question = app.module();

    Question.Model = Backbone.Model.extend({});

    Question.Collection = Backbone.Collection.extend({
        model: Question.Model,
        url: '/modules/1/questions',
        currentQuestion: 1,

        initialize: function() {
            this.on('reset', function() {
                this.currentQuestion = 1;
            }, this);
        },

        selectQuestion: function(questionNum) {
            this.currentQuestion = questionNum;
            this.trigger('change:question');
        },

        nextQuestion: function() {
            this.currentQuestion = ++this.currentQuestion % (this.length + 1) || 1;
            this.trigger('change:question');
        },

        prevQuestion: function() {
            this.currentQuestion = --this.currentQuestion % (this.length + 1) || this.length;
            this.trigger('change:question');
        }
    });

    Question.Views.Item = Backbone.View.extend({
        template: 'question',

        events: {
            'click #submit-answer': 'submitAnswer'
        },

        initialize: function() {
        },

        beforeRender: function() {
            this.setView('#results-hook', new Results.Views.Layout({
                model: new Results.Model({
                    id: this.model.get('id')
                })
            }));
        },

        serialize: function() {
            return this.model.toJSON();
        },
        
        submitAnswer: function() {
            app.trigger('submit:answer', {
                userAnswer: this.$('textarea').val(),
                realAnswer: this.getModel().get('answer')
            })
            
        }
    });

    Question.Views.Layout = Backbone.View.extend({
        template: 'questionlayout',
        className: 'question-layout',

        events: {
            'click .next': 'nextQuestion',
            'click .previous': 'prevQuestion',
            'click .pagination a': 'selectQuestion'
        },

        initialize: function() {
            this.collection.on('reset', this.render, this);
            this.collection.on('change:question', this.render, this);
        },

        beforeRender: function() {
            if (this.collection.length) {
                this.setView('#question-hook', new Question.Views.Item({
                    model: this.collection.at(this.collection.currentQuestion - 1)
                }));
            }
        },

        serialize: function() {
            var questions = [];
            for (var i = 1, len = this.collection.length; i <= len; i++ ) {
                questions.push({
                    questionNumber: i,
                    isActive: i === this.collection.currentQuestion ? true : false
                })
            }
            return questions;
        },

        nextQuestion: function(e) {
            e.preventDefault();
            this.collection.nextQuestion();
        },

        prevQuestion: function(e) {
            e.preventDefault();
            this.collection.prevQuestion();
        },

        selectQuestion: function(e) {
            e.preventDefault();
            var $parent = $(e.target).parent();
            if (!$parent.hasClass('previous') && !$parent.hasClass('next')) {
                this.collection.selectQuestion(+$(e.target).text());
            }
        }
    })

    return Question;
});