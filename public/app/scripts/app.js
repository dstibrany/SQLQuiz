/* global define */

define([
    // Libraries.
    'jquery',
    'lodash',
    'backbone',
    'handlebars',
    'ace',

    // Plugins.
    'layoutmanager',
    'rateify',
    '../scripts/extensions/handlebars-ext'
],

function($, _, Backbone, Handlebars, ace) {
    'use strict';
    // Provide a global location to place configuration settings and module
    // creation.
    var app = window.app = {
        // The root path to run the application.
        root: '/',
        apiRoot: '/api',
        models: {},
        state: {
            problem_set: null
        }
    };

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    // Configure LayoutManager with Backbone Boilerplate defaults.
    Backbone.Layout.configure({
        manage: true,

        prefix: 'templates/',
        
        fetch: function(path) {
            path = path + '.html';

            if (!JST[path]) {
                $.ajax({ url: app.root + path, async: false }).then(function(contents) {
                    JST[path] = Handlebars.compile(contents);
                });
            }

            return JST[path];
        }
    });

    // Mix Backbone.Events, modules, and layout management into the app object.
    return _.extend(app, {
        // Create a custom object with a nested Views object.
        module: function(additionalProps) {
            return _.extend({ Views: {} }, additionalProps);
        },

        // Helper for using layouts.
        useLayout: function(name, options) {
            // Enable variable arity by allowing the first argument to be the options
            // object and omitting the name argument.
            if (_.isObject(name)) {
                options = name;
            }

            // Ensure options is an object.
            options = options || {};

            // If a name property was specified use that as the template.
            if (_.isString(name)) {
                options.template = name;
            }

            // Check if a layout already exists, if so, update the template.
            if (this.layout) {
                this.layout.template = options.template;
            } else {
                // Create a new Layout with options.
                this.layout = new Backbone.Layout(_.extend({
                    
                }, options));
            }
            
            this.layout.remove();

            $('#main').append(this.layout.$el);

            // Cache the reference.
            return this.layout;
        }
    }, Backbone.Events);

});
