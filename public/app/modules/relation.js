define([
  "app"
],

function(app) {

    var Relation = app.module();

    Relation.Model = Backbone.Model.extend({});

    Relation.Collection = Backbone.Collection.extend({
        model: Relation.Model,
        url: '/modules/1/relations', // 1 is just a placeholder and will be dynamically replaced

        setURL: function(module_id) {
            this.url = this.url.replace(/\d+/, module_id);
        }
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

        serialize: function() {
            var out = {};
            var data = this.model.toJSON();
            out.relation = _.clone(data);
            out.name = data.__name__;
            delete out.relation.__name__;
            return out;
        }
    })

    return Relation;
});
