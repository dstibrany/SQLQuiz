define([
  "app"
],

function (app) {

    var Header = app.module();

    Header.Views.Layout = Backbone.Layout.extend({
        template: "header"
    });

    return Header;
});
