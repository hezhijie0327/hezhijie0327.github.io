/* jquery.scrollex.js | @ajlkn */

(function ($) {
    var $window = $(window),
        ids = 1,
        queue = {};
    function resolve(x, eHeight, vHeight) {
        if (typeof x === "string") {
            if (x.slice(-1) == "%") {
                x = (parseInt(x.substring(0, x.length - 1)) / 100) * eHeight;
            } else {
                if (x.slice(-2) == "vh") {
                    x = (parseInt(x.substring(0, x.length - 2)) / 100) * vHeight;
                } else {
                    if (x.slice(-2) == "px") {
                        x = parseInt(x.substring(0, x.length - 2));
                    }
                }
            }
        }
        return x;
    }
    $window
        .on("scroll", function () {
            var vTop = $window.scrollTop();
            $.map(queue, function (o) {
                window.clearTimeout(o.timeoutId);
                o.timeoutId = window.setTimeout(function () {
                    o.handler(vTop);
                }, o.options.delay);
            });
        })
        .on("load", function () {
            $window.trigger("scroll");
        });
    jQuery.fn.scrollex = function (userOptions) {
        var $this = $(this);
        if (this.length == 0) {
            return $this;
        }
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++) {
                $(this[i]).scrollex(userOptions);
            }
            return $this;
        }
        if ($this.data("_scrollexId")) {
            return $this;
        }
        var id, options, test, handler, o;
        id = ids++;
        options = jQuery.extend({ top: 0, bottom: 0, delay: 0, mode: "default", enter: null, leave: null, initialize: null, terminate: null, scroll: null }, userOptions);
        switch (options.mode) {
            case "top":
                test = function (vTop, vMiddle, vBottom, eTop, eBottom) {
                    return vTop >= eTop && vTop <= eBottom;
                };
                break;
            case "bottom":
                test = function (vTop, vMiddle, vBottom, eTop, eBottom) {
                    return vBottom >= eTop && vBottom <= eBottom;
                };
                break;
            case "middle":
                test = function (vTop, vMiddle, vBottom, eTop, eBottom) {
                    return vMiddle >= eTop && vMiddle <= eBottom;
                };
                break;
            case "top-only":
                test = function (vTop, vMiddle, vBottom, eTop, eBottom) {
                    return vTop <= eTop && eTop <= vBottom;
                };
                break;
            case "bottom-only":
                test = function (vTop, vMiddle, vBottom, eTop, eBottom) {
                    return vBottom >= eBottom && eBottom >= vTop;
                };
                break;
            default:
            case "default":
                test = function (vTop, vMiddle, vBottom, eTop, eBottom) {
                    return vBottom >= eTop && vTop <= eBottom;
                };
                break;
        }
        handler = function (vTop) {
            var currentState = this.state,
                newState = false,
                offset = this.$element.offset(),
                vHeight,
                vMiddle,
                vBottom,
                eHeight,
                eTop,
                eBottom;
            vHeight = $window.height();
            vMiddle = vTop + vHeight / 2;
            vBottom = vTop + vHeight;
            eHeight = this.$element.outerHeight();
            eTop = offset.top + resolve(this.options.top, eHeight, vHeight);
            eBottom = offset.top + eHeight - resolve(this.options.bottom, eHeight, vHeight);
            newState = this.test(vTop, vMiddle, vBottom, eTop, eBottom);
            if (newState != currentState) {
                this.state = newState;
                if (newState) {
                    if (this.options.enter) {
                        this.options.enter.apply(this.element);
                    }
                } else {
                    if (this.options.leave) {
                        this.options.leave.apply(this.element);
                    }
                }
            }
            if (this.options.scroll) {
                this.options.scroll.apply(this.element, [(vMiddle - eTop) / (eBottom - eTop)]);
            }
        };
        o = { id: id, options: options, test: test, handler: handler, state: null, element: this, $element: $this, timeoutId: null };
        queue[id] = o;
        $this.data("_scrollexId", o.id);
        if (o.options.initialize) {
            o.options.initialize.apply(this);
        }
        return $this;
    };
    jQuery.fn.unscrollex = function () {
        var $this = $(this);
        if (this.length == 0) {
            return $this;
        }
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++) {
                $(this[i]).unscrollex();
            }
            return $this;
        }
        var id, o;
        id = $this.data("_scrollexId");
        if (!id) {
            return $this;
        }
        o = queue[id];
        window.clearTimeout(o.timeoutId);
        delete queue[id];
        $this.removeData("_scrollexId");
        if (o.options.terminate) {
            o.options.terminate.apply(this);
        }
        return $this;
    };
})(jQuery);
