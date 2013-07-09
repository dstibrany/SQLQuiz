define([
  "app"
],

function(app) {

    var Relation = app.module();

    Relation.Model = Backbone.Model.extend({});

    Relation.Collection = Backbone.Collection.extend({
        model: Relation.Model,
        url: '/modules/1/relations'
    });

    Relation.Views.List = Backbone.View.extend({
        template: 'relations',

        initialize: function() {
            this.collection.on('reset', this.render, this);
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

        initialize: function() {
        },

        serialize: function() {
            var out = {};
            var data = this.model.toJSON();
            out.relation = _.clone(data);
            out.name = data.__name__;
            delete out.relation.__name__;
            console.log(out);
            return out;
        }
    })

    return Relation;
});
