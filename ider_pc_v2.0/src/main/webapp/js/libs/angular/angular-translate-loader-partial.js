/*!
 * angular-translate - v2.18.1 - 2018-05-19
 *
 * Copyright (c) 2018 The angular-translate team, Pascal Precht; Licensed MIT
 */
!function (t, e) {
    "function" == typeof define && define.amd ? define([], function () {
        return e()
    }) : "object" == typeof module && module.exports ? module.exports = e() : e()
}(0, function () {
    function t() {
        "use strict";
        function a(t, e, r) {
            this.name = t, this.isActive = !0, this.tables = {}, this.priority = e || 0, this.langPromises = {}, this.urlTemplate = r
        }

        a.prototype.parseUrl = function (t, e) {
            return angular.isFunction(t) ? t(this.name, e) : t.replace(/\{part\}/g, this.name).replace(/\{lang\}/g, e)
        }, a.prototype.getTable = function (e, t, r, a, n, i) {
            var o = this, s = this.langPromises[e], l = t.defer(), u = function (t) {
                o.tables[e] = t, l.resolve(t)
            }, c = function () {
                l.reject(o.name)
            }, p = function () {
                r(angular.extend({method: "GET", url: o.parseUrl(o.urlTemplate || n, e)}, a)).then(function (t) {
                    u(t.data)
                }, function (t) {
                    i ? i(o.name, e, t).then(u, c) : c()
                })
            };
            return this.tables[e] ? l.resolve(this.tables[e]) : (s ? s.then(l.resolve, p) : p(), this.langPromises[e] = l.promise), l.promise
        };
        var n = {};

        function i(t) {
            return Object.prototype.hasOwnProperty.call(n, t)
        }

        function f(t) {
            return angular.isString(t) && "" !== t
        }

        function t(t) {
            if (!f(t))throw new TypeError("Invalid type of a first argument, a non-empty string expected.");
            return i(t) && n[t].isActive
        }

        function d() {
            var t = [];
            for (var e in n)n[e].isActive && t.push(n[e]);
            return t.sort(function (t, e) {
                return t.priority - e.priority
            }), t
        }

        this.addPart = function (t, e, r) {
            if (!f(t))throw new TypeError("Couldn't add part, part name has to be a string!");
            return i(t) || (n[t] = new a(t, e, r)), n[t].isActive = !0, this
        }, this.setPart = function (t, e, r) {
            if (!f(t))throw new TypeError("Couldn't set part.`lang` parameter has to be a string!");
            if (!f(e))throw new TypeError("Couldn't set part.`part` parameter has to be a string!");
            if ("object" != typeof r || null === r)throw new TypeError("Couldn't set part. `table` parameter has to be an object!");
            return i(e) || (n[e] = new a(e), n[e].isActive = !1), n[e].tables[t] = r, this
        }, this.deletePart = function (t) {
            if (!f(t))throw new TypeError("Couldn't delete part, first arg has to be string.");
            return i(t) && (n[t].isActive = !1), this
        }, this.isPartAvailable = t, this.$get = ["$rootScope", "$injector", "$q", "$http", "$log", function (o, s, l, u, c) {
            var p = function (r) {
                if (!f(r.key))throw new TypeError("Unable to load data, a key is not a non-empty string.");
                if (!f(r.urlTemplate) && !angular.isFunction(r.urlTemplate))throw new TypeError("Unable to load data, a urlTemplate is not a non-empty string or not a function.");
                var e = r.loadFailureHandler;
                if (void 0 !== e) {
                    if (!angular.isString(e))throw new Error("Unable to load data, a loadFailureHandler is not a string.");
                    e = s.get(e)
                }
                var a = [], t = d();
                angular.forEach(t, function (t) {
                    a.push(t.getTable(r.key, l, u, r.$http, r.urlTemplate, e)), t.urlTemplate = t.urlTemplate || r.urlTemplate
                });
                var n = !1, i = o.$on("$translatePartialLoaderStructureChanged", function () {
                    n = !0
                });
                return l.all(a).then(function () {
                    if (i(), n) {
                        if (!r.__retries)return r.__retries = (r.__retries || 0) + 1, p(r);
                        c.warn("The partial loader has detected a multiple structure change (with addPort/removePart) while loading translations. You should consider using promises of $translate.use(lang) and $translate.refresh(). Also parts should be added/removed right before an explicit refresh if possible.")
                    }
                    var e = {};
                    return t = d(), angular.forEach(t, function (t) {
                        !function t(e, r) {
                            for (var a in r)r[a] && r[a].constructor && r[a].constructor === Object ? (e[a] = e[a] || {}, t(e[a], r[a])) : e[a] = r[a];
                            return e
                        }(e, t.tables[r.key])
                    }), e
                }, function () {
                    return i(), l.reject(r.key)
                })
            };
            return p.addPart = function (t, e, r) {
                if (!f(t))throw new TypeError("Couldn't add part, first arg has to be a string");
                return i(t) ? n[t].isActive || (n[t].isActive = !0, o.$emit("$translatePartialLoaderStructureChanged", t)) : (n[t] = new a(t, e, r), o.$emit("$translatePartialLoaderStructureChanged", t)), p
            }, p.deletePart = function (r, t) {
                if (!f(r))throw new TypeError("Couldn't delete part, first arg has to be string");
                if (void 0 === t)t = !1; else if ("boolean" != typeof t)throw new TypeError("Invalid type of a second argument, a boolean expected.");
                if (i(r)) {
                    var e = n[r].isActive;
                    if (t) {
                        var a = s.get("$translate").loaderCache();
                        "string" == typeof a && (a = s.get(a)), "object" == typeof a && angular.forEach(n[r].tables, function (t, e) {
                            a.remove(n[r].parseUrl(n[r].urlTemplate, e))
                        }), delete n[r]
                    } else n[r].isActive = !1;
                    e && o.$emit("$translatePartialLoaderStructureChanged", r)
                }
                return p
            }, p.isPartLoaded = function (t, e) {
                return angular.isDefined(n[t]) && angular.isDefined(n[t].tables[e])
            }, p.getRegisteredParts = function () {
                var e = [];
                return angular.forEach(n, function (t) {
                    t.isActive && e.push(t.name)
                }), e
            }, p.isPartAvailable = t, p
        }]
    }

    return angular.module("pascalprecht.translate").provider("$translatePartialLoader", t), t.displayName = "$translatePartialLoader", "pascalprecht.translate"
});