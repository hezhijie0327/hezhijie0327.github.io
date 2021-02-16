/* browser.js | @ajlkn */

var browser = (function () {
    var _ = {
        name: null,
        version: null,
        os: null,
        osVersion: null,
        touch: null,
        mobile: null,
        _canUse: null,
        canUse: function (p) {
            if (!_._canUse) {
                _._canUse = document.createElement("div");
            }
            var e = _._canUse.style,
                up = p.charAt(0).toUpperCase() + p.slice(1);
            return p in e || "Moz" + up in e || "Webkit" + up in e || "O" + up in e || "ms" + up in e;
        },
        init: function () {
            var x,
                y,
                a,
                i,
                ua = navigator.userAgent;
            x = "other";
            y = 0;
            a = [
                ["firefox", /Firefox\/([0-9\.]+)/],
                ["bb", /BlackBerry.+Version\/([0-9\.]+)/],
                ["bb", /BB[0-9]+.+Version\/([0-9\.]+)/],
                ["opera", /OPR\/([0-9\.]+)/],
                ["opera", /Opera\/([0-9\.]+)/],
                ["edge", /Edge\/([0-9\.]+)/],
                ["safari", /Version\/([0-9\.]+).+Safari/],
                ["chrome", /Chrome\/([0-9\.]+)/],
                ["ie", /MSIE ([0-9]+)/],
                ["ie", /Trident\/.+rv:([0-9]+)/],
            ];
            for (i = 0; i < a.length; i++) {
                if (ua.match(a[i][1])) {
                    x = a[i][0];
                    y = parseFloat(RegExp.$1);
                    break;
                }
            }
            _.name = x;
            _.version = y;
            x = "other";
            y = 0;
            a = [
                [
                    "ios",
                    /([0-9_]+) like Mac OS X/,
                    function (v) {
                        return v.replace("_", ".").replace("_", "");
                    },
                ],
                [
                    "ios",
                    /CPU like Mac OS X/,
                    function (v) {
                        return 0;
                    },
                ],
                ["wp", /Windows Phone ([0-9\.]+)/, null],
                ["android", /Android ([0-9\.]+)/, null],
                [
                    "mac",
                    /Macintosh.+Mac OS X ([0-9_]+)/,
                    function (v) {
                        return v.replace("_", ".").replace("_", "");
                    },
                ],
                ["windows", /Windows NT ([0-9\.]+)/, null],
                ["bb", /BlackBerry.+Version\/([0-9\.]+)/, null],
                ["bb", /BB[0-9]+.+Version\/([0-9\.]+)/, null],
                ["linux", /Linux/, null],
                ["bsd", /BSD/, null],
                ["unix", /X11/, null],
            ];
            for (i = 0; i < a.length; i++) {
                if (ua.match(a[i][1])) {
                    x = a[i][0];
                    y = parseFloat(a[i][2] ? a[i][2](RegExp.$1) : RegExp.$1);
                    break;
                }
            }
            _.os = x;
            _.osVersion = y;
            _.touch = _.os == "wp" ? navigator.msMaxTouchPoints > 0 : !!("ontouchstart" in window);
            _.mobile = _.os == "wp" || _.os == "android" || _.os == "ios" || _.os == "bb";
        },
    };
    _.init();
    return _;
})();
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        if (typeof exports === "object") {
            module.exports = factory();
        } else {
            root.browser = factory();
        }
    }
})(this, function () {
    return browser;
});
