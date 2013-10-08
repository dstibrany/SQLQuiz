define([
  "app",
  "ace",
  "../modules/results"
],

function(app, ace, Results) {

    var Question = app.module();

    Question.Model = Backbone.Model.extend({});

    Question.Collection = Backbone.Collection.extend({
        model: Question.Model,

        // '1' is just a placeholder and will be dynamically replaced
        url: app.apiRoot + '/problem_set/1/questions', 
        
        currentQuestion: 1,

        hover: false,

        getCurrentQuestion: function() {
            return +this.currentQuestion;
        },

        selectQuestion: function(questionNum) {
            this.currentQuestion = questionNum;
            this.trigger('change:question');
        },

        nextQuestion: function() {
            this.currentQuestion = (this.getCurrentQuestion() + 1) % (this.length + 1) || 1;
            this.trigger('change:question');
        },

        prevQuestion: function() {
            this.currentQuestion = (this.getCurrentQuestion() - 1) % (this.length + 1) || this.length;
            this.trigger('change:question');
        },

        setURL: function(problem_set_id) {
            this.url = this.url.replace(/\d+/, problem_set_id);
        }
    });

    Question.Views.Nav = Backbone.View.extend({
        template: 'questionnav',
        className: 'question-nav',

        events: {
            'click .next': 'nextQuestion',
            'click .previous': 'prevQuestion',
            'click .pagination a': 'selectQuestion',
            'mouseover .fui-arrow-left': function(e) {
                $(e.target).removeClass('hover-prev');
            },
            'mouseover .fui-arrow-right': function(e) {
                $(e.target).removeClass('hover-next');
            }
        },

        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'change:question', this.changeRoute);
        },

        afterRender: function() {
            this.collection.hover = false;
        },

        serialize: function() {
            var questions = [];

            if (!this.collection.length) questions.empty = true;

            for (var i = 1, len = this.collection.length; i <= len; i++) {
                questions.push({
                    questionNumber: i,
                    isActive: i === this.collection.getCurrentQuestion() ? true : false,
                    correct: this.collection.at(i - 1).get('correct')
                })
            }

            if (this.collection.hover === 'prev') {
                questions.hoverPrev = true;
            } else if (this.collection.hover === 'next') {
                questions.hoverNext = true;
            }

            return questions;
        },

        changeRoute: function() {
            var route = '/problem_set/' 
                        + app.state.problem_set 
                        + '/question/' 
                        + this.collection.getCurrentQuestion();
            Backbone.history.navigate(route);
            this.render();
        },

        nextQuestion: function(e) {
            e.preventDefault();
            this.collection.hover = 'next';
            this.collection.nextQuestion();
        },

        prevQuestion: function(e) {
            e.preventDefault();
            this.collection.hover = 'prev';
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

    Question.Views.Question = Backbone.View.extend({
        template: 'question',
        className: 'question-item',

        events: {
            'click #submit-answer': 'submitAnswer',
            'click #btn-next': 'nextQuestion'
        },

        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'change:question', this.render);
        },

        beforeRender: function() {
            this.model = this.collection.at(this.collection.getCurrentQuestion() - 1);
            this.setView('#results-hook', new Results.Views.Layout({
                model: new Results.Model({
                    id: this.model.get('id')
                }),
                ace: ace
            }));
        },

        afterRender: function() {
            var editor = this.editor = ace.edit('editor');
            editor.setTheme("ace/theme/xcode");
            editor.getSession().setMode("ace/mode/sql");
            editor.setShowPrintMargin(false);
            editor.focus();
        },

        serialize: function() {
            return this.model.toJSON();
        },
        
        submitAnswer: function() {
            var userAnswer = this.editor.getValue();
            if (userAnswer.trim()) {
                app.trigger('submit:answer', {
                    userAnswer: this.editor.getValue(),
                    realAnswer: this.model.get('answer')
                });
            }
            this.editor.focus();
        },

        nextQuestion: function() {
            app.models.questions.nextQuestion();
        }
    });

    return Question;
});
