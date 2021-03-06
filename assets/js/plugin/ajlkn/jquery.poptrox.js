/* jquery.poptrox.js | @n33 */

(function ($) {
    $.fn.poptrox_disableSelection = function () {
        return $(this).css("user-select", "none").css("-khtml-user-select", "none").css("-moz-user-select", "none").css("-o-user-select", "none").css("-webkit-user-select", "none");
    };
    $.fn.poptrox = function (options) {
        if (this.length == 0) {
            return $(this);
        }
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++) {
                $(this[i]).poptrox(options);
            }
            return $(this);
        }
        var settings = $.extend({ preload: false, baseZIndex: 1000, fadeSpeed: 300, overlayColor: "#000000", overlayOpacity: 0.6, overlayClass: "poptrox-overlay", windowMargin: 50, windowHeightPad: 0, selector: "a", caption: null, parent: "body", popupSpeed: 300, popupWidth: 200, popupHeight: 100, popupIsFixed: false, useBodyOverflow: false, usePopupEasyClose: true, usePopupForceClose: false, usePopupLoader: true, usePopupCloser: true, usePopupCaption: false, usePopupNav: false, usePopupDefaultStyling: true, popupBackgroundColor: "#FFFFFF", popupTextColor: "#000000", popupLoaderTextSize: "2em", popupCloserBackgroundColor: "#000000", popupCloserTextColor: "#FFFFFF", popupCloserTextSize: "20px", popupPadding: 10, popupCaptionHeight: 60, popupCaptionTextSize: null, popupBlankCaptionText: "(untitled)", popupCloserText: "&#215;", popupLoaderText: "&bull;&bull;&bull;&bull;", popupClass: "poptrox-popup", popupSelector: null, popupLoaderSelector: ".loader", popupCloserSelector: ".closer", popupCaptionSelector: ".caption", popupNavPreviousSelector: ".nav-previous", popupNavNextSelector: ".nav-next", onPopupClose: null, onPopupOpen: null }, options);
        var $this = $(this),
            $body = $("body"),
            $overlay = $('<div class="' + settings.overlayClass + '"></div>'),
            $window = $(window);
        var windowWidth,
            windowHeight,
            queue = [],
            navPos = 0,
            isLocked = false,
            cache = new Array();
        function updateWH() {
            windowWidth = $(window).width();
            windowHeight = $(window).height() + settings.windowHeightPad;
            var dw = Math.abs($popup.width() - $popup.outerWidth()),
                dh = Math.abs($popup.height() - $popup.outerHeight());
            var nw = $x.width(),
                nh = $x.height();
            var maxw = windowWidth - settings.windowMargin * 2 - dw,
                maxh = windowHeight - settings.windowMargin * 2 - dh;
            $popup.css("min-width", settings.popupWidth).css("min-height", settings.popupHeight);
            $pic.children().css("max-width", maxw).css("max-height", maxh);
        }
        if (!settings.usePopupLoader) {
            settings.popupLoaderSelector = null;
        }
        if (!settings.usePopupCloser) {
            settings.popupCloserSelector = null;
        }
        if (!settings.usePopupCaption) {
            settings.popupCaptionSelector = null;
        }
        if (!settings.usePopupNav) {
            settings.popupNavPreviousSelector = null;
            settings.popupNavNextSelector = null;
        }
        var $popup;
        if (settings.popupSelector) {
            $popup = $(settings.popupSelector);
        } else {
            $popup = $('<div class="' + settings.popupClass + '">' + (settings.popupLoaderSelector ? '<div class="loader">' + settings.popupLoaderText + "</div>" : "") + '<div class="pic"></div>' + (settings.popupCaptionSelector ? '<div class="caption"></div>' : "") + (settings.popupCloserSelector ? '<span class="closer">' + settings.popupCloserText + "</span>" : "") + (settings.popupNavPreviousSelector ? '<div class="nav-previous"></div>' : "") + (settings.popupNavNextSelector ? '<div class="nav-next"></div>' : "") + "</div>");
        }
        var $pic = $popup.find(".pic"),
            $x = $(),
            $loader = $popup.find(settings.popupLoaderSelector),
            $caption = $popup.find(settings.popupCaptionSelector),
            $closer = $popup.find(settings.popupCloserSelector),
            $nav_next = $popup.find(settings.popupNavNextSelector),
            $nav_previous = $popup.find(settings.popupNavPreviousSelector),
            $nav = $nav_next.add($nav_previous);
        if (settings.usePopupDefaultStyling) {
            $popup
                .css("background", settings.popupBackgroundColor)
                .css("color", settings.popupTextColor)
                .css("padding", settings.popupPadding + "px");
            if ($caption.length > 0) {
                $popup.css("padding-bottom", settings.popupCaptionHeight + "px");
                $caption
                    .css("position", "absolute")
                    .css("left", "0")
                    .css("bottom", "0")
                    .css("width", "100%")
                    .css("text-align", "center")
                    .css("height", settings.popupCaptionHeight + "px")
                    .css("line-height", settings.popupCaptionHeight + "px");
                if (settings.popupCaptionTextSize) {
                    $caption.css("font-size", popupCaptionTextSize);
                }
            }
            if ($closer.length > 0) {
                $closer.html(settings.popupCloserText).css("font-size", settings.popupCloserTextSize).css("background", settings.popupCloserBackgroundColor).css("color", settings.popupCloserTextColor).css("display", "block").css("width", "40px").css("height", "40px").css("line-height", "40px").css("text-align", "center").css("position", "absolute").css("text-decoration", "none").css("outline", "0").css("top", "0").css("right", "-40px");
            }
            if ($loader.length > 0) {
                $loader
                    .html("")
                    .css("position", "relative")
                    .css("font-size", settings.popupLoaderTextSize)
                    .on("startSpinning", function (e) {
                        var x = $("<div>" + settings.popupLoaderText + "</div>");
                        x.css("height", Math.floor(settings.popupHeight / 2) + "px")
                            .css("overflow", "hidden")
                            .css("line-height", Math.floor(settings.popupHeight / 2) + "px")
                            .css("text-align", "center")
                            .css("margin-top", Math.floor(($popup.height() - x.height() + ($caption.length > 0 ? $caption.height() : 0)) / 2))
                            .css("color", settings.popupTextColor ? settings.popupTextColor : "")
                            .on("xfin", function () {
                                x.fadeTo(300, 0.5, function () {
                                    x.trigger("xfout");
                                });
                            })
                            .on("xfout", function () {
                                x.fadeTo(300, 0.05, function () {
                                    x.trigger("xfin");
                                });
                            })
                            .trigger("xfin");
                        $loader.append(x);
                    })
                    .on("stopSpinning", function (e) {
                        var x = $loader.find("div");
                        x.remove();
                    });
            }
            if ($nav.length == 2) {
                $nav.css("font-size", "75px").css("text-align", "center").css("color", "#fff").css("text-shadow", "none").css("height", "100%").css("position", "absolute").css("top", "0").css("opacity", "0.35").css("cursor", "pointer").css("box-shadow", "inset 0px 0px 10px 0px rgba(0,0,0,0)").poptrox_disableSelection();
                var wn, wp;
                if (settings.usePopupEasyClose) {
                    wn = "100px";
                    wp = "100px";
                } else {
                    wn = "75%";
                    wp = "25%";
                }
                $nav_next.css("right", "0").css("width", wn).html('<div style="position: absolute; height: 100px; width: 125px; top: 50%; right: 0; margin-top: -50px;">&gt;</div>');
                $nav_previous.css("left", "0").css("width", wp).html('<div style="position: absolute; height: 100px; width: 125px; top: 50%; left: 0; margin-top: -50px;">&lt;</div>');
            }
        }
        $window.on("resize orientationchange", function () {
            updateWH();
        });
        $caption.on("update", function (e, s) {
            if (!s || s.length == 0) {
                s = settings.popupBlankCaptionText;
            }
            $caption.html(s);
        });
        $closer.css("cursor", "pointer").on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $popup.trigger("poptrox_close");
            return true;
        });
        $nav_next.on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $popup.trigger("poptrox_next");
        });
        $nav_previous.on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $popup.trigger("poptrox_previous");
        });
        $overlay
            .css("position", "fixed")
            .css("left", 0)
            .css("top", 0)
            .css("z-index", settings.baseZIndex)
            .css("width", "100%")
            .css("height", "100%")
            .css("text-align", "center")
            .css("cursor", "pointer")
            .appendTo(settings.parent)
            .prepend('<div style="display:inline-block;height:100%;vertical-align:middle;"></div>')
            .append('<div style="position:absolute;left:0;top:0;width:100%;height:100%;background:' + settings.overlayColor + ";opacity:" + settings.overlayOpacity + ";filter:alpha(opacity=" + settings.overlayOpacity * 100 + ');"></div>')
            .hide()
            .on("touchmove", function (e) {
                return false;
            })
            .on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                $popup.trigger("poptrox_close");
            });
        $popup
            .css("display", "inline-block")
            .css("vertical-align", "middle")
            .css("position", "relative")
            .css("z-index", 1)
            .css("cursor", "auto")
            .appendTo($overlay)
            .hide()
            .on("poptrox_next", function () {
                var x = navPos + 1;
                if (x >= queue.length) {
                    x = 0;
                }
                $popup.trigger("poptrox_switch", [x]);
            })
            .on("poptrox_previous", function () {
                var x = navPos - 1;
                if (x < 0) {
                    x = queue.length - 1;
                }
                $popup.trigger("poptrox_switch", [x]);
            })
            .on("poptrox_reset", function () {
                updateWH();
                $popup.data("width", settings.popupWidth).data("height", settings.popupHeight);
                $loader.hide().trigger("stopSpinning");
                $caption.hide();
                $closer.hide();
                $nav.hide();
                $pic.hide();
                $x.attr("src", "").detach();
            })
            .on("poptrox_open", function (e, index) {
                if (isLocked) {
                    return true;
                }
                isLocked = true;
                if (settings.useBodyOverflow) {
                    $body.css("overflow", "hidden");
                }
                if (settings.onPopupOpen) {
                    settings.onPopupOpen();
                }
                $overlay.fadeTo(settings.fadeSpeed, 1, function () {
                    $popup.trigger("poptrox_switch", [index, true]);
                });
            })
            .on("poptrox_switch", function (e, index, ignoreLock) {
                var x, img;
                if (!ignoreLock && isLocked) {
                    return true;
                }
                isLocked = true;
                $popup.css("width", $popup.data("width")).css("height", $popup.data("height"));
                $caption.hide();
                if ($x.attr("src")) {
                    $x.attr("src", "");
                }
                $x.detach();
                x = queue[index];
                $x = x.object;
                $x.off("load");
                $pic.css("text-indent", "-9999px").show().append($x);
                if (x.type == "ajax") {
                    $.get(x.src, function (data) {
                        $x.html(data);
                        $x.trigger("load");
                    });
                } else {
                    $x.attr("src", x.src);
                }
                if (x.type != "image") {
                    var xwidth, xheight;
                    xwidth = x.width;
                    xheight = x.height;
                    if (xwidth.slice(-1) == "%") {
                        xwidth = (parseInt(xwidth.substring(0, xwidth.length - 1)) / 100) * $window.width();
                    }
                    if (xheight.slice(-1) == "%") {
                        xheight = (parseInt(xheight.substring(0, xheight.length - 1)) / 100) * $window.height();
                    }
                    $x.css("position", "relative")
                        .css("outline", "0")
                        .css("z-index", settings.baseZIndex + 100)
                        .width(xwidth)
                        .height(xheight);
                }
                $loader.trigger("startSpinning").fadeIn(300);
                $popup.show();
                if (settings.popupIsFixed) {
                    $popup.width(settings.popupWidth).height(settings.popupHeight);
                    $x.load(function () {
                        $x.off("load");
                        $loader.hide().trigger("stopSpinning");
                        $caption.trigger("update", [x.captionText]).fadeIn(settings.fadeSpeed);
                        $closer.fadeIn(settings.fadeSpeed);
                        $pic.css("text-indent", 0)
                            .hide()
                            .fadeIn(settings.fadeSpeed, function () {
                                isLocked = false;
                            });
                        navPos = index;
                        $nav.fadeIn(settings.fadeSpeed);
                    });
                } else {
                    $x.load(function () {
                        updateWH();
                        $x.off("load");
                        $loader.hide().trigger("stopSpinning");
                        var nw = $x.width(),
                            nh = $x.height(),
                            f = function () {
                                $caption.trigger("update", [x.captionText]).fadeIn(settings.fadeSpeed);
                                $closer.fadeIn(settings.fadeSpeed);
                                $pic.css("text-indent", 0)
                                    .hide()
                                    .fadeIn(settings.fadeSpeed, function () {
                                        isLocked = false;
                                    });
                                navPos = index;
                                $nav.fadeIn(settings.fadeSpeed);
                                $popup.data("width", nw).data("height", nh).css("width", "auto").css("height", "auto");
                            };
                        if (nw == $popup.data("width") && nh == $popup.data("height")) {
                            f();
                        } else {
                            $popup.animate({ width: nw, height: nh }, settings.popupSpeed, "swing", f);
                        }
                    });
                }
                if (x.type != "image") {
                    $x.trigger("load");
                }
            })
            .on("poptrox_close", function () {
                if (isLocked && !settings.usePopupForceClose) {
                    return true;
                }
                isLocked = true;
                $popup.hide().trigger("poptrox_reset");
                if (settings.onPopupClose) {
                    settings.onPopupClose();
                }
                $overlay.fadeOut(settings.fadeSpeed, function () {
                    if (settings.useBodyOverflow) {
                        $body.css("overflow", "auto");
                    }
                    isLocked = false;
                });
            })
            .trigger("poptrox_reset");
        if (settings.usePopupEasyClose) {
            $caption.on("click", "a", function (e) {
                e.stopPropagation();
            });
            $popup.css("cursor", "pointer").on("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                $popup.trigger("poptrox_close");
            });
        } else {
            $popup.on("click", function (e) {
                e.stopPropagation();
            });
        }
        $window.keydown(function (e) {
            if ($popup.is(":visible")) {
                switch (e.keyCode) {
                    case 37:
                    case 32:
                        if (settings.usePopupNav) {
                            $popup.trigger("poptrox_previous");
                            return false;
                        }
                        break;
                    case 39:
                        if (settings.usePopupNav) {
                            $popup.trigger("poptrox_next");
                            return false;
                        }
                        break;
                    case 27:
                        $popup.trigger("poptrox_close");
                        return false;
                        break;
                }
            }
        });
        $this.find(settings.selector).each(function (index) {
            var x,
                tmp,
                a = $(this),
                i = a.find("img"),
                data = a.data("poptrox");
            if (data == "ignore") {
                return;
            }
            if (!a.attr("href")) {
                return;
            }
            x = { src: a.attr("href"), captionText: i.attr("title"), width: null, height: null, type: null, object: null, options: null };
            if (!settings.caption) {
                c = i.attr("title");
            } else {
                if (typeof settings.caption == "function") {
                    c = settings.caption(a);
                } else {
                    if ("selector" in settings.caption) {
                        var s;
                        s = a.find(settings.caption.selector);
                        if ("attribute" in settings.caption) {
                            c = s.attr(settings.caption.attribute);
                        } else {
                            c = s.html();
                            if (settings.caption.remove === true) {
                                s.remove();
                            }
                        }
                    }
                }
            }
            x.captionText = c;
            if (data) {
                var b = data.split(",");
                if (0 in b) {
                    x.type = b[0];
                }
                if (1 in b) {
                    tmp = b[1].match(/([0-9%]+)x([0-9%]+)/);
                    if (tmp && tmp.length == 3) {
                        x.width = tmp[1];
                        x.height = tmp[2];
                    }
                }
                if (2 in b) {
                    x.options = b[2];
                }
            }
            if (!x.type) {
                tmp = x.src.match(/\/\/([a-z0-9\.]+)\/.*/);
                if (!tmp || tmp.length < 2) {
                    tmp = [false];
                }
                switch (tmp[1]) {
                    case "api.soundcloud.com":
                        x.type = "soundcloud";
                        break;
                    case "youtu.be":
                        x.type = "youtube";
                        break;
                    case "vimeo.com":
                        x.type = "vimeo";
                        break;
                    case "wistia.net":
                        x.type = "wistia";
                        break;
                    case "bcove.me":
                        x.type = "bcove";
                        break;
                    default:
                        x.type = "image";
                        break;
                }
            }
            tmp = x.src.match(/\/\/[a-z0-9\.]+\/(.*)/);
            switch (x.type) {
                case "iframe":
                    x.object = $('<iframe src="" frameborder="0"></iframe>');
                    x.object
                        .on("click", function (e) {
                            e.stopPropagation();
                        })
                        .css("cursor", "auto");
                    if (!x.width || !x.height) {
                        x.width = "600";
                        x.height = "400";
                    }
                    break;
                case "ajax":
                    x.object = $('<div class="poptrox-ajax"></div>');
                    x.object
                        .on("click", function (e) {
                            e.stopPropagation();
                        })
                        .css("cursor", "auto")
                        .css("overflow", "auto");
                    if (!x.width || !x.height) {
                        x.width = "600";
                        x.height = "400";
                    }
                    break;
                case "soundcloud":
                    x.object = $('<iframe scrolling="no" frameborder="no" src=""></iframe>');
                    x.src = "//w.soundcloud.com/player/?url=" + escape(x.src) + (x.options ? "&" + x.options : "");
                    x.width = "600";
                    x.height = "166";
                    break;
                case "youtube":
                    x.object = $('<iframe src="" frameborder="0" allowfullscreen="1"></iframe>');
                    x.src = "//www.youtube.com/embed/" + tmp[1] + (x.options ? "?" + x.options : "");
                    if (!x.width || !x.height) {
                        x.width = "800";
                        x.height = "480";
                    }
                    break;
                case "vimeo":
                    x.object = $('<iframe src="" frameborder="0" allowFullScreen="1"></iframe>');
                    x.src = "//player.vimeo.com/video/" + tmp[1] + (x.options ? "?" + x.options : "");
                    if (!x.width || !x.height) {
                        x.width = "800";
                        x.height = "480";
                    }
                    break;
                case "wistia":
                    x.object = $('<iframe src="" frameborder="0" allowFullScreen="1"></iframe>');
                    x.src = "//fast.wistia.net/" + tmp[1] + (x.options ? "?" + x.options : "");
                    if (!x.width || !x.height) {
                        x.width = "800";
                        x.height = "480";
                    }
                    break;
                case "bcove":
                    x.object = $('<iframe src="" frameborder="0" allowFullScreen="1" width="100%"></iframe>');
                    x.src = "//bcove.me/" + tmp[1] + (x.options ? "?" + x.options : "");
                    if (!x.width || !x.height) {
                        x.width = "640";
                        x.height = "360";
                    }
                    break;
                default:
                    x.object = $('<img src="" alt="" style="vertical-align:bottom" />');
                    if (settings.preload) {
                        var tmp = document.createElement("img");
                        tmp.src = x.src;
                        cache.push(tmp);
                    }
                    x.width = a.attr("width");
                    x.height = a.attr("height");
                    break;
            }
            if (window.location.protocol == "file:" && x.src.match(/^\/\//)) {
                x.src = "http:" + x.src;
            }
            queue.push(x);
            i.attr("title", "");
            a.attr("href", "")
                .css("outline", 0)
                .on("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $popup.trigger("poptrox_open", [index]);
                });
        });
        return $(this);
    };
})(jQuery);
