define([
  "app"
],

function(app) {

    var Results = app.module();

    Results.Model = Backbone.Model.extend({
        urlRoot: '/checkAnswer'
    });

    Results.Views.Layout = Backbone.View.extend({
        template: 'results',

        initialize: function() {
            var self = this;
            app.on('submit:answer', function (data) {
                data.id = this.model.get('id');
                this.model.clear();
                this.model.set(data);
                Backbone.sync('create', this.model).done(function (res) {
                    self.model.set(res);
                    self.render();
                });
            }, this);
        },

        serialize: function() {
            var data = this.model.toJSON();
            if (!data.userAnswer) {
                data.empty = true;
            }
            return data;
        }

    })

    return Results;
});
