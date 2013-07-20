define([
  "app",
  "../modules/results"
],

function(app, Results) {

    var Question = app.module();

    Question.Model = Backbone.Model.extend({});

    Question.Collection = Backbone.Collection.extend({
        model: Question.Model,

        url: '/modules/1/questions', // 1 is just a placeholder and will be dynamically replaced
        currentQuestion: 1,

        initialize: function() {
            this.on('reset', function (question_number) {
                question_number = typeof question_number === 'number' ? question_number : 1;
                this.currentQuestion = question_number;
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
        },

        setURL: function(module_id) {
            this.url = this.url.replace(/\d+/, module_id);
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
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'change:question', this.changeRoute);
        },

        beforeRender: function() {
            if (this.collection.length) {
                this.insertView(new Question.Views.Item({
                    model: this.collection.at(this.collection.currentQuestion - 1)
                }));
            }
        },

        serialize: function() {
            var questions = [];
            for (var i = 1, len = this.collection.length; i <= len; i++ ) {
                questions.push({
                    questionNumber: i,
                    isActive: i === this.collection.currentQuestion ? true : false,
                    correct: this.collection.at(i - 1).get('correct')
                })
            }
            return questions;
        },

        changeRoute: function() {
            var route = '/module/' + app.state.module + '/question/' + this.collection.currentQuestion;
            Backbone.history.navigate(route);
            this.render();
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
                this.collection.selectQuestion($(e.target).text());
            }
        }
    });

    Question.Views.Item = Backbone.View.extend({
        template: 'question',
        className: 'question-item',

        events: {
            'click #submit-answer': 'submitAnswer'
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
                realAnswer: this.model.get('answer')
            })
            
        }
    });


    return Question;
});
