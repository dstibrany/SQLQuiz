// Set the require.js configuration for your application.
require.config({

    // Initialize the application with the main application file.
    deps: ['main'],

    packages: [
        {
            "name": "ace",
            "location": "../components/ace/lib/ace",
            "main": "ace.js"
        }
    ],

    paths: {
        // JavaScript folders.
        libs: '../scripts/libs',
        plugins: '../scripts/plugins',
        components: '../components',

        // plugins'
        rateify: '../scripts/plugins/rateify',

        // Libraries.
        jquery: '../components/jquery/jquery',
        lodash: '../components/lodash/lodash',
        backbone: '../components/backbone/backbone',
        handlebars: '../components/handlebars/handlebars',
        layoutmanager: '../components/layoutmanager/backbone.layoutmanager'
    },

    map: {
        // Ensure Lo-Dash is used instead of underscore.
        "*": { "underscore": "lodash" }
    },

    shim: {
        // Backbone library depends on lodash and jQuery.
        backbone: {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        },

        // Backbone.LayoutManager depends on Backbone.
        layoutmanager: ['backbone'],

        handlebars: {
            exports: 'Handlebars'
        },

        rateify: ['jquery']
    }

});
