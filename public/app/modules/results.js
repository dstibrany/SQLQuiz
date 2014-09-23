define([
    'app',
    '../modules/vote'
],

function(app, Vote) {

    var Results = app.module();

    Results.Model = Backbone.Model.extend({
        urlRoot: app.apiRoot + '/checkAnswer'
    });

    Results.Views.Layout = Backbone.View.extend({
        template:  'results',
        id:        'results',

        events: {
            'click .close': 'close'
        },

        initialize: function() {
            app.off('submit:answer');
            app.on('submit:answer', function (data) {
                data.id = this.model.get('id');
                this.model.clear();
                this.model.set(data);

                // POST data to check results
                Backbone.sync('create', this.model).done(_.bind(function (res) {
                    this.model.set(res);
                    this.render();
                    app.models.questions.get(data.id).set({
                        correct: res.correct
                    });
                    if (res.correct) {
                        $('.pagination .active a').addClass('correct');
                        $('#btn-next').css('display', 'block');
                        this.areAllCorrect();
                    }
                }, this));
            }, this);
        },

        serialize: function() {
            var data = this.model.toJSON();

            if (data.user_error) {
                data.user_error = data.user_error.replace(/SQLITE_ERROR/, "DB_ERROR");
                return data;
            }

            if (!data.userAnswer) {
                data.empty = true;
                return data;
            }

            if (data.correctResults && data.correctResults.length > 0) {
                data.correctColumns = Object.keys(data.correctResults[0]);
            } else if (data.correctResults) {
                data.correctResults.push({ empty: 'No results found.' })
            }

            if (data.userResults && data.userResults.length > 0) {
                data.userColumns = Object.keys(data.userResults[0]);
            } else if (data.userResults) {
                data.userResults.push({ empty: 'No results found.' })
            }

            return data;
        },

        areAllCorrect: function() {
            var questions_model = app.models.questions;
            if (questions_model.where({ 'correct': true }).length === questions_model.length) {
                questions_model.trigger('all_correct');
            }
        },

        close: function() {
            this.$el.find('.results-wrapper').fadeOut();
            this.options.ace.edit('editor').focus();
        }

    });

    return Results;
});
