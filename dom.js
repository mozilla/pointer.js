var dom = (function(win, doc, undefined) {

    function dom(sel) {

        if (sel === window) return window;
        var ret = sel.nodeType ? [sel] : arr(doc.querySelectorAll(sel));

        ret.on = function (type, handler) {
            ret.forEach(function(el) {
                on(el, type, handler)
            });
            return ret;
        };
        ret.delegate = function (type, sel, handler) {
            ret.forEach(function(delegateEl) {
                on(delegateEl, type, function(e,t) {
                    var matches = delegateEl.querySelectorAll(sel);
                    if (!matches.length) return;
                    for (var el = t; el.parentNode && el != delegateEl; el = el.parentNode) {
                        for (var i = 0; i < matches.length; i++) {
                            if (matches[i] == el) {
                                handler.call(el, e);
                                return;
                            }
                        }
                    }
                });
            });
            return ret;
        };
        ret.css = function (o) {
            if (typeof o == 'object') {
                for (var i in o) {
                    if (!o.hasOwnProperty(i)) continue;
                    ret.forEach(function(el) {
                        el.style.setProperty(i, o[i]);
                    });
                }
                return ret;
            }
            return win.getComputedStyle(ret[0]).getPropertyValue(o);
        };
        ret.attr = function (o) {
            if (typeof o == 'object') {
                for (var i in o) {
                    if (!o.hasOwnProperty(i)) continue;
                    ret.forEach(function(el) {
                        el.setAttribute(i, o[i]);
                    });
                }
                return ret;
            }
            return ret[0].getAttribute(o);
        };
        ret.prop = function (o) {
            ret.forEach(function(el) {
                extend(el, o);
            });
            return ret;
        };
        ret.append = function (el) {
            ret[0].appendChild(el.length ? el[0] : el);
            return ret;
        };
        ret.empty = function () {
            ret.forEach(empty);
            return ret;
        };
        ret.text = function (s) {
            ret[0].appendChild(doc.createTextNode(s));
            return ret;
        };

        return ret;
    };

    var arr = dom.arr = function(a, i) {
        return Array.prototype.slice.call(a, i || 0);
    };
    var extend = dom.extend = function extend(d, s) {
        for (p in s) {
            if (s.hasOwnProperty(p)) {
                d[p] = s[p];
            }
        }
    };
    var on = dom.on = function on(obj, type, handler) {
        obj.addEventListener(type, function(e) {
            handler(e, e.target);
        }, false);
    };

    var empty = dom.empty = function empty(el) {
        while (el.childNodes.length) {
            el.removeChild(el.firstChild);
        }
    };

    dom.tag = function tag(name) {
        return dom(doc.createElement(name));
    };

    return dom;

})(window, document);
