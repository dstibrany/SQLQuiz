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

        nextQuestion: function() {
            this.currentQuestion++;
            this.trigger('change:question');
        },

        prevQuestion: function() {
            this.currentQuestion--;
            this.trigger('change:question');
        }
    });

    Question.Views.Layout = Backbone.View.extend({
        template: 'question',

        events: {
            'click #submit-answer': 'submitAnswer'
        },

        initialize: function() {
            this.collection.on('reset', this.render, this);
            this.collection.on('change:question', this.render, this);
        },

        beforeRender: function() {
            if (this.collection.length) {
                this.setView('#results-hook', new Results.Views.Layout({
                    model: new Results.Model({
                        id: this.getModel().get('id')
                    })
                }));
            }
        },

        serialize: function() {
            var question = this.collection.at(this.collection.currentQuestion - 1);
            return question ? question.toJSON() : {};
        },
        
        submitAnswer: function() {
            app.trigger('submit:answer', {
                userAnswer: this.$('textarea').val(),
                realAnswer: this.getModel().get('answer')
            })
            
        },

        getModel: function() {
            return this.collection.at(this.collection.currentQuestion - 1);
        }

    })

    return Question;
});
