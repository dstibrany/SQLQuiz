;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "rateify",
        defaults = {
            stars:    5,
            readOnly: false,
            generate: true
        };

    var id = 0;


    // The actual plugin constructor
    function Plugin( element, options ) {
        id++; // internal id to differentiate groups
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var self = this;
            var $el = $(this.element);

            if (this.options.readOnly) {
                $el.addClass('read-only');
            }

            if (this.options.url) {
                $el.on('click', 'input', function (e) {
                    var $target = $(e.target);
                    $.post(self.options.url, { 'rating': $target.val(), 'name': $target.attr('name') })
                    .then(function() { // success
                        console.log('success');
                    }, function() { // fail
                        console.log('fail');
                    });
                });
            }

            this.generate(this.element, this.options);
        },

        generate: function(el, options) {
            var title = '';
            var html = '';
            var checked = '';
            var disabled = options.readOnly ? 'disabled="disabled" ' : '';
            var rating = +options.readOnly;

            for (var i = this.options.stars; i > 0; i--) {
                if (options.titles) title = titles[i];
                checked = Math.floor(rating) === i ? 'checked="checked" ' : '';
                html += '<input ' + disabled + checked + 'type="radio" id="star' + i + '-group' + id + '" name="rating-group' + id + '" value="' + i + '" />';
                html += '<label for="star' + i + '-group' + id + '" title=' + title + '>' + i + ' stars</label>';
            }
            $(el).html(html);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );