/*
 * StarRating plugin - customizable, easy and powerful
 * jQuery plugin.
 *
 * @see https://github.com/1st/StarRating.js
 * @author Anton Danilchenko <anton.danilchenko@me.com>
 */

(function($) {

    $.fn.StarRating = function(method) {
        var func_arguments = arguments;

        // call method
        if (methods[method]) {
            return this.each(function() {
                methods[method].apply(this, Array.prototype.slice.call(func_arguments, 1));
            });
        }
        else if (typeof method === 'object' || !method) {
            return this.each(function() {
                methods.init.apply(this, func_arguments);
            });
        }
        else {
            $.error('Method ' + method + ' does not exist!');
        }

        // return this to chaining
        return this;
    };

    // Plugin defaults – added as a property on our plugin function.
    $.fn.StarRating.defaults = {
        highlight: false,   // if true - show yellow stars
        half_stars: false,  // show full star of half
        read_only: false,   // disable change stars by mouse
        vote: 0             // initial value: 0-5
    };

    var methods = {
        init: function(options){
            var container = this;

            // This is the easiest way to have default options.
            this.opts = $.extend({}, $.fn.StarRating.defaults, options);

            // set initial rating
            var element = $('<A href="#" />').css({
                'display': 'block',
                'width': '16px',
                'height': '16px',
                'float': 'left',
                'margin-right': '10px',
                'background-image': 'url(/static/img/stars_rating.png)',
                'background-position': '0px 0px'
            });

            $(this).on('mouseleave', function() {
                methods._hover.apply(container, [this, false]);
            });

            // insert 5 stars and handle actions on these stars
            for (var n=1; n<=5; n++) {
                var el = element.clone().data('vote', n);
                $(this).append(el);
                el.on('mouseenter', function() {
                    methods._hover.apply(container, [this, true]);
                })
                .on('click', function(el) {
                    methods._click.apply(container, [this]);
                    return false;
                });
            }
            methods._reset_stars.apply(this);
        },

        read_only: function(val){
            this.opts.read_only = val;
        },

        vote: function(val){
            this.opts.vote = val;
            methods._show_stars.apply(this, [this.opts.vote, this.opts.highlight]);
        },

        highlight: function(val){
            this.opts.highlight = val;
            methods._show_stars.apply(this, [this.opts.vote, this.opts.highlight]);
        },

        _show_stars: function(vote, highlight){
            var stars = $('A', this);
            stars.css('background-position', '0px 0px');
            stars.each(function(){
                if ($(this).data('vote') <= vote) {
                    if (highlight) {
                        // yellow star
                        $(this).css('background-position', '-16px -16px');
                    }
                    else {
                        // gray star
                        $(this).css('background-position', '0px -16px');
                    }
                }
            });
        },

        _hide_stars: function(vote){
            methods._reset_stars.apply(this);
        },

        _reset_stars: function(){
            methods._show_stars.apply(this, [this.opts.vote, this.opts.highlight]);
        },

        _hover: function(star, over){
            /* 
             * Params:
             * - over = true: when move mouse to star
             * - over = false: when mouse out outside of star
             */
            if (this.opts.read_only) {
                return false;
            }
            if (over) {
                methods._show_stars.apply(this, [$(star).data('vote'), true]);
            }
            else {
                methods._hide_stars.apply(this, [$(star).data('vote')]);
            }
        },

        _click: function(star){
            if (this.opts.read_only) {
                return false;
            }
            if (this.opts.callback) {
                this.opts.callback.apply(this, [star]);
            }
            methods.highlight.apply(this, [true]);
            methods.vote.apply(this, [$(star).data('vote')]);
        },
    };

}( jQuery ));
