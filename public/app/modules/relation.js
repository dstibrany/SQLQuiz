define([
  "app"
],

function (app) {

    var Relation = app.module();

    Relation.Model = Backbone.Model.extend({});

    Relation.Collection = Backbone.Collection.extend({
        model: Relation.Model,
        url: app.apiRoot + '/problem_set/1/relations', // 1 is just a placeholder and will be dynamically replaced

        setURL: function(problem_set_id) {
            this.url = this.url.replace(/\d+/, problem_set_id);
        }
    });

    Relation.Views.List = Backbone.View.extend({
        template: 'relations',

        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
        },

        beforeRender: function() {
            this.collection.each(function (model) {
                this.insertView("#relation-hook", new Relation.Views.Item({
                    model: model
                }))
            }, this);
        }
    });

    Relation.Views.Item = Backbone.View.extend({
        template: 'relation',
        className: 'relation',

        serialize: function() {
            return this.model.toJSON();
        }
    })

    return Relation;
});
