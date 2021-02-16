/* jquery.dropotron.js | @ajlkn */

(function ($) {
    $.fn.disableSelection_dropotron = function () {
        return $(this).css("user-select", "none").css("-khtml-user-select", "none").css("-moz-user-select", "none").css("-o-user-select", "none").css("-webkit-user-select", "none");
    };
    $.fn.dropotron = function (options) {
        if (this.length == 0) {
            return $(this);
        }
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++) {
                $(this[i]).dropotron(options);
            }
        }
        return $.dropotron($.extend({ selectorParent: $(this) }, options));
    };
    $.dropotron = function (options) {
        var settings = $.extend({ selectorParent: null, baseZIndex: 1000, menuClass: "dropotron", expandMode: "hover", hoverDelay: 150, hideDelay: 250, openerClass: "opener", openerActiveClass: "active", submenuClassPrefix: "level-", mode: "fade", speed: "fast", easing: "swing", alignment: "left", offsetX: 0, offsetY: 0, globalOffsetY: 0, IEOffsetX: 0, IEOffsetY: 0, noOpenerFade: true, detach: true, cloneOnDetach: true }, options);
        var $top = settings.selectorParent,
            $menus = $top.find("ul"),
            $body = $("body"),
            $bodyhtml = $("body,html"),
            $window = $(window);
        var isLocked = false,
            hoverTimeoutId = null,
            hideTimeoutId = null;
        $top.on("doCollapseAll", function () {
            $menus.trigger("doCollapse");
        });
        $menus.each(function () {
            var $menu = $(this),
                $opener = $menu.parent();
            if (settings.hideDelay > 0) {
                $menu.add($opener).on("mouseleave", function (e) {
                    window.clearTimeout(hideTimeoutId);
                    hideTimeoutId = window.setTimeout(function () {
                        $menu.trigger("doCollapse");
                    }, settings.hideDelay);
                });
            }
            $menu
                .disableSelection_dropotron()
                .hide()
                .addClass(settings.menuClass)
                .css("position", "absolute")
                .on("mouseenter", function (e) {
                    window.clearTimeout(hideTimeoutId);
                })
                .on("doExpand", function () {
                    if ($menu.is(":visible")) {
                        return false;
                    }
                    window.clearTimeout(hideTimeoutId);
                    $menus.each(function () {
                        var $this = $(this);
                        if (!$.contains($this.get(0), $opener.get(0))) {
                            $this.trigger("doCollapse");
                        }
                    });
                    var oo = $opener.offset(),
                        op = $opener.position(),
                        opp = $opener.parent().position(),
                        ow = $opener.outerWidth(),
                        mw = $menu.outerWidth(),
                        isTL = $menu.css("z-index") == settings.baseZIndex;
                    var x, c, left, top;
                    if (isTL) {
                        if (!settings.detach) {
                            x = op;
                        } else {
                            x = oo;
                        }
                        top = x.top + $opener.outerHeight() + settings.globalOffsetY;
                        c = settings.alignment;
                        $menu.removeClass("left").removeClass("right").removeClass("center");
                        switch (settings.alignment) {
                            case "right":
                                left = x.left - mw + ow;
                                if (left < 0) {
                                    left = x.left;
                                    c = "left";
                                }
                                break;
                            case "center":
                                left = x.left - Math.floor((mw - ow) / 2);
                                if (left < 0) {
                                    left = x.left;
                                    c = "left";
                                } else {
                                    if (left + mw > $window.width()) {
                                        left = x.left - mw + ow;
                                        c = "right";
                                    }
                                }
                                break;
                            case "left":
                            default:
                                left = x.left;
                                if (left + mw > $window.width()) {
                                    left = x.left - mw + ow;
                                    c = "right";
                                }
                                break;
                        }
                        $menu.addClass(c);
                    } else {
                        if ($opener.css("position") == "relative" || $opener.css("position") == "absolute") {
                            top = settings.offsetY;
                            left = -1 * op.left;
                        } else {
                            top = op.top + settings.offsetY;
                            left = 0;
                        }
                        switch (settings.alignment) {
                            case "right":
                                left += -1 * $opener.parent().outerWidth() + settings.offsetX;
                                break;
                            case "center":
                            case "left":
                            default:
                                left += $opener.parent().outerWidth() + settings.offsetX;
                                break;
                        }
                    }
                    if (navigator.userAgent.match(/MSIE ([0-9]+)\./) && RegExp.$1 < 8) {
                        left += settings.IEOffsetX;
                        top += settings.IEOffsetY;
                    }
                    $menu
                        .css("left", left + "px")
                        .css("top", top + "px")
                        .css("opacity", "0.01")
                        .show();
                    var tmp = false;
                    if ($opener.css("position") == "relative" || $opener.css("position") == "absolute") {
                        left = -1 * op.left;
                    } else {
                        left = 0;
                    }
                    if ($menu.offset().left < 0) {
                        left += $opener.parent().outerWidth() - settings.offsetX;
                        tmp = true;
                    } else {
                        if ($menu.offset().left + mw > $window.width()) {
                            left += -1 * $opener.parent().outerWidth() - settings.offsetX;
                            tmp = true;
                        }
                    }
                    if (tmp) {
                        $menu.css("left", left + "px");
                    }
                    $menu.hide().css("opacity", "1");
                    switch (settings.mode) {
                        case "zoom":
                            isLocked = true;
                            $opener.addClass(settings.openerActiveClass);
                            $menu.animate({ width: "toggle", height: "toggle" }, settings.speed, settings.easing, function () {
                                isLocked = false;
                            });
                            break;
                        case "slide":
                            isLocked = true;
                            $opener.addClass(settings.openerActiveClass);
                            $menu.animate({ height: "toggle" }, settings.speed, settings.easing, function () {
                                isLocked = false;
                            });
                            break;
                        case "fade":
                            isLocked = true;
                            if (isTL && !settings.noOpenerFade) {
                                var tmp;
                                if (settings.speed == "slow") {
                                    tmp = 80;
                                } else {
                                    if (settings.speed == "fast") {
                                        tmp = 40;
                                    } else {
                                        tmp = Math.floor(settings.speed / 2);
                                    }
                                }
                                $opener.fadeTo(tmp, 0.01, function () {
                                    $opener.addClass(settings.openerActiveClass);
                                    $opener.fadeTo(settings.speed, 1);
                                    $menu.fadeIn(settings.speed, function () {
                                        isLocked = false;
                                    });
                                });
                            } else {
                                $opener.addClass(settings.openerActiveClass);
                                $opener.fadeTo(settings.speed, 1);
                                $menu.fadeIn(settings.speed, function () {
                                    isLocked = false;
                                });
                            }
                            break;
                        case "instant":
                        default:
                            $opener.addClass(settings.openerActiveClass);
                            $menu.show();
                            break;
                    }
                    return false;
                })
                .on("doCollapse", function () {
                    if (!$menu.is(":visible")) {
                        return false;
                    }
                    $menu.hide();
                    $opener.removeClass(settings.openerActiveClass);
                    $menu.find("." + settings.openerActiveClass).removeClass(settings.openerActiveClass);
                    $menu.find("ul").hide();
                    return false;
                })
                .on("doToggle", function (e) {
                    if ($menu.is(":visible")) {
                        $menu.trigger("doCollapse");
                    } else {
                        $menu.trigger("doExpand");
                    }
                    return false;
                });
            $opener
                .disableSelection_dropotron()
                .addClass("opener")
                .css("cursor", "pointer")
                .on("click touchend", function (e) {
                    if (isLocked) {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    $menu.trigger("doToggle");
                });
            if (settings.expandMode == "hover") {
                $opener.hover(
                    function (e) {
                        if (isLocked) {
                            return;
                        }
                        hoverTimeoutId = window.setTimeout(function () {
                            $menu.trigger("doExpand");
                        }, settings.hoverDelay);
                    },
                    function (e) {
                        window.clearTimeout(hoverTimeoutId);
                    }
                );
            }
        });
        $menus
            .find("a")
            .css("display", "block")
            .on("click touchend", function (e) {
                if (isLocked) {
                    return;
                }
                if ($(this).attr("href").length < 1) {
                    e.preventDefault();
                }
            });
        $top.find("li")
            .css("white-space", "nowrap")
            .each(function () {
                var $this = $(this),
                    $a = $this.children("a"),
                    $ul = $this.children("ul"),
                    href = $a.attr("href");
                $a.on("click touchend", function (e) {
                    if (href.length == 0 || href == "#") {
                        e.preventDefault();
                    } else {
                        e.stopPropagation();
                    }
                });
                if ($a.length > 0 && $ul.length == 0) {
                    $this.on("click touchend", function (e) {
                        if (isLocked) {
                            return;
                        }
                        $top.trigger("doCollapseAll");
                        e.stopPropagation();
                    });
                }
            });
        $top.children("li").each(function () {
            var $opener = $(this),
                $menu = $opener.children("ul"),
                c;
            if ($menu.length > 0) {
                if (settings.detach) {
                    if (settings.cloneOnDetach) {
                        c = $menu.clone();
                        c.attr("class", "").hide().appendTo($menu.parent());
                    }
                    $menu.detach().appendTo($body);
                }
                for (var z = settings.baseZIndex, i = 1, y = $menu; y.length > 0; i++) {
                    y.css("z-index", z++);
                    if (settings.submenuClassPrefix) {
                        y.addClass(settings.submenuClassPrefix + (z - 1 - settings.baseZIndex));
                    }
                    y = y.find("> li > ul");
                }
            }
        });
        $window
            .on("scroll", function () {
                $top.trigger("doCollapseAll");
            })
            .on("keypress", function (e) {
                if (!isLocked && e.keyCode == 27) {
                    e.preventDefault();
                    $top.trigger("doCollapseAll");
                }
            });
        $bodyhtml.on("click touchend", function () {
            if (!isLocked) {
                $top.trigger("doCollapseAll");
            }
        });
    };
})(jQuery);
