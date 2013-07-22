define([
  "app"
],

function(app) {

    var Results = app.module();

    Results.Model = Backbone.Model.extend({
        urlRoot: app.apiRoot + '/checkAnswer'
    });

    Results.Views.Layout = Backbone.View.extend({
        template: 'results',

        initialize: function() {
            var self = this;
            app.on('submit:answer', function (data) {
                data.id = this.model.get('id');
                this.model.clear();
                this.model.set(data);
                // POST data to check results;
                Backbone.sync('create', this.model).done(function (res) {
                    self.model.set(res);
                    self.render();
                    app.models.questions.get(data.id).set({
                        correct: res.correct
                    });
                    $('.pagination .active a').addClass('correct');
                });
            }, this);
        },

        serialize: function() {
            var data = this.model.toJSON();
            if (!data.userAnswer) {
                data.empty = true;
                return data;
            }

            if (data.correctResults && data.correctResults.length > 0) {
                data.correctColumns = Object.keys(data.correctResults[0]);
            } else if (data.correctResults) {
                data.correctResults.push({empty: 'No results found.'})
            }

            if (data.userResults && data.userResults.length > 0) {
                data.userColumns = Object.keys(data.userResults[0]);
            } else if (data.userResults) {
                data.userResults.push({empty: 'No results found.'})
            }
            return data;
        },

        cleanup: function() {
            app.off('submit:answer');
        }

    })

    return Results;
});
