define([
  "app"
],

function (app) {

    var Header = app.module();

    Header.Views.Layout = Backbone.Layout.extend({
        template: "header",

        events: {
            'click #navtitle': function(e) {
                e.preventDefault();
                Backbone.history.navigate('/', true);
            }
        },

        initialize: function() {
            this.listenTo(app.models.problem_sets, 'reset', this.render);
        },

        serialize: function() {
            var problem_set = app.models.problem_sets.get(app.state.problem_set);

            if (problem_set) {
                return {
                    ps_name: problem_set.get('name')
                }
            } else {
                return {};
            }
        }
    });

    return Header;
});
