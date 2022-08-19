var u = {}, a = {}, s = {}, r = {};


(function (e) {
    "use strict";
    var i, r, f, n = (i = 1,
        r = 8,
        f = 32,
    {
        "getEncryption": function (t, e, n, o) {
            n = n || "",
                t = t || "";
            for (var o = o ? t : l(t), t = l(w(o) + e), n = u["default"].strToBytes(n.toUpperCase(), !0), i = Number(n.length / 2).toString(16); i.length < 4;)
                i = "0" + i;
            u["default"].initkey(t),
                n = u["default"].encrypt(o + u["default"].strToBytes(e) + i + n),
                u["default"].initkey("");
            for (var r = Number(n.length / 2).toString(16); r.length < 4;)
                r = "0" + r;
            return n = a["default"].rsa_encrypt(w(r + n)),
                setTimeout(function () {
                    !function (t, e) {
                        if (!(Math.random() > (e || 1)))
                            try {
                                var n = location.protocol + "//ui.ptlogin2.qq.com/cgi-bin/report?id=" + t;
                                document.createElement("img").src = n
                            } catch (o) { }
                    }(488358, 1)
                }, 0),
                s["default"].encode(w(n)).replace(/[\/\+=]/g, function (t) {
                    return {
                        "/": "-",
                        "+": "*",
                        "=": "_"
                    }[t]
                })
        },
        "getRSAEncryption": function (t, e, n) {
            return e = (n ? t : l(t)) + e.toUpperCase(),
                a["default"].rsa_encrypt(e)
        },
        "md5": l
    });
    function l(t) {
        return v(c(y(t = t), t.length * r))
    }
    function c(t, e) {
        t[e >> 5] |= 128 << e % 32,
            t[14 + (e + 64 >>> 9 << 4)] = e;
        for (var n = 1732584193, o = -271733879, i = -1732584194, r = 271733878, a = 0; a < t.length; a += 16) {
            var u = n
                , s = o
                , l = i
                , c = r
                , n = p(n, o, i, r, t[a + 0], 7, -680876936)
                , r = p(r, n, o, i, t[a + 1], 12, -389564586)
                , i = p(i, r, n, o, t[a + 2], 17, 606105819)
                , o = p(o, i, r, n, t[a + 3], 22, -1044525330);
            n = p(n, o, i, r, t[a + 4], 7, -176418897),
                r = p(r, n, o, i, t[a + 5], 12, 1200080426),
                i = p(i, r, n, o, t[a + 6], 17, -1473231341),
                o = p(o, i, r, n, t[a + 7], 22, -45705983),
                n = p(n, o, i, r, t[a + 8], 7, 1770035416),
                r = p(r, n, o, i, t[a + 9], 12, -1958414417),
                i = p(i, r, n, o, t[a + 10], 17, -42063),
                o = p(o, i, r, n, t[a + 11], 22, -1990404162),
                n = p(n, o, i, r, t[a + 12], 7, 1804603682),
                r = p(r, n, o, i, t[a + 13], 12, -40341101),
                i = p(i, r, n, o, t[a + 14], 17, -1502002290),
                n = h(n, o = p(o, i, r, n, t[a + 15], 22, 1236535329), i, r, t[a + 1], 5, -165796510),
                r = h(r, n, o, i, t[a + 6], 9, -1069501632),
                i = h(i, r, n, o, t[a + 11], 14, 643717713),
                o = h(o, i, r, n, t[a + 0], 20, -373897302),
                n = h(n, o, i, r, t[a + 5], 5, -701558691),
                r = h(r, n, o, i, t[a + 10], 9, 38016083),
                i = h(i, r, n, o, t[a + 15], 14, -660478335),
                o = h(o, i, r, n, t[a + 4], 20, -405537848),
                n = h(n, o, i, r, t[a + 9], 5, 568446438),
                r = h(r, n, o, i, t[a + 14], 9, -1019803690),
                i = h(i, r, n, o, t[a + 3], 14, -187363961),
                o = h(o, i, r, n, t[a + 8], 20, 1163531501),
                n = h(n, o, i, r, t[a + 13], 5, -1444681467),
                r = h(r, n, o, i, t[a + 2], 9, -51403784),
                i = h(i, r, n, o, t[a + 7], 14, 1735328473),
                n = g(n, o = h(o, i, r, n, t[a + 12], 20, -1926607734), i, r, t[a + 5], 4, -378558),
                r = g(r, n, o, i, t[a + 8], 11, -2022574463),
                i = g(i, r, n, o, t[a + 11], 16, 1839030562),
                o = g(o, i, r, n, t[a + 14], 23, -35309556),
                n = g(n, o, i, r, t[a + 1], 4, -1530992060),
                r = g(r, n, o, i, t[a + 4], 11, 1272893353),
                i = g(i, r, n, o, t[a + 7], 16, -155497632),
                o = g(o, i, r, n, t[a + 10], 23, -1094730640),
                n = g(n, o, i, r, t[a + 13], 4, 681279174),
                r = g(r, n, o, i, t[a + 0], 11, -358537222),
                i = g(i, r, n, o, t[a + 3], 16, -722521979),
                o = g(o, i, r, n, t[a + 6], 23, 76029189),
                n = g(n, o, i, r, t[a + 9], 4, -640364487),
                r = g(r, n, o, i, t[a + 12], 11, -421815835),
                i = g(i, r, n, o, t[a + 15], 16, 530742520),
                n = m(n, o = g(o, i, r, n, t[a + 2], 23, -995338651), i, r, t[a + 0], 6, -198630844),
                r = m(r, n, o, i, t[a + 7], 10, 1126891415),
                i = m(i, r, n, o, t[a + 14], 15, -1416354905),
                o = m(o, i, r, n, t[a + 5], 21, -57434055),
                n = m(n, o, i, r, t[a + 12], 6, 1700485571),
                r = m(r, n, o, i, t[a + 3], 10, -1894986606),
                i = m(i, r, n, o, t[a + 10], 15, -1051523),
                o = m(o, i, r, n, t[a + 1], 21, -2054922799),
                n = m(n, o, i, r, t[a + 8], 6, 1873313359),
                r = m(r, n, o, i, t[a + 15], 10, -30611744),
                i = m(i, r, n, o, t[a + 6], 15, -1560198380),
                o = m(o, i, r, n, t[a + 13], 21, 1309151649),
                n = m(n, o, i, r, t[a + 4], 6, -145523070),
                r = m(r, n, o, i, t[a + 11], 10, -1120210379),
                i = m(i, r, n, o, t[a + 2], 15, 718787259),
                o = m(o, i, r, n, t[a + 9], 21, -343485551),
                n = _(n, u),
                o = _(o, s),
                i = _(i, l),
                r = _(r, c)
        }
        return 16 == f ? Array(o, i) : Array(n, o, i, r)
    }
    function d(t, e, n, o, i, r) {
        return _((r = _(_(e, t), _(o, r))) << (i = i) | r >>> 32 - i, n)
    }
    function p(t, e, n, o, i, r, a) {
        return d(e & n | ~e & o, t, e, i, r, a)
    }
    function h(t, e, n, o, i, r, a) {
        return d(e & o | n & ~o, t, e, i, r, a)
    }
    function g(t, e, n, o, i, r, a) {
        return d(e ^ n ^ o, t, e, i, r, a)
    }
    function m(t, e, n, o, i, r, a) {
        return d(n ^ (e | ~o), t, e, i, r, a)
    }
    function _(t, e) {
        var n = (65535 & t) + (65535 & e);
        return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n
    }
    function y(t) {
        for (var e = Array(), n = (1 << r) - 1, o = 0; o < t.length * r; o += r)
            e[o >> 5] |= (t.charCodeAt(o / r) & n) << o % 32;
        return e
    }
    function v(t) {
        for (var e = i ? "0123456789ABCDEF" : "0123456789abcdef", n = "", o = 0; o < 4 * t.length; o++)
            n += e.charAt(t[o >> 2] >> o % 4 * 8 + 4 & 15) + e.charAt(t[o >> 2] >> o % 4 * 8 & 15);
        return n
    }
    function w(t) {
        for (var e = [], n = 0; n < t.length; n += 2)
            e.push(String.fromCharCode(parseInt(t.substr(n, 2), 16)));
        return e.join("")
    }
    e["default"] = n
})(r);



(function (e) {
    "use strict";
    var l = ""
        , a = 0
        , i = []
        , u = []
        , s = 0
        , c = 0
        , f = []
        , d = []
        , p = !0;
    function h() {
        return Math.round(4294967295 * Math.random())
    }
    function g(t, e, n) {
        (!n || 4 < n) && (n = 4);
        for (var o = 0, i = e; i < e + n; i++)
            o <<= 8,
                o |= t[i];
        return (4294967295 & o) >>> 0
    }
    function m(t, e, n) {
        t[e + 3] = n >> 0 & 255,
            t[e + 2] = n >> 8 & 255,
            t[e + 1] = n >> 16 & 255,
            t[e + 0] = n >> 24 & 255
    }
    function _(t) {
        if (!t)
            return "";
        for (var e = "", n = 0; n < t.length; n++) {
            var o = Number(t[n]).toString(16);
            1 == o.length && (o = "0" + o),
                e += o
        }
        return e
    }
    function y(t) {
        i = new Array(8),
            u = new Array(8),
            s = c = 0,
            p = !0,
            a = 0;
        var e = t.length
            , n = 0;
        0 != (a = (e + 10) % 8) && (a = 8 - a),
            f = new Array(e + a + 10),
            i[0] = 255 & (248 & h() | a);
        for (var o = 1; o <= a; o++)
            i[o] = 255 & h();
        a++;
        for (o = 0; o < 8; o++)
            u[o] = 0;
        for (n = 1; n <= 2;)
            a < 8 && (i[a++] = 255 & h(),
                n++),
                8 == a && v();
        for (o = 0; 0 < e;)
            a < 8 && (i[a++] = t[o++],
                e--),
                8 == a && v();
        for (n = 1; n <= 7;)
            a < 8 && (i[a++] = 0,
                n++),
                8 == a && v();
        return f
    }
    function v() {
        for (var t = 0; t < 8; t++)
            i[t] ^= p ? u[t] : f[c + t];
        for (var e = function (t) {
            var e = 16
                , n = g(t, 0, 4)
                , o = g(t, 4, 4)
                , i = g(l, 0, 4)
                , r = g(l, 4, 4)
                , a = g(l, 8, 4)
                , u = g(l, 12, 4)
                , s = 0;
            for (; 0 < e--;)
                o = (4294967295 & (o += ((n = (4294967295 & (n += (o << 4) + i ^ o + (s = (4294967295 & (s += 2654435769)) >>> 0) ^ (o >>> 5) + r)) >>> 0) << 4) + a ^ n + s ^ (n >>> 5) + u)) >>> 0;
            t = new Array(8);
            return m(t, 0, n),
                m(t, 4, o),
                t
        }(i), t = 0; t < 8; t++)
            f[s + t] = e[t] ^ u[t],
                u[t] = i[t];
        c = s,
            s += 8,
            a = 0,
            p = !1
    }
    function w(t) {
        for (var e = 16, n = g(t, 0, 4), o = g(t, 4, 4), i = g(l, 0, 4), r = g(l, 4, 4), a = g(l, 8, 4), u = g(l, 12, 4), s = 3816266640; 0 < e--;)
            n = (4294967295 & (n -= ((o = (4294967295 & (o -= (n << 4) + a ^ n + s ^ (n >>> 5) + u)) >>> 0) << 4) + i ^ o + s ^ (o >>> 5) + r)) >>> 0,
                s = (4294967295 & (s -= 2654435769)) >>> 0;
        t = new Array(8);
        return m(t, 0, n),
            m(t, 4, o),
            t
    }
    function b() {
        d.length;
        for (var t = 0; t < 8; t++)
            u[t] ^= d[s + t];
        return u = w(u),
            s += 8,
            a = 0,
            1
    }
    function k(t, e) {
        var n = [];
        if (e)
            for (var o = 0; o < t.length; o++)
                n[o] = 255 & t.charCodeAt(o);
        else
            for (var i = 0, o = 0; o < t.length; o += 2)
                n[i++] = parseInt(t.substr(o, 2), 16);
        return n
    }
    var S = {
        "encrypt": function (t, e) {
            return _(y(k(t, e)))
        },
        "enAsBase64": function (t, e) {
            for (var n = y(k(t, e)), o = "", i = 0; i < n.length; i++)
                o += String.fromCharCode(n[i]);
            return r["default"].encode(o)
        },
        "decrypt": function (t) {
            return _(function (t) {
                var e = 0
                    , n = new Array(8)
                    , o = t.length;
                if (d = t,
                    o % 8 != 0 || o < 16)
                    return null;
                if (u = w(t),
                    (e = o - (a = 7 & u[0]) - 10) < 0)
                    return null;
                for (var i = 0; i < n.length; i++)
                    n[i] = 0;
                f = new Array(e),
                    c = 0,
                    s = 8,
                    a++;
                for (var r = 1; r <= 2;)
                    if (a < 8 && (a++,
                        r++),
                        8 == a && (n = t,
                            !b()))
                        return null;
                for (i = 0; 0 != e;)
                    if (a < 8 && (f[i] = 255 & (n[c + a] ^ u[a]),
                        i++,
                        e--,
                        a++),
                        8 == a && (n = t,
                            c = s - 8,
                            !b()))
                        return null;
                for (r = 1; r < 8; r++) {
                    if (a < 8) {
                        if (0 != (n[c + a] ^ u[a]))
                            return null;
                        a++
                    }
                    if (8 == a && (n = t,
                        c = s,
                        !b()))
                        return null
                }
                return f
            }(k(t, !1)))
        },
        "initkey": function (t, e) {
            l = k(t, e)
        },
        "bytesToStr": function (t) {
            for (var e = "", n = 0; n < t.length; n += 2)
                e += String.fromCharCode(parseInt(t.substr(n, 2), 16));
            return e
        },
        "strToBytes": function (t, e) {
            if (!t)
                return "";
            e && (t = function (t) {
                var e, n, o = [], i = t.length;
                for (e = 0; e < i; e++)
                    0 < (n = t.charCodeAt(e)) && n <= 127 ? o.push(t.charAt(e)) : 128 <= n && n <= 2047 ? o.push(String.fromCharCode(192 | n >> 6 & 31), String.fromCharCode(128 | 63 & n)) : 2048 <= n && n <= 65535 && o.push(String.fromCharCode(224 | n >> 12 & 15), String.fromCharCode(128 | n >> 6 & 63), String.fromCharCode(128 | 63 & n));
                return o.join("")
            }(t));
            for (var n = [], o = 0; o < t.length; o++)
                n[o] = t.charCodeAt(o);
            return _(n)
        },
        "bytesInStr": _,
        "dataFromStr": k
    };
    e["default"] = S
})(u);









(function(e) {
    "use strict";
    var o = function () {
        function i() {
            this.n = null,
                this.e = 0,
                this.d = null,
                this.p = null,
                this.q = null,
                this.dmp1 = null,
                this.dmq1 = null,
                this.coeff = null
        }
        var t;
        i.prototype.doPublic = function (t) {
            return t.modPowInt(this.e, this.n)
        }
            ,
            i.prototype.setPublic = function (t, e) {
                null != t && null != e && 0 < t.length && 0 < e.length ? (this.n = new _(t, 16),
                    this.e = parseInt(e, 16)) : uv_alert("Invalid RSA public key")
            }
            ,
            i.prototype.encrypt = function (t) {
                return null == (t = function (t, e) {
                    if (e < t.length + 11)
                        return uv_alert("Message too long for RSA"),
                            null;
                    for (var n = new Array, o = t.length - 1; 0 <= o && 0 < e;) {
                        var i = t.charCodeAt(o--);
                        n[--e] = i
                    }
                    n[--e] = 0;
                    for (var r = new w, a = new Array; 2 < e;) {
                        for (a[0] = 0; 0 == a[0];)
                            r.nextBytes(a);
                        n[--e] = a[0]
                    }
                    return n[--e] = 2,
                        n[--e] = 0,
                        new _(n)
                }(t, this.n.bitLength() + 7 >> 3)) || null == (t = this.doPublic(t)) ? null : 0 == (1 & (t = t.toString(16)).length) ? t : "0" + t
            }
            ;
        function _(t, e, n) {
            null != t && ("number" == typeof t ? this.fromNumber(t, e, n) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
        }
        function y() {
            return new _(null)
        }
        t = "Microsoft Internet Explorer" == 'Netscape' ? (_.prototype.am = function (t, e, n, o, i, r) {
            for (var a = 32767 & e, u = e >> 15; 0 <= --r;) {
                var s = 32767 & this[t]
                    , l = this[t++] >> 15
                    , c = u * s + l * a;
                i = ((s = a * s + ((32767 & c) << 15) + n[o] + (1073741823 & i)) >>> 30) + (c >>> 15) + u * l + (i >>> 30),
                    n[o++] = 1073741823 & s
            }
            return i
        }
            ,
            30) : "Netscape" != 'Netscape' ? (_.prototype.am = function (t, e, n, o, i, r) {
                for (; 0 <= --r;) {
                    var a = e * this[t++] + n[o] + i;
                    i = Math.floor(a / 67108864),
                        n[o++] = 67108863 & a
                }
                return i
            }
                ,
                26) : (_.prototype.am = function (t, e, n, o, i, r) {
                    for (var a = 16383 & e, u = e >> 14; 0 <= --r;) {
                        var s = 16383 & this[t]
                            , l = this[t++] >> 14
                            , c = u * s + l * a;
                        i = ((s = a * s + ((16383 & c) << 14) + n[o] + i) >> 28) + (c >> 14) + u * l,
                            n[o++] = 268435455 & s
                    }
                    return i
                }
                    ,
                    28),
            _.prototype.DB = t,
            _.prototype.DM = (1 << t) - 1,
            _.prototype.DV = 1 << t;
        _.prototype.FV = Math.pow(2, 52),
            _.prototype.F1 = 52 - t,
            _.prototype.F2 = 2 * t - 52;
        for (var e, n = "0123456789abcdefghijklmnopqrstuvwxyz", u = new Array, o = "0".charCodeAt(0), r = 0; r <= 9; ++r)
            u[o++] = r;
        for (o = "a".charCodeAt(0),
            r = 10; r < 36; ++r)
            u[o++] = r;
        for (o = "A".charCodeAt(0),
            r = 10; r < 36; ++r)
            u[o++] = r;
        function s(t) {
            return n.charAt(t)
        }
        function a(t) {
            var e = y();
            return e.fromInt(t),
                e
        }
        function v(t) {
            var e, n = 1;
            return 0 != (e = t >>> 16) && (t = e,
                n += 16),
                0 != (e = t >> 8) && (t = e,
                    n += 8),
                0 != (e = t >> 4) && (t = e,
                    n += 4),
                0 != (e = t >> 2) && (t = e,
                    n += 2),
                0 != (e = t >> 1) && (t = e,
                    n += 1),
                n
        }
        function l(t) {
            this.m = t
        }
        function c(t) {
            this.m = t,
                this.mp = t.invDigit(),
                this.mpl = 32767 & this.mp,
                this.mph = this.mp >> 15,
                this.um = (1 << t.DB - 15) - 1,
                this.mt2 = 2 * t.t
        }
        function f() {
            var t;
            t = (new Date).getTime(),
                d[p++] ^= 255 & t,
                d[p++] ^= t >> 8 & 255,
                d[p++] ^= t >> 16 & 255,
                d[p++] ^= t >> 24 & 255,
                k <= p && (p -= k)
        }
        if (l.prototype.convert = function (t) {
            return t.s < 0 || 0 <= t.compareTo(this.m) ? t.mod(this.m) : t
        }
            ,
            l.prototype.revert = function (t) {
                return t
            }
            ,
            l.prototype.reduce = function (t) {
                t.divRemTo(this.m, null, t)
            }
            ,
            l.prototype.mulTo = function (t, e, n) {
                t.multiplyTo(e, n),
                    this.reduce(n)
            }
            ,
            l.prototype.sqrTo = function (t, e) {
                t.squareTo(e),
                    this.reduce(e)
            }
            ,
            c.prototype.convert = function (t) {
                var e = y();
                return t.abs().dlShiftTo(this.m.t, e),
                    e.divRemTo(this.m, null, e),
                    t.s < 0 && 0 < e.compareTo(_.ZERO) && this.m.subTo(e, e),
                    e
            }
            ,
            c.prototype.revert = function (t) {
                var e = y();
                return t.copyTo(e),
                    this.reduce(e),
                    e
            }
            ,
            c.prototype.reduce = function (t) {
                for (; t.t <= this.mt2;)
                    t[t.t++] = 0;
                for (var e = 0; e < this.m.t; ++e) {
                    var n = 32767 & t[e]
                        , o = n * this.mpl + ((n * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
                    for (t[n = e + this.m.t] += this.m.am(0, o, t, e, 0, this.m.t); t[n] >= t.DV;)
                        t[n] -= t.DV,
                            t[++n]++
                }
                t.clamp(),
                    t.drShiftTo(this.m.t, t),
                    0 <= t.compareTo(this.m) && t.subTo(this.m, t)
            }
            ,
            c.prototype.mulTo = function (t, e, n) {
                t.multiplyTo(e, n),
                    this.reduce(n)
            }
            ,
            c.prototype.sqrTo = function (t, e) {
                t.squareTo(e),
                    this.reduce(e)
            }
            ,
            _.prototype.copyTo = function (t) {
                for (var e = this.t - 1; 0 <= e; --e)
                    t[e] = this[e];
                t.t = this.t,
                    t.s = this.s
            }
            ,
            _.prototype.fromInt = function (t) {
                this.t = 1,
                    this.s = t < 0 ? -1 : 0,
                    0 < t ? this[0] = t : t < -1 ? this[0] = t + DV : this.t = 0
            }
            ,
            _.prototype.fromString = function (t, e) {
                var n;
                if (16 == e)
                    n = 4;
                else if (8 == e)
                    n = 3;
                else if (256 == e)
                    n = 8;
                else if (2 == e)
                    n = 1;
                else if (32 == e)
                    n = 5;
                else {
                    if (4 != e)
                        return void this.fromRadix(t, e);
                    n = 2
                }
                this.t = 0,
                    this.s = 0;
                for (var o = t.length, i = !1, r = 0; 0 <= --o;) {
                    var a = 8 == n ? 255 & t[o] : (a = o,
                        null == (a = u[t.charCodeAt(a)]) ? -1 : a);
                    a < 0 ? "-" == t.charAt(o) && (i = !0) : (i = !1,
                        0 == r ? this[this.t++] = a : r + n > this.DB ? (this[this.t - 1] |= (a & (1 << this.DB - r) - 1) << r,
                            this[this.t++] = a >> this.DB - r) : this[this.t - 1] |= a << r,
                        (r += n) >= this.DB && (r -= this.DB))
                }
                8 == n && 0 != (128 & t[0]) && (this.s = -1,
                    0 < r && (this[this.t - 1] |= (1 << this.DB - r) - 1 << r)),
                    this.clamp(),
                    i && _.ZERO.subTo(this, this)
            }
            ,
            _.prototype.clamp = function () {
                for (var t = this.s & this.DM; 0 < this.t && this[this.t - 1] == t;)
                    --this.t
            }
            ,
            _.prototype.dlShiftTo = function (t, e) {
                for (var n = this.t - 1; 0 <= n; --n)
                    e[n + t] = this[n];
                for (n = t - 1; 0 <= n; --n)
                    e[n] = 0;
                e.t = this.t + t,
                    e.s = this.s
            }
            ,
            _.prototype.drShiftTo = function (t, e) {
                for (var n = t; n < this.t; ++n)
                    e[n - t] = this[n];
                e.t = Math.max(this.t - t, 0),
                    e.s = this.s
            }
            ,
            _.prototype.lShiftTo = function (t, e) {
                for (var n = t % this.DB, o = this.DB - n, i = (1 << o) - 1, r = Math.floor(t / this.DB), a = this.s << n & this.DM, u = this.t - 1; 0 <= u; --u)
                    e[u + r + 1] = this[u] >> o | a,
                        a = (this[u] & i) << n;
                for (u = r - 1; 0 <= u; --u)
                    e[u] = 0;
                e[r] = a,
                    e.t = this.t + r + 1,
                    e.s = this.s,
                    e.clamp()
            }
            ,
            _.prototype.rShiftTo = function (t, e) {
                e.s = this.s;
                var n = Math.floor(t / this.DB);
                if (n >= this.t)
                    e.t = 0;
                else {
                    var o = t % this.DB
                        , i = this.DB - o
                        , r = (1 << o) - 1;
                    e[0] = this[n] >> o;
                    for (var a = n + 1; a < this.t; ++a)
                        e[a - n - 1] |= (this[a] & r) << i,
                            e[a - n] = this[a] >> o;
                    0 < o && (e[this.t - n - 1] |= (this.s & r) << i),
                        e.t = this.t - n,
                        e.clamp()
                }
            }
            ,
            _.prototype.subTo = function (t, e) {
                for (var n = 0, o = 0, i = Math.min(t.t, this.t); n < i;)
                    o += this[n] - t[n],
                        e[n++] = o & this.DM,
                        o >>= this.DB;
                if (t.t < this.t) {
                    for (o -= t.s; n < this.t;)
                        o += this[n],
                            e[n++] = o & this.DM,
                            o >>= this.DB;
                    o += this.s
                } else {
                    for (o += this.s; n < t.t;)
                        o -= t[n],
                            e[n++] = o & this.DM,
                            o >>= this.DB;
                    o -= t.s
                }
                e.s = o < 0 ? -1 : 0,
                    o < -1 ? e[n++] = this.DV + o : 0 < o && (e[n++] = o),
                    e.t = n,
                    e.clamp()
            }
            ,
            _.prototype.multiplyTo = function (t, e) {
                var n = this.abs()
                    , o = t.abs()
                    , i = n.t;
                for (e.t = i + o.t; 0 <= --i;)
                    e[i] = 0;
                for (i = 0; i < o.t; ++i)
                    e[i + n.t] = n.am(0, o[i], e, i, 0, n.t);
                e.s = 0,
                    e.clamp(),
                    this.s != t.s && _.ZERO.subTo(e, e)
            }
            ,
            _.prototype.squareTo = function (t) {
                for (var e = this.abs(), n = t.t = 2 * e.t; 0 <= --n;)
                    t[n] = 0;
                for (n = 0; n < e.t - 1; ++n) {
                    var o = e.am(n, e[n], t, 2 * n, 0, 1);
                    (t[n + e.t] += e.am(n + 1, 2 * e[n], t, 2 * n + 1, o, e.t - n - 1)) >= e.DV && (t[n + e.t] -= e.DV,
                        t[n + e.t + 1] = 1)
                }
                0 < t.t && (t[t.t - 1] += e.am(n, e[n], t, 2 * n, 0, 1)),
                    t.s = 0,
                    t.clamp()
            }
            ,
            _.prototype.divRemTo = function (t, e, n) {
                var o = t.abs();
                if (!(o.t <= 0)) {
                    var i = this.abs();
                    if (i.t < o.t)
                        return null != e && e.fromInt(0),
                            void (null != n && this.copyTo(n));
                    null == n && (n = y());
                    var r = y()
                        , a = this.s
                        , u = t.s
                        , t = this.DB - v(o[o.t - 1]);
                    0 < t ? (o.lShiftTo(t, r),
                        i.lShiftTo(t, n)) : (o.copyTo(r),
                            i.copyTo(n));
                    var s = r.t
                        , l = r[s - 1];
                    if (0 != l) {
                        var i = l * (1 << this.F1) + (1 < s ? r[s - 2] >> this.F2 : 0)
                            , c = this.FV / i
                            , f = (1 << this.F1) / i
                            , d = 1 << this.F2
                            , p = n.t
                            , h = p - s
                            , g = null == e ? y() : e;
                        for (r.dlShiftTo(h, g),
                            0 <= n.compareTo(g) && (n[n.t++] = 1,
                                n.subTo(g, n)),
                            _.ONE.dlShiftTo(s, g),
                            g.subTo(r, r); r.t < s;)
                            r[r.t++] = 0;
                        for (; 0 <= --h;) {
                            var m = n[--p] == l ? this.DM : Math.floor(n[p] * c + (n[p - 1] + d) * f);
                            if ((n[p] += r.am(0, m, n, h, 0, s)) < m)
                                for (r.dlShiftTo(h, g),
                                    n.subTo(g, n); n[p] < --m;)
                                    n.subTo(g, n)
                        }
                        null != e && (n.drShiftTo(s, e),
                            a != u && _.ZERO.subTo(e, e)),
                            n.t = s,
                            n.clamp(),
                            0 < t && n.rShiftTo(t, n),
                            a < 0 && _.ZERO.subTo(n, n)
                    }
                }
            }
            ,
            _.prototype.invDigit = function () {
                if (this.t < 1)
                    return 0;
                var t = this[0];
                if (0 == (1 & t))
                    return 0;
                var e = 3 & t;
                return 0 < (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) ? this.DV - e : -e
            }
            ,
            _.prototype.isEven = function () {
                return 0 == (0 < this.t ? 1 & this[0] : this.s)
            }
            ,
            _.prototype.exp = function (t, e) {
                if (4294967295 < t || t < 1)
                    return _.ONE;
                var n, o = y(), i = y(), r = e.convert(this), a = v(t) - 1;
                for (r.copyTo(o); 0 <= --a;)
                    e.sqrTo(o, i),
                        0 < (t & 1 << a) ? e.mulTo(i, r, o) : (n = o,
                            o = i,
                            i = n);
                return e.revert(o)
            }
            ,
            _.prototype.toString = function (t) {
                if (this.s < 0)
                    return "-" + this.negate().toString(t);
                var e;
                if (16 == t)
                    e = 4;
                else if (8 == t)
                    e = 3;
                else if (2 == t)
                    e = 1;
                else if (32 == t)
                    e = 5;
                else {
                    if (4 != t)
                        return this.toRadix(t);
                    e = 2
                }
                var n, o = (1 << e) - 1, i = !1, r = "", a = this.t, u = this.DB - a * this.DB % e;
                if (0 < a--)
                    for (u < this.DB && 0 < (n = this[a] >> u) && (i = !0,
                        r = s(n)); 0 <= a;)
                        u < e ? (n = (this[a] & (1 << u) - 1) << e - u,
                            n |= this[--a] >> (u += this.DB - e)) : (n = this[a] >> (u -= e) & o,
                                u <= 0 && (u += this.DB,
                                    --a)),
                            0 < n && (i = !0),
                            i && (r += s(n));
                return i ? r : "0"
            }
            ,
            _.prototype.negate = function () {
                var t = y();
                return _.ZERO.subTo(this, t),
                    t
            }
            ,
            _.prototype.abs = function () {
                return this.s < 0 ? this.negate() : this
            }
            ,
            _.prototype.compareTo = function (t) {
                var e = this.s - t.s;
                if (0 != e)
                    return e;
                var n = this.t;
                if (0 != (e = n - t.t))
                    return e;
                for (; 0 <= --n;)
                    if (0 != (e = this[n] - t[n]))
                        return e;
                return 0
            }
            ,
            _.prototype.bitLength = function () {
                return this.t <= 0 ? 0 : this.DB * (this.t - 1) + v(this[this.t - 1] ^ this.s & this.DM)
            }
            ,
            _.prototype.mod = function (t) {
                var e = y();
                return this.abs().divRemTo(t, null, e),
                    this.s < 0 && 0 < e.compareTo(_.ZERO) && t.subTo(e, e),
                    e
            }
            ,
            _.prototype.modPowInt = function (t, e) {
                return e = new (t < 256 || e.isEven() ? l : c)(e),
                    this.exp(t, e)
            }
            ,
            _.ZERO = a(0),
            _.ONE = a(1),
            null == d) {
            var d = new Array
                , p = 0;
            if ("Netscape" == 'Netscape' && '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36' < "5" && window.crypto && window.crypto.random)
                for (var h = window.crypto.random(32), g = 0; g < h.length; ++g)
                    d[p++] = 255 & h.charCodeAt(g);
            for (; p < k;)
                g = Math.floor(65536 * Math.random()),
                    d[p++] = g >>> 8,
                    d[p++] = 255 & g;
            p = 0,
                f()
        }
        function m() {
            if (null == e) {
                for (f(),
                    (e = new b).init(d),
                    p = 0; p < d.length; ++p)
                    d[p] = 0;
                p = 0
            }
            return e.next()
        }
        function w() { }
        function b() {
            this.i = 0,
                this.j = 0,
                this.S = new Array
        }
        w.prototype.nextBytes = function (t) {
            for (var e = 0; e < t.length; ++e)
                t[e] = m()
        }
            ,
            b.prototype.init = function (t) {
                for (var e, n, o = 0; o < 256; ++o)
                    this.S[o] = o;
                for (o = e = 0; o < 256; ++o)
                    e = e + this.S[o] + t[o % t.length] & 255,
                        n = this.S[o],
                        this.S[o] = this.S[e],
                        this.S[e] = n;
                this.i = 0,
                    this.j = 0
            }
            ,
            b.prototype.next = function () {
                var t;
                return this.i = this.i + 1 & 255,
                    this.j = this.j + this.S[this.i] & 255,
                    t = this.S[this.i],
                    this.S[this.i] = this.S[this.j],
                    this.S[this.j] = t,
                    this.S[t + this.S[this.i] & 255]
            }
            ;
        var k = 256;
        return {
            "rsa_encrypt": function (t, e, n) {
                var o = new i;
                return o.setPublic("e9a815ab9d6e86abbf33a4ac64e9196d5be44a09bd0ed6ae052914e1a865ac8331fed863de8ea697e9a7f63329e5e23cda09c72570f46775b7e39ea9670086f847d3c9c51963b131409b1e04265d9747419c635404ca651bbcbc87f99b8008f7f5824653e3658be4ba73e4480156b390bb73bc1f8b33578e7a4e12440e9396f2552c1aff1c92e797ebacdc37c109ab7bce2367a19c56a033ee04534723cc2558cb27368f5b9d32c04d12dbd86bbd68b1d99b7c349a8453ea75d1b2e94491ab30acf6c46a36a75b721b312bedf4e7aad21e54e9bcbcf8144c79b6e3c05eb4a1547750d224c0085d80e6da3907c3d945051c13c7c1dcefd6520ee8379c4f5231ed", "10001"),
                    o.encrypt(t)
            }
        }
    }();
    e["default"] = o
})(a);




(function(e) {
    "use strict";
    var s = {
        "PADCHAR": "=",
        "ALPHA": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        "getbyte": function(t, e) {
            e = t.charCodeAt(e);
            if (255 < e)
                throw "INVALID_CHARACTER_ERR: DOM Exception 5";
            return e
        },
        "encode": function(t) {
            if (1 != arguments.length)
                throw "SyntaxError: Not enough arguments";
            var e, n, o = s.PADCHAR, i = s.ALPHA, r = s.getbyte, a = [], u = (t = "" + t).length - t.length % 3;
            if (0 == t.length)
                return t;
            for (e = 0; e < u; e += 3)
                n = r(t, e) << 16 | r(t, e + 1) << 8 | r(t, e + 2),
                a.push(i.charAt(n >> 18)),
                a.push(i.charAt(n >> 12 & 63)),
                a.push(i.charAt(n >> 6 & 63)),
                a.push(i.charAt(63 & n));
            switch (t.length - u) {
            case 1:
                n = r(t, e) << 16,
                a.push(i.charAt(n >> 18) + i.charAt(n >> 12 & 63) + o + o);
                break;
            case 2:
                n = r(t, e) << 16 | r(t, e + 1) << 8,
                a.push(i.charAt(n >> 18) + i.charAt(n >> 12 & 63) + i.charAt(n >> 6 & 63) + o)
            }
            return a.join("")
        }
    };
    e["default"] = s
})(s)



function uin2hex(str) {
    var maxLength = 16;
    str = parseInt(str);
    for (var hex = str.toString(16), len = hex.length, i = len; i < maxLength; i++)
        hex = "0" + hex;
    for (var arr = [], j = 0; j < maxLength; j += 2)
        arr.push("\\x" + hex.substr(j, 2));
    var result = arr.join("");
    return eval('result="' + result + '"'),
    result
}


// let p__ = r['default'].getEncryption("12345678", "\u0000\u0000\u0000\u0000\t ¾å", "!HJU", undefined);
// console.log(p__);

module.exports = {
    getEncryption(uin, passwd, flag) {
        let salt = uin2hex(uin.replace("@qq.com", ""))
        return r['default'].getEncryption(passwd, salt, flag, undefined);
    }
}