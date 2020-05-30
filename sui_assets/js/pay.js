$(function () {
    var key_json = {};
    var shopId, tableId, version = 'ALIPAY';
    if (location.search) {
        var key_str = location.search.substr(1);
        for (var i = 0; i < key_str.split("&").length; i++) {
            var j = key_str.split("&")[i].split("=");
            key_json[j[0]] = j[1];
        }
        if (key_json.id) {
            localStorage.setItem("id", key_json.id);
            localStorage.setItem("d", key_json.d || '');
            shopId = key_json.id;
            tableId = key_json.d;
        } else if (localStorage.getItem("id")) {
            shopId = localStorage.getItem("id");
            tableId = localStorage.getItem("d");
        }
    }
    if (!shopId && !key_json.code) {
        location.href = "error.html?url=" + location.href;
    }
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        version = 'WXPAY';
    }
    if ($.fn.cookie("token")) {
        pay();
    } else {
        auth();
    }

    function auth() {
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            if (key_json.appid && key_json.code) {
                var json1 = {};
                json1.code = key_json.code;
                json1.appid = key_json.appid;
                rest("/auth/user", json1, "post", function (data1) {
                    if (data1.code == 200) {
                        var token = data1.result.token;
                        $.fn.cookie("token", token, {"expires": 30});
                        pay();
                    } else {
                        redirectFn(function () {
                            location.href = "auth?url=" + encodeURIComponent(location.href) + "&durl=" + encodeURIComponent(redirect);
                        });
                    }
                });
            } else {
                redirectFn(function () {
                    location.href = "auth?url=" + encodeURIComponent(location.href) + "&durl=" + encodeURIComponent(redirect);
                });
            }
        } else {
            //支付宝没有检测登陆的接口，直接授权
            if (key_json.auth_code) {
                rest("/auth/alipay/user", {"code": key_json.auth_code}, "post", function (data) {
                    if (data.code == 200) {
                        var token = data.result.token;
                        $.fn.cookie("token", token, {"expires": 30});
                        pay();
                    }
                });
            } else {
                redirectFn(function () {
                    location.href = "auth/alipay?url=" + encodeURIComponent(location.href) + "&durl=" + encodeURIComponent(redirect);
                });
            }
        }
    }

    function pay() {
        new Vue({
            el: '#app',
            data: {
                data: {},
                post: {
                    amount: ''
                },
                version: version,
                payment: "",
                cursor: true,
                aIllegal: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0..', '.'],
                decimal: 2,
                inter: 5,
                disable: false
            },
            created: function () {
                var _self = this;
                rest("/shop/" + shopId + "/paymode", {"type": version}, "get", function (data1) {
                    if (data1.code == 200) {
                        if (data1.result.oasis) {
                            location.href = location.origin + "/author/" + shopId + "/fuiou?url=" + encodeURIComponent(location.href);
                            return;
                        }
                        _self.payment = data1.result.payMode;
                    } else if (data1.code == 403000) {
                        $.fn.cookie("cookie", "", {"expires": 0});
                        auth();
                    }
                });
                var para = {};
                para.type = version == "WXPAY" ? "wx" : "ali";
                if (key_json.d) {
                    para.tableId = key_json.d;
                }
                rest("/shop/" + shopId, para, "get", function (data1) {
                    if (data1.code == 200) {
                        _self.data = data1.result;
                        _self.intervalID = setInterval(function () {
                            _self.cursor = !_self.cursor;
                        }, 500);
                    }
                });
            },
            methods: {
                passCheck: function (val) {
                    /*验证规则*/
                    var aRules = [
                        this.illegalInput,
                        this.illegalValue,
                        this.accuracy
                    ];
                    return aRules.every(function (item) {
                        return item(val);
                    });
                },
                illegalInput: function (val) {
                    if (this.aIllegal.indexOf(val) > -1) {
                        return false;
                    }
                    return true;
                },
                /*非法值*/
                illegalValue: function (val) {
                    if (parseFloat(val) != val) {
                        return false;
                    }
                    return true;
                },
                /*验证精度*/
                accuracy: function (val) {
                    var v = val.split('.');
                    if (v[0].length > this.inter) {
                        return false;
                    }
                    if (v[1] && (v[1].length) > this.decimal) {
                        return false;
                    }
                    return true;
                },
                typing: function (type) {
                    var str = this.post.amount;
                    if (type === '') {
                        str = str.slice(0, -1);
                    } else {
                        /*保存旧的值*/
                        var oldValue = str;
                        /*获取新的值*/
                        str = oldValue + type;
                        /*检验新值, 如果没有通过检测, 恢复值*/
                        if (!this.passCheck(str)) {
                            str = oldValue;
                            return;
                        }
                    }
                    Vue.set(this.post, 'amount', str)
                },
                submit: function () {
                    var _self = this;
                    this.disable = true;
                    if (!this.post.amount || !parseFloat(this.post.amount)) {
                        // alert("请先输入金额");
                        _self.disable = false;
                        return;
                    }
                    if (!_self.payment) {
                        _self.disable = false;
                        alert("没有可用的支付方式");
                        return;
                    }
                    if (this.post.amount.charAt(this.post.amount.length - 1) == '.') {
                        this.post.amount += '0';
                    }
                    var json = {
                        "amount": this.post.amount,
                        "url": location.href,
                        "payCategory": _self.payment
                    };
                    if (key_json.d) {
                        json.tableId = key_json.d;
                    }
                    rest("/check/shop/" + shopId + "/pay", json, "post", function (data) {
                        if (data.code == 200) {
                            switch (_self.payment) {
                                case "1005":
                                    var js = data.result.js;
                                    var pay = data.result.pay;
                                    pay.success = function () {
                                        _self.disable = false;
                                        alert("支付成功")
                                    };
                                    pay.cancel = function () {
                                        _self.disable = false;
                                    };
                                    pay.fail = function (res) {
                                        _self.disable = false;
                                        alert("支付失败");
                                    };
                                    js.debug = false;
                                    js.jsApiList = ['chooseWXPay'];
                                    delete js.url;
                                    wx.config(js);
                                    wx.ready(function () {
                                        wx.chooseWXPay(pay);
                                    });
                                    break;
                                case "1101":
                                    AlipayJSBridge.call("tradePay", {
                                        tradeNO: data.result.pay.tradeNO
                                    }, function (result) {
                                        if (result.resultCode == "6001") {
                                            _self.disable = false;
                                            return;
                                        }
                                        if (result.resultCode == "9000") {
                                            _self.disable = false;
                                            alert("支付成功")
                                        }
                                    });
                                    break;
                            }

                        } else {
                            _self.disable = false;
                            alert(data.message);
                        }
                    });
                }
            }
        });
    }

    var redirect = "";

    function redirectFn(action) {
        redirect = "/pay.html?id=" + shopId;
        if (tableId) {
            redirect += "&d=" + tableId;
        }
        action();
    }

    function rest(u, j, h, f) { //json, url,http
        $.fn.cookie("apikey", "6b774cc5eb7d45818a9c7cc0a4b6920f", {'expires': 30, path: "/"});
        var url = location.origin + u;
        var data = {};
        if (h == "get") {
            data = objSort(j);
        } else {
            url += "?" + sortUrl();
            data = JSON.stringify(j);
        }

        /*     加密     */
        function objSort(r) {
            var t = "037925fa578c4ed98885d7b28ade5462", e = [];
            if (Object.keys(r).length) {
                for (var a in r) e.push(a)
            }
            r.timestamp = (new Date).getTime(), e.push("timestamp"), e.sort();
            var n = "", f = {};
            for (var h in e) n += e[h] + "=" + r[e[h]], f[e[h]] = r[e[h]];
            n += t;
            for (var i = hex_md5(n), m = "", o = 0; o < i.length; o += 2) m += i.charAt(o);
            for (var s = 1; s < i.length; s += 2) m += i.charAt(s);
            f.signature = m;
            return f;
        }

        function sortUrl() {
            for (var r = "037925fa578c4ed98885d7b28ade5462", t = (new Date).getTime(), e = hex_md5("timestamp=" + t + r), a = "", n = 0; n < e.length; n += 2) a += e.charAt(n);
            for (var f = 1; f < e.length; f += 2) a += e.charAt(f);
            var h = "";
            return h = "timestamp=" + t + "&signature=" + a;
        }

        /*     加密     */
        $.ajax({
            url: url,
            data: data,
            timeout: 10000,
            type: h,
            dataType: "json",
            async: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-Type", "application/json");
            }, //这里设置header
            success: function (data) {
                if (data.code == 400000) {
                    location.href = "error.html#7";
                } else {
                    f(data);
                }
            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    a.abort();
                    alert("超时");
                }
            }
        });
    }
})
