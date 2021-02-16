/* breakpoints.js | @ajlkn */

var breakpoints = (function () {
    var _ = {
        list: null,
        media: {},
        events: [],
        init: function (list) {
            _.list = list;
            window.addEventListener("resize", _.poll);
            window.addEventListener("orientationchange", _.poll);
            window.addEventListener("load", _.poll);
            window.addEventListener("fullscreenchange", _.poll);
        },
        active: function (query) {
            var breakpoint, op, media, a, x, y, units;
            if (!(query in _.media)) {
                if (query.substr(0, 2) == ">=") {
                    op = "gte";
                    breakpoint = query.substr(2);
                } else {
                    if (query.substr(0, 2) == "<=") {
                        op = "lte";
                        breakpoint = query.substr(2);
                    } else {
                        if (query.substr(0, 1) == ">") {
                            op = "gt";
                            breakpoint = query.substr(1);
                        } else {
                            if (query.substr(0, 1) == "<") {
                                op = "lt";
                                breakpoint = query.substr(1);
                            } else {
                                if (query.substr(0, 1) == "!") {
                                    op = "not";
                                    breakpoint = query.substr(1);
                                } else {
                                    op = "eq";
                                    breakpoint = query;
                                }
                            }
                        }
                    }
                }
                if (breakpoint && breakpoint in _.list) {
                    a = _.list[breakpoint];
                    if (Array.isArray(a)) {
                        x = parseInt(a[0]);
                        y = parseInt(a[1]);
                        if (!isNaN(x)) {
                            units = a[0].substr(String(x).length);
                        } else {
                            if (!isNaN(y)) {
                                units = a[1].substr(String(y).length);
                            } else {
                                return;
                            }
                        }
                        if (isNaN(x)) {
                            switch (op) {
                                case "gte":
                                    media = "screen";
                                    break;
                                case "lte":
                                    media = "screen and (max-width: " + y + units + ")";
                                    break;
                                case "gt":
                                    media = "screen and (min-width: " + (y + 1) + units + ")";
                                    break;
                                case "lt":
                                    media = "screen and (max-width: -1px)";
                                    break;
                                case "not":
                                    media = "screen and (min-width: " + (y + 1) + units + ")";
                                    break;
                                default:
                                    media = "screen and (max-width: " + y + units + ")";
                                    break;
                            }
                        } else {
                            if (isNaN(y)) {
                                switch (op) {
                                    case "gte":
                                        media = "screen and (min-width: " + x + units + ")";
                                        break;
                                    case "lte":
                                        media = "screen";
                                        break;
                                    case "gt":
                                        media = "screen and (max-width: -1px)";
                                        break;
                                    case "lt":
                                        media = "screen and (max-width: " + (x - 1) + units + ")";
                                        break;
                                    case "not":
                                        media = "screen and (max-width: " + (x - 1) + units + ")";
                                        break;
                                    default:
                                        media = "screen and (min-width: " + x + units + ")";
                                        break;
                                }
                            } else {
                                switch (op) {
                                    case "gte":
                                        media = "screen and (min-width: " + x + units + ")";
                                        break;
                                    case "lte":
                                        media = "screen and (max-width: " + y + units + ")";
                                        break;
                                    case "gt":
                                        media = "screen and (min-width: " + (y + 1) + units + ")";
                                        break;
                                    case "lt":
                                        media = "screen and (max-width: " + (x - 1) + units + ")";
                                        break;
                                    case "not":
                                        media = "screen and (max-width: " + (x - 1) + units + "), screen and (min-width: " + (y + 1) + units + ")";
                                        break;
                                    default:
                                        media = "screen and (min-width: " + x + units + ") and (max-width: " + y + units + ")";
                                        break;
                                }
                            }
                        }
                    } else {
                        if (a.charAt(0) == "(") {
                            media = "screen and " + a;
                        } else {
                            media = a;
                        }
                    }
                }
                _.media[query] = media ? media : false;
            }
            return _.media[query] === false ? false : window.matchMedia(_.media[query]).matches;
        },
        on: function (query, handler) {
            _.events.push({ query: query, handler: handler, state: false });
            if (_.active(query)) {
                handler();
            }
        },
        poll: function () {
            var i, e;
            for (i = 0; i < _.events.length; i++) {
                e = _.events[i];
                if (_.active(e.query)) {
                    if (!e.state) {
                        e.state = true;
                        e.handler();
                    }
                } else {
                    if (e.state) {
                        e.state = false;
                    }
                }
            }
        },
    };
    function __(list) {
        _.init(list);
    }
    __._ = _;
    __.on = function (query, handler) {
        _.on(query, handler);
    };
    __.active = function (query) {
        return _.active(query);
    };
    return __;
})();
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        if (typeof exports === "object") {
            module.exports = factory();
        } else {
            root.breakpoints = factory();
        }
    }
})(this, function () {
    return breakpoints;
});
