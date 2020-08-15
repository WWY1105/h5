var key_json = {}, shopId = "", guestId, key = "", _id = "", version = "ALIPAY", stop = 1, payment, dataS = {};
//function common() {
//获取url的键值对

if (location.search) {
  var key_str = location.search.substr(1);
  for (var i = 0; i < key_str.split("&").length; i++) {
    var j = key_str.split("&")[i].split("=");
    key_json[j[0]] = j[1];
  }
  if (key_json.id) shopId = key_json.id;
  if (key_json.cashier) cashier = key_json.cashier;
  if (key_json.guestid) guestId = key_json.guestid;
  _id = key_json.id || key_json.guestid;
  if (!_id) location.href = "error.html";
  if (key_json.token) {
    $.fn.cookie("token", key_json.token, {'expires': 7});
  }
} else {
  location.href = "error.html";
}
$.config = {router: false};
//商户列表
var basicName = location.pathname.split(".")[0].split("/")[1];
//js的控制器
/*-----------auth for guest------------------*/
if (!$.fn.cookie("token")) {
  $.fn.cookie("url", location.href, {'expires': 0.0006});
  location.href = "index.html" + location.search.split("&state=1")[0];
}
var ua = window.navigator.userAgent.toLowerCase();

if (ua.match(/MicroMessenger/i) == 'micromessenger') {
  version = "WXPAY";
  if (!$.fn.cookie("token")) {
  } else if (!$.fn.cookie(_id)) {
    rest("/author/guest/" + _id + "/check", {}, "get", function (data) {
      if (data.code == 200) {
        //正确
        $.fn.cookie(_id, "true", {"expires": 1});
        eval(basicName)();
        $.fn.cookie("url", "", {'expires': 0});
      } else if (data.code == 403020) {
        //未授权
        location.href = location.origin + "/author/guest/" + _id + "?url=" + encodeURIComponent(location.href.split("&state=1")[0]);
      } else {
        //token非法
        $.fn.cookie("url", location.href, {'expires': 0.0006});
        location.href = "index.html" + location.search.split("&state=1")[0];
      }
    })
  } else {
    $.fn.cookie("url", "", {'expires': 0});
    eval(basicName)();
  }
} else {
  $.fn.cookie("url", {'expires': 0});
  eval(basicName)();
}

$(function () {
  if (shopId && version == "WXPAY" && basicName != "praise" && basicName != "paymentee" && basicName != "raffleActivity1") {
    // 通过下面这个API隐藏右上角按钮
    var wxJson = {};
    wxJson.url = location.href;
    //wxJson.shopId = shopId;
    rest("/auth/sign", wxJson, "post", function (data) {
      if (data.code == 200) {
        var result1 = data.result;
        result1.jsApiList = [
          'hideOptionMenu',
          'closeWindow'
        ];
        // wx.config(result1);
        // wx.ready(function () {
        //   wx.hideOptionMenu();
        // });
      }
    });
  }

  if (version == "WXPAY" && basicName == "orderDetail") {

    // 通过下面这个API隐藏右上角按钮
    var wxJson = {};
    wxJson.url = location.href;
    //wxJson.shopId = shopId;
    rest("/auth/sign", wxJson, "post", function (data) {
      if (data.code == 200) {
        var result1 = data.result;
        result1.jsApiList = [
          'hideOptionMenu',
          'closeWindow'
        ];
        wx.config(result1);
        wx.ready(function () {
          wx.hideMenuItems({
            menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          });
          wx.hideOptionMenu();
        });
      }
    });
  }

  $.fn.longPress = function (fn) {
    var timeout = undefined;
    var $this = this;
    for (var i = 0; i < $this.length; i++) {
      $this[i].addEventListener('touchstart', function (event) {
        timeout = setTimeout(fn, 800);  //长按时间超过800ms，则执行传入的方法
      }, false);
      $this[i].addEventListener('touchend', function (event) {
        clearTimeout(timeout);  //长按时间少于800ms，不会执行传入的方法
      }, false);
    }
  }
  $("body").on("click", ".coupon_show", function (e) {
    if ("deletefont" == e.target.classList[0]) return;
    var uri;
    var node = $(this);
    if ($(this).attr("index")) {
      ajaxUrl("couponDetail.html?cid=" + $(this).attr("index"))
      // uri = "/activities//coupon/" + $(this).attr("index");
    } else {
      uri = "/benefit/userCoupon/" + $(this).attr("id");
      if ($(this).find(".a4002").length || $(this).find(".a4003").length) {
        return;
      }
    }
    $.showIndicator();
    rest(uri, {}, "get", function (data) {
      if (data.code == 200) {
        var categoty = {
          "901": "本券买单时自动抵用",
          "902": "本券在买单时出示使用",
          "9021": "本券在买单时出示使用",
          "9011": "本券买单时自动抵用",
          "904": "到店出示给服务员即可使用",
          "9031": "到店出示给服务员即可使用",
          "903": "本券买单时自动抵用"
        };
        var result = data.result;
        var html = $(".popup-coupon");
        if (!html.length) {
          html = document.createElement("div");
          html.innerHTML = '<div class="popup popup-coupon bottom-fx"><div class="liner"><span class="text2"></span><span class="md-close"></span></div><div class="coupon-show-box"><div class="name_add"><div class="name"></div><div class="code"></div><div id="my-code"></div></div></div><div class="coupons-detail"></div>';
          $(".page-group").append(html);
          html = $(".popup-coupon");
        }
        html.find(".text2").html(categoty[result.category]);
        html.find(".name").html(result.name);
        var str = "";
        if (result.category == "902" || result.category == "9021") {
          str += '<div class="item">' +
            '<div class="left">价值：</div>' +
            '<div class="right">原价:' + result.amount + "元，现价:" + result.currentAmount +
            '元</div>' +
            '</div>';
        }
        if (result.amount && (result.category == "901" || result.category == "904")) {
          str += '<div class="item">' +
            '<div class="left">价值：</div>' +
            '<div class="right"> ' + result.amount + "元</div>" +
            '</div>';
        }
        str += '<div class="item">' +
          '<div class="left">使用条件：</div>' +
          '<div class="right">' + result.useStrategy + ((result.category != "904" && result.countLimit) ? '<div>每次消费最多可使用' + result.countLimit + "张</div>" : "") + '</div>' +
          '</div>' +
          '<div class="item">' +
          '<div class="left">有效期：</div>' +
          '<div class="right">' + result.times + '</div>' +
          '</div>' +
          '<div class="item">' +
          '<div class="left">详情：</div>' +
          '<div class="right">';

        for (var o in result.content) {
          str = str + "<div>" + result.content[o] + "</div>";
        }
        str += '</div></div><div class="item">' +
          '<div class="left">备注：</div>' +
          '<div class="right">' +
          '<div>本券不找零，不兑现，不做外卖使用</div>' +
          '<div>本活动在法律允许范围内商家拥有最终解释权</div>' +
          '</div>' +
          '</div>';
        html.find(".coupons-detail").html(str);
        html.find(".code").html(result.code || '');
        $("#my-code").html("");
        if (node.attr("id") && (result.category == "902" || result.category == "9021" || result.category == "904" || result.category == "9031")) {
          var qrcode = new QRCode($("#my-code"), {
            width: 100,
            height: 100
          });
          //当面付
          qrcode.makeCode(result.id);
        }
        $.popup(".popup-coupon");
      }
    });
  });
  /*$("body").on('click', '.exchange', function () {
        if (!$(this).hasClass("disabled")) {
            var id = $(this).attr("id").split("&");
            if (id.length < 2) return;
            $.confirm('本次抢兑需要花费' + id[0] + '积分,确认抢兑?', function () {
                rest("/benefit/exchange/guest/" + _id, {
                    activityId: id[1],
                    ruleTupleId: id[2]
                }, "post", function (data) {
                    if (data.code == 200) {
                        earnTrue();
                    } else {
                        $.toast(data.message);
                    }
                });
            });
        }
    });*/
  //关闭
  $("body").on("click", ".modal-overlay-visible", function () {
    if (!$(this).hasClass("popup-overlay")) return;
    $.closeModal();
    setTimeout(function () {
      $(".modal-overlay-visible").removeClass("modal-overlay-visible");
    }, 100);
  });

  $("body").on("click", ".md-close", function () {
    if (basicName == "entrance") {
      $(".modal").hide();
      $(".popup").hide();
      if (!$(this).parent().hasClass("liner")) {
        $(".modal-overlay-visible").removeClass("modal-overlay-visible");
        $.fn.cookie("limitcoupon", "true", {expires: 0.0034722});
      }
    } else {
      $.closeModal();
      $(".modal-overlay").removeClass("modal-overlay-visible");
    }
  });
});

function earnCheck(order_id) {
  y = setInterval(function () {
    rest("/order/" + order_id + "/pay/result", {}, "get", function (data1) {
      if (data1.code == "200" || data1.code == "404014") {
        clearInterval(y);
        earnTrue();
      } else {
        $.toast("支付结果查询中");
      }
    });
  }, 1000)

}

function chooseCity() {
  //控制单元
  var cities = {};
  //请求服务器得到城市列表
  rest("/dict/city", {}, "get", function (data) {
    if (data.code == 200) {
      var result = data.result;
      var citys = "";
      for (var i in result) {
        $(".am-padding-sm").append("<a class='box external' href='shops.html" + location.search + "&code=" + result[i].code + "&name=" + encodeURIComponent(result[i].name) + "'>" + result[i].name + "</a>")
      }
      $("#city").html(citys);
      $("#total").show();
    } else {
      toast(data.message);
    }
  });

}

function refresh() {
  window.location.href = location.href + '&time=' + ((new Date()).getTime());
}

/*function couponName(coupon) {
 var str = "";

 switch (coupon.category) {
 case "901":
 str = "<div style='font-size: .9rem'>" + coupon.name + "</div>";
 break;
 case "902":
 str = "<div><div style='font-size: .7rem'>" + coupon.name + "</div>" +
 "<div style='font-size: .6rem;'><span style='color: #e6111e'> ￥" + coupon.currentAmount + "</span>" +
 "<span style='color: #9b9b9b;text-decoration: line-through'> ￥" + coupon.amount + "</span></div></div>";
 break;
 case "908":
 str = "<div style='font-size: .9rem'>" + coupons.currentAmount + "元抵" + coupons.amount + "元</div>";
 break;
 case "904":
 str = "<div style='font-size: .9rem'>" + coupon.name + "</div>";

 break;
 case "9031":
 str = "<div style='font-size: .9rem'>" + coupon.name + "</div>";

 break;
 case "903":
 str = "<div style='font-size: .9rem'>" + coupon.name + "</div>";
 }
 return str;
 }*/
function couponName(coupon) {
  if (coupon.hasOwnProperty("amount")) {
    var str = "<div class='left'><span class='dollar'></span>" + coupon.amount + "</div>";
  } else {
    var str = "<div class='left coupon-icon'></div>";
  }
  str += "<div class='right'><div class='ellipsis'>" + coupon.name + "</div>" + (coupon.count > 1 ? "<div class='countNo'>X" + coupon.count + "</div>" : "") + "<div class='grey'>" + coupon.times + "</div></div>";
  return str;

}

function setTitle(name) {
  document.title = name;
  var i = document.createElement('iframe');
  i.style.display = 'none';
  i.onload = function () {
    setTimeout(function () {
      i.remove();
    }, 9)
  };
  document.body.appendChild(i);
}

/*function selfPay() {
    Vue.component('input-val', {
        props: ['placeholder', 'label', 'val'],
        data: function () {
            return {
                inter: 5,
                decimal: 2,
                // label: '消费金额',
                // placeholder:,
                cursor: false,
                keyboard: false,
                /!*value 在组件中的值*!/
                aIllegal: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0..', '.'],
                cursorDuration: 600,
                bodyHeight: '',
                bodyOverflow: '',
            }
        }, created: function () {
            _self = this;
            document.addEventListener('click', function () {
                _self.blur && _self.blur();
            });
        },
        template: '<div class="keyboard">' +
        '<div class="input-box" @click.stop="focus">' +
        '<div class="place">{{label}} : </div>' +
        '<div class="content1">' +
        '<div class="input"><span class="currency" v-show="val">¥</span>{{val}}</div>' +
        '<div class="placeholder" v-show="val.length === 0">{{placeholder}}</div>' +
        '<div class="cursor" :style="{visibility: cursor ? \'visible\' : \'hidden\'}"></div>' +
        '</div>' +
        '</div>' +
        '<transition name="slide">' +
        '<div class="keyboard1 animated" v-show="keyboard" @touchstart.stop.prevent="fn">' +
        '<div class="done">' +
        '<div class="text" @touchstart="complete">完成</div>' +
        '</div>' +
        '<div class="list">' +
        '<div class="key" @touchstart="typing(\'1\')">1</div>' +
        '<div class="key" @touchstart="typing(\'2\')">2</div>' +
        '<div class="key" @touchstart="typing(\'3\')">3</div>' +
        '<div class="key" @touchstart="typing(\'4\')">4</div>' +
        '<div class="key" @touchstart="typing(\'5\')">5</div>' +
        '<div class="key" @touchstart="typing(\'6\')">6</div>' +
        '<div class="key" @touchstart="typing(\'7\')">7</div>' +
        '<div class="key" @touchstart="typing(\'8\')">8</div>' +
        '<div class="key" @touchstart="typing(\'9\')">9</div>' +
        '<div class="key dot" @touchstart="typing(\'.\')">.</div>' +
        '<div class="key" @touchstart="typing(\'0\')">0</div>' +
        ' <div class="key" @touchstart="typing(\'\')"><img src="/sui_assets/img/selfPay/delete.svg"></div>' +
        '</div>' +
        ' </div>' +
        '</transition>' +
        '</div>',
        methods: {
            /!*focus*!/
            focus: function () {
                if (app.init.preCheckData) return;
                this.blur();
                $(".keyboard").click();
                /!*显示键盘*!/
                this.showKeyboard();
                /!*显示光标*!/
                this.showCursor();
                /!*闪烁光标*!/
                this.blinkCursor();
            },
            blinkCursor: function () {
                clearInterval(this.intervalID);
                _self = this;
                /!*           this.intervalID = setInterval(function () {
                               // Vue.set("cursor",!this.cursor)
                               _self.cursor = !_self.cursor;
                           }, this.cursorDuration);*!/
            },
            unblinkCursor: function () {
                clearInterval(this.intervalID);
            },
            /!*blur*!/
            blur: function () {
                /!*隐藏光标*!/
                this.hideCursor();
                /!*停止光标闪烁*!/
                this.unblinkCursor();
                /!*隐藏键盘*!/
                this.hideKeyboard();
                /!*
                    附加 00, 如果用户输入了一个以 . 结尾的值就点完成了,
                    那么这个时候就在后面加上00
                *!/
                this.toCompletion();
                /!*通知父组件, 老子值出来了*!/
                /!*
                    校验用户输入的金额是不是为 0, 如果是的话, 直接重置
                *!/
                this.checkValue();
                this.notify();

            },
            showKeyboard: function () {
                this.keyboard = true;
            },
            hideKeyboard: function () {
                this.keyboard = false;
            },
            showCursor: function () {
                this.cursor = true;
            },
            hideCursor: function () {
                this.cursor = false;
            },
            checkValue: function () {

            },
            /!*判读是否需要加0*!/
            toCompletion: function () {
                if (app.init.preCheckData) return;
                var list = this.val.split('.');
                if (list[1] === '') {
                    this.val += "0";
                }
                // if (typeof list[1] === 'undefined') {
                //     // if (this.val !== '') {
                //     //     this.val = this.val + '.';
                //     //     this.completion(this.decimal);
                //     // }
                // } else {
                //     if (list[1].length < this.decimal) {
                //         this.completion(this.decimal - list[1].length);
                //     }
                // }
            },
            /!*  completion: function (len) {
                  var v = '';
                  for (var i = 0; i < len; i++) {
                      v = v + '0';
                  }
                  this.val = this.val + v;
              },*!/
            notify: function () {
                this.$emit('input', this.val);
            },
            del: function () {
                /!*删除值并不会触发值的校验, 所以需要手动再触发一次*!/
                this.val = this.val.slice(0, -1);
                this.notify();
            },
            fn: function () {
            },
            /!*输入*!/
            typing: function (value) {
                /!*如果是点击删除*!/
                if (value === '') {
                    this.del();
                }
                /!*保存旧的值*!/
                var oldValue = this.val;
                /!*获取新的值*!/
                this.val = this.val + value;
                /!*检验新值, 如果没有通过检测, 恢复值*!/
                if (!this.passCheck(this.val)) {
                    this.val = oldValue;
                    return;
                }
                /!*为了让外界同步输入, 需要发送事件*!/
                this.notify();
            },

            /!*点击完成*!/
            complete: function () {
                this.blur();
            },
            passCheck: function (val) {
                // /!*验证规则*!/
                var aRules = [
                    this.illegalInput,
                    this.illegalValue,
                    this.accuracy
                ]
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
            /!*非法值*!/
            illegalValue: function (val) {
                if (parseFloat(val) != val) {
                    return false;
                }
                return true;
            },
            /!*验证精度*!/
            accuracy: function (val) {
                var v = val.split('.')
                if (v[0].length > this.inter) {
                    return false;
                }
                if (v[1] && (v[1].length) > this.decimal) {
                    return false;
                }
                return true;
            }
        }
    });
    app = new Vue({
        el: '#app',
        data: {
            data: "",
            view: {},
            disk: {dish: 0, meal: 0},
            visible: {dish: false, coupon: false, couponModal: false, timer: 3},
            post: {},
            coupons: {},
            init: {},
            socketObj: {},
            swiper: "",
            ads: "",
            ad: ""
        },
        beforeCreate: function () {
            var _self = this;
            var para = {};
            para.type = version == "WXPAY" ? "wx" : "ali";
            if (key_json.d) {
                para.tableId = key_json.d;
            }
            rest("/activities/shop/" + shopId + "/check", para, "get", function (data) {
                if (data.code == 200) {
                    $.fn.cookie("user", data.result.user.id);
                    setTitle(data.result.brandName + "(" + data.result.name + ")");
                    _self.init = data.result;
                    _self.post = _self.init.preCheckData || {amount: '', nonParticationAmount: ''};
                    $("#loading").addClass("hide");
                    if (data.result.order) {
                        $.modal({
                            title: '注意',
                            afterText: '您' + (data.result.order.tableNo ? ("在" + data.result.order.tableNo + "号桌") : "") + '有个买单未完成',
                            buttons: [{
                                text: '取消买单',
                                bold: true,
                                onClick: function () {
                                    rest("/check/" + data.result.order.orderId + "/cancel", {}, "post", function (data1) {
                                        if (data1.code != 200) {
                                            $.toast(data1.message);
                                            if (data1.code == 403108) {
                                                setTimeout(function () {
                                                    ajaxUrl("strategy.html?oid=" + data.result.order.orderId);
                                                }, 2000)
                                            } else {
                                                ajaxUrl("entrance.html");
                                            }
                                        } else {
                                            delete _self.init.order;
                                            addVip();

                                            // if (_self.init.couponCount) {
                                            //     delete _self.init.couponCount;
                                            //     _self.init.existCoupon = true;
                                            // }
                                        }
                                    });
                                }
                            }, {
                                text: '继续买单',
                                bold: true,
                                onClick: function () {
                                    $.fn.cookie("order_id", data.result.order.orderId);
                                    state();
                                }
                            }]
                        });
                    } else {
                        addVip();
                    }
                    if (data.result.rollingActivities) {
                        $('.e-ad').removeClass("hide");
                        $(".ad1-text").html("<img src='/sui_assets/img/coupon/2.svg'> " + data.result.rollingActivities[0].name);
                        var i = $(".e-ad1").width();
                        setInterval(function () {
                            if (i < 5 - $(".ad1-text").width()) {
                                i = $(".e-ad1").width();
                            }
                            $(".ad1-text").css("margin-left", i--);
                        }, 20)
                    }
                    //ads
                    rest("/activities/shop/" + shopId + "/placards", {}, "get", function (data) {
                        if (data.code == 200) {
                            _self.ads = data.result;
                        }
                    });
                } else {
                    location.href = "error.html";
                }
            });
        },
        computed: {
            number: function () {
                return this.disk.dish + this.disk.meal;
            },
            validateDish: function () {
                return this.data.result.specialDishes ? this.data.result.specialDishes.filter(function (item) {
                    return item.count > 0
                }) : [];
            },
            validateMeal: function () {
                return this.data.result.setmealDishes ? this.data.result.setmealDishes.filter(function (item) {
                    return item.count > 0
                }) : []
            }
        },
        methods: {
            inputFn: function (value) {
                this.post.amount = value;
            },
            nonPartsFn: function (value) {
                this.post.nonParticationAmount = value;
            },
            updateValue: function (event, target) {
                var value = event.target.value;
                var formattedValue = value
                // 删除两侧的空格符
                    .trim()
                    // 保留 2 小数位
                    .slice(
                        0,
                        value.indexOf('.') === -1
                            ? value.length
                            : value.indexOf('.') + 3
                    );
                // 如果值不统一，手动覆盖以保持一致
                if (formattedValue !== value) {
                    if (target) {
                        this.post.amount = Number(formattedValue);
                        this.$refs.input.value = Number(formattedValue);
                    } else {
                        this.post.nonParticationAmount = Number(formattedValue);
                        this.$refs.input1.value = Number(formattedValue);
                    }
                }
            },
            closeCouponModal: function () {
                this.visible.couponModal = false;
                $.fn.cookie(_id + "modal", true, {
                    //半小时
                    "expires": 0.02,
                    "path": "/"
                });
                if ($(".a4005").length) {
                    this.init.couponCount = $(".a4005").length;
                } else {
                    delete this.init.couponCount;
                    this.init.existCoupon = true;
                }
            },
            clear: function () {
                if (this.data.result.specialDishes) {
                    for (var i = 0; i < this.data.result.specialDishes.length; i++) {
                        this.data.result.specialDishes[i].count = 0;
                    }
                }
                if (this.data.result.setmealDishes) {
                    for (var j = 0; j < this.data.result.setmealDishes.length; j++) {
                        this.data.result.setmealDishes[j].count = 0;
                    }
                }
                this.disk.dish = 0;
                this.disk.meal = 0;
            },
            cancel: function (id) {
                var _self = this;
                $.confirm("确认放弃后您需要重新出示给店员才可使用", function () {
                    rest("/check/shop/" + shopId + "/coupons/" + id, {}, "delete", function (data) {
                        if (data.code == 200) {
                            _self.getCouponData();
                        } else {
                            alert(data.message);
                        }
                    })
                });
            },
            socket: function () {
                var _self = this;
                setTimeout(function () {
                    var a;
                    var code = 12;
                    var uri = "wss://" + location.hostname + "/websocket?id=" + _self.init.user.id;
                    _self.socketObj = websocket = new WebSocket(uri);
                    websocket.onopen = function () {
                        a = setInterval(function () {
                            websocket.send("1");
                        }, 30000)
                    };
                    websocket.onmessage = function (evt) {
                        if (evt.data == "success") return false;
                        var data = JSON.parse(evt.data);
                        data.orderId && $.fn.cookie("order_id", data.orderId, {"path": "/"});
                        switch (data.type) {
                            case "500100":
                            case "500101":
                                app.getCouponData();
                                break;
                        }
                    };
                    websocket.onclose = function () {
                    };
                    websocket.onerror = function () {
                    };
                }, 3000)
            },
            getDishes: function () {
                $("input").blur();
                var _self = this;
                if (_self.view.dishes && _self.view.amount == _self.post.amount) {
                    _self.view.amount = this.post.amount;
                    _self.visible.dish = true;
                    _self.data.result = JSON.parse(JSON.stringify(_self.view.dishes));
                    _self.disk = JSON.parse(JSON.stringify(_self.view.disk));
                    return;
                }
                var json = {};
                if (this.post.amount) {
                    json.amount = this.post.amount;
                }
                _self.view.amount = this.post.amount;
                rest("/activities/shop/" + shopId + "/dishes", json, "get", function (data) {
                    _self.data = data;
                    if (_self.data.code !== 200) {
                        $.toast("暂无可用的特价菜/套餐");
                        delete _self.view.dishes;
                        return;
                    }
                    _self.disk.meal = 0;
                    _self.disk.dish = 0;
                    if (data.result.setmealDishes) {
                        for (var i = 0; i < data.result.setmealDishes.length; i++) {
                            var meal = data.result.setmealDishes[i];
                            if (meal.choosed) {
                                _self.disk.meal += meal.count;
                            }
                        }
                    }
                    if (data.result.specialDishes) {
                        for (var j = 0; j < data.result.specialDishes.length; j++) {
                            var dish = data.result.specialDishes[j];
                            if (dish.choosed) {
                                _self.disk.dish += dish.count;
                            }
                        }
                    }
                    _self.visible.dish = true;
                });

            },
            getCouponData: function () {
                $("input").blur();
                var _self = this;
                var json = {};
                if (this.post.amount) json.amount = this.post.amount;
                rest("/check/coupons/" + _id, json, "get", function (data1) {
                    if (data1.code == 200) {
                        _self.coupons = data1.result;
                    } else {
                        //$.toast("没有可用的券");
                    }
                });
            },
            getCoupons: function () {
                $("input").blur();
                var _self = this;
                var json = {};
                if (this.post.amount) json.amount = this.post.amount;
                rest("/check/coupons/" + _id, json, "get", function (data1) {
                    if (data1.code == 200) {
                        _self.coupons = data1.result;
                        _self.visible.couponModal = true;
                        _self.$nextTick(function () {
                            for (var index in _self.coupons) {
                                if (!$("#code" + index).html()) {
                                    var qrcode = new QRCode($("#code" + index), {
                                        width: 100,
                                        height: 100
                                    });
                                    qrcode.makeCode(_self.coupons[index].id);
                                }
                            }
                            //当面付
                            $(".over-bg .swiper-container").swiper({
                                pagination: '#swiper-pagination',
                                paginationClickable: true,
                                slidesPerView: 1.3,
                                spaceBetween: 30,
                                centeredSlides: true
                            });
                            _self.socket();
                        })
                    }
                });
            },
            getCouponsModal: function () {
                if ($.fn.cookie(_id + "modal")) {
                    this.visible.timer = 0;
                    return;
                }
                if (!this.init.couponCount) {
                    this.getCoupons();
                    _self = this;
                    var t = setInterval(function () {
                        if ((!_self.visible) || (_self.visible.timer == 0)) {
                            clearInterval(t);
                        } else {
                            _self.visible.timer--;
                        }
                    }, 1000);
                } else {
                    this.visible.timer = 0;
                }
            },
            checked: function () {
                this.visible.checked = !this.visible.checked;
                this.visible = JSON.parse(JSON.stringify(this.visible));
            },
            confirmDish: function () {
                this.view.amount = this.post.amount;
                Vue.set(app.view, "dishes", this.data.result);
                //this.view.dishes = JSON.parse(JSON.stringify(this.data.result));
                this.view.disk = JSON.parse(JSON.stringify(this.disk));
                this.visible.dish = false;
                this.visible.checked = false;
            },
            plus: function (index) {
                if (this.disk.meal) {
                    $.toast("对不起，本店特价菜与套餐不可同享。");
                    return;
                }
                var json = this.data.result.specialDishes[index];
                if (this.data.result.specialDishes[index].count) {
                    json.count++;
                } else {
                    json.count = 1;
                }
                this.disk.dish++;
                Vue.set(this.data.result.specialDishes, index, json);
            },
            reduce: function (index) {
                var json = this.data.result.specialDishes[index];
                json.count -= 1;
                this.disk.dish--;
                Vue.set(this.data.result.specialDishes, index, json);

            },
            plusMeal: function (index) {
                if (this.disk.dish) {
                    $.toast("对不起，本店特价菜与套餐不可同享。");
                    return;
                }
                var json = this.data.result.setmealDishes[index];
                if (this.data.result.setmealDishes[index].count) {
                    json.count++;
                } else {
                    json.count = 1;
                }
                this.disk.meal++;
                Vue.set(this.data.result.setmealDishes, index, json);
            },
            reduceMeal: function (index) {
                var json = this.data.result.setmealDishes[index];
                json.count -= 1;
                this.disk.meal--;
                Vue.set(this.data.result.setmealDishes, index, json);
            },
            submitFn: function (event) {
                var json = {};
                //清除键盘事件
                $(".second-pay").click();
                // if (event) event.cancelBubble = true;
                _self = this;
                if ($(".toast").length) return;
                var result = this.data.result;
                if (!(this.post.amount && parseFloat(this.post.amount))) {
                    $.toast("请先填写消费总额");
                    return;
                }
                if (this.init.nonPart) {
                    if (!this.post.nonParticationAmount && this.post.nonParticationAmount != "0") {
                        $.toast("请先填写不参与优惠项金额，如未消费此类项目，请输入0");
                        return;
                    } else {
                        if (parseInt(this.post.nonParticationAmount) > parseInt(this.post.amount)) {
                            $.toast("不参与金额不得大于总金额");
                            return;
                        }
                        json.nonParticationAmount = this.post.nonParticationAmount;
                    }
                }
                if (this.disk.dish) {
                    json.specialMap = {};
                    for (var i = 0; i < result.specialDishes.length; i++) {
                        if (result.specialDishes[i].count) {
                            json.specialMap[result.specialDishes[i].code] = parseInt(result.specialDishes[i].count);
                        }
                    }
                }
                if (this.disk.meal) {
                    json.meals = {};
                    for (var j = 0; j < result.setmealDishes.length; j++) {
                        if (result.setmealDishes[j].count) {
                            json.meals[result.setmealDishes[j].code] = parseInt(result.setmealDishes[j].count);
                        }
                    }
                }
                json.amount = this.post.amount;

                if (key_json.d) {
                    json.tableId = key_json.d;
                }
                rest("/check/shop/" + key_json.id + "/autonomy", json, "post", function (data) {
                    if (data.code == 200) {
                        $.fn.cookie("order_id", data.result.orderId);
                        ajaxUrl("strategy.html?oid=" + data.result.orderId);
                    } else if (data.code == 405004) {
                        $.confirm("您在" + (data.result.shopname || ("本店" + data.result.tableNo + "号桌")) + "有一个买单正在进行中,是否放弃此订单？", function () {
                            rest("/check/shop/" + data.result.shopId + "/cancel", {}, "post", function (data) {
                                if (data.code == 200) {
                                    alert("取消成功！");
                                    _self.submitFn();
                                }
                            });
                        });
                    } else if (data.code == 405807) {
                        $.toast("本次消费金额系统已为您读取，将继续为您买单");
                        setTimeout(function () {
                            refresh();
                        }, 1000)
                    } else {
                        alert(data.message);
                    }
                })
            }
        }
    });
    app.$watch("disk", function (val) {
        if (val.meal + val.dish == 0) {
            this.visible.checked = false;
        }
    }, {deep: true});

}*/

function checkTime(i) { //将0-9的数字前面加上0，例1变为01
  if (i < 10) {
    i = "0" + i;
  }
  return "" + i;
}

//v-html 加换行
function replaceMethod(value) {
  if (!value) return '';
  var a = value.split("\n");
  return a.join("<br/>");
}

//iconfont
function replaceFont(value) {
  var str = "";
  if (typeof(value) == 'number') {
    value = value + '';
  }
  for (var i in value) {
    str += '<i class="iconfont icon-icon-test' + (value.charAt(i) == '.' ? 'dot' : value.charAt(i)) + '"></i>';
  }
  return str;
}

function replaceUrl(item) {
  if (!item.activityCategory) {
    if (item.linkUrl) {
      location.href = item.linkUrl;
    }
    return;
  }
  switch (item.activityCategory) {
    //送券
    case '6004':
      ajaxUrl('couponActivity.html?aid=' + item.activityId);
      break;
    //套餐
    case "6015":
      ajaxUrl('mealActivity.html?aid=' + item.activityId);
      break;
    //充值
    case "6002":
      redirectUrl("charge");
      break;
    //入会及升级
    case "6001":
      redirectUrl('upgrade?tid=' + item.activityId);
      // ajaxUrl('upgrade.html?tid=' + item.activityId);
      break;
    //积分兑换
    case "6003":
      redirectUrl('exchange');
      break;
    //砍价
    case "6041":
      location.href = '/grouponInfo.html?aid=' + item.activityId + "&guestid=" + item.guestId;
      break;
    //评赏
    case "6050":
      location.href = '/lottery.html?aid=' + item.activityId + "&guestid=" + item.guestId;
      break;
    //抽奖
    case "6051":
      location.href = '/raffleActivity.html?aid=' + item.activityId + "&guestid=" + item.guestId;
      break;
    default:
      ajaxUrl('activity.html?aid=' + item.activityId);
  }
}

function grouponInfo() {
  var app = new Vue({
    el: '#app',
    data: {
      data: "",
      view: {},
      time: [],
      state: false,
      transversePicUrl : ''
    },
    beforeCreate: function () {
      var _self = this;
      if (!key_json.aid) {
        alert(location.href);
        ajaxUrl("groupee.html?gid=" + key_json.id);
        return;
      }
      rest("/groupon/activity/" + key_json.aid, {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          setTitle(data.result.brandName + "邀您来砍价");
          if (data.result.groupon) {
            rest("/groupon/" + data.result.groupon.grouponId + "/record", {}, "get", function (data1) {
              if (data1.code == 200) {
                _self.view = {
                  list: data1.result
                };
                setTimeout(function () {
                  $('#Marquee_x').Marquee({'marquee': 'y', 'speed': 50, 'margin_bottom': '5px'});
                }, 100);
              }
            });
          }
          _self.data = data.result;
          if(_self.data.advertisement&&_self.data.advertisement.transversePicUrl) {
            _self.transversePicUrl = _self.data.advertisement.transversePicUrl
          }
          var t = setInterval(leftTimer, 1000);

          function leftTimer() {
            var leftTime = (new Date(_self.data.activity.endTime)) - (new Date()); //计算剩余的毫秒数
            if (!leftTime) {
              clearInterval(t);
              return;
            }
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            Vue.set(_self.time, 0, checkTime(days));
            Vue.set(_self.time, 1, checkTime(hours));
            Vue.set(_self.time, 2, checkTime(minutes));
            Vue.set(_self.time, 3, checkTime(seconds));
          }

          //js config
          if (version == "WXPAY") {
            var wxJson = {};
            wxJson.url = location.href;
            //wxJson.shopId = shopId;
            rest("/auth/sign", wxJson, "post", function (data) {
              if (data.code == 200) {
                var result1 = data.result;
                result1.jsApiList = [
                  'hideMenuItems',
                  'onMenuShareAppMessage',
                  'onMenuShareTimeline'
                ];
                wx.config(result1);
                wx.ready(function () {
                  wx.hideMenuItems({
                    menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                  });
                  wx.onMenuShareAppMessage({
                    title: _self.data.shareTitle, // 分享标题
                    desc: (_self.data.activity.unUsedCount ? ('仅剩' + _self.data.activity.unUsedCount + "份") : '') + "最低砍到" + _self.data.activity.finalAmount + "！你也有机会！猛戳抢", // 分享描述
                    link: _self.data.groupon ? (location.origin + '/groupee.html?gid=' + _self.data.groupon.grouponId + '&guestid=' + key_json.guestid) : location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _self.data.logoUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                      // 用户确认分享后执行的回调函数--分享事件
                      rest("/groupon/activity/" + key_json.aid + "/invitation", {}, "post", function (data) {
                      });
                    },
                    cancel: function () {
                      // 用户取消分享后执行的回调函数
                    }
                  });
                  wx.onMenuShareTimeline({
                    title: _self.data.shareTitle, // 分享标题
                    link: _self.data.groupon ? (location.origin + '/groupee.html?gid=' + _self.data.groupon.grouponId + '&guestid=' + key_json.guestid) : location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _self.data.logoUrl, // 分享图标
                    success: function () {
                      // 用户确认分享后执行的回调函数
                    }
                  });
                });
              }
            });
          }
        } else {
          alert(data.message);
          location.href = "error.html#4";
        }
      });

    },
    methods: {
      bargainFn: function () {
        _self = this;
        rest("/groupon/activity/" + key_json.aid, {}, "post", function (data) {
          if (data.code == 200) {
            $.toast("成功砍减" + data.result.amount + "元");
            setTimeout(function () {
              refresh();
            }, 2500)
          } else {
            alert(data.message);
          }
        });
      },
      ruleFn: function () {
        $.showIndicator();
        var _self = this;
        rest("/groupon/activity/" + key_json.aid + "/content", {}, "get", function (data) {
          if (data.code == 200) {
            Vue.set(_self.view, 'rule', data.result);
            $("#modal").show();
          }
        });
      },
      earnFn: function () {
        ajaxUrl("buyRecord.html?aid=" + key_json.aid);
      },
      closeFn: function () {
        $(".gmodal").hide();
      },
      buyFn: function (e) {
        ajaxUrl("buy.html?aid=" + key_json.aid);
      },
      inviteFn: function () {
        $(".gmadal-black").append("<div id='loading'></div>");
        var _self = this;
        $(".gmadal-black").show();
        if ($("#canvas").html()) {
          rest("/groupon/activity/" + key_json.aid + "/invitation", {}, "post", function (data) {
            if (data.code == 200) {
              _self.qrcode = data.result;
              _self.$nextTick(function () {
                var qrcode = new QRCode($("#my-code1"), {
                  width: 100,
                  height: 100
                });
                //当面付
                qrcode.makeCode(data.result.qrCode);
                var dom = $("#canvas"); //你要转变的dom
                var width = dom.width();
                var height = dom.height();
                setTimeout(function () {
                  var scaleBy = 2;  //缩放比例
                  var canvas = document.createElement('canvas');
                  canvas.width = width * scaleBy;
                  canvas.height = (height) * scaleBy;
                  canvas.style.width = width * scaleBy + 'px';
                  canvas.style.height = height * scaleBy + 'px';
                  var context = canvas.getContext('2d');
                  context.scale(scaleBy, scaleBy);
                  html2canvas($("#canvas"), {
                    useCORS: true,
                    canvas: canvas,
                    onrendered: function (canvas) {
                      //生成base64图片数据
                      var dataUrl = canvas.toDataURL();
                      $("#img").attr("src", dataUrl);
                      $("#canvas").remove();
                      $(".gmadal-black #loading").remove();
                    }
                  })
                }, 100)
              });
            }
          });
        } else {
          $(".gmadal-black #loading").remove();
        }
      },
      pageFn: function () {
        var _self = this;
        if (_self.view.list.page >= _self.view.list.pageSize) {
          return;
        }
        rest("/groupon/" + this.data.groupon.grouponId + "/record", {
          page: ++_self.view.list.page,
          count: _self.view.list.count
        }, "get", function (data1) {
          if (data1.code == 200) {
            // 添加新条目
            _self.view.list.items = _self.view.list.items.concat(data1.result.items);
          }
        })
      }
    }
  });
  app.$watch('data.groupon.amount', function (val) {
    console.log(val);
  }, {deep: true});
}

// function gift() {
//   var app = new Vue({
//     el: '#app',
//     data: {
//       data: "",
//       gift : '',
//       phone1: "",
//       show : false,
//       url : '',
//       imgUrl : '',
//     },
//     beforeCreate : function() {
//         // this.initFn()
//         var _self = this;
//         rest("/activities/gift/" + this.$route.query.aid + "/guest/" + (this.$route.query.id || this.$route.query.guestid) , {} , 'get' , function (data) {
//           if (data.code == 200) {
//             _self.gift = data.result;
//             _self.phone1 = {text: '获取验证码', able: true};
//             console.log(_self.gift.brandName);

//             // 微信扫的 显示公众号二维码
//             // var ua = window.navigator.userAgent.toLowerCase();
//             if (version == "WXPAY") {
//               // 获取二维码
//               rest("/shop/" + (this.$route.query.id || this.$route.query.guestid) + "/mp"  , {} , 'get' , function (data)  {
//                 var wechat = data.result;
//                 if (wechat && wechat.url) {
//                   this.imgUrl = wechat.url
//                   this.url = true;
//                 }
//               })
//               //分享
//               var wxJson = {};
//               wxJson.url = location.href;
//               rest("/auth/sign", wxJson, "post", function (data) {
//                 if (data.code == 200) {
//                   var result1 = data.result;
//                   result1.jsApiList = [
//                     'hideMenuItems',
//                     'onMenuShareAppMessage',
//                     'onMenuShareTimeline'
//                   ];
//                   wx.config(result1);
//                   wx.ready(function () {
//                     wx.hideMenuItems({
//                       menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//                     });
//                     // 分享朋友
//                     wx.onMenuShareAppMessage({
//                       title: _self.gift.brandName + '邀您领取新人礼', // 分享标题
//                       desc: '礼轻情意重！猛戳领红包！', // 分享描述
//                       link: location.origin + "/gift.html?aid=" + key_json.aid + (key_json.guestid ? "&guestid=" + key_json.guestid : "&id=" + key_json.id ) , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//                       imgUrl: _self.gift.logo, // 分享图标
//                       type: '', // 分享类型,music、video或link，不填默认为link
//                       dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//                       success: function () {
//                         // 用户确认分享后执行的回调函数--分享事件
//                       },
//                       cancel: function () {
//                         // 用户取消分享后执行的回调函数
//                       }
//                     });
//                     // 分享到朋友圈
//                     wx.onMenuShareTimeline({
//                       title: _self.gift.brandName + '邀您领取新人礼', // 分享标题
//                       link: location.origin + "/gift.html?aid=" + key_json.aid + (key_json.guestid ? "&guestid=" + key_json.guestid : "&id=" + key_json.id ) , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//                       imgUrl:  _self.gift.logo, // 分享图标
//                       success: function () {
//                         // 用户确认分享后执行的回调函数
//                       }
//                     });
//                   });
//                 }
//               });
//             }

//           }
//         });

//     },
//     methods: {
//       // 券详情页
//       couponDetailFn: function (index) {
//         var item = this.gift.benefits[index];
//         if (item) {
//           this.ajaxUrl("couponDetail.html?cid=" + item.id + (item.type == '1017' ? ('&type=reward') : ''));
//         }

//       },
//       //获取验证码
//       validate1Fn : function() {
//         console.log(1111);

//         if (!this.phone1.able) return;
//         if (!this.phone1.phone || this.phone1.phone.length != 11) {
//           this.$toast("手机格式不正确");
//           return;
//         }
//         this.phone1.able = false;
//         var _self = this;
//         rest("/validate/bindup", {"phone": this.phone1.phone} , 'post' , function(response) {
//           var data = response.data;
//           if (data.code == 200) {
//             this.$toast("获取成功");
//             var second = 90;
//             var init = setInterval(function () {
//               second--;
//               if (!second || !_self.phone1) {
//                 clearInterval(init);
//                 _self.phone1.text = "重新获取验证码";
//                 _self.phone1.able = true;
//                 return;
//               }
//               _self.phone1.text = "已发送 " + second + " s";
//             }, 1000);
//           } else {
//             this.phone1.able = true;
//             this.$toast(data.message);
//           }
//         });
//       },
//       // 验证手机号 领取新人礼
//       bindPhone1 : function() {
//         var _self = this;
//         if (this.phone1.phone && this.phone1.validateCode && this.phone1.phone.length == 11 && this.phone1.validateCode.length == 6) {
//           var jsonA = {activityId: this.$route.query.aid };
//           jsonA.phone = this.phone1.phone;
//           jsonA.validateCode = this.phone1.validateCode;
//           rest("/activities/gift/guest/" + (this.$route.query.id || this.$route.query.guestid) , jsonA , 'post', function(response) {
//             var data1 = response.data;
//             if (data1.code == 200) {
//               console.log(data1);
//               // 隐藏手机框 显示领取成功弹框
//               this.show = true
//             } else {
//               this.$toast(data.message);
//             }
//           });
//         }
//       },
//       // 不用手机号 领取新人礼
//       bindPhone : function () {
//         var _self = this;
//         var jsonB = {activityId: this.$route.query.aid };
//         rest("/activities/gift/guest/" + (this.$route.query.id || this.$route.query.guestid) , jsonB , 'post' , function(response){
//           var data = response.data;
//           if (data.code == 200) {
//             console.log(data);
//             // 隐藏手机框 显示领取成功弹框
//             this.show = true
//           } else {
//             this.$toast(data.message);
//           }
//         });

//       },

//     }
//   })
// }

function groupon() {
  grouponInfo();
}

function groupee() {
  var app = new Vue({
    el: '#app',
    data: {
      data: "",
      view: {},
      time: [],
      state: false
    },
    beforeCreate: function () {
      var _self = this;
      if (!key_json.gid) {
        alert("no");
        return;
      }
      rest("/groupon/" + key_json.gid, {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
          setTitle(data.result.brandName);
          if (data.result.self == true) {
            ajaxUrl("groupon.html?aid=" + data.result.activity.activityId);
            return;
          }
          rest("/groupon/" + key_json.gid + "/record", {}, "get", function (data1) {
            if (data1.code == 200) {
              _self.view = {
                list: data1.result
              };
              setTimeout(function () {
                $('#Marquee_x').Marquee({'marquee': 'y', 'speed': 50, 'margin_bottom': '5px'});
              }, 100);
            } else {
              $('.infinite-scroll-preloader').remove();
            }
          });


          var t = setInterval(leftTimer, 1000);

          function leftTimer() {
            var leftTime = (new Date(_self.data.activity.endTime)) - (new Date()); //计算剩余的毫秒数
            if (!leftTime) {
              clearInterval(t);
              return;
            }
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            Vue.set(_self.time, 0, checkTime(days));
            Vue.set(_self.time, 1, checkTime(hours));
            Vue.set(_self.time, 2, checkTime(minutes));
            Vue.set(_self.time, 3, checkTime(seconds));
          }


          function checkTime(i) { //将0-9的数字前面加上0，例1变为01
            if (i < 10) {
              i = "0" + i;
            }
            return "" + i;
          }

          if (version == "WXPAY") {
            var wxJson = {};
            wxJson.url = location.href;
            rest("/auth/sign", wxJson, "post", function (data) {
              if (data.code == 200) {
                var result1 = data.result;
                result1.jsApiList = [
                  'hideMenuItems',
                  'onMenuShareAppMessage',
                  'onMenuShareTimeline'
                ];
                wx.config(result1);
                wx.ready(function () {
                  wx.hideMenuItems({
                    menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                  });
                  wx.onMenuShareAppMessage({
                    title: _self.data.shareTitle, // 分享标题
                    desc: (_self.data.activity.unUsedCount ? ('仅剩' + _self.data.activity.unUsedCount + "份") : '') + "最低砍到" + _self.data.activity.finalAmount + "！你也有机会！猛戳抢", // 分享描述
                    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _self.data.logoUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                      // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                      // 用户取消分享后执行的回调函数
                    }
                  });
                  wx.onMenuShareTimeline({
                    title: _self.data.shareTitle, // 分享标题
                    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _self.data.logoUrl, // 分享图标
                    success: function () {
                      // 用户确认分享后执行的回调函数
                    }
                  });
                });
              }
            });
          }
        } else {
          alert(data.message);
          location.href = "error.html#4";
        }
      });
    },
    methods: {
      bargainFn: function () {
        var _self = this;
        rest("/groupon/" + key_json.gid, {}, "post", function (data) {
          if (data.code == 200) {
            $.toast("成功砍减" + data.result.amount + "元");
            //setTimeout(function () {
            //    ajaxUrl("groupee.html?v=1&gid=" + key_json.gid);
            //}, 2000);
            rest("/groupon/" + key_json.gid, {}, "get", function (data) {
              if (data.code == 200) {
                _self.data = data.result;
                rest("/groupon/" + key_json.gid + "/record", {}, "get", function (data1) {
                  if (data1.code == 200) {
                    _self.view = {
                      list: data1.result
                    };
                  }
                });
              }
            });
          } else if (data.code == 405015) {
            if (!$("#my-code2").html()) {
              qrcode = new QRCode($("#my-code2"), {
                width: 140,
                height: 140
              });
              //当面付
              qrcode.makeCode(data.result.qrCode);
            }
            $("#qrcode").show();
          } else {
            alert(data.message);
          }
        });
      },
      ruleFn: function () {
        var _self = this;
        $.showIndicator();
        rest("/groupon/activity/" + _self.data.activity.activityId + "/content", {}, "get", function (data) {
          if (data.code == 200) {
            Vue.set(_self.view, 'rule', data.result);
            $("#modal").show();
          } else {
            alert(data.message);
          }
        });
      },
      earnFn: function () {
        $.showIndicator();
        ajaxUrl("buyRecord.html?aid=" + this.data.activity.activityId);
      },
      closeFn: function () {
        $(".gmodal").hide();
      },
      buyFn: function (e) {
        ajaxUrl("buy.html?aid=" + this.data.activity.activityId + "&gid=" + key_json.gid);
      },
      restartFn: function () {
        ajaxUrl('groupon.html?aid=' + this.data.activity.activityId);
      },
      pageFn: function () {
        var _self = this;
        if (_self.view.list.page >= _self.view.list.pageSize) {
          return;
        }
        rest("/groupon/" + this.data.groupon.grouponId + "/record", {
          page: ++_self.view.list.page,
          count: _self.view.list.count
        }, "get", function (data1) {
          if (data1.code == 200) {
            // 添加新条目
            _self.view.list.items = _self.view.list.items.concat(data1.result.items);
          }
        })
      }
    }
  });

}

function buy() {
  var app = new Vue({
    el: '#app',
    data: {
      data: "",
      payment: ""
    },
    beforeCreate: function () {
      var _self = this;
      setPayMode(a);

      function a(payment) {
        if (payment && payment.payMode) {
          _self.payment = payment.payMode;
        }
        var para = {};
        if (key_json.gid) {
          para.grouponId = key_json.gid;
        }
        rest("/groupon/" + key_json.aid + "/buy", para, "get", function (data) {
          if (data.code == 200) {
            $("#loading").addClass("hide");
            _self.data = data.result;
          } else {
            //alert(data.message);
            history.back();
          }
        });
      }
    },
    methods: {
      buyFn: function (e) {
        $.showIndicator();
        $(".button-big").addClass("disabled");
        var _self = this;

        var para = {
          activityId: key_json.aid,
          url: encodeURIComponent(location.href),
          failedUrl: encodeURIComponent(location.href)
        };
        if (!_self.payment) {
          if (_self.data.amount > 0) {
            alert("暂无可支持的方式");
            return;
          }
        } else {
          para.payCategory = payment;
        }
        if (key_json.gid) {
          para.grouponId = key_json.gid;
        }
        rest("/groupon/buy", para, "post", function (data) {
          if (data.code == 405009) {
            $.confirm("支付遇到问题，是否重新支付？", function () {
              rest("/order/" + data.result.orderId + "/pay/revoke", {}, "post", function (data) {
                if (data.code == 200) {
                  refresh();
                } else {
                  alert(data.message);
                  $(".button-big").removeClass("disabled");
                }
              });
            }, function () {
              $(".button-big").removeClass("disabled");
            });
            return;
          }
          if (data.code != 200) {
            alert(data.message);
            $(".button-big").removeClass("disabled");
            $.hideIndicator();
            return;
          }
          if (_self.data.amount == 0) {
            $("#succed").show();
            setTimeout(function () {
              ajaxUrl("buyRecord.html?aid=" + key_json.aid);
            }, 1500);
            return;
          }
          var order_id = data.result.orderId;
          $.fn.cookie("order_id", order_id);
          if (data.result.url) {
            location.href = data.result.url;
            return;
          }
          switch (payment) {
            case "1005":
              var js = data.result.js;
              var pay = data.result.pay;
              pay.success = function () {
                $.hideIndicator();
                $(".pay-fixed").hide();
                $("#succed").show();
                setTimeout(function () {
                  ajaxUrl("buyRecord.html?aid=" + key_json.aid);
                }, 1500)
              };
              pay.cancel = function () {
                $.hideIndicator();
                $(".button-big").removeClass("disabled");
                cancelPay();
                // rest("/groupon/buy/" + order_id + "/cancel", {}, "post", function () {
                // })
              };
              pay.fail = function (res) {
                $.hideIndicator();
                $(".button-big").removeClass("disabled");
                cancelPay();
                // rest("/groupon/buy/" + order_id + "/cancel", {}, "post", function () {
                // });
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
                  $(".button-big").removeClass("disabled");
                  cancelPay();
                  // rest("/groupon/buy/" + order_id + "/cancel", {}, "post", function () {
                  // });
                  return;
                }
                if (result.resultCode == "9000") {
                  $.hideIndicator();
                  $(".pay-fixed").hide();
                  $("#succed").show();
                  setTimeout(function () {
                    ajaxUrl("buyRecord.html?aid=" + key_json.aid);
                  }, 1500)
                }
                $.hideIndicator();
              });
              break;
          }

        });
      },
      closeFn: function () {
        $(".gmodal").hide();
      }
    }

  });
}

function buyRecord() {
  var app = new Vue({
    el: '#app',
    data: {
      data: ""
    },
    beforeCreate: function () {
      $("#loading").addClass("hide");
      var _self = this;
      rest("/groupon/" + key_json.aid + "/buy/record", {}, "get", function (data) {
        if (data.code == 200) {
          _self.data = data.result;
          if (version == "WXPAY") {
            rest("/shop/" + _id + "/mp", {}, "get", function (data1) {
              var wechat = data1.result;
              if (!wechat.subscribe) {
                loadImage(wechat.url, '$(".shop_url").attr("src", url);$("#addon").attr("style","justify-content: center;-webkit-justify-content: center;display:flex")');
              }
            });
          }
        } else {
        }
      });
    },
    methods: {
      pageFn: function () {
        var _self = this;
        if (_self.data.page >= _self.data.pageSize) {
          return;
        }
        rest("/groupon/" + key_json.aid + "/buy/record", {
          page: ++_self.data.page,
          count: _self.data.count
        }, "get", function (data1) {
          if (data1.code == 200) {
            // 添加新条目
            _self.data.items = _self.data.items.concat(data1.result.items);
          }
        })
      }

    }

  });
}

function mealDetail() {
  var app = new Vue({
    el: '#app',
    data: {
      data: ""
    },
    beforeCreate: function () {
      var _self = this;
      rest("/activities/activity/" + key_json.aid + "/setmeal/" + key_json.rid, {}, "get", function (data) {
          if (data.code == 200) {
            $("#loading").addClass("hide");
            _self.data = data.result;
          } else {
            alert(data.message);
          }
        }
      )
      ;
    },
  });
}

function mealActivity() {
  rest("/activities/setmeal/" + key_json.aid, {}, "get", function (data) {
    if (data.code == 200) {
      var result = data.result;
      result.remainCount && $(".relative-label").html("剩" + result.remainCount + "份");
      $(".coupon-name").html(result.name);
      for (var i = 0; i < result.strategy.length; i++) {
        var item = result.strategy[i];
        var code = $(".hide .item").clone();
        code.attr("onclick", "ajaxUrl('mealDetail.html?aid=" + item.activityId + "&rid=" + item.ruleTupleId + "')");
        item.desUrl && code.find(".m-bg").attr("style", "background-image:url(" + item.desUrl + ")");
        item.from && code.find(".i-grade").html("<span>" + item.from + "可参加</span>");
        code.find(".m-bg .m-title").html(item.name);
        item.content && code.find(".m-content .m-title").html(item.content[0]);
        code.find(".text-orange").html("￥" + item.benefit);
        code.find(".amount").html("￥" + item.amount);
        $(".set-coupon").append(code);
      }
      $("#loading").addClass("hide");
    }
  });

}

function my() {
  location.href = "admin.html#/user" + location.search
}

function user() {
  location.href = "admin.html#/user" + location.search
}

//face
function face() {
  rest("/check/code", {}, "get", function (data) {
    if (data.code == 200) {
      if (!$("#my-code1").html()) {
        qrcode = new QRCode($("#my-code1"), {
          width: 150,
          height: 150
        });
        //当面付
        qrcode.makeCode(data.result.code);
      }
      setInterval(refreshCode, 60000);
      $("#loading").addClass("hide");
      socket();
    } else {
      history.back();
    }
    $.init();

  });
}
// 活动券
function couponActivity() {
  rest("/activities/activity/" + key_json.aid + "/coupon", {}, "get", function (data) {
    if (data.code == 200) {
      $("title").html(data.result.brandName);
      data.result.logo && loadImage(data.result.logo, '$(".avatar").attr("src", url)');
      if (!data.result.existPhone) {
        $("#bind").show();
        $("#phone").hide();
        $(".strength").show();
      }
      data.result.remainCount && $(".relative-label").html("剩" + data.result.remainCount + "份");
      $(".coupon-name").html(data.result.name);
      $(".set-coupon").html("");
      var cell = data.result.cells;
      for (var t = 0; t < cell.length; t++) {
        for (var r = 0; r < cell[t].coupons.length; r++) {
          var coupon = cell[t].coupons[r];
          var code = $(".hide .coupon_show").clone();
          code.attr("index", coupon.id);
          r == 0 ? code.find(".i-grade").html("<span>" + cell[t].name + '尊享</span>') : code.find(".i-grade").remove();
          switch (coupon.category) {
            case "9021":
            case "902":
              code.find(".i-uncoupon").addClass("dui");
              code.addClass("more");
              code.find(".follow-box").append(' <div class="right"> <div class="currentAmount" style="font-weight: 700">' + (coupon.currentAmount ? "￥" + coupon.currentAmount : "免费") + '</div> <div class="amount" style="font-size: .5rem">￥' + coupon.amount + '</div> </div>');
              break;
            case "903":
              code.find(".i-uncoupon").addClass("di");
              code.addClass("more");
              break;
            case "904":
              code.find(".i-uncoupon").addClass("gift1");
              break;
          }
          if (coupon.category == "902" || coupon.category == "9021" || coupon.category == "904") {
          }
          if (coupon.useStrategy) {
            code.find(".follow-box .left").append("<div>" + coupon.useStrategy + "</div>")
          }
          if (coupon.times) {
            code.find(".follow-box .left").append("<div>" + coupon.times + "</div>")
          }
          code.find(".text-lg").html(coupon.name);
          $(".set-coupon").append(code);
        }
      }
      //detail
      $("#time").html(data.result.time || "不限");
      if (data.result.limit) {
        var limit_contents = "";
        for (var m in data.result.limit) {
          limit_contents += "<li>" + data.result.limit[m] + "</li>";
        }
        $("#content").html(limit_contents);
      }
      if (data.result.additional) {
        $("#content").append("<li>" + data.result.additional + "</li>");
      }
      $("#loading").addClass("hide");
    } else {
      location.href = "error.html#1"
    }
  });
  var init;
  $(".input-text").click(function () {
    if ($("#tel").val().length == 11) {
      $(this).addClass("disabled");
      rest("/validate/bindup", {"phone": $("#tel").val()}, "post", function (result) {
        if (result.code == 200) {
          var second = 90;
          init = setInterval(function () {
            second--;
            if (!second) {
              clearInterval(init);
              $(".input-text").html("重新获取验证码");
              $(".input-text").removeClass("disabled");
              return;
            }
            $(".input-text").html("已发送 " + second + " s");
          }, 1000);
        } else {
          $(".input-text").removeClass("disabled");
          $.toast(result.message);
        }
      });
    } else {
      $.toast("请输入正确的手机号");
    }
  });
  // function temporaryRepair () {
  //   setTimeout(() => {
  //     var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
  //     window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  //   }, 100);
  // };
  // $('#tel').blur(function () {
  //   setTimeout(() => {
  //     var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
  //     window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  //   }, 100);
  // });
  // $('#validate').blur(function () {
  //   setTimeout(() => {
  //     var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
  //     window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  //   }, 100);
  // });
  $("#bindPhone").off().click(function () {
    if ($("#tel").val().length == 11 && $("#validate").val().length == 6) {
      if (!$(this).hasClass("disabled")) {
        $(this).addClass("disabled");
        rest("/phone/bindup", {
          "phone": $("#tel").val(),
          "validateCode": $("#validate").val(),
          "guestId": key_json.guestid,
          "shopId": key_json.id,
        }, "post", function (data) {
          if (data.code == 200) {
            data.result && data.result.token && $.fn.cookie("token", data.result.token, {
              "expires": 30,
              "path": "/"
            });
            getCoupon();
          } else {
            $("#validate").val("");
            clearInterval(init);
            $(".input-text").removeClass("disabled").html("重新获取验证码");
            $.toast(data.message);
            $("#bindPhone").removeClass("disabled");
          }
        });
      }
    } else {
      $.toast("输入框不能为空")
    }
  });
  $("body").on("click", ".earnCoupon", function () {
    getCoupon();
  });

  function getCoupon() {
    $.showIndicator();
    rest("/benefit/obtain/guest/" + _id, {activityId: key_json.aid}, "post", function (data) {
      switch (data.code) {
        case 200:
          earnTrue();
          break;
        case 405017:
          alert(data.message);
          alert('111')
          if (key_json.guestid) {
            ajaxUrl("more.html")
          } else {
            chooseIndex();
          }
          break;
        case 405015:
          rest("/shop/" + _id + "/mp", {}, "get", function (data) {
            var wechat = data.result;
            $.modal({
              title: '<strong>关注本店公众号<br/>才可参与本活动</strong>',
              afterText: '<div class="text-center">' +
              '<div style="height: 2px;background: #e1e1e1;margin: 1rem 40%"></div>' +
              '<div class=""><img style="width: 68%;min-height: 8rem" src="' + wechat.url + '\"></div><div class="text-grey" style="padding: 1rem 0 .5rem">长按二维码关注</div><img src="/sui_assets/img/finger.gif"><div class="md-close"></div></div>',
              extraClass: "bg-green"
            });
          });
          break;
        case 405029:
          $.toast(data.message);
          setTimeout(function () {
            ajaxUrl('birth.html');
          }, 2500);
          break;
        case 4050781:
          $.toast(data.message, 5000);
          break;
        default :
          $.toast(data.message);
      }
      $.hideIndicator();
    });
  }
}

function success() {
  if (key_json.type == "fail") {
    $(".success").addClass("fail");
  }
  rest("/shop/" + _id + "/mp", {}, "get", function (data) {
    var wechat = data.result;
    setTitle(wechat.name);
    if (wechat && wechat.url) {
      $(".wx-img img").attr("src", wechat.url);
    } else {
      $(".direct-content").hide();
    }
  });
  $.init();
  $("#loading").addClass("hide");
}

function waiting() {
  socket();
  //setTitle($.fn.cookie("brandName") || '');
  var id = $.fn.cookie("order_id");
  if (!id) {
    alert("订单不存在");
    chooseIndex();
  }
  /*coupon*/
  rest("/check/coupons/" + _id, {}, "get", function (data1) {
    if (data1.code == 200) {
      setCoupon({items: data1.result});
      $("#coupon").show();
    }
  });
  $.init();
  $("#loading").addClass("hide");
  rest("/check/" + id, {}, "get", function (data) {
    if (data.code != 200) {
      history.back();
      return;
    }
    if (data.result.step != 1) {
      state();
      return;
    }
    var result = data.result;
    var amount = result.times || 0;
    setInterval(clark, 1000);

    function clark() {
      var clark = [];
      clark[0] = Math.floor(amount % 60);
      clark[1] = Math.floor((amount % (60 * 60)) / 60);
      clark[2] = Math.floor(amount / (60 * 60));
      for (var i = 0; i < 3; i++) {
        if (clark[i] < 10) {
          clark[i] = "0" + clark[i];
        }
      }
      $(".clark").html(clark[2] + " : " + clark[1] + " : " + clark[0]);
      amount += 1;
    }
  });
  $(".cancel").click(function () {
    $.closeModal();
    $.modal({
      title: '注意',
      afterText: '<p>为了保障上宾权益，您一天最多可以取消三次买单</p>',
      buttons: [
        {
          text: '不取消',
          bold: true
        },
        {
          text: '确认取消',
          bold: true,
          onClick: function () {
            rest("/check/" + $.fn.cookie("order_id") + "/cancel", {}, "post", function (data) {
              if (data.code == 200) {
                chooseIndex();
              } else {
                $.toast(data.message);
              }
            });

          }
        }
      ]
    });
  });
}

function chooseIndex() {
  if (key_json.id) {
    var redirect = "/admin.html#/selfpay";
    if(key_json.cashier) {
      redirect = "/admin.html#/cashier"
    }
    redirect += "?id=" + key_json.id;
    if (key_json.d) {
      redirect += "&d=" + key_json.d;
    }
    if (key_json.cashier) {
      redirect += "&cashier=" + key_json.cashier;
    }
    location.href = redirect;
  } else {
    redirectUrl();
  }
}


function cancelPay() {
  rest("/order/" + $.fn.cookie("order_id") + "/pay/revoke", {}, "post", function (data) {
    if (data.code == 200) {
      if (basicName == 'strategy') {
        // app.choosedFn();
      } else {
        // refresh();
        $.hideIndicator();
      }
    }
  });
}

function bargain() {
  rest("/bargain/" + key_json.bid, {}, "post", function (data) {
    $.init();
    $("#loading").addClass("hide");
    switch (data.code) {
      case 405326:
        $("#text").html("还没人为我凑单");
        $(".self").removeClass("hide");
        $(".continue").show();
        $("body").on("click", ".continue", function () {
          location.href = "strategy.html?id=" + data.result.shopId + "&oid=" + data.result.orderId;
        });
        break;
      case 405325:
        $(".top").addClass("fail");
        $(".auth").removeClass("hide");
        break;
      case 405324:
        $(".top").addClass("fail");
        $(".auth").removeClass("hide");
        break;
      case 405323:
        $(".top").addClass("fail");
        $(".expire").removeClass("hide");
        break;
      case 200:
        $(".done").removeClass("hide");
        break;
      case 405328:
        $(".top").addClass("fail");
        $(".top").html('<div style="padding: 0 20px"><div class="c-expire"></div><div>本次凑单已经结束啦~</div></div>');
        break;
      default :
        $(".top").addClass("fail");
        $(".top").html('<div style="padding: 0 20px"><div class="c-expire"></div><div>' + data.message + '</div></div>')
    }
    $(".currentAmount").html((data.result.effective || 0) + "元");
    $(".reduce").html((data.result.eachAmount || 0) + "元");
    $(".time").html(data.result.timesLimit);
    $(".name").html(data.result.nickname || '');
    if (data.result.details) {
      $(".media-list").html("");
      for (var i = 0; i < data.result.details.length; i++) {
        var code = $(".hide ul").clone();
        var detail = data.result.details[i];
        if (!detail.enabled) {
          break;
        }
        code.find(".item-title").html(detail.nickname);
        if (detail.myself) {
          code.find(".item-title").html("我");
          code.css("background", "beige");
        }
        code.find(".c-star").html(i + 1);
        code.find(".item-media img").attr("src", detail.avatarUrl);
        code.find(".text-orange").html(detail.amount + "元");
        code.find(".text-xs").html(detail.createTime);
        $(".media-list").append(code);
      }
    }
  });
}

function record() {
  rest("/order/guest/" + _id, {}, "get", function (data) {
    var page = 1, count = 20, loading = false, total;
    if (data.code == 200) {
      data.result.items && setItems(data.result.items);
      total = data.result.total;
      if (total <= count) {
        $('.infinite-scroll-preloader').remove();
        //$.detachInfiniteScroll($('.infinite-scroll'));
      }
      $.init();
      $("#loading").addClass("hide");
    } else {
      $('.infinite-scroll-preloader').remove();
      $(".content").append('<div class="text-center" style="padding: 3rem 2.5rem"><div class="v_green_wrong_coupon" style="margin: 0 auto;float: inherit"></div><p class="text">您还没有成功的买单哦~</p></div>');
    }

    function setItems(items) {
      for (var i = 0; i < items.length; i++) {
        var html = $(".hide .card").clone();
        html.find("#finalAmount").html("实付款 ￥" + (items[i].amount - (items[i].reduceAmount || 0)).toFixed(2));
        html.find("#amount").html("消费 ￥" + items[i].amount);
        html.find(".c-record .text-grey").html(items[i].checkTime);
        html.find(".shop").html(items[i].shopName + "<span class='text-grey pull-right' style='padding-top: 0'>订单号：" + items[i].no + "</span>");
        html.find(".btn-w").attr("onclick", "ajaxUrl('orderDetail.html?order=" + items[i].orderId + "')");
        if (items[i].state == '1000') {
          html.find(".c-b-box .pull-left").removeClass("hide");
        }
        html.find(".operate .pull-right").html(items[i].staffName || "");
        var strategy = items[i].strategy;
        if (strategy) {
          if (strategy.coupons) {
            for (var j = 0; j < strategy.coupons.length; j++) {
              var coupon = strategy.coupons[j];
              var temp = $(".hide .c-coupon").clone();
              if (coupon.category == "901") {
                temp.find(".left").html("现金券")
              } else if (coupon.category == "904") {
                temp.find(".left").html("礼品券")
              }
              temp.find(".right").html(coupon.name + " " + coupon.count + "张<div class='text-xs'>" + coupon.times + "</div>");
              html.find(".set-coupon").append(temp);
            }
          }
          if (strategy.points) {
            html.find(".c-point").html('<img src="/sui_assets/img/svg/2@1x.svg">' + strategy.points.point + "积分");
          }
        } else {
          html.find(".c-box").remove();
          html.find(".c-record").addClass("empty");
        }
        $(".set-code").append(html);
      }
    }

    //无限滚动
    $(document).on('infinite', ".infinite-scroll-bottom", function () {
      if (loading) return;
      // 设置flag
      loading = true;
      // 模拟1s的加载过程
      setTimeout(function () {
        // 重置加载flag
        loading = false;
        if (page * count >= total) {
          // 加载完毕，则注销无限加载事件，以防不必要的加载
          $('.infinite-scroll-preloader').remove();
          //$.detachInfiniteScroll($('.infinite-scroll'));
          return;
        }
        page++;
        // 添加新条目
        rest("/order/guest/" + _id, {page: page, count: count}, "get", function (data) {
          data.result && setItems(data.result.items);
        });
        //容器发生改变,如果是js滚动，需要刷新滚动
        $.refreshScroller();
      }, 1000);
    });
  });

}
// 订单详情页
function orderDetail() {
   // 限制不能复制链接
  //  console.log(1111)
  //  wx.hideMenuItems({
  //    menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
  //  });
  //  wx.hideOptionMenu();
  if (!key_json.order) {
    alert("无订单信息");
    return;
  }
  rest("/order/" + key_json.order + "/detail", {}, "get", function (data) {
    if (data.code == 200) {
      var result = data.result;
      var strategy = data.result.strategy;
      $(".shop").html(data.result.shopName);
      $("#finalAmount").html("实付款 ￥" + strategy.finalAmount);
      $("#amount").html(result.paymentModeText);
      if(result.state == '1000'){
        $("#amount").append("<span class=''> （已退款）</span>");
      }
      $(".plan-box").html('<div class="padding-xs"> <div class="left">原单金额</div> <div class="right">￥' + result.amount + '</div> </div>');
      if ((!result.hasOwnProperty("obtained")) || result.obtained) {
        if (result.state == "906") {
          $(".btn-w").removeClass("hide");
          if (shopId) {
            $(".btn-w").attr("onclick", "redirectUrl()");
          }
        } else {
          $(".c-text").html("奖励已发放至您的账户:");
          $(".set-coupon").attr("onclick", "redirectUrl()");
          $(".c-point").attr("onclick", "redirectUrl('exchange')");
        }

      } else {
        $(".btn-g").removeClass("hide");
      }

      if (result.strategy.coupons) {
        for (var i = 0; i < result.strategy.coupons.length; i++) {
          var coupon = result.strategy.coupons[i];
          var temp = $("#code .c-coupon").clone();
          if (coupon.category == "901") {
            temp.find(".left").html("现金券")
          } else if (coupon.category == "904") {
            temp.find(".left").html("礼品券")
          }
          temp.find(".right").html(coupon.name + " " + coupon.count + "张<div class='text-xs'>" + coupon.times + "</div>");
          $(".set-coupon").append(temp);
        }
      }
      if (result.strategy.points) {
        $(".c-point").html('<img src="/sui_assets/img/svg/2@1x.svg">' + result.strategy.points.point + "积分");
      }
      if (!result.strategy.points && !result.strategy.coupons) {
        $(".c-box").remove();
      }
      if (strategy.nonPart) {
        var html = '<div class="padding-xs">' +
          '<div class="left">不计优惠</div>' +
          '<div class="right">' + strategy.nonPart.name + '<span class="pull-right">￥' + strategy.nonPart.amount + '</span></div></div>';
        $(".plan-box").append(html);
      }
      if (strategy.used) {
        var html = '<div class="padding-xs">' +
          '<div class="left">金额抵用</div>' +
          '<div class="right">';
        for (var j = 0; j < strategy.used.length; j++) {
          var str = strategy.used[j].count ? "(" + strategy.used[j].count + " 张)" : "";
          html += "<div>" + strategy.used[j].content + '<span class="pull-right">- ￥' + strategy.used[j].amount + str + '</span></div>';
        }
        html += "</div></div>";
        $(".plan-box").append(html);
      }

      $(".plan-box").append('<div class="padding-xs"> <div class="left">操作人员</div> <div class="right">' + (result.staffName || '自助买单') + '</div> </div>');
      $.init();
      $("#loading").addClass("hide");



    } else {
      alert(data.message);
    }
  });

}

function couponFn() {
  Vue.component('coupon', {
    props: ['item', 'use','use1','use2'],
    template: '<div class="item" v-bind:class="{\'used\':use,\'used1\':use1,\'used2\':use2,\'reward\':item.category == \'1017\'}" v-on:click="couponDetailFn(item.id,item.category)">' +
    '<div class="left" v-if="item.amount > \'0\' ">' +
    '<div v-if="item.category == \'1016\' ">' +
    '<div v-if="item.couponCategory == \'901\'">' +
    // '<span class="dollar"></span>' +
    // '<span class="amount">{{item.amount}}</span>' +
    '<div class="amount"><span class="dollar"></span>{{item.amount}}</div>'+
    '</div>' +
    '<div v-if="item.couponCategory == \'9011\'">' +
    // '<span class="dollar"></span>' +
    // '<span class="amount">{{item.amount}}</span>' +
    '<div class="amount"><span class="dollar"></span>{{item.amount}}</div>'+
    '</div>' +
    '<div v-if="item.couponCategory == \'902\'">' +
    // '<span class="dollar"></span>' +
    // '<span class="amount">{{item.currentAmount}}</span>' +
    '<div class="amount"><span class="dollar"></span>{{item.amount}}</div>'+
    '<div class="grey" style="text-decoration: line-through">原价￥{{+item.amount + +item.currentAmount}}</div>' +
    '</div>' +
    '<div v-if="item.couponCategory == \'9021\'">' +
    // '<span class="dollar"></span>' +
    // '<span class="amount">{{item.currentAmount}}</span>' +
    '<div class="amount"><span class="dollar"></span>{{item.amount}}</div>'+
    '<div class="grey">价值￥{{item.amount}}</div>' +
    '</div>' +
    '<div v-if="item.couponCategory == \'903\'">' +
    '<span class="amount">{{item.amount}}<span style="font-size: .9rem">折</span></span>' +
    '</div>' +
    '<div v-if="item.couponCategory == \'9031\'">' +
    '<span class="amount">{{item.amount}}<span style="font-size: .9rem">折</span></span>' +
    '</div>' +
    '<div v-if="item.couponCategory == \'904\'">' +   //礼品券
    '<div class="amount"><span class="dollar"></span>{{item.amount}}</div>' +
    '</div>' +
    '</div>' +
    '<div v-if="item.category !== \'1016\'">' +
    // '<span class="dollar" style="color:#f7a00e"></span>' +
    // '<span class="amount" style="color:#f7a00e">{{item.amount}}</span>' +
    '<div class="amount" style="color:#f7a00e"><span class="dollar" style="color:#f7a00e"></span>{{item.amount}}</div>'+
    '</div>' +
    '</div>' +
    '<div class="left coupon-icon" v-if="item.amount == \'0\' ">' +
    '</div>' +
    '<div class="right">' +
    '<div class="title">{{item.category == \'1017\'?\'代用币\':(item.name + (item.count>1?"（"+item.count +"张）":""))}}</div>' +
    '<ul>' +
    '<li>{{item.useStrategy}}</li>' +
    '<li v-if="item.times">{{item.times}}</li>' +
    '</ul>' +
    '</div>' +
    '<div class="countsN" v-if="item.count> \'1\' ">{{item.count}}张' +
    '</div>' +
    '</div>'
    ,
    methods: {
      couponDetailFn: function (id, type) {
        ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : ''));
      }
    }
  });
}

function prizesFn() {
  Vue.component('prizes', {
    props: ['prize'],
    data: function () {
      return {
        category: {
          '901': 'simple',
          '9011': 'simple',
          '902': 'multi',
          '9021': 'multi',
          '903': 'simple',
          '9031': 'simple',
          '904': 'multi'
        }/*,
                text: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']*/
      }
    },
    template: '<div class="prizes">' +
    '<div v-on:click="couponDetailFn(item.benefits[0].id,item.benefits[0].category)" :class="{\'gap\':index!=0||prize.length%2==0}" v-for="(item,index) in prize">' +
    '<div class="item multi" :style="{\'backgroundImage\':\'url(\'+item.benefits[0].picUrl+\')\'}" v-if="category[item.benefits[0].couponCategory]==\'multi\'&&(index!=0||prize.length%2==0)">' +
    '<div class="border">' +
    '<div>{{item.benefits[0].name}}<div v-if="item.benefits[0].couponCategory==\'904\'">价值 <span class="text-red">￥{{item.benefits[0].amount}}</span></div><div v-else><span class="text-red">￥{{item.benefits[0].currentAmount}}</span> <span class="text-through">价值￥{{item.benefits[0].amount}}</span></div>' +
    '</div>' +

    '<div class="addon"><span class="label"><span v-if="item.start">发红包数</span><span v-else>{{item.name}}</span></span><span class="label1"><span v-if="item.start">第{{item.start}}</span><span v-else>{{item.count}}</span><span v-if="item.end">~{{item.end}}</span>名</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="item simple" :class="{\'reward\':item.benefits[0].category==\'1017\'}" v-else>' +

    '<div class="left has-pic" v-if="category[item.benefits[0].couponCategory]==\'multi\'":style="{\'backgroundImage\':\'url(\'+item.benefits[0].picUrl+\')\'}">' +
    '</div>' +
    '<div class="left" v-else>' +
    '<div v-if="item.benefits[0].couponCategory==\'903\'||item.benefits[0].couponCategory==\'9031\'">' +
    '{{item.benefits[0].amount}}折' +
    '</div>' +
    '<div v-else-if="item.benefits[0].couponCategory==\'9011\'">{{item.benefits[0].name}}</div>' +
    '<div v-else><span class="dollar"></span>{{item.benefits[0].amount}}</div>' +
    '</div>' +
    '<div class="right" v-if="category[item.benefits[0].couponCategory]==\'multi\'">' +
    '    <div style="overflow: hidden">{{item.benefits[0].name}}</div>' +
    '<div class="text-right" v-if="item.benefits[0].couponCategory==\'904\'"><span style="color: #8e8e8e; font-size: 14px;">价值</span> <div class="text-red" >￥{{item.benefits[0].amount}}</div></div><div class="text-right" v-else><div class="text-red">￥{{item.benefits[0].currentAmount}}</div> <div class="text-through">价值￥{{item.benefits[0].amount}}</div></div>' +
    '</div>' +
    '<div class="right" v-else>' +
    '<span v-if="item.benefits[0].category==\'1017\'">代用币</span>' +
    '<span v-else-if="item.benefits[0].couponCategory==\'901\'">代金券</span>' +
    '<span v-else-if="item.benefits[0].couponCategory==\'903\'">全场折扣</span>' +
    '<span v-else-if="item.benefits[0].couponCategory==\'9011\'">抵扣优惠</span>' +
    '<span v-else>{{item.benefits[0].name}}</span>' +
    '</div>' +
    '<div class="addon"><span class="label"><span v-if="item.start">发红包数</span><span v-else>{{item.name}}</span></span><span class="label1"><span v-if="item.start">第{{item.start}}</span><span v-else>{{item.count}}</span><span v-if="item.end">~{{item.end}}</span>名</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
    ,
    methods: {
      couponDetailFn: function (id, type) {
        ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : ''))
      }
    }
  });
}

function ads(data) {
  if (data.linkUrl) {
    location.href = data.linkUrl;
  } else {
    switch (data.activityCategory) {
      case "6051":
        ajaxUrl("raffleActivity.html?aid=" + data.id);
        break;
    }
  }
}


function bindPhone(title, text) {
  $("#app").css("height", $(window).height() + "px");
  $("#app").css("overflow", "hidden");
  $(".page-group").show().html('<div class="bg-green"><div class="title">' + (title || '补全手机 领取权益') + '</div>' +
    '<div class="text">' + (text || '绑定手机号后，您的权益将立即到账') + '</div>' +
    '<input type="tel" placeholder="手机号" id="tel" maxlength="11"/>' +
    '<div class="input-text">获取验证码</div>' +
    '<input type="tel" placeholder="验证码" id="validate" maxlength="6"/>' +
    '<div class="btn-green" id="submitFn">确定</div>' +
    '<div class="close" onclick="  $(\'.page-group\').hide();$(\'#app\').css(\'overflow\', \'\');"></div></div>');

  $(".input-text").click(function () {
    if ($("#tel").val().length == 11) {
      $(this).addClass("disabled");
      rest("/validate/bindup", {"phone": $("#tel").val()}, "post", function (data) {
        if (data.code == 200) {
          $.toast("获取成功");
          var second = 90;
          var init = setInterval(function () {
            second--;
            if (!second) {
              clearInterval(init);
              $(".input-text").html("重新获取验证码");
              $(".input-text").removeClass("disabled");
              return;
            }
            $(".input-text").html("已发送 " + second + " s");
          }, 1000);
        } else {
          $(".input-text").removeClass("disabled");
          $.toast(data.message);
        }
      });
    } else {
      $.toast("请输入正确的手机号");
    }
  });
  // function temporaryRepair () {
  //   setTimeout(() => {
  //   var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
  //   window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  //   }, 100);
  // };
  // $('#tel').blur(function () {
  //   setTimeout(() => {
  //     var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
  //     window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  //   }, 100);
  // });
  // $('#validate').blur(function () {
  //   setTimeout(() => {
  //     var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
  //     window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  //   }, 100);
  // });
}

function comment() {
  prizesFn();
  var app = new Vue({
    el: '#app',
    data: {
      data: "",
      post: {content: ""},
      rule: '',
      stars: {}
    },
    beforeCreate: function () {
      var _self = this;
      rest("/praise/activity/order/" + key_json.oid, {}, "get", function (data) {
        if (data.code == 200) {
          if (data.result.step < 3) {
            ajaxUrl('praise.html?pid=' + data.result.id);
            return;
          }
          if (data.result.step == 3) {
            ajaxUrl("prize.html?cid=" + data.result.candidateId)
          }
          $("#loading").addClass("hide");
          _self.data = data.result;
          _self.stars = {
            text: ["吐槽", "凑合", "一般", "满意", "很棒"],
            star: [{
              id: "cuisine",
              name: "菜品",
              check: 4,
              content: new Array(5)
            }, {
              id: "service",
              name: "服务",
              check: 4,
              content: new Array(5)
            }, {
              id: "surroundings",
              name: "卫生",
              check: 4,
              content: new Array(5)
            }]
          }
          if (data.result.lastWinners) {
            setTimeout(function () {
              $('#LastWinners').Marquee({'marquee': 'y', 'speed': 50, 'margin_bottom': '5px'});
            }, 100);
          }
        } else {
          if (key_json.id) {
            location.href = "admin.html#/payment?id=" + key_json.id + "&order=" + $.fn.cookie("order_id");
          } else {
            location.href = "admin.html#/payment?guestid=" + key_json.guestid + "&order=" + $.fn.cookie("order_id");
          }
        }
      });
    },
    methods: {
      ruleFn: function () {
        _self = this;
        rest("/praise/activity/" + this.data.activityId, {}, "get", function (data) {
          if (data.code == 200) {
            _self.rule = data.result;
            $("#app").css("height", $(window).height() + "px");
            $("#app").css("overflow", "hidden");
            $(".page-group1").show();

          }
        });

      },
      joinFn: function () {
        var _self = this;
        if (this.post.content == "") {
          this.post.content = null;
        } else if (this.post.content.length < 5) {
          $.toast("请先填写五个字以上评价");
          return;
        }
        for (var i = 0; i < _self.stars.star.length; i++) {
          _self.post[_self.stars.star[i].id] = "100" + 5 - _self.stars.star[i].check;
        }

        $.showIndicator();
        $("#app").css("height", $(window).height() + "px");
        $("#app").css("overflow", "hidden");
        rest("/praise/comment/" + key_json.oid, this.post, "post", function (data) {
          if (data.code == 200) {
            $("#app").css("height", $(window).height() + "px");
            $("#app").css("overflow", "hidden");
            var query = "from=comment&";
            if (data.result.praiseId) {
              query = "pid=" + data.result.praiseId;
            } else if (data.result.commentId) {
              query = "mid=" + data.result.commentId;
            }
            if (data.result.needPhone) {
              // bindPhone("提交成功",data.result.benefit?"验证手机号即获“ "+data.result.benefit + "”<br>成功后可在公众号查看":"");
              $("#app").css("height", $(window).height() + "px");
              $("#app").css("overflow", "hidden");
              $(".page-group").show().html('<div class="bg-green"><div class="title">' +
                '<img src="/sui_assets/img/payment1/success1.svg" style="vertical-align: middle;margin-right: 5px;">提交成功</div>' +
                '<div class="text">' + (data.result.benefit ? ("验证手机号即获“ " + data.result.benefit + "”<br>成功后可在公众号查看") : "") + '</div>' +
                '<input type="tel" placeholder="手机号" id="tel" maxlength="11"/>' +
                '<div class="input-text">获取验证码</div>' +
                '<input type="tel" placeholder="验证码" id="validate" maxlength="6"/>' +
                '<div class="btn-green" id="submitFn">确定</div>' +
                '<div class="close" onclick="ajaxUrl(\'praise.html?' + query + '\')"></div></div>');

              $(".input-text").click(function () {
                if ($("#tel").val().length == 11) {
                  $(this).addClass("disabled");
                  rest("/validate/bindup", {"phone": $("#tel").val()}, "post", function (data) {
                    if (data.code == 200) {
                      $.toast("获取成功");
                      var second = 90;
                      var init = setInterval(function () {
                        second--;
                        if (!second) {
                          clearInterval(init);
                          $(".input-text").html("重新获取验证码");
                          $(".input-text").removeClass("disabled");
                          return;
                        }
                        $(".input-text").html("已发送 " + second + " s");
                      }, 1000);
                    } else {
                      $(".input-text").removeClass("disabled");
                      $.toast(data.message);
                    }
                  });
                } else {
                  $.toast("请输入正确的手机号");
                }
              });
              $("#submitFn").off().click(function () {
                if ($("#tel").val().length == 11 && $("#validate").val().length == 6) {
                  $.showIndicator();
                  //todo
                  var jsonA = {};
                  jsonA.phone = $("#tel").val();
                  jsonA.validateCode = $("#validate").val();
                  jsonA.commentId = data.result.commentId;
                  rest("/praise/benefits", jsonA, "post", function (data1) {
                    if (data1.code == 200) {
                      if (data.result.benefit) {
                        $.toast("红包已到账");
                      }
                      ajaxUrl('praise.html?' + query);
                    } else {
                      $("#validate").val("");
                      $(".input-text").html("重新获取验证码");
                      $.toast(data1.message);
                    }
                  });
                } else {
                  $.toast("请输入正确的验证码")
                }
              });
            } else {
              var str = "";
              if (data.result.benefit) {
                str = '<div class="text">恭喜获得“ ' + data.result.benefit + ' ”<br>可在公众号查看</div>';
              }
              $(".page-group").show().html('<div class="achieve">' +
                '<div class="title"><img src="/sui_assets/img/payment1/success1.svg" style="vertical-align: middle;margin-right: 5px;">提交成功</div>' + str +
                '<div class="btn" onclick="ajaxUrl(\'praise.html?' + query + '\')">我知道了</div>' +
                '</div>');

            }
          } else {
            alert(data.message);
            $("#app").css("overflow", "");
          }
        });

      },
      couponDetailFn: function (id, type) {
        ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : ''))
      }
    }
  });
}

function couponDetail() {
  var app = new Vue({
    el: '#app',
    data: {
      data: ""
    },
    beforeCreate: function () {
      var _self = this;
      rest("/activities/" + (key_json.type == 'reward' ? 'reward' : 'coupon') + "/" + key_json.cid, {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
        } else {
          alert(data.message);
        }
      });
    },
    methods: {}
  });
}

function praise() {
  prizesFn();
  var app = new Vue({
    el: '#app',
    data: {
      data: "",
      rule: "",
      time: [],
    },
    beforeCreate: function () {
      var _self = this;
      var url = "";
      if (key_json.pid) {
        url = "/praise/" + key_json.pid + "/activity";
      } else if (key_json.mid) {
        url = "/praise/comment/" + key_json.mid;
      } else if (key_json.cid) {
        url = "/praise/activity/candidate/" + key_json.cid;
      }
      rest(url, {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
          if (data.result.service) {
            _self.data.stars = {
              text: ["吐槽", "凑合", "一般", "满意", "很棒"],
              star: [{
                id: "cuisine",
                name: "菜品",
                check: 5 - data.result.cuisine.substr(3, 1),
                content: new Array(5)
              }, {
                id: "service",
                name: "服务",
                check: 5 - data.result.service.substr(3, 1),
                content: new Array(5)
              }, {
                id: "surroundings",
                name: "卫生",
                check: 5 - data.result.surroundings.substr(3, 1),
                content: new Array(5)
              }]
            };
          }
          _self.$nextTick(function () {
            if (data.result.lottery) {
              var t = setInterval(leftTimer, 1000);

              function leftTimer() {
                var leftTime = (new Date(_self.data.lottery.endTime)) - (new Date()); //计算剩余的毫秒数
                if (!leftTime) {
                  clearInterval(t);
                  return;
                }
                var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                Vue.set(_self.time, 0, checkTime(days));
                Vue.set(_self.time, 1, checkTime(hours));
                Vue.set(_self.time, 2, checkTime(minutes));
                Vue.set(_self.time, 3, checkTime(seconds));
              }

              if (data.result.lastWinners) {
                setTimeout(function () {
                  $('#LastWinners').Marquee({
                    'marquee': 'y',
                    'speed': 50,
                    'margin_bottom': '5px'
                  });
                }, 100);
              }
            }
            if (version == "WXPAY") {
              var wxJson = {};
              wxJson.url = location.href;
              rest("/auth/sign", wxJson, "post", function (data) {
                if (data.code == 200) {
                  var result1 = data.result;
                  result1.jsApiList = [
                    'hideMenuItems',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline'
                  ];
                  wx.config(result1);
                  wx.ready(function () {
                    if (_self.data.lottery) {
                      str = '老板发狠！';
                      if (_self.data.redEnvelopes) {
                        str = '猛戳领红包！';
                      }
                      str += "多份礼包大派送！你也有机会！";
                    } else {
                      str = '礼轻情意重！猛戳领红包！'
                    }
                    wx.hideMenuItems({
                      menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                    wx.onMenuShareAppMessage({
                      title: _self.data.shareTitle, // 分享标题
                      desc: str, // 分享描述
                      link: location.origin + "/paymentee.html?pid=" + _self.data.id + "&guestid=" + _self.data.brand.guestId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.brand.logo, // 分享图标
                      type: '', // 分享类型,music、video或link，不填默认为link
                      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                      success: function () {
                        // 用户确认分享后执行的回调函数--分享事件
                      },
                      cancel: function () {
                        // 用户取消分享后执行的回调函数
                      }
                    });
                    wx.onMenuShareTimeline({
                      title: _self.data.shareTitle, // 分享标题
                      link: location.origin + "/paymentee.html?pid=" + _self.data.id + "&guestid=" + _self.data.brand.guestId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.brand.logo, // 分享图标
                      success: function () {
                        // 用户确认分享后执行的回调函数
                      }
                    });
                  });
                }
              });
              rest("/shop/" + _id + "/mp", {}, "get", function (data) {
                if (data.result && !data.result.subscribe) {
                  $(".float-icon2").show();
                }
              });
            }

          })
        } else {
          location.href = "error.html#5";
        }
      });
    },
    mounted: function () {
      if (key_json.from == 'comment') {
        this.inviteFn();
      }
    },
    methods: {
      inviteFn: function () {
        $(".gmadal-black").append("<div id='loading'></div>");
        $(".gmodal").show();
        if ($("#htmlCode").html()) {
          var qrcode = new QRCode($("#my-code1"), {
            width: 108,
            height: 108,
          });
          //当面付
          qrcode.makeCode(this.data.qrCode);
          var dom = $("#htmlCode"); //你要转变的dom
          var width = dom.width();
          var height = dom.height();
          setTimeout(function () {
            var scaleBy = 2;  //缩放比例
            var canvas = document.createElement('canvas');
            canvas.width = width * scaleBy;
            canvas.height = height * scaleBy;  //35是我处理完后发现短了一点，具体为什么不清楚,如果你也少的话，根据自己的项目调吧
            canvas.style.width = width * scaleBy + 'px';
            canvas.style.height = height * scaleBy + 'px';
            var context = canvas.getContext('2d');
            context.scale(scaleBy, scaleBy);
            html2canvas($("#htmlCode"), {
              useCORS: true,
              canvas: canvas,
              onrendered: function (canvas) {
                //生成base64图片数据
                var dataUrl = canvas.toDataURL();
                $(".gmadal-black #loading").remove();
                $("#img").attr("src", dataUrl);
                $("#htmlCode").remove();
              }
            })
          }, 100)

        } else {
          $(".gmadal-black #loading").remove();
        }
      },
      ruleFn: function () {
        _self = this;
        rest("/praise/activity/" + this.data.activityId, {}, "get", function (data) {
          if (data.code == 200) {
            _self.rule = data.result;
            $("#app").css("height", $(window).height() + "px");
            $("#app").css("overflow", "hidden");
            $(".page-group1").show();
          }
        })

      },
      benefitFn: function () {
        var param = {};
        _self = this;
        if (this.data.commentId) {
          param.commentId = this.data.commentId;
        } else {
          $.toast("您没有待领取的红包");
          return
        }
        rest("/praise/benefits", param, "get", function (data) {
          if (data.code == 200) {
            if (data.result.needPhone) {
              bindPhone("领取权益", (data.result.benefit ? "验证手机号即获“ " + data.result.benefit[0].name + "”<br>成功后可在公众号查看" : ""));
              $("#submitFn").off().click(function () {
                if ($("#tel").val().length == 11 && $("#validate").val().length == 6) {
                  $.showIndicator();
                  var jsonA = {};
                  if (key_json.id) {
                    jsonA.shopId = _id
                  } else {
                    jsonA.guestId = _id
                  }
                  jsonA.commentId = _self.data.commentId;
                  jsonA.phone = $("#tel").val();
                  jsonA.validateCode = $("#validate").val();
                  rest("/praise/benefits", jsonA, "post", function (result) {
                    if (data.code == 200) {
                      data.result && data.result.token && $.fn.cookie("token", data.result.token, {"expires": 30});
                      $.toast("操作成功");
                      refresh();
                    } else {
                      $("#validate").val("");
                      $(".input-text").html("重新获取验证码");
                      $.toast(result.message ? result.message : "请重试");
                    }
                  });
                } else {
                  $.toast("请输入正确的验证码")
                }
              });
            } else {
              var jsonA = {commentId: _self.data.commentId};
              rest("/praise/benefits", jsonA, "post", function (data) {
                if (data.code == 200) {
                  $.toast("领取成功,红包已发放至您的账户");
                  setTimeout(function () {
                    refresh();
                  }, 2000)
                } else {
                  $.toast(data.message);
                }
              });
            }
          }
        });
      },
      pageFn: function () {
        var _self = this;
        var param = {};
        param.page = this.data.candidaters.page + 1;
        param.count = this.data.candidaters.count;
        param.praiseId = _self.data.id;
        rest("/praise/candidate", param, "get", function (data) {
          if (data.code == 200) {
            _self.data.candidaters.page++;
            _self.data.candidaters.items = _self.data.candidaters.items.concat(data.result.items);
          }
        });
      },
      directFn: function () {
        ajaxUrl('upvoters.html?cid=' + this.data.candidateId);
      },
      biggerFn: function () {
        $("#my-code2").html("");
        var qrcode = new QRCode($("#my-code2"), {
          width: 100,
          height: 100
        });
        //当面付
        qrcode.makeCode(this.data.qrCode);
        $(".page-group2").show();
      },
      couponDetailFn: function (id, type) {
        ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : ''))
      }
    }
  })
}

function setCouponText(coupon) {
  var str = "";
  // if (coupon.category == '1016') {
  //     if (coupon.couponCategory == "902" || coupon.couponCategory == "9021" || coupon.couponCategory == "904") {
  //         str = "价值" + coupon.amount + "元";
  //     }
  // }
  str += coupon.name;
  return str;
}

function upvoters() {
  var app = new Vue({
    el: '#app',
    data: {
      data: "",
      data1: "",
      time: [],
      state: false
    },
    beforeCreate: function () {
      var _self = this;
      var url;
      if (key_json.pid) {
        url = "/praise/" + key_json.pid + "/supporter";
      } else if (key_json.cid) {
        url = "/praise/supporter/" + key_json.cid;
      } else {
        alert("当前链接已失效");
        return;
      }
      rest(url, {}, "get", function (data) {
        $("#loading").addClass("hide");
        _self.data = data.result;
      });
    },
    methods: {
      pageFn: function () {
        var _self = this;
        if (_self.data.page >= _self.data.pageSize) {
          return;
        }
        var url;
        if (key_json.pid) {
          url = "/praise/" + key_json.pid + "/supporter";
        } else if (key_json.cid) {
          url = "/praise/supporter/" + key_json.cid;
        }
        rest(url, {
          page: ++_self.data.page,
          count: _self.data.count
        }, "get", function (data) {
          if (data.code == 200) {
            // 添加新条目
            _self.data.items = _self.data.items.concat(data.result.items);
          }
        })
      }
    }

  });

}

function paymentee() {
  couponFn();
  prizesFn();
  app = new Vue({
      el: '#app',
      data: {
        data: "",
        time: [],
        rule: '',
        canvas: '',
        state: false,
        stars: ''
      },
      beforeCreate: function () {
        var _self = this;
        rest("/praise/" + key_json.pid + "/activity/support", {}, "get", function (data) {
          if (data.code == 200) {
            if (data.result.step == 3) {
              ajaxUrl("prize.html?cid=" + data.result.candidateId);
              return;
            }
            _self.data = data.result;
            if (_self.data.service) {
              _self.data.stars = {
                text: ["吐槽", "凑合", "一般", "满意", "很棒"],
                star: [{
                  id: "cuisine",
                  name: "菜品",
                  check: 5 - _self.data.cuisine.substr(3, 1),
                  content: new Array(5)
                }, {
                  id: "service",
                  name: "服务",
                  check: 5 - _self.data.service.substr(3, 1),
                  content: new Array(5)
                }, {
                  id: "surroundings",
                  name: "卫生",
                  check: 5 - _self.data.surroundings.substr(3, 1),
                  content: new Array(5)
                }]
              }
            }
            $("#loading").addClass("hide");
            if (data.result.lottery) {
              var t = setInterval(leftTimer, 1000);

              function leftTimer() {
                var leftTime = (new Date(_self.data.lottery.endTime)) - (new Date()); //计算剩余的毫秒数
                if (!leftTime) {
                  clearInterval(t);
                  return;
                }
                var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                Vue.set(_self.time, 0, checkTime(days));
                Vue.set(_self.time, 1, checkTime(hours));
                Vue.set(_self.time, 2, checkTime(minutes));
                Vue.set(_self.time, 3, checkTime(seconds));
              }
            }
            if (version == "WXPAY") {
              var wxJson = {};
              wxJson.url = location.href;
              rest("/auth/sign", wxJson, "post", function (data) {
                if (data.code == 200) {
                  var result1 = data.result;
                  result1.jsApiList = [
                    'hideMenuItems',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline'
                  ];
                  wx.config(result1);
                  wx.ready(function () {
                    if (_self.data.lottery) {
                      str = '老板发狠！';
                      if (_self.data.redEnvelopes) {
                        str = '猛戳领红包！';
                      }
                      str += "多份礼包大派送！你也有机会！";
                    } else {
                      str = '礼轻情意重！猛戳领红包！'
                    }
                    wx.hideMenuItems({
                      menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                    wx.onMenuShareAppMessage({
                      title: _self.data.shareTitle, // 分享标题
                      desc: str, // 分享描述
                      link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.brand.logo, // 分享图标
                      type: '', // 分享类型,music、video或link，不填默认为link
                      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                      success: function () {
                        // 用户确认分享后执行的回调函数--分享事件
                      },
                      cancel: function () {
                        // 用户取消分享后执行的回调函数
                      }
                    });
                    wx.onMenuShareTimeline({
                      title: _self.data.shareTitle, // 分享标题
                      link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.brand.logo, // 分享图标
                      success: function () {
                        // 用户确认分享后执行的回调函数
                      }
                    });
                  });
                }
              });
            }

          } else {
            location.href = "error.html#5";
          }
        })
      },
      methods: {
        submitFn: function () {
          var _self = this;
          rest("/praise/support", {praiseId: key_json.pid}, "post", function (data) {
            // if(data.code == 4050890){
            //     $.toast("助力失败！");
            //     return;
            // }
            if (data.code == 200 || data.code == 4050892) {
              $("#app").css("height", $(window).height() + "px");
              $("#app").css("overflow", "hidden");
              if (data.result && data.result.needPhone) {
                $("#app").css("height", $(window).height() + "px");
                $("#app").css("overflow", "hidden");
                if (data.code == 4050892) {
                  str = '<div style="color: black" class="text">' + (data.result.benefit ? ("抱歉您已超本日助力限制<br>但验证手机号后依旧可获得“ " + data.result.benefit + "”<br>成功后可在公众号查看") : "") + '</div>';
                } else {
                  str = '<img src="/sui_assets/img/payment1/success1.svg" style="vertical-align: middle;margin-right: 5px;">' + (_self.data.self ? '领取成功' : '助力成功') + '</div>' +
                    '<div class="text">' + (data.result.benefit ? ("验证手机号即获“ " + data.result.benefit + "”<br>成功后可在公众号查看") : "") + '</div>';
                }
                $(".page-group").show().html('<div class="bg-green"><div class="title">' +
                  str + '<input type="tel" placeholder="手机号" id="tel" maxlength="11"/>' +
                  '<div class="input-text">获取验证码</div>' +
                  '<input type="tel" placeholder="验证码" id="validate" maxlength="6"/>' +
                  '<div class="btn-green" id="submitFn">确定</div>' +
                  '<div class="close" onclick="refresh()"></div></div>');

                $(".input-text").click(function () {
                  if ($("#tel").val().length == 11) {
                    $(this).addClass("disabled");
                    rest("/validate/bindup", {"phone": $("#tel").val()}, "post", function (data) {
                      if (data.code == 200) {
                        $.toast("获取成功");
                        var second = 90;
                        var init = setInterval(function () {
                          second--;
                          if (!second) {
                            clearInterval(init);
                            $(".input-text").html("重新获取验证码");
                            $(".input-text").removeClass("disabled");
                            return;
                          }
                          $(".input-text").html("已发送 " + second + " s");
                        }, 1000);
                      } else {
                        $(".input-text").removeClass("disabled");
                        $.toast(data.message);
                      }
                    });
                  } else {
                    $.toast("请输入正确的手机号");
                  }
                });
                $("#submitFn").off().click(function () {
                  if ($("#tel").val().length == 11 && $("#validate").val().length == 6) {
                    $.showIndicator();
                    var jsonA = {};
                    jsonA.phone = $("#tel").val();
                    jsonA.validateCode = $("#validate").val();
                    jsonA.praiseId = key_json.pid;
                    rest("/praise/redEnvelopes", jsonA, "post", function (data1) {
                      if (data1.code == 200) {
                        if (data.result.benefit) {
                          $.toast("红包已到账");
                        }
                        refresh();
                      } else {
                        $.hideIndicator();
                        $("#validate").val("");
                        $(".input-text").html("重新获取验证码");
                        $.toast(data1.message);
                      }
                    });
                  } else {
                    $.toast("请输入正确的验证码")
                  }
                });
              } else {
                if (data.result && data.result.benefit) {
                  $.toast("<img src=\"/sui_assets/img/payment1/bingo.svg\" ><div>助力成功！<br>红包已到账</div>");
                } else {
                  $.toast("<img src=\"/sui_assets/img/payment1/bingo.svg\" ><div>助力成功！</div>");
                }
                setTimeout(function () {
                  refresh();
                }, 1500)
              }
            } else {
              alert(data.message);
              refresh();
            }
          });

        },
        participantFn: function () {
          var _self = this;
          if (!_self.data.self) {
            rest("/praise/lottery", {
              // "candidateId": this.data.candidateId,
              "guestId": this.data.brand.guestId
            }, "post", function (data) {
              if (_self.data.existPraise) {
                ajaxUrl("praise.html?pid=" + data.result.id);
                return;
              }
              $.toast("<img src=\"/sui_assets/img/payment1/bingo.svg\" ><div>报名成功！</div>");
              setTimeout(function () {
                ajaxUrl("praise.html?pid=" + data.result.id);
              }, 2500);
            });
            return;
          }

          $(".gmadal-black").append("<div id='loading'></div>");
          $(".gmadal-black").show();
          if ($("#htmlCode").html()) {
            _self.canvas = {};
            _self.$nextTick(function () {
              // 二维码的大小
              var qrcode = new QRCode($("#my-code1"), {
                width: 108,
                height: 108
              });
              //当面付
              qrcode.makeCode(_self.data.qrCode);
              var dom = $("#htmlCode"); //你要转变的dom
              var width = dom.width();
              var height = dom.height();
              setTimeout(function () {
                var scaleBy = 2;  //缩放比例
                var canvas = document.createElement('canvas');
                canvas.width = width * scaleBy;
                canvas.height = height * scaleBy;  //35是我处理完后发现短了一点，具体为什么不清楚,如果你也少的话，根据自己的项目调吧
                canvas.style.width = width * scaleBy + 'px';
                canvas.style.height = height * scaleBy + 'px';
                var context = canvas.getContext('2d');
                context.scale(scaleBy, scaleBy);
                html2canvas($("#htmlCode"), {
                  useCORS: true,
                  canvas: canvas,
                  onrendered: function (canvas) {
                    //生成base64图片数据
                    var dataUrl = canvas.toDataURL();
                    $("#img").attr("src", dataUrl);
                    $("#htmlCode").remove();
                    $(".gmadal-black #loading").remove();
                  }
                })
              }, 100)
            });


          } else {
            $(".gmadal-black #loading").remove();
          }
        },
        redirectFn: function () {
          ajaxUrl("brandStory.html?guestid=" + this.data.brand.guestId);
        },
        redirect1Fn: function () {
          ajaxUrl('upvoters.html?cid=' + this.data.candidateId);
        },
        couponDetailFn: function (id, type) {
          ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : ''))
        },
        benefitFn: function () {
          $.showIndicator();
          var param = {};
          _self = this;
          param.praiseId = key_json.pid;
          if (_self.self) {
            rest("/praise/redEnvelopes", param, "post", function (data) {
              if (data.code == 200) {
                $.toast("领取成功");
                setTimeout(function () {
                  refresh();
                }, 2000)
              } else {
                $.toast(data.message);
              }
            });
            return;
          }
          rest("/praise/redEnvelopes", param, "get", function (data) {
            if (data.code == 200) {
              if (data.result.needPhone) {
                bindPhone("领取权益", (data.result.benefit ? "验证手机号即获“ " + data.result.benefit[0].name + "”<br>成功后可在公众号查看" : ""));
                // bindPhone();
                $("#submitFn").off().click(function () {
                  if ($("#tel").val().length == 11 && $("#validate").val().length == 6) {
                    $.showIndicator();
                    var jsonA = {};
                    if (key_json.id) {
                      jsonA.shopId = _id
                    } else {
                      jsonA.guestId = _id
                    }
                    jsonA.praiseId = key_json.pid;
                    jsonA.phone = $("#tel").val();
                    jsonA.validateCode = $("#validate").val();
                    rest("/praise/redEnvelopes", jsonA, "post", function (data) {
                      if (data.code == 200) {
                        data.result && data.result.token && $.fn.cookie("token", data.result.token, {"expires": 30});
                        $.toast("操作成功");
                        refresh();
                      } else {
                        $("#validate").val("");
                        $(".input-text").html("重新获取验证码");
                        $.toast(data.message ? data.message : "请重试");
                      }
                    });
                  } else {
                    $.toast("请输入正确的验证码")
                  }
                });
              } else {
                var jsonA = {praiseId: key_json.pid};
                rest("/praise/redEnvelopes", jsonA, "post", function (data) {
                  if (data.code == 200) {
                    $.toast("领取成功");
                    setTimeout(function () {
                      refresh();
                    }, 2000)
                  } else {
                    $.toast(data.message);
                  }
                });
              }
            }
          });
        },
        pageFn: function () {
          var _self = this;
          var param = {};
          param.page = this.data.candidaters.page + 1;
          param.count = this.data.candidaters.count;
          param.praiseId = key_json.pid;
          rest("/praise/candidate", param, "get", function (data) {
            if (data.code == 200) {
              _self.data.candidaters.page++;
              _self.data.candidaters.items = _self.data.candidaters.items.concat(data.result.items);
            }
          });
        },
        directFn: function () {
          if (this.data.redEnvelopes && this.data.redEnvelopes[0].category !== '1017') {
            ajaxUrl("couponDetail.html?cid=" + this.data.redEnvelopes[0].id)
          }
        },
        ruleFn: function () {
          _self = this;
          rest("/praise/activity/" + this.data.activityId, {}, "get", function (data) {
            if (data.code == 200) {
              _self.rule = data.result;
              $("#app").css("height", $(window).height() + "px");
              $("#app").css("overflow", "hidden");
              $(".page-group1").show();
            }
          })

        }
      }
    }
  )
  ;
}

function lottery() {
  prizesFn();
  app = new Vue({
      el: '#app',
      data: {
        data: "",
        time: [],
        rule: '',
        canvas: '',
        state: false,
        stars: ''
      },
      beforeCreate: function () {
        var _self = this;
        rest("/praise/activity/guest/" + key_json.guestid, {}, "get", function (data) {
          if (data.code == 200) {
            _self.data = data.result;
            $("#loading").addClass("hide");
            if (data.result.lottery) {
              var t = setInterval(leftTimer, 1000);

              function leftTimer() {
                var leftTime = (new Date(_self.data.lottery.endTime)) - (new Date()); //计算剩余的毫秒数
                if (!leftTime) {
                  clearInterval(t);
                  return;
                }
                var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                Vue.set(_self.time, 0, checkTime(days));
                Vue.set(_self.time, 1, checkTime(hours));
                Vue.set(_self.time, 2, checkTime(minutes));
                Vue.set(_self.time, 3, checkTime(seconds));
              }

              if (data.result.lastWinners) {
                setTimeout(function () {
                  $('#LastWinners').Marquee({'marquee': 'y', 'speed': 50, 'margin_bottom': '5px'});
                }, 100);
              }
            }
            if (version == "WXPAY") {
              var wxJson = {};
              wxJson.url = location.href;
              rest("/auth/sign", wxJson, "post", function (data) {
                if (data.code == 200) {
                  var result1 = data.result;
                  result1.jsApiList = [
                    'hideMenuItems',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline'
                  ];
                  wx.config(result1);
                  wx.ready(function () {
                    wx.hideMenuItems({
                      menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                    wx.onMenuShareAppMessage({
                      title: _self.data.nickname + "邀您领“" + _self.data.brand.brand + '”的红包', // 分享标题
                      desc: '助力好友，领优惠', // 分享描述
                      link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.brand.logo, // 分享图标
                      type: '', // 分享类型,music、video或link，不填默认为link
                      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                      success: function () {
                        // 用户确认分享后执行的回调函数--分享事件
                      },
                      cancel: function () {
                        // 用户取消分享后执行的回调函数
                      }
                    });
                    wx.onMenuShareTimeline({
                      title: _self.data.nickname + "邀您领“" + _self.data.brand.brand + '”的红包', // 分享标题
                      link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.brand.logo, // 分享图标
                      success: function () {
                        // 用户确认分享后执行的回调函数
                      }
                    });
                  });
                }
              });
            }

          } else {
            location.href = "error.html#5";
          }
        })
      },
      methods: {
        participantFn: function () {
          if (this.data.existPraise) {
            ajaxUrl("praise.html?cid=" + this.data.candidateId);
          } else {
            rest("/praise/lottery", {
              "guestId": this.data.brand.guestId
            }, "post", function (data) {
              if (data.code == 200) {
                ajaxUrl("praise.html?pid=" + data.result.id);
                /* $.toast("<img src=\"/sui_assets/img/payment1/bingo.svg\" ><div>报名成功！</div>");
                                 setTimeout(function () {
                                 }, 2500);*/
              }
            });
          }
        },
        couponDetailFn: function (id, type) {
          ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : ''))
        },
        pageFn: function () {
          var _self = this;
          rest("/praise/candidate/" + key_json.guestid, {
            page: this.data.candidaters.page + 1,
            count: this.data.candidaters.count
          }, "get", function (data) {
            if (data.code == 200) {
              _self.data.candidaters.page++;
              _self.data.candidaters.items = _self.data.candidaters.items.concat(data.result.items);
            }
          });
        },
        ruleFn: function () {
          _self = this;
          rest("/praise/activity/" + this.data.activityId, {}, "get", function (data) {
            if (data.code == 200) {
              _self.rule = data.result;
              $("#app").css("height", $(window).height() + "px");
              $("#app").css("overflow", "hidden");
              $(".page-group1").show();
            }
          })

        }
      }
    }
  )
  ;
}

function timeFormat(time) {
  var leftTime = (new Date(time)) - (new Date()); //计算剩余的毫秒数
  if (!leftTime) {
    return "00天00时00分00秒";
  }
  var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
  var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
  var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
  var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
  return checkTime(days) + "天" + checkTime(hours) + "时" + checkTime(minutes) + "分" + checkTime(seconds) + "秒";
}

function lotteryMy() {
  app = new Vue({
    el: '#app',
    data: {
      data: "",
      time: [],
      rule: '',
      canvas: '',
      state: false,
      stars: ''
    },
    beforeCreate: function () {
      var _self = this;
      rest("/praise/lottery/guest/" + key_json.guestid, {}, "get", function (data) {
        if (data.code == 200) {
          _self.data = data.result;
          $("#loading").addClass("hide");
        } else {
          alert(data.message);
          history.back();
        }
      })
    },
    methods: {
      redirectFn: function (id, state) {
        if (state == 2) {
          ajaxUrl("praise.html?cid=" + id);
        } else {
          ajaxUrl("prize.html?cid=" + id);
        }
      }
    }
  });
}

function brandStory() {
  app = new Vue({
    el: '#app',
    data: {
      data: "",
      time: [],
      rule: '',
      canvas: '',
      state: false,
      stars: ''
    },
    beforeCreate: function () {
      var _self = this;
      rest("/shop/" + _id + "/brand", {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
        } else {
          alert(data.message);
          history.back();
        }
      });
    }
  });
}


function prize() {
  couponFn();
  var app = new Vue({
    el: '#app',
    data: {
      data: "",
      winners: "",
      canvas: '',
      stars: {},
      rule: ''
    },
    beforeCreate: function () {
      key_json.cid = key_json.comment ? key_json.comment : key_json.cid;
      var _self = this;
      rest("/praise/lottery/" + key_json.cid, {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
        }
      })

    },
    methods: {
      participantFn: function () {
        _self = this;
        rest("/praise/lottery", {
          "candidateId": key_json.cid
        }, "post", function (data) {
          if (data.code == 200) {
            if (_self.data.existPraise) {
              ajaxUrl("praise.html?pid=" + data.result.id);
              return;
            }
            $.toast("<img src=\"/sui_assets/img/payment1/bingo.svg\" ><div>报名成功！</div>");
            setTimeout(function () {
              ajaxUrl("praise.html?pid=" + data.result.id);
            }, 2500)
          } else {
            alert(data.message);
          }
        });

      },
      benefitFn: function () {
        var param = {};
        _self = this;
        param.candidateId = key_json.cid;
        rest("/praise/benefits", param, "get", function (data) {
          if (data.code == 200) {
            if (data.result.needPhone) {
              bindPhone("领取权益", data.result.benefit ? "验证手机号即获“ " + data.result.benefit[0].name + "”<br>成功后可在公众号查看" : "");
              $("#submitFn").off().click(function () {
                if ($("#tel").val().length == 11 && $("#validate").val().length == 6) {
                  $.showIndicator();
                  var jsonA = {};
                  if (key_json.id) {
                    jsonA.shopId = _id
                  } else {
                    jsonA.guestId = _id
                  }
                  jsonA.candidateId = key_json.cid;
                  jsonA.phone = $("#tel").val();
                  jsonA.validateCode = $("#validate").val();
                  rest("/praise/benefits", jsonA, "post", function (data) {
                    if (data.code == 200) {
                      data.result && data.result.token && $.fn.cookie("token", data.result.token, {"expires": 30});
                      $('.page-group').hide();
                      $.toast("操作成功");
                      refresh();
                    } else {
                      $("#validate").val("");
                      $(".input-text").html("重新获取验证码");
                      $.toast(data.message ? data.message : "请重试");
                    }
                  });
                } else {
                  $.toast("请输入正确的验证码")
                }
              });
            } else {
              var jsonA = {candidateId: key_json.cid};
              rest("/praise/benefits", jsonA, "post", function (data) {
                if (data.code == 200) {
                  $.toast("领取成功");
                  setTimeout(function () {
                    refresh();
                  }, 2000)
                } else {
                  $.toast(data.message);
                }
              });
            }

          }
        });
      },
      ruleFn: function () {
        _self = this;
        rest("/praise/activity/" + this.data.activityId, {}, "get", function (data) {
          if (data.code == 200) {
            _self.rule = data.result;
            $("#app").css("height", $(window).height() + "px");
            $("#app").css("overflow", "hidden");
            $(".page-group1").show();
          }
        })

      },
      pageFn: function () {
        var _self = this;
        var param = {};
        param.page = this.data.candidaters.page + 1;
        param.count = this.data.candidaters.count;
        param.candidateId = key_json.cid;
        rest("/praise/candidate", param, "get", function (data) {
          if (data.code == 200) {
            _self.data.candidaters.page++;
            _self.data.candidaters.items = _self.data.candidaters.items.concat(data.result.items);
          }
        });
      }
    }
  });
}

function raffleActivity() {
  var app = new Vue({
    el: '#app',
    data: {
      data: ""
    },
    beforeCreate: function () {
      var _self = this;
      rest("/lottery/activity/" + key_json.aid + "/cover", {}, "get", function (data) {
          if (data.code == 200) {
            if (data.result.step == 3) {
              if (data.result.id) {
                ajaxUrl('raffleResult.html?lid=' + data.result.id);
              } else {
                ajaxUrl("raffleWinners.html?aid=" + key_json.aid);
              }
            }
            if (data.result.step == -1) {
              ajaxUrl("raffleWinners.html?aid=" + key_json.aid);
            }
            $("#loading").addClass("hide");
            setTitle(data.result.brandName + "大奖免费抽");
            _self.data = data.result;
            _self.category = {
              '901': 'simple',
              '9011': 'simple',
              '902': 'multi',
              '9021': 'multi',
              '903': 'simple',
              '9031': 'simple',
              '904': 'multi'
            };
            if (version == "WXPAY") {
              var wxJson = {};
              wxJson.url = location.href;
              rest("/auth/sign", wxJson, "post", function (data) {
                if (data.code == 200) {
                  var result1 = data.result;
                  result1.jsApiList = [
                    'hideMenuItems',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline'
                  ];
                  wx.config(result1);
                  wx.ready(function () {
                    // alert(_self.data.shareTitle);
                    wx.hideMenuItems({
                      menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                    wx.onMenuShareAppMessage({
                      title: _self.data.shareTitle, // 分享标题
                      desc: '抢到就是赚到!仅限' + _self.data.requirements + "名！大小奖品" + _self.data.lottery.awardCount + "份！满额即时开奖", // 分享描述
                      link: location.origin + "/raffleActivity.html?aid=" + key_json.aid + (_self.data.id ? ('&lid=' + _self.data.id) : '') + "&guestid=" + _id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.logoUrl, // 分享图标
                      type: '', // 分享类型,music、video或link，不填默认为link
                      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                      success: function () {
                        // 用户确认分享后执行的回调函数--分享事件
                      },
                      cancel: function () {
                        // 用户取消分享后执行的回调函数
                      }
                    });
                    wx.onMenuShareTimeline({
                      title: _self.data.shareTitle, // 分享标题
                      link: location.origin + "/raffleActivity.html?aid=" + key_json.aid + (_self.data.id ? ('&lid=' + _self.data.id) : '') + "&guestid=" + _id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.logoUrl, // 分享图标
                      success: function () {
                        // 用户确认分享后执行的回调函数
                      }
                    });
                  });
                }
              });
              // rest("/shop/" + _id + "/mp", {}, "get", function (data) {
              //     if (data.result && !data.result.subscribe) {
              //         _self.wx = data.result;
              //     }
              // });
            }

            // document.addEventListener("touchstart", function (e) {
            //     starty = e.touches[0].pageY;
            //     if ($(window).height() + $(window).scrollTop() == $(document).height()) {
            //         location.href = location.origin + "/raffleActivity1.html" + location.search;
            //     }
            // }, false);
            // //手指离开屏幕
            // document.addEventListener("touchend", function (e) {
            //     endy = e.changedTouches[0].pageY;
            //     if (starty - endy > 150) {
            //         location.href = location.origin + "/raffleActivity1.html" + location.search;
            //     }
            // }, false);
          } else {
            location.href = "error.html#6";
          }
        }
      )
    },
    methods: {
      redirectFn: function () {
        location.href = location.origin + "/raffleActivity1.html" + location.search;
      },
      couponDetailFn: function (id, type) {
        ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : ''))
      }
    }
  });
}

function raffleActivity1() {
  // couponFn();
  // prizesFn();
  var app = new Vue({
      el: '#app',
      data: {
        data: {
          category: {
            '901': 'simple',
            '9011': 'simple',
            '902': 'multi',
            '9021': 'multi',
            '903': 'simple',
            '9031': 'simple',
            '904': 'multi'
          }
        },
        applicants: "",
        sponsors: ""
      },
      beforeCreate: function () {
        var _self = this;
        rest("/lottery/guest/" + _id + "/activity/" + key_json.aid, {}, "get", function (data) {
          if (data.code == 200) {
            if (data.result.step == 3) {
              ajaxUrl('raffleResult.html?lid=' + data.result.id);
            }
            //报名名单
            if (!data.result.enrolled && data.result.applicants) {
              rest("/lottery/activity/" + key_json.aid + "/applicants", {}, "get", function (data) {
                if (data.code == 200) {
                  $("#loading").addClass("hide");
                  _self.applicants = data.result;
                } else {
                  alert(data.message);
                }

              });
            }
            if (data.result.enrolled && data.result.inviterBenefit.total) {
              rest("/lottery/" + data.result.id + "/sponsors", {}, "get", function (data) {
                if (data.code == 200) {
                  $("#loading").addClass("hide");
                  _self.sponsors = data.result;
                } else {
                  alert(data.message);
                }

              });
            }
            $("#loading").addClass("hide");
            setTitle(data.result.brand.brand + "大奖免费抽");
            _self.data = data.result;
            _self.$nextTick(function () {
              if (_self.data.needSubscribe && _self.data.enrolled) {
                if (_self.data.qrCode) {
                  var qrcode = new QRCode($("#my-code2"), {
                    width: 60,
                    height: 60
                  });
                  //当面付
                  qrcode.makeCode(_self.data.qrCode);
                } else {
                  rest("/lottery/activity/" + key_json.aid + "/invitation", {}, "post", function (data) {
                    if (data.code == 200) {
                      _self.data.qrCode = data.result.qrCode;
                      var qrcode = new QRCode($("#my-code2"), {
                        width: 100,
                        height: 100
                      });
                      //当面付
                      qrcode.makeCode(_self.data.qrCode);
                    }
                  });
                }
              }
            });

            if (version == "WXPAY") {
              var wxJson = {};
              wxJson.url = location.href;
              rest("/auth/sign", wxJson, "post", function (data) {
                if (data.code == 200) {
                  var result1 = data.result;
                  result1.jsApiList = [
                    'hideMenuItems',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline'
                  ];
                  wx.config(result1);
                  wx.ready(function () {
                    // alert(_self.data.shareTitle);
                    wx.hideMenuItems({
                      menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                    wx.onMenuShareAppMessage({
                      title: _self.data.shareTitle, // 分享标题
                      desc: '抢到就是赚到!仅限' + _self.data.requirements + "名！大小奖品" + _self.data.lottery.awardCount + "份！满额即时开奖", // 分享描述
                      link: location.origin + "/raffleActivity.html?aid=" + key_json.aid + (_self.data.id ? ('&lid=' + _self.data.id) : '') + "&guestid=" + _id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.brand.logo, // 分享图标
                      type: '', // 分享类型,music、video或link，不填默认为link
                      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                      success: function () {
                        // 用户确认分享后执行的回调函数--分享事件
                      },
                      cancel: function () {
                        // 用户取消分享后执行的回调函数
                      }
                    });
                    wx.onMenuShareTimeline({
                      title: _self.data.shareTitle, // 分享标题
                      link: location.origin + "/raffleActivity.html?aid=" + key_json.aid + (_self.data.id ? ('&lid=' + _self.data.id) : '') + "&guestid=" + _id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                      imgUrl: _self.data.brand.logo, // 分享图标
                      success: function () {
                        // 用户确认分享后执行的回调函数
                      }
                    });
                  });
                }
              });
              // rest("/shop/" + _id + "/mp", {}, "get", function (data) {
              //     if (data.result && !data.result.subscribe) {
              //         _self.wx = data.result;
              //     }
              // });
            }
          } else {
            location.href = "error.html#6";
          }
        })

      },
      methods: {
        submitFn: function () {
          if ($(".preloader-indicator-modal").length) return;
          _self = this;
          if (this.data.needPhone) {
            this.bindPhone();
            return;
          }
          $("#pay").addClass('disabled');
          setPayMode(a);

          function a(payment) {
            if (!payment) {
              alert("不支持在线支付");
              return;
            }
            $.showIndicator();
            var json = {};
            if (key_json.lid) {
              json.lotteryId = key_json.lid;
            }
            json.activityId = key_json.aid;
            json.payCategory = payment.payMode;
            json.url = encodeURIComponent(location.href);
            json.failedUrl = encodeURIComponent(location.href);
            rest("/lottery/buy", json, "post", function (data) {
              if (data.code == 200) {
                $.showIndicator();
                var order_id = data.result.orderId;
                $.fn.cookie("order_id", order_id);
                switch (payment.payMode) {
                  case "1005":
                    var js = data.result.js;
                    var pay = data.result.pay;
                    pay.success = function () {
                      $("#pay").removeClass('disabled');
                      rest("/order/" + order_id + "/pay/result", {}, "get", function () {
                      });
                      $('.page-group1').show();
                    };
                    pay.cancel = function () {
                      cancelPay();
                      $("#pay").removeClass('disabled');
                      $.hideIndicator();
                    };
                    pay.fail = function (res) {
                      cancelPay();
                      $.hideIndicator();
                      $("#pay").removeClass('disabled');
                      alert("支付失败");
                    };
                    js.debug = false;
                    js.jsApiList = ['chooseWXPay'];
                    delete js.url;
                    wx.config(js);
                    // wx.ready(function () {
                    wx.chooseWXPay(pay);
                    // });
                    break;
                  case "1101":
                    AlipayJSBridge.call("tradePay", {
                      tradeNO: data.result.pay.tradeNO
                    }, function (result) {
                      if (result.resultCode == "6001") {
                        $("#pay").removeClass('disabled');
                        cancelPay();
                        return;
                      }
                      if (result.resultCode == "9000") {
                        $("#pay").removeClass('disabled');
                        rest("/order/" + order_id + "/pay/result", {}, "get", function () {
                        });
                        $('.page-group1').show();
                      }
                      $.hideIndicator();
                    });
                    break;
                }
              } else if (data.code == 405009) {
                $.confirm("支付遇到问题，是否重新支付？", function () {
                  rest("/order/" + data.result.orderId + "/pay/revoke", {}, "post", function (data) {
                    if (data.code == 200) {
                      _self.submitFn();
                    } else {
                      $("#pay").removeClass('disabled');
                      alert(data.message);
                    }
                  });
                }, function () {
                  $("#pay").removeClass('disabled');
                });
              } else {
                alert(data.message);
              }
            });
          }

        },
        bindPhone: function () {
          _self = this;
          bindPhone("验证手机号码", "为了在您获得大奖后能及时通知<br>请先验证手机号码");
          $("#submitFn").off().click(function () {
            if ($("#tel").val().length == 11 && $("#validate").val().length == 6) {
              $.showIndicator();
              var jsonA = {};
              jsonA.guestId = _id;
              jsonA.phone = $("#tel").val();
              jsonA.validateCode = $("#validate").val();
              rest("/phone/bindup", jsonA, "post", function (data) {
                if (data.code == 200) {
                  data.result && data.result.token && $.fn.cookie("token", data.result.token, {"expires": 30});
                  $('.page-group').hide();
                  _self.data.needPhone = false;
                  $.toast("操作成功");
                  _self.submitFn();
                } else {
                  $("#validate").val("");
                  $(".input-text").html("重新获取验证码");
                  $.toast(data.message ? data.message : "请重试");
                }
              });
            } else {
              $.toast("请输入正确的验证码")
            }
          });

        },
        inviteFn: function () {
          var url = this.data.qrCode;
          if (!this.data.qrCode) {
            rest("/lottery/activity/" + key_json.aid + "/invitation", {}, "post", function (data) {
              if (data.code == 200) {
                url = data.result.qrCode;
                a();
              }
            });
          } else {
            a();
          }

          function a() {
            $(".gmadal-black").append("<div id='loading'></div>");
            $(".gmodal").show();
            if ($("#htmlCode").html()) {
              var qrcode = new QRCode($("#my-code1"), {
                width: 100,
                height: 100
              });
              //当面付
              qrcode.makeCode(url);
              var dom = $("#htmlCode"); //你要转变的dom
              var width = dom.width();
              var height = dom.height();
              setTimeout(function () {
                var scaleBy = 2;  //缩放比例
                var canvas = document.createElement('canvas');
                canvas.width = width * scaleBy;
                canvas.height = height * scaleBy;  //35是我处理完后发现短了一点，具体为什么不清楚,如果你也少的话，根据自己的项目调吧
                canvas.style.width = width * scaleBy + 'px';
                canvas.style.height = height * scaleBy + 'px';
                var context = canvas.getContext('2d');
                context.scale(scaleBy, scaleBy);
                html2canvas($("#htmlCode"), {
                  useCORS: true,
                  canvas: canvas,
                  onrendered: function (canvas) {
                    //生成base64图片数据
                    var dataUrl = canvas.toDataURL();
                    $(".gmadal-black #loading").remove();
                    $("#img").attr("src", dataUrl);
                    $("#htmlCode").remove();
                  }
                })
              }, 100)
            }
            else {
              $(".gmadal-black #loading").remove();
            }
          }
        },
        redirectFn: function () {
          ajaxUrl('raffleJoin.html?aid=' + key_json.aid);
        },
        couponDetailFn: function (id, type) {
          ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : ''))
        },
        applicantsPageFn: function () {
          var _self = this;
          if (_self.applicants.page >= _self.applicants.pageSize) {
            return;
          }
          rest("/lottery/activity/" + key_json.aid + "/applicants", {
            page: ++_self.applicants.page,
            count: _self.applicants.count
          }, "get", function (data1) {
            if (data1.code == 200) {
              // 添加新条目
              _self.applicants.items = _self.applicants.items.concat(data1.result.items);
            }
          })
        },
        sponsorsPageFn: function () {
          var _self = this;
          if (_self.sponsors.page >= _self.sponsors.pageSize) {
            return;
          }
          rest("/lottery/" + key_json.lid + "/sponsors", {
            page: ++_self.sponsors.page,
            count: _self.sponsors.count
          }, "get", function (data1) {
            if (data1.code == 200) {
              // 添加新条目
              _self.sponsors.items = _self.sponsors.items.concat(data1.result.items);
            }
          })
        }


      }
    })
  ;
}

function raffleJoin() {
  var app = new Vue({
    el: '#app',
    data: {
      data: ""
    },
    beforeCreate: function () {
      var _self = this;
      rest("/lottery/activity/" + key_json.aid + "/applicants", {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
        } else {
          alert(data.message);
          history.back();
        }

      });
    },
    methods: {
      pageFn: function () {
        var _self = this;
        if (_self.data.page >= _self.data.pageSize) {
          return;
        }
        rest("/lottery/activity/" + key_json.aid + "/applicants", {
          page: ++_self.data.page,
          count: _self.data.count
        }, "get", function (data1) {
          if (data1.code == 200) {
            // 添加新条目
            _self.data.items = _self.data.items.concat(data1.result.items);
          }
        })
      }
    }

  });
}

function raffles() {
  var app = new Vue({
    el: '#app',
    data: {
      data: ""
    },
    beforeCreate: function () {
      var _self = this;
      rest("/lottery/" + key_json.lid + "/sponsors", {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
        } else {
          alert(data.message);
          history.back();
        }

      });
    },
    methods: {
      pageFn: function () {
        var _self = this;
        if (_self.data.page >= _self.data.pageSize) {
          return;
        }
        rest("/lottery/" + key_json.lid + "/sponsors", {
          page: ++_self.data.page,
          count: _self.data.count
        }, "get", function (data1) {
          if (data1.code == 200) {
            // 添加新条目
            _self.data.items = _self.data.items.concat(data1.result.items);
          }
        })
      }
    }
  });
}

function raffleWinners() {
  var app = new Vue({
    el: '#app',
    data: {
      data: ""
    },
    beforeCreate: function () {
      var _self = this;
      rest("/lottery/guest/" + _id + "/activity/" + key_json.aid + "/winners", {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
        } else {
          location.href = "error.html#6"
        }
      });
    },
    methods: {
      pageFn: function () {
        var _self = this;
        if (_self.data.page >= _self.data.pageSize) {
          return;
        }
        rest("/lottery/guest/" + _id + "/activity/" + key_json.aid + "/winners", {
          page: ++_self.data.page,
          count: _self.data.count
        }, "get", function (data1) {
          if (data1.code == 200) {
            // 添加新条目
            _self.data.items = _self.data.items.concat(data1.result.items);
          }
        })
      }
    }
  });
}

function raffleResult() {
  couponFn();
  var app = new Vue({
    el: '#app',
    data: {
      data: "",
      rule: ""
    },
    beforeCreate: function () {
      var _self = this;
      rest("/lottery/" + key_json.lid, {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          _self.data = data.result;
        } else {
          alert(data.message);
          location.href = "error.html#6"
        }
      })

    },
    methods: {
      rafflesFn: function () {
        ajaxUrl('raffles.html?lid=' + key_json.lid);
      },
      listFn: function () {
        ajaxUrl('raffleWinners.html?aid=' + this.data.activityId);
      },
      ruleFn: function () {
        _self = this;
        rest("/lottery/activity/" + this.data.activityId + "/content", {}, "get", function (data) {
          if (data.code == 200) {
            _self.rule = data.result;
            $(".page-group1").show();
            $("#app").css("height", $(window).height() + "px");
            $("#app").css("overflow", "hidden");
          }
        })

      }
    }
  });
}

function userInfo() {
  rest("/user", {}, "get", function (data) {
    if (data.code == 200) {
      $(".name").html(data.result.nickname);
      $(".avatar").attr("src", data.result.avatarUrl);
      if (data.result.phone) {
        $.fn.cookie("phone", data.result.phone);
        $("#phone").attr("onclick", "ajaxUrl('changePhone.html')");
        $("#phone .item-after").html(data.result.phone + "<span class='text-green'> 修改手机</span>")
      } else {
        $("#set").addClass('round');
        if (key_json.type == "coupon") {
          phoneModal();
          $(".earn-box1").removeClass("hide");
        } else {
          phoneModal("phone");
        }
        $("#phone").addClass('round');
      }
      if (data.result.gender) {
        gender(data.result.gender)
      }

      function gender(gender1) {
        var str = "";
        switch (gender1) {
          case "F":
            str = '女士 <span class="F"></span>';
            break;
          case "M":
            str = '男士 <span class="M"></span>';
            break;
          default:
            str = '保密';
        }
        $("#gender .item-after").html(str);
      }

      if (data.result.birthday) {
        $("#birth .item-after").html(data.result.birthday);
        $("#birth").addClass("has-birth");
      }
      $("#gender").click(function () {
        var a = data.result.gender == "F" ? 2 : data.result.gender == "M" ? 3 : 4;
        $.modal({
          title: '请选择您的性别',
          afterText: '<div class="text-center" style="font-size: .75rem;line-height: 2">' +
          '<div style="height: 2px;background: #e1e1e1;margin: 1rem 40%"></div>' +
          '<div><input type="radio" id="radio1" name="gender" value="F"/> <label for="radio1">女士 <span class="F"></span></label></div>' +
          '<div><input type="radio" id="radio2" name="gender" value="M"/> <label for="radio2">男士 <span class="M"></span></label></div>' +
          '<div><input type="radio" id="radio3" name="gender" value="N"/> <label for="radio3">保密 <span class="N"></span></label></div>' +
          '<div class="btn-green" style="width: 100%;margin: 1rem -1px 0;height: 2rem;line-height: 2rem" id="gender-submit">确认</div><div class="md-close"></div>',
          extraClass: "bg-green"
        });

        $('.modal-inner .text-center div:nth-child(' + a + ') input').attr("checked", "checked");
      });
      $("body").on("click", "#gender-submit", function () {
        if ($("input:checked").val()) {
          var data1 = rest("/user", {
            gender: $("input:checked").val()
          }, "post", function (data1) {
            if (data1.code == 200) {
              $.closeModal();
              $.toast("操作成功!");
              data.result.gender = $("input:checked").val();
              gender($("input:checked").val());
            } else {
              toast(data1.message);
            }
          });
        } else {
          $.toast("请先选择性别！");
        }
      });
      $.init();
      $("#loading").addClass("hide");
    }
  });

}

function brand() {
  var para = {};
  para.type = version == "WXPAY" ? "wx" : "ali";
  rest("/activities/guest/" + _id, para, "get", function (data) {
    if (data.result) {
      $("#loading").addClass("hide");
      $(".shop").html(data.result.brandName);
      $("title").html(data.result.brandName);
      var activity = data.result;
      if (activity.cardUrl) {
        data.result.cardUrl && loadImage(data.result.cardUrl, '$(".card-bg").attr("style", "background-image:url(" + url + ")")');
        data.result.logo && loadImage(data.result.logo, '$(".card-content .avatar").attr("src", url)');
        $(".card-bg").attr("onclick", "ajaxUrl('vip.html')");
        $('.set-content').html('<div class="coupon-content"> <div class="right"><span class="iconA"></span></div> </div>');
        $(".card-grey").removeClass("hide");
      }
      activity.activeActivities && setActivityCode(activity.activeActivities);
      activity.checkActivities && setCheckCode(activity.checkActivities);
      if (activity.topActivity) {
        var a = [activity.topActivity];
        if (activity.topActivity.activityCategory < 6005 || activity.topActivity.activityCategory == "6007") {
          setActivityCode(a, 1);
        } else {
          setCheckCode(a, 1);
        }
      }
      if (activity.followActivity) {
        var str = "";
        var follow = activity.followActivity;
        var len = follow.coupons.length > 2 ? 2 : follow.coupons.length;
        for (var w = 0; w < len; w++) {
          switch (follow.coupons[w].category) {
            case "9021":
            case "902":
              str += '<div class="food-box">' + follow.coupons[w].value + '<span class="pull-right">￥' + follow.coupons[w].currentAmount + '<span class="amount" style="font-size: .5rem;"> ￥' + follow.coupons[w].amount + '</span></span></div>';
              break;
            case "901":
              str += '<div class="money-box">' + follow.coupons[w].name + '</div>';
              break;
            case "9011":
              str += '<div class="discount-box">' + follow.coupons[w].name + '</div>';
              break;
            case "904":
              str += '<div class="gift-box">' + follow.coupons[w].name + '</div>';
              break;
            case "9031":
              str += '<div class="di-box">' + follow.coupons[w].name + '</div>';
              break;
            case "903":
              str += '<div class="di-box">全场' + follow.coupons[w].name + '</div>';
              break;
          }
        }
        $(".separate").html('<div class="follow-card" onclick="ajaxUrl(\'follow.html\')"><div class="follow">' + str + '</div></div>');
      }
      $.init();
      $("#loading").addClass("hide");
    }
  });
}

function more() {
  var para = {};
  para.type = version == "WXPAY" ? "wx" : "ali";
  para.id = _id;
  rest("/activities/shop", para, "get", function (data) {
    if (data.result) {
      $(".shop").html(data.result.brandName);
      $("title").html(data.result.brandName);
      var activity = data.result;
      if (activity.cardUrl && shopId) {
        activity.cardUrl && loadImage(activity.cardUrl, '$(".card-bg").attr("style", "background-image:url(" + url + ")")');
        data.result.logo && loadImage(data.result.logo, '$(".card-content .avatar").attr("src", url)');
        $(".card-bg").attr("onclick", "ajaxUrl('vip.html')");
        $('.set-content').html('<div class="coupon-content"><div class="right"><span class="iconA"></span></div> </div>');
        $(".card-grey").removeClass("hide");
      }
      activity.activeActivities && setActivityCode(activity.activeActivities);
      activity.checkActivities && setCheckCode(activity.checkActivities);
      if (activity.topActivity) {
        var a = [activity.topActivity];
        if (activity.topActivity.activityCategory < 6005 || activity.topActivity.activityCategory == "6007") {
          setActivityCode(a, 1);
        } else {
          setCheckCode(a, 1);
        }
      }
      if (activity.followActivity) {
        var str = "";
        var follow = activity.followActivity;
        var len = follow.coupons.length > 2 ? 2 : follow.coupons.length;
        for (var w = 0; w < len; w++) {
          switch (follow.coupons[w].category) {
            case "9021":
            case "902":
              str += '<div class="food-box">' + follow.coupons[w].value + '<span class="pull-right">￥' + follow.coupons[w].currentAmount + '<span class="amount" style="font-size: .5rem;"> ￥' + follow.coupons[w].amount + '</span></span></div>';
              break;
            case "901":
              str += '<div class="money-box">' + follow.coupons[w].value + '元代金券</div>';
              break;
            case "9011":
              str += '<div class="discount-box">' + follow.coupons[w].name + '</div>';
              break;
            default:
              str += '<div class="gift-box">' + follow.coupons[w].value + '</div>';
          }
        }
        $(".separate").html('<div class="follow-card" onclick="ajaxUrl(\'follow.html\')"><div class="">关注本店公众号，即可获专享优惠</div> <div class="follow">' + str + '</div></div>');
      }
      $.init();
      $("#loading").addClass("hide");
    }
  });
}

function follow() {
  rest("/activities/follow/guest/" + _id, {}, "get", function (data1) {
    if (data1.code != 200) {
      $.modal({
        title: '',
        afterText: '<div >您不是本店的新粉丝<br>不能参加此活动哦~<br>我们将带您到活动中心</div>',
        buttons: [
          {
            text: '我知道了',
            onClick: function () {
              ajaxUrl("more.html");
            }
          }]
      });
    }
    rest("/shop/" + _id + "/mp", {}, "get", function (data) {
      if (data.code == 200) {
        $("title").html(data1.result.brandName);
        var activity = data1.result;
        var str = "";
        var len = activity.coupons.length;
        for (var t = 0; t < len; t++) {
          switch (activity.coupons[t].category) {
            case "902":
            case "9021":
              str += '<div class="food-box"><span class="ellipsis">' + activity.coupons[t].value + '</span><span class="pull-right">￥' + activity.coupons[t].currentAmount + '<span class="amount" style="font-size: .5rem"> ￥' + activity.coupons[t].amount + '</span></span></div>';
              break;
            case "901":
              str += '<div class="money-box">' + activity.coupons[t].value + '元代金券</div>';
              break;
            case "9011":
              str += '<div class="discount-box">' + activity.coupons[t].name + '</div>';
              break;
            default:
              str += '<div class="gift-box">' + activity.coupons[t].value + '</div>';
          }
        }
        if (!data.result.subscribe) {
          $(".inner").html('<div class="text-xs">关注本店公众号，即可获专属优惠</div>' +
            '<div class="coupon-list">' + str + '</div><div class="follow-wx"><div> <div>长按关注再领券</div><img src="/sui_assets/img/finger.gif"> </div> <div > <img src="' + data.result.url + '" class="shop_url"> </div> </div>');
        } else if (!data1.result.existPhone) {
          $(".inner").html('<div class="text-xs">您已关注！快来领取专属好礼！</div>' +
            '<div class="coupon-list">' + str + '</div><div class="phone-box1" id="bind">' +
            '<input type="tel" placeholder="请输入手机号码" id="tel" maxlength="11"/>' +
            '<div class="input-text">获取验证码</div>' +
            '<input type="tel" placeholder="输入验证码" id="validate" maxlength="6"/>' +
            '</div>' +
            '<div id="bindPhone" index="' + activity.activityId + '&' + activity.ruleTupleId + '"><img src="/sui_assets/img/follow/submit.svg" style="width: 3.5rem;margin-top: -.25rem"></div>');
          bind();
        } else {
          $(".inner").html('<div class="text-xs">您已关注！快来领取专属好礼！</div>' +
            '<div class="coupon-list">' + str + '</div><div class="phone-box1">' +
            '<div><img onclick="earn(\'' + activity.activityId + '\',\'' + activity.ruleTupleId + '\')" src="/sui_assets/img/follow/submit.svg" style="width: 3.5rem;margin-top: 1rem"></div>');

        }
        $.init();
        $("#loading").addClass("hide");
        //} else {
        //    $.toast('你不符合参加条件');
        //}
      }
    });
  });
}

function bind() {
  //$.init();
  $("#loading").addClass("hide");
  $(".input-text").click(function () {
    if ($(".toast").hasClass("modal-in")) return;
    if ($("#tel").val().length == 11) {
      $(this).addClass("disabled");
      rest("/validate/bindup", {"phone": $("#tel").val()}, "post", function (data) {
        if (data.code == 200) {
          $.toast("获取成功");
          var second = 90;
          var init = setInterval(function () {
            second--;
            if (!second) {
              clearInterval(init);
              $(".input-text").html("重新获取验证码");
              $(".input-text").removeClass("disabled");
              return;
            }
            $(".input-text").html("已发送 " + second + " s");
          }, 1000);
        } else {
          $(".input-text").removeClass("disabled");
          $.toast(data.message);
        }
      });
    } else {
      $.toast("请输入正确的手机号");
    }
  });
  $("#bindPhone").off().click(function () {
    if ($(".toast").hasClass("modal-in")) return;
    if ($("#tel").val().length == 11 && $("#validate").val().length == 6) {
      $.showIndicator();
      var jsonA = {};
      if (key_json.id) {
        jsonA.shopId = _id
      } else {
        jsonA.guestId = _id
      }
      jsonA.phone = $("#tel").val();
      jsonA.validateCode = $("#validate").val();
      rest("/phone/bindup", jsonA, "post", function (result) {
        if (result.code == 200) {
          $.closeModal();
          result.result && result.result.token && $.fn.cookie("token", result.result.token, {"expires": 30});
          switch (basicName) {
            case "bind":
              alert("绑定手机成功，请继续您未完成的操作");
              history.go(-1);
              break;
            case "follow":
              earn($("#bindPhone").attr("index").split("&")[0], $("#bindPhone").attr("index").split("&")[1]);
              break;
            case "payment":
            case "orderDetail":
              $.toast("正在同步您的权益，请稍后", 3000);
              setTimeout(function () {
                redirectUrl();
              }, 2000);
              break;
            case "userInfo":
              if (key_json.type == "coupon") {
                $.toast("权益已自动发放，请刷新查看", 3000);
              } else {
                $.toast("补全手机成功");
              }
              location.href = location.href + "&time=" + new Date();
              break;
            /*  case "entrance":
                          case "selfPay":
                          case "user":
                              $(".modal").remove();
                              addVipResult();
                              break;*/
            case "strategy":
              app.data.strategies[_self.key].needValidate = false;
              $(".md-close").click();
              app.submitFn();
              break;
            // case "upgrade":
            //     Vue.set(app.data, 'needPhone', false);
            //     for (var i in app.data.strategies) {
            //         if (app.data.strategies[i].type == 'FREE') {
            //             $.toast("<div style='padding-bottom: 11px;'><img src=\"/sui_assets/img/payment1/bingo.svg\"> 操作成功！</div><div style='font-size: 14px;'>即将跳转到用户中心，<br>查看您的特权</div>", 4000);
            //             setTimeout(function () {
            //                 redirectUrl();
            //             }, 3000)
            //         }
            //     }
            //     app.checked = false;
            //     break;
            default:
              alert("操作成功");
              redirectUrl();
          }
        } else {
          $("#validate").val("");
          $(".input-text").html("重新获取验证码");
          $.toast(result.message ? result.message : "请重试");
        }
      });
    } else {
      if ($("#tel").val().length == 11) {
        $.toast("请输入正确的验证码")
      } else {
        $.toast("请输入正确的手机号")
      }
    }
  });
}


function reuion() {
  app = new Vue({
    el: "#bind",
    data: {
      data: "",
      post: {},
      list: ""
    },
    beforeCreate: function () {
      $("#loading").addClass("hide");
    },
    methods: {
      validateFn: function () {
        _self = this;
        if ($(".input-text").hasClass("disabled")) {
          return;
        }
        $(".input-text").addClass("disabled");
        rest("/membership/" + this.data.id + "/binding/validate", {}, "post", function (data) {
          if (data.code == 200) {
            $.toast("获取成功");
            var second = 90;
            var init = setInterval(function () {
              second--;
              if (!second) {
                clearInterval(init);
                $(".input-text").html("重新获取验证码");
                $(".input-text").removeClass("disabled");
                return;
              }
              $(".input-text").html("已发送 " + second + " s");
            }, 1000);
          } else {
            $(".input-text").removeClass("disabled");
          }
        });
      },
      searchFn: function () {
        _self = this;
        rest("/membership/binding/guest/" + _id, {"param": this.post.tel}, "get", function (data) {
          if (data.code == 200) {
            _self.data = data.result;
          } else {
            // $.toast("对不起，没有查到相关权益，请重新提交或呼叫服务员为您服务。");
            console.log($(document))
            $(document).dialog({
              type : 'confirm',
              titleText: '提示',
              content: '查询不到您的老系统信息！可能如下原因导致：<br> 1.您输入手机号错误，请检查；<br> 2.您在老系统中的账户权益为0，请在新系统领取新卡即可；<br> 3.其他情况呼叫服务员为您处理。',
              buttonTextConfirm: '我知道了'
            })
          }

        });
      },
      submitFn: function () {
        _self = this;
        if (this.post.validate.length != 6) {
          $.toast("请先填写正确的验证码");
          return;
        }
        rest("/membership/" + this.data.id + "/binding", {"validateCode": this.post.validate}, "post", function (data) {
          if (data.code == 200) {
            _self.list = data.result;
          } else {
            $.toast(data.message);
          }
        });
      },
      redirectFn: function () {
        redirectUrl();
      }
    }
  })
}

function birth() {
  var user = rest("/user", {}, "get", function (data) {
    var user = data.result;
    if (user) {
      $(".name").html(user.nickname);
    }
    $("input").calendar({
      maxDate: "2018-01-01",
      dateFormat: "yyyy-mm-dd",
      value: ["1990-01-01"],
      onOpen: function () {
        $(".picker-calendar-year-picker").insertBefore($(".picker-calendar-month-picker"), $(".toolbar-inner"));
      }
    });
    $(".btn-orange").click(function () {
      if ($("input").val()) {
        $.confirm("注意！请填写您的真实生日，生日一旦设置将不可更改！您设置的生日将可能影响您在商家正常行使权益。", function () {
          rest("/user", {
            birthday: $("input").val()
          }, "post", function (data) {
            if (data.code == 200) {
              $.toast("操作成功!");
              history.back();
            } else {
              toast(data.message);
            }
          });
        });
      } else {
        $.toast("请填写生日！");
      }
    });
    $.init();
    $("#loading").addClass("hide");
  })
}

function control() {
  key_json.guestid = key_json.id;
  var str;
  if (key_json.t == "c") {
    //coupon
    str = "coupon";
  } else if (key_json.t == "p") {
    //point
    str = "point";
    $(".coupon-box").addClass("point");
  } else {
    location.href = "error.html#1";
  }
  function result() {
    var amount = "";
    //rest("/membership/grade/guest/"+_id, {}, "get", function (data) {
    //    if (data.code == 200) {
    //
    //    }
    //});
    if (key_json.t == "c") {
      if (dataS.category == "902" || dataS.category == "9021") {
        amount = "<div class='m-title'>恭喜获得价值<span style='color: #ed393a'>" + (dataS.amount - dataS.currentAmount) + "元</span>优惠礼</div>";
      } else if (dataS.category == "901") {
        amount = "<div class='m-title'>恭喜获得价值<span style='color: #ed393a'>" + (dataS.amount) + "元</span>优惠礼</div>";
      } else {
        amount = "<div class='m-title'>恭喜获得<span style='color: #ed393a'>" + (dataS.name) + "</span></div>";
      }
      amount += "<div class='coupon-box1'>" + dataS.name + "</div>" +
        "<div style='font-size: 10px;color:#ad1c1b'>" + dataS.times + "</div>";
    } else {
      amount = "<div class='m-title'>恭喜获得<span style='color: #ed393a'>" + dataS.value + "积分</span></div>" +
        "<div class='point-box1'>" + dataS.value + "积分</div>";
    }

    rest("/shop/" + _id + "/mp", {}, "get", function (data) {
      var wechat = data.result;
      var addon = "";
      if (wechat && wechat.url) {
        addon = "<div class='addon'><div><img src='" + wechat.url + "'/></div><div>长按识别<br>查看获赠权益</div></div>";
      }
      $.modal({
        afterText: "<div class='bg-green'><div class='modal-title'>领取成功</div>" + amount +
        "<div class='grey'>下次扫码买单时将【自动使用权益】</div></div>" + addon +
        "<div class='close' onclick=\"window.location.href = location.href + '&time=' + ((new Date()).getTime());\"></div>"
      });
    });

  }

  rest("/user", {}, "get", function (user) {
    if (user.result.phone) {
      $(".user").hide();
    }
    $.init();
    $("#loading").addClass("hide");
    $(".new-in .button-fill").click(function () {
      if (user.result.phone) {
        rest("/benefit/" + str, {id: $(this).attr("id")}, "post", function (redata) {
          if (redata.code == 200) {
            redata.result && $.fn.cookie("token", redata.result.token, {"expires": 30});
            result();
          } else {
            $.toast(redata.message);
          }
        });
      } else {
        var value = $('#code').val();
        if (value.length !== 6) {
          delay(".title", "请填写正确的验证码");
        } else if (value.length) {
          rest("/benefit/" + str, {
            phone: $("#phone").val(),
            id: $(this).attr("id"),
            "validateCode": value
          }, "post", function (redata) {
            if (redata.code == 200) {
              redata.result && $.fn.cookie("token", redata.result.token, {"expires": 30});
              result();
            } else {
              delay(".title", redata.message);
            }
          });
        } else {
          delay(".title", "请正确填写手机号码！");
        }
      }
    });
  });

  function delay(name, text) {
    $(name).html(text);
    setTimeout(function () {
      $(name).html("");
    }, 3000)
  }

  rest("/benefit/" + str + "/" + key_json.v, {}, "get", function (data) {
    if (data.code == 200) {
      var result = data.result;
      dataS = result;
      setTitle(result.brandName);
      $("#shop").html(result.brandName);
      if (result.state == 4004) {
        $(".old-in").removeClass("hide1");
      } else {
        $(".new-in").removeClass("hide1");
      }
      if (result.category == "905") {
        $("#limits").remove();
        $("#coupon").html(result.value + "积分");
      } else {
        $("#coupon").html(result.name);
        if (result.category == '902' || result.category == '9021') {
          $(".line-through").html("原价 ￥" + result.amount);
          $(".now").html(" 现价 ￥" + result.currentAmount);
        }
        var str = "";
        if (result.category == "901" || result.category == "904") {
          str += '<div class="item">' +
            '<div class="left">价值：</div>' +
            '<div class="right"> ' + result.amount + "元</div>" +
            '</div>';
        }
        str += '<div class="item">' +
          '<div class="left">使用条件：</div>' +
          '<div class="right">' + result.useStrategy + '</div>' +
          '</div>' +
          '<div class="item">' +
          '<div class="left">有效期：</div>' +
          '<div class="right">' + result.times + '</div>' +
          '</div>' +
          '<div class="item">' +
          '<div class="left">详情：</div>' +
          '<div class="right">';

        if (result.content) {
          for (var i = 0; i < result.content.length; i++) {
            str += "<div>" + result.content[i] + "</div>";
          }
        }
        str += '</div></div><div class="item">' +
          '<div class="left">备注：</div>' +
          '<div class="right">' +
          '<div>本券不找零，不兑现，不做外卖使用</div>' +
          '<div>本活动在法律允许范围内商家拥有最终解释权</div>' +
          '</div>' +
          '</div>';
        $("#limits").html(str);
      }
      $(".button-fill").attr("id", result.id);
    } else {
      alert(data.message);
    }
    //提交电话号码领券
    $(".help-btn").click(function () {
      var value = $('#phone').val();
      if (value == "") {
        $.toast("手机号码不能为空！")
      } else if (/^\s*1\d{10}\s*$/.test(value)) {
        rest("/validate/bindup", {phone: value}, "post", function (redata) {
          if (redata.code == 200) {
            $(".help-btn").addClass("disabled");
            delay(".title", "获取成功");
            var second = 90;
            var init = setInterval(function () {
              if (!second) {
                clearInterval(init);
                $(".help-btn").html("重新获取验证码");
                $(".help-btn").removeClass("disabled");
                return;
              }
              $(".help-btn").html("已发送 " + second + " s");
              second--;
            }, 1000);
          } else {
            $.toast(redata.message);
          }
        });
      } else {
        delay(".title", "请正确填写手机号码");
      }
    });

  });
}

function vipNew() {
  location.href = "admin.html#/vip" + location.search;
}

function vip() {
  location.href = "admin.html#/vip" + location.search;
}

function changePhone() {
  var timer;
  var phone = $.fn.cookie("phone");
  phone && $("#tel").val(phone);
  $.init();
  $("#loading").addClass("hide");
  $("body").on("click", ".code", function () {
    clearInterval(timer);
    rest("/validate/binded", {}, "post", function (result) {
      timer = validatePhone(result);
    });
  });
  $("body").on("click", ".submit", function () {
    clearInterval(timer);
    $(".btn-orange").removeClass("submit");
    rest("/phone/binded", {"validateCode": $("#code").val()}, "post", function (result) {
      if (result.code == 200) {
        $.fn.cookie("validateResult", result.result.validateResult);
        $("#old").hide();
        $("#new").show();
        $("#new .btn-orange").addClass("disabled").removeClass("submit").html("收取验证码");
      } else {
        $(".btn-orange").addClass("code").removeClass("submit");
        $(".code").html("重新获取验证码");
        $.toast(result.message ? result.message : "请重试");
      }
    });
  });
  $("body").on("input", "#new_tel", function () {
    if ($("#new_tel").val().length == 11) {
      $(".disabled").removeClass("disabled").addClass("code1");
    } else {
      $(".btn-orange").addClass("disabled");
    }
  });
  $("body").on("click", ".code1", function () {
    clearInterval(timer);
    $("#new_code").show();
    var result = rest("/validate/binding", {phone: $("#new_tel").val()}, "post", function (result) {

      if (result.code == 200) {
        $("#new_code").show();
        $(".btn-orange").addClass("disabled");
        var second = 90;
        var timer = setInterval(function () {
          second = second - 1;
          if ($("#new_code").val().length == 6) {
            $(".btn-orange").addClass("submit1").removeClass("disabled code1");
            $(".btn-orange").html("确定");
          } else {
            $(".btn-orange").removeClass("submit1").addClass("code1");
            if (second <= 0) {
              $(".btn-orange").removeClass("disabled");
              $(".btn-orange").html("重新获取验证码");
            } else {
              $(".btn-orange").addClass("disabled");
              $(".btn-orange").html("验证码已发送 " + second + "s");
            }
          }
        }, 1000)
      } else {
        $.toast(result.message);
      }
    });
  });
  $("body").on("click", ".submit1", function () {
    $(".btn-orange").removeClass("submit1");
    var data = rest("/phone/binding", {
      phone: $("#new_tel").val(),
      validateCode: $("#new_code").val(),
      validateResult: $.fn.cookie("validateResult")
    }, "post", function (data) {

      if (data.code == 200) {
        alert("成功");
        history.go(-1);
      } else {
        $.toast(data.message);
      }
    });
  });

}
function remainder() {
  var relationId = $.fn.cookie("relation_id");
  if (!relationId) {
    history.go(-1);
    return;
  }
  var page = 1, count = 15, loading = false, total;
  $("#amount").html($.fn.cookie("charge") || 0);

  function setItems(result) {
    var records = "";
    for (var i in result.items) {
      var record = $('.hide #record').html();
      record = record.replace("@date@", result.items[i].date);
      var contexts = "";
      for (var o in result.items[i].records) {
        var context = $('.hide #context').html();
        if (result.items[i].records[o].type == "601") {
          context = context.replace("@color@", '<span class="text-orange">+@money@</span>');
        } else {
          context = context.replace("@color@", '<span class="text-blue">-@money@</span>');
        }
        context = context.replace("@name@", result.items[i].records[o].content);
        context = context.replace("@time@", result.items[i].records[o].time);
        context = context.replace("@money@", result.items[i].records[o].amount);
        contexts += context;
      }
      record = record.replace("@record@", contexts);
      records += record;
    }
    $('.set-code').append(records);
  }

//充值记录
  rest("/benefit/" + relationId + "/record/charge", {
    page: page,
    count: count
  }, "get", function (data) {
    if (data.code == 200) {
      data.result && setItems(data.result);
      total = data.result.total;
      if (total <= count) {
        $('.infinite-scroll-preloader').remove();
      }
      $.init();
      $("#loading").addClass("hide");
    }
    else {
      $('.infinite-scroll-preloader').remove();
      $('.set-code').html('<img src="/assets/images/kong.png" style="width:40%;display:block;position:relative;margin: 20% auto;">');
    }
  });

  $(document).on('infinite', ".infinite-scroll-bottom", function () {
    if (loading) return;
    // 设置flag
    loading = true;
    // 模拟1s的加载过程
    setTimeout(function () {
      // 重置加载flag
      if (page * count >= total) {
        // 加载完毕，则注销无限加载事件，以防不必要的加载
        //$.detachInfiniteScroll($('.infinite-scroll'));
        return;
      }
      page++;
      // 添加新条目
      rest("/benefit/" + relationId + "/record/charge", {
        page: page,
        count: count
      }, "get", function (data) {

        data.result && setItems(data.result);
        //容器发生改变,如果是js滚动，需要刷新滚动
        loading = false;
        $.refreshScroller();
      });
    }, 1000);
  });

}

function pointRecord() {
  var relationId = $.fn.cookie("relation_id");
  if (!relationId) {
    history.go(-1);
  }
  var page = 1, count = 20, loading = false, total;
  //当前积分
  $("#amount").html($.fn.cookie("point") || 0);

  function setItems(result) {
    var records = "";
    var _record = $('.hide #record').html();
    for (var i in result.items) {
      var record = _record;
      record = record.replace("@date@", result.items[i].date);
      record = record.replace("@got@", result.items[i].got || 0);
      record = record.replace("@use@", result.items[i].used || 0);
      var contexts = "";
      for (var o in result.items[i].records) {
        var context = $('.hide #context').html();
        if (result.items[i].records[o].type == "601") {
          context = context.replace("@color@", '<span class="text-orange">+@money@</span>');
        } else {
          context = context.replace("@color@", '<span class="text-blue">-@money@</span>');
        }
        context = context.replace("@name@", result.items[i].records[o].content);
        context = context.replace("@time@", result.items[i].records[o].time);
        context = context.replace("@money@", result.items[i].records[o].amount);
        contexts += context;
      }
      record = record.replace("@record@", contexts);
      records += record;
    }
    $('.set-code').append(records);
  }

  rest("/benefit/" + relationId + "/record/point", {
    page: page,
    count: count
  }, "get", function (data) {

    if (data.code == 200) {
      var result = data.result;
      //记录
      setItems(result);
      total = result.total;
      if (total <= count) {
        $('.infinite-scroll-preloader').remove();
      }
      $.init();
      $("#loading").addClass("hide");
    }
    else {
      $('.infinite-scroll-preloader').remove();
      $('.set-code').html('<img src="/assets/images/kong.png" style="width:40%;display:block;position:relative;margin: 20% auto;">');
    }
  });
  $(document).on('infinite', ".infinite-scroll-bottom", function () {
    if (loading) return;
    // 设置flag
    loading = true;
    // 模拟1s的加载过程
    setTimeout(function () {
      // 重置加载flag
      if (page * count >= total) {
        // 加载完毕，则注销无限加载事件，以防不必要的加载
        //$.detachInfiniteScroll($('.infinite-scroll'));
        $('.infinite-scroll-preloader').remove();
        return;
      }
      page++;
      // 添加新条目
      var data = rest("/benefit/" + relationId + "/record/point", {
        page: page,
        count: count
      }, "get", function (data) {

        data.result && setItems(data.result);
        //容器发生改变,如果是js滚动，需要刷新滚动
        loading = false;
        $.refreshScroller();
      });
    }, 1000);
  });
}

function rewardRecord() {
  var relationId = $.fn.cookie("relation_id");
  if (!relationId) {
    history.go(-1);
  }
  var page = 1, count = 20, loading = false, total;
  //当前积分
  $.fn.cookie("reward") && $("#amount").html($.fn.cookie("reward"));

  function setItems(result) {
    var records = "";
    var _record = $('.hide #record').html();
    for (var i in result.items) {
      var record = _record;
      record = record.replace("@date@", result.items[i].date);
      record = record.replace("@got@", result.items[i].got || 0);
      record = record.replace("@use@", result.items[i].used || 0);
      var contexts = "";
      for (var o in result.items[i].records) {
        var context = $('.hide #context').html();
        if (result.items[i].records[o].type == "601") {
          context = context.replace("@color@", '<span class="text-orange">+@money@</span>');
        } else {
          context = context.replace("@color@", '<span class="text-blue">-@money@</span>');
        }
        context = context.replace("@name@", result.items[i].records[o].content);
        context = context.replace("@time@", result.items[i].records[o].time);
        context = context.replace("@money@", result.items[i].records[o].amount);
        contexts += context;
      }
      record = record.replace("@record@", contexts);
      records += record;
    }
    $('.set-code').append(records);
  }

  rest("/benefit/" + relationId + "/record/reward", {
    page: page,
    count: count
  }, "get", function (data) {
    if (data.code == 200) {
      var result = data.result;
      //记录
      setItems(result);
      total = result.total;
      if (total <= count) {
        $('.infinite-scroll-preloader').remove();
      }
      $.fn.cookie("reward") && $(".am-sticky .text-orange").html($.fn.cookie("reward"));
      $.init();
      $("#loading").addClass("hide");
    }
    else {
      $('.infinite-scroll-preloader').remove();
      $('.set-code').html('<img src="/assets/images/kong.png" style="width:40%;display:block;position:relative;margin: 20% auto;">');
    }
  });
  $(document).on('infinite', ".infinite-scroll-bottom", function () {
    if (loading) return;
    // 设置flag
    loading = true;
    // 模拟1s的加载过程
    setTimeout(function () {
      // 重置加载flag
      if (page * count >= total) {
        // 加载完毕，则注销无限加载事件，以防不必要的加载
        //$.detachInfiniteScroll($('.infinite-scroll'));
        $('.infinite-scroll-preloader').remove();
        return;
      }
      page++;
      // 添加新条目
      var data = rest("/benefit/" + relationId + "/record/reward", {
        page: page,
        count: count
      }, "get", function (data) {

        data.result && setItems(data.result);
        //容器发生改变,如果是js滚动，需要刷新滚动
        loading = false;
        $.refreshScroller();
      });
    }, 1000);
  });
}

function activity() {
  //简介的图标文字
  rest("/activities/activity/" + key_json.aid, {}, "get", function (data) {
    if (data.code == 200) {
      var result = data.result;
      if (result.get || result.used) {
        var arr = result.get || [];
        arr = arr.concat(result.used || []);
        result.get = arr;
        var code = $("#code #get");
        for (var i = 0; i < result.get.length; i++) {
          var html = code.clone();
          //标题
          html.find(".am-name").text(result.get[i].name);
          //限制条件
          result.get[i].periods ? html.find("#periods .lang").html(result.get[i].periods) : html.find("#periods").hide();
          result.get[i].shared ? html.find("#shared .lang").html(result.get[i].shared) : html.find("#shared").hide();
          result.get[i].shops ? html.find("#shops .lang").html(result.get[i].shops) : html.find("#shops").hide();
          result.get[i].nonParticipations ? html.find("#nonParticipations .lang").html(result.get[i].nonParticipations) : html.find("#nonParticipations").hide();
          result.get[i].time ? html.find("#time .lang").html(result.get[i].time) : html.find("#time").hide();
          result.get[i].descriptor ? html.find("#descriptor .lang").html(result.get[i].descriptor) : html.find("#descriptor").hide();

          if (result.get[i].limit != null) {
            var limit_contents = "";
            for (var s in result.get[i].limit) {
              var limit_content = $("#limit-content").html();
              limit_content = limit_content.replace("@limit@", result.get[i].limit[s]);
              limit_contents += limit_content;
            }
            html.find("#limit-content").html(limit_contents);

          } else {
            html.find("#limit").hide();
          }
          //内容
          var strategy = "";
          for (var o in result.get[i].strategy) {
            var title = $("#code #activity-title").html();
            title = title.replace("@class@", result.get[i].strategy[o].name);
            var content1 = "";
            var details = result.get[i].strategy[o].details;
            for (var t in details) {
              //名称
              var content = $("#code #activity-content").html();
              if (details[t].content != null) {
                var list = "";
                for (var c in details[t].content) {
                  var list_name = html.find("#list-name").html();
                  list_name = list_name.replace("@content@", details[t].content[c]);
                  list += list_name;
                }
                content = content.replace($("#code #list-name").html(), list);
              }
              //券
              var coupons = "";
              if (details[t].coupons != null) {
                for (var c in details[t].coupons) {
                  var coupon = details[t].coupons[c];
                  var tmp = "";
                  if (coupon.category == "901") {
                    tmp = $("#code #tmp-coupon-charge").html();
                    tmp = tmp.replace("@@name@@", coupon.name);
                    tmp = tmp.replace("@@effectTimes@@", coupon.times);
                    tmp = tmp.replace("@id@", coupon.id);
                  } else if (coupon.category == "902" || coupon.category == "9021") {
                    tmp = $("#code #tmp-coupon-consume").html();
                    tmp = tmp.replace("@@name@@", coupon.name);
                    tmp = tmp.replace("@@amount@@", coupon.amount);
                    tmp = tmp.replace("@@currentAmount@@", coupon.currentAmount ? "￥" + coupon.currentAmount : "免费");
                    tmp = tmp.replace("@@effectTimes@@", coupon.times);
                    tmp = tmp.replace("@id@", coupon.id);
                  } else {
                    tmp = $("#code #tmp-coupon-charge").html();
                    tmp = tmp.replace("@@name@@", coupon.name);
                    tmp = tmp.replace("@@effectTimes@@", coupon.times);
                    tmp = tmp.replace("@id@", coupon.id);
                    tmp = tmp.replace("代金券", "礼品券");
                  }
                  coupons += tmp;
                }
              }
              content = content.replace($("#code #coupon").html(), coupons);
              content1 += content;
            }
            title = title.replace($("#code #activity-content").html(), content1);
            strategy += title;
          }
          html.find("#activity-title").html(strategy);
          $(".set_code").append(html);
          $(".loader-bg").hide();
        }
      }
      $.init();
      $("#loading").addClass("hide");
    } else {
      location.href = "error.html#2"
    }
  });

}

function reward() {
  app = new Vue({
    el: '#app',
    data: {
      data: ""
    },
    beforeCreate: function () {
      $("#loading").addClass("hide");
      _self = this;
      rest("/benefit/rewards/guest/" + _id, {}, "get", function (data) {
        if (data.code == 200) {
          _self.data = data.result;
        } else {
          // alert(data.message);
        }
      })
      if (!$.fn.cookie("relation_id")) {
        $(".record").hide();
      }
      $.fn.cookie("reward") && $(".number span").html('￥' + $.fn.cookie("reward"));

    }
  });
}

function mass() {
  app = new Vue({
    el: '#app',
    data: {
      data: "",
      type: {
        "901": "本券买单时自动抵用",
        "902": "本券在买单时出示使用",
        "9021": "本券在买单时出示使用",
        "9011": "本券买单时自动抵用",
        "904": "到店出示给服务员即可使用",
        "9031": "到店出示给服务员即可使用",
        "903": "本券买单时自动抵用"
      }
    },
    beforeCreate: function () {
      _self = this;
      rest("/mass/guest/" + _id + "/" + key_json.mid, {}, "get", function (data) {
        if (data.code == 200) {
          _self.data = data.result;
          $("#loading").addClass("hide");
        } else {
          alert(data.message);
        }
      })
    },
    methods: {
      redirectFn: function (url) {
        if (url) location.href = url;
      },
      couponDetailFn: function (type, id) {
        id ? ajaxUrl("couponDetail.html?cid=" + id + (type == '1017' ? ('&type=reward') : '')) : redirectUrl();
      }
    }
  });
}


/*************
 *
 * 公用方法
 *
 * ***********/
//

function phoneModal(a) {
  var str = (a == "phone") ? "补全手机" : "补全手机 领取权益";
  $.modal({
    title: '<strong>【' + str + '】</strong>',
    afterText: '<div class="text-xs" style="padding-top: .5rem">绑定手机号后，您的权益将立即到账</div>' +
    '<div class="text-center">' +
    '<div style="height: 2px;background: #e1e1e1;margin: 1rem 40%"></div>' +
    '<input type="tel" placeholder="手机号" id="tel" maxlength="11"/>' +
    '<div class="input-text">获取验证码</div>' +
    '<input type="tel" placeholder="验证码" id="validate" maxlength="6"/>' +
    '</div>' +
    '<div class="btn-green" id="bindPhone">确认</div>' +
    '<div class="md-close"></div>',
    extraClass: "bg-green"
  });
  bind();
}

function earnTrue() {
  if (key_json.type == "channel") {
    $.modal({
      title: '操作成功',
      text: "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。",
      buttons: [
        {
          text: '我的权益',
          onClick: function () {
            if (version == "WXPAY") {
              rest("/user/guest/" + _id, {}, "get", function (data) {
                //未关注
                if (data.code == 200 && !data.result.subscribe) {
                  ajaxUrl("success.html");
                } else {
                  redirectUrl();
                }
              });
            } else {
              redirectUrl();
            }
          }
        },
        {
          text: '继续买单',
          bold: true,
          onClick: function () {
            state();
            //ajaxUrl("entrance.html");
          }
        }
      ]
    });
  } else {
    $.modal({
      title: '操作成功',
      text: "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。",
      buttons: [
        {
          text: '我知道啦',
          onClick: function () {
            redirectUrl();
          }
        }
      ]
    });
  }
}

function setPayMode(a) {
  rest("/shop/" + _id + "/paymode", {"type": version}, "get", function (data1) {
    if (data1.code == 200) {
      payment = data1.result.payMode;
      $.fn.cookie("payment", JSON.stringify(data1.result));
      if (data1.result.oasis) {
        location.href = location.origin + "/author/" + _id + "/fuiou?url=" + encodeURIComponent(location.href);
        return;
      }
    } else {
      $.fn.cookie("payment", "", {"expires": 0});
    }
    a && a(data1.result);
  });

}

//小消息通知
function toast(message) {
  $("body").append("<div class='toast-center'><div class='toast'>" + message + "</div></div>");
  setTimeout(function () {
    $(".toast-center").remove();
  }, 3000);
}

//检测电话号码的正确性
function validatePhone(result) {
  if (result.code == 200) {
    $("#code").show();
    $(".btn-orange").addClass("disabled");
    var second = 90;
    var init = setInterval(function () {
      if ($("#code").val().length == 6) {
        $(".btn-orange").addClass("submit").removeClass("disabled code");
        $(".btn-orange").html("确定");
      } else {
        $(".btn-orange").removeClass("submit").addClass("code");
        second = second - 1;
        if (second <= 0) {
          $(".btn-orange").removeClass("disabled");
          $(".btn-orange").html("重新获取验证码");
        } else {
          $(".btn-orange").addClass("disabled");
          $(".btn-orange").html("验证码已发送 " + second + "s");
        }
      }
    }, 1000);
    return init;
  } else {
    $.toast(result.message);
  }
}

function earn(a, b) {
  //$(".modal").hide();
  //$(".modal-overlay").removeClass("modal-overlay-visible");
  //alert("敬请期待！");
  var json = {activityId: a, ruleTupleId: b};
  var url = "/benefit/follow/guest/" + _id;
  rest(url, json, "post", function (data) {
    if (data.code == 200) {
      $.closeModal();
      earnTrue();
    } else {
      $.toast(data.message);
    }
  });
}

function refreshCode() {
  rest("/check/code", {}, "get", function (data) {
    if (data.code == 200) {
      $("#my-code1").html("");
      qrcode = new QRCode($("#my-code1"), {
        width: 200,
        height: 200
      });
      //当面付
      qrcode.makeCode(data.result.code);
    }

  });
}

function check() {
  $.showIndicator();
  var json = {}, url = "/check/shop/" + shopId;
  if (key_json.d) {
    json = {
      tableId: key_json.d
    };
  }
  rest(url, json, "post", function (data) {
    switch (data.code) {
      case 200:
        $.fn.cookie("order_id", data.result.orderId);
        $.fn.cookie("table_no", data.result.tableNo);
        ajaxUrl("waiting.html");
        break;
      case 405004:
        $("#loading").removeClass("hide");
        $.confirm("您在" + (data.result.shopname || ("本店" + data.result.tableNo + "号桌")) + "有一个买单正在进行中,是否取消？", function () {
          rest("/check/shop/" + data.result.shopId + "/cancel", {}, "post", function (data) {
            if (data.code == 200) {
              alert("取消成功！");
              check();
            }
          });
        });
        $("#loading").addClass("hide");
        break;
      case 405007:
        alert("当前桌台有个请求正在处理，请让服务员处理");
        break;
      default:
        alert(data.message);
    }
  });
}

//小蓝条状态判断
function state() {
  rest("/check/" + $.fn.cookie("order_id"), {}, "get", function (data) {
    if (data.code == 200) {
      var result = data.result;
      if (result.step == 1) {
        if (result.online) {
          $.fn.cookie("table_no", result.tableNo);
          ajaxUrl("waiting.html");
        } else {
          $.toast("上宾正在加速为您配置专属优惠方案");
        }
      } else if (result.state >= 2) {
        ajaxUrl("strategy.html?oid=" + $.fn.cookie("order_id"));
      } else {
        window.location.href = location.href + '&time=' + ((new Date()).getTime());
      }
    } else {
      redirectUrl("selfPay");
      //alert("订单不存在！");
      // ajaxUrl("entrance.html")
    }
  });

}


function setCoupon(coupon1) {
  var coupon = $(".hide .coupon_show");
  for (var i = 0; i < coupon1.items.length; i++) {
    var html = coupon.clone();
    var coupons = coupon1.items[i];
    html.attr("id", coupons.id);
    html.find(".name").html(coupons.name);
    switch (coupons.category) {
      case "9021":
      case "902":
        html.find(".amount0").html("<span style='font-size: .6rem'>可抵 ￥</span>" + (coupons.amount - coupons.currentAmount) + '<div class="through">' + coupons.amount + '</div>');
        break;
      case "9031":
        html.find(".name").html(coupons.value);
        html.find(".amount0").html(coupons.amount + "<span style='font-size: .6rem'> 折</span>");
        break;
      case "904":
        if (coupons.amount) {
          html.find(".amount0").html("<span style='font-size: .6rem'>价值 ￥</span>" + coupons.amount);
        }
        break;
      default :
        html.find(".amount0").remove();
    }

    html.find(".a4001").addClass("a" + coupons.state);
    html.find(".addon").html("<span>" + coupons.times + "</span>");
    html.find(".addon").append("<span>" + coupons.useStrategy + "</span>");
    $(".set-coupon").append(html);
  }
  $.fn.longPress = function () {
    var timeout = undefined;
    var $this = this;
    for (var i = 0; i < $this.length; i++) {
      $this[i].addEventListener('touchstart', function () {
        var node = this;
        timeout = setTimeout(function () {
          document.getElementById(node.id).getElementsByClassName("deletefont")[0].style.display = 'block';
        }, 800);  //长按时间超过800ms，则执行传入的方法
      }, false);
      $this[i].addEventListener('touchend', function (event) {
        var node = this;
        if (event.target.classList[0] == 'deletefont') {
          uri = "/benefit/userCoupon/" + $(this).attr("id");
          $.showIndicator();
          rest(uri, {}, "post", function (data) {
            if (data.code == 200) {
              $("#" + node.id).remove();
            } else {
              alert("删除失败！")
            }
          });
        }
        clearTimeout(timeout);  //长按时间少于800ms，不会执行传入的方法
      }, false);
    }
  }

  $(".coupon_show").longPress();
}

function setCheckCode(check, top) {
  var types = {
    "6001": "MEMBERUPGRADE",
    "6002": "CHARGE",
    "6003": "EXCHANGE",
    "6004": "COUPONFREE",
    "6005": "DISCOUNT",
    "6006": "SPECIAL_PRICE",
    "6007": "COUPON",
    "6008": "POINT",
    "6012": "SPENDAS",
    "6014": "LIMITREDUCE",
    "6015": "SETMEAL",
    "6017": "CHARGEFREE"
  };
  for (var i = 0; i < check.length; i++) {
    var activities = check[i].activities;
    if (check[i].activityCategory == "6007") {
      var a = [check[i]];
      setActivityCode(a, "6007");
      continue;
    }
    more = $("#code #more");
    for (var j = 0; j < activities.length; j++) {
      var activity = activities[j];
      var type = types[check[i].activityCategory];
      var html = more.clone();
      html.find('.set-title').addClass(type);
      if (j == 0) {
        html.find(".set-title").append($("#code .content-title1").html());
      }
      html.find(".text").html(activity.name);
      if (activities.length > 1) {
        html.find(".set-title").append($("#code .content-desc1").html());
        html.find(".content-desc").html(activity.name);
        html.find(".right").addClass("hide");
        switch (check[i].activityCategory) {
          case "6005":
            html.find(".text").html("会员折扣有力度");
            break;
          case "6006":
            html.find(".text").html("特价促销");
            break;
          case "6008":
            html.find(".text").html("小积分大用处");
            break;
          case "6012":
            html.find(".text").html("抵扣活动");
            break;
          case "6014":
            html.find(".text").html("满额减免");
            break;
          case "6015":
            html.find(".text").html("套餐活动");
            break;
          case "6017":
            html.find(".text").html("充值免单");
            break;
        }
      }
      var lis = $("#code #more").find("li");
      html.attr("onclick", "ajaxUrl('activity.html?aid=" + activity.activityId + "')");
      for (var k = 0; k < activity.strategy.length; k++) {
        var strategy = activity.strategy[k];
        //有无券
        if (strategy.coupons) {
          for (var y = 0; y < strategy.coupons.length; y++) {
            var coupon = strategy.coupons[y];
            var li = lis.clone();
            li.find(".item-title .name").html(coupon.value);
            li.find(".item-title .text-grey .orange-lg").html("￥" + coupon.currentAmount);
            li.find(".item-title .text-grey .line-through").html(" ￥" + coupon.amount);
            li.find(".item-media").html('<img src="/sui_assets/img/space_coupon.png" class="space"/>');
            li.find(".item-after").html(text);
            html.find("ul").append(li);
          }
        } else {
          var li = lis.clone();
          li.find(".item-title .text-grey").html(activity.time);
          switch (type) {
            case "POINT":
              li.find(".item-media").remove();
              if (strategy.amount) {
                li.find(".item-title .name").html((strategy.from ? (strategy.from + ':') : "") + "消费<span class='orange-lg'>" + strategy.amount + "</span>元积<span class='orange-lg'>" + strategy.benefit + "</span>分");
              } else {
                li.find(".item-title .name").html((strategy.from ? strategy.from + "：" : "") + "消费即获得<span class='orange-lg'>" + strategy.benefit + "</span>积分");
              }
              if (strategy.type && strategy.type == "1007") {
                li.find(".item-title .name").html(activity.limit[0]);
              }
              break;
            case "DISCOUNT":
              li.find(".item-media").remove();
              if (strategy.amount) {
                li.find(".item-title .name").html((strategy.from ? strategy.from + "：" : "") + "消费满<span class='orange-lg'>" + strategy.amount + "</span>元 享<span class='orange-lg'>" + strategy.benefit + "</span>折");
              } else {
                li.find(".item-title .name").html((strategy.from ? strategy.from + "：" : "") + "消费即享<span class='orange-lg'>" + strategy.benefit + "</span>折");
              }
              break;
            case "SPECIAL_PRICE":
              if (strategy.desUrl) {
                li.find(".item-media").html('<img src="' + strategy.desUrl + '" class="space"/>');
              } else {
                li.find(".item-media").html('<img src="/sui_assets/img/space.png" class="space"/>');
              }
              li.find(".item-title .name").html(strategy.name);
              break;
            case "LIMITREDUCE":
              li.find(".item-media").remove();
              li.find(".item-title .name").html((strategy.from ? strategy.from + "：" : "") + "消费每满<span class='orange-lg'>" + strategy.amount + "</span>元减<span class='orange-lg'>" + strategy.benefit + "</span>元");
              break;
            case "SPENDAS":
              li.find(".item-media").remove();
              li.find(".item-title .name").html((strategy.from ? strategy.from + "：" : "") + "<span class='orange-lg'>" + strategy.amount + "</span>元可抵<span class='orange-lg'>" + strategy.benefit + "</span>元消费");
              break;
            case "SETMEAL":
              if (strategy.desUrl) {
                li.find(".item-media").html('<img src="' + strategy.desUrl + '" class="space"/>');
              } else {
                li.find(".item-media").html('<img src="/sui_assets/img/space.png" class="space"/>');
              }
              li.find(".item-title .name").html("<span class='orange-lg'>" + strategy.amount + "</span>套餐现价<span class='orange-lg'>" + strategy.benefit + "</span>元");
              html.attr("onclick", "ajaxUrl('mealActivity.html?aid=" + activity.activityId + "')");
              break;

            case "CHARGEFREE":
              li.find(".item-media").remove();
              li.find(".item-title .name").html((strategy.from ? strategy.from + "：" : "") + "充值" + strategy.amount + "倍免单");
              break;
          }
          html.find("ul").append(li);
        }
      }
      if (top) {
        $(".top").html(html);
      } else {
        $(".code").append(html);
      }
    }
  }
}

function setActivityCode(activities, top) {
  var types = {
    "6001": "MEMBERUPGRADE",
    "6002": "CHARGE",
    "6003": "EXCHANGE",
    "6004": "COUPONFREE",
    "6005": "DISCOUNT",
    "6006": "SPECIAL_PRICE",
    "6007": "COUPON",
    "6008": "POINT"
  };
  if (activities) {
    var active = activities;
    for (var j = 0; j < active.length; j++) {
      var activity = active[j].activities;
      var type = active[j].activityCategory;
      for (var i = 0; i < activity.length; i++) {
        if (type == "6004" || type == "6007") {
          for (var k = 0; k < activity[i].strategy.length; k++) {
            var strategy = activity[i].strategy[k];
            var code = $("#code #coupons").clone();
            code.find('.set-title').addClass(types[type]);
            if (k == 0) {
              code.find(".set-title").append($("#code .content-title1").html());
            }
            if (activity[i].strategy.length > 1) {
              code.find(".set-title").append($("#code .content-desc1").html());
              code.find(".content-desc").html(activity[i].name);
              if (type == "6004") {
                code.find(".text").html("免费领取礼遇");
              } else {
                code.find(".text").html("消费即送大礼");
              }
            } else {
              code.find(".text").html(activity[i].name);
            }
            var innerBox = "";
            code.find(".text-grey").html(strategy.from);
            if (type == "6007") {
              code.find(".btn-green-light").html("买单即享");
              code.attr("onclick", "ajaxUrl('activity.html?aid=" + activity[i].activityId + "')");
            } else {
              code.attr("onclick", "ajaxUrl('couponActivity.html?aid=" + activity[i].activityId + "&rid=" + strategy.ruleTupleId + "')");
            }
            for (var l = 0; l < strategy.coupons.length; l++) {
              var coupons = strategy.coupons[l];
              switch (coupons.category) {
                case "901":
                  innerBox = $("#code .money-box").clone();
                  innerBox.find('.coupon-content').addClass("money-box");
                  innerBox.find(".name").html(coupons.value + '元代金券');
                  innerBox.find(".text-gold").html(coupons.value);
                  break;
                case "9021":
                case "902":
                  innerBox = $("#code .good-box").clone();
                  innerBox.find('.coupon-content').addClass("good-box");
                  innerBox.find(".name").html(coupons.value);
                  innerBox.find(".current-amount").html(coupons.currentAmount ? ("￥" + coupons.currentAmount) : "免费");
                  innerBox.find(".amount").html("￥" + coupons.amount);
                  break;
                case "9011":
                  innerBox = $("#code .good-box").clone();
                  innerBox.find('.coupon-content').addClass("good-box");
                  innerBox.find(".name").html(coupons.currentAmount + "元抵" + coupons.amount + "元");
                  innerBox.find("img").attr("src", "sui_assets/img/card/dikou.svg").css("margin-top", "0px");
                  break;
                case "904":
                  innerBox = $("#code .good-box").clone();
                  innerBox.find('.coupon-content').addClass("good-box");
                  innerBox.find(".name").html(coupons.value);
                  break;
                case "9031":
                  innerBox = $("#code .good-box").clone();
                  innerBox.find('.coupon-content').addClass("good-box");
                  innerBox.find(".name").html(coupons.value);
                  innerBox.find(".current-amount").html(coupons.amount + "折");
                  break;
                case "903":
                  innerBox = $("#code .good-box").clone();
                  innerBox.find('.coupon-content').addClass("good-box");
                  innerBox.find(".name").html("全场" + coupons.amount + "折");
                  innerBox.find(".current-amount").html(coupons.amount + "折");
              }
              innerBox.find("ul").append("<li>" + coupons.times + "</li>");
              coupons.useStrategy && innerBox.find("ul").append("<li>" + coupons.useStrategy + "</li>");
              var disable = "";
              if (strategy.remainCount) {
                innerBox.find(".limit-label").html("剩" + strategy.remainCount + "份");
              } else {
                if (strategy.remainCount == 0) {
                  disable = "disabled";
                  code.find(".btn-green-light").html("已抢光");
                  innerBox.find(".limit-label").html("剩 0 份");
                } else {
                  innerBox.find(".limit-label").remove();
                }
              }
              code[0].className = "coupons row no-gutter " + types[type] + " " + disable;

              code.find(".set_coupon").append(innerBox ? innerBox.html() : "");
            }
            if (top === 1) {
              $(".top").append(code);
            } else {
              $(".code").append(code);
            }
          }
          code = "";
        }
        else if (type == "6002") { //充值回馈
          var code = $("#code #coupons").clone();
          var innerBox = "";
          code.find(".set-title").append($("#code .content-title1").html());
          code[0].className = "coupons row no-gutter " + types[type];
          code.find(".text").html(activity[i].name);
          code.attr("onclick", "redirectUrl('charge');");
          innerBox = $("#code .charge-box").clone();
          for (var s = 0; s < activity[i].strategy.length; s++) {
            //默认显示第一条benefits[0]
            var strategy = activity[i].strategy[s];
            var charge = $("#code .charge-content").clone();
            charge.find(".name").html(strategy.amount + "元");
            if (strategy.benefits) {
              switch (strategy.benefits[0].type) {
                case "1014":
                  charge.find("ul").append("<li>" + (strategy.benefits[0].amount || 0) + "元</li>");
                  break;
                case "1015":
                  charge.find("ul").append("<li>" + strategy.benefits[0].amount + "积分</li>");
                  break;
                case "1016":
                  charge.find("ul").append("<li>" + strategy.benefits[0].name + "（" + strategy.benefits[0].count + "张）</li>");
                  break;
              }
            } else {
              charge.find(".row").html("充值有礼");
            }
            innerBox.find(".card1").append(charge);
          }
          code.find(".text-grey").html(activity[i].strategy[0].from);
          code.find(".btn-green-light").html("立即充值");
          code.find(".set_coupon").html(innerBox ? innerBox.html() : "");
        }
        else {//6003积分兑换
          var code = $("#code #coupons").clone();
          var innerBox = "";
          code.find(".set-title").append($("#code .content-title1").html());
          code[0].className = "coupons row no-gutter " + types[type];
          code.find(".text").html(activity[i].name);
          code.attr("onclick", "redirectUrl('exchange')");
          innerBox = $("#code .charge-box").clone();
          for (var s = 0; s < activity[i].strategy.length; s++) {
            var charge = $("#code .charge-content").clone();
            charge.find(".no-gutter").addClass("exchange");
            charge.find(".name").html(activity[i].strategy[s].amount + "积分");
            if (activity[i].strategy[s].coupons) {
              var cou = activity[i].strategy[s].coupons;
              for (var p = 0; p < cou.length; p++) {
                var str1 = "";
                if (cou[p].category == "901") {
                  str1 = "元代金券";
                } else if (cou[p].category == "902" || cou[p].category == "9021") {
                  str1 = "抵用券";
                } else {
                  str1 = "礼品券";
                }
                charge.find("ul").append("<li>" + activity[i].strategy[s].coupons[p].value + str1 + "</li>");
              }
            } else {
              charge.find("ul").append("<li>" + activity[i].strategy[s].amount + "元</li>");
            }
            innerBox.find(".card1").append(charge);
          }
          code.find(".text-grey").html(activity[i].strategy[0].from);
          code.find(".btn-green-light").html("立即兑换");
          code.find(".set_coupon").html(innerBox ? innerBox.html() : "");
        }
        if (top) {
          $(".top").append(code);
        } else {
          $(".code").append(code);
        }
      }
    }
  }
}

function loadImage(url, callback) {
  var img = new Image();
  img.src = url;
  //图片下载完毕时异步调用callback函数。
  img.onload = function () {
    eval(callback);
  };
}

/*
*
* url:"more?aid=abc"
*
* */
function redirectUrl(url) {
  $("body").html("");
  var operation = "?";
  if (!url) {
    url = "admin.html#/user";
  } else {
    url = "admin.html#/" + url;
  }
  if (url.split("?").length == 2) {
    operation = "&";
  }
  if (shopId) {
    url += operation + "id=" + shopId;
    if (key_json.d) {
      url += "&d=" + key_json.d;
    } 
    if(key_json.cashier) {
      url += "&cashier=" + key_json.cashier;
    }
  } else {
    url += operation + "guestid=" + key_json.guestid;
  }
  location.href = url;
  setTimeout(function () {
    location.href = url;
  }, 10)
}

function goto(url) {
  ajaxUrl(url);
}

function ajaxUrl(url) {
  //$("#loading").removeClass("hide");
  $("body").html("");
  var operation = "?";
  if (!url) {
    if (shopId) {
      if(cashier) {
        url = "admin.html#/cashier"
      }else {
        url = "admin.html#/selfPay"; 
      }
    } else {
      url = "admin.html#/user";
      // url = "user.html";
    }
  }
  if (url.split("?").length == 2) {
    operation = "&";
  }
  if (shopId) {
    url += operation + "id=" + shopId;
    if (key_json.d) {
      url += "&d=" + key_json.d;
    } 
    if(key_json.cashier) {
      url += "&cashier=" + key_json.cashier;
    }
  } else {
    //$.router.load( url + "&shopid=" + shopId;);
    url += operation + "guestid=" + key_json.guestid;
    $.fn.cookie("relation_id") ? location.href = url + "&relationid=" + $.fn.cookie("relation_id") : "";
  }
  location.href = url;
  setTimeout(function () {
    location.href = url;
  }, 10)
}

var interval;

//socket 消息通知
function socket() {
  setTimeout(function () {
    var a;
    var id = $.fn.cookie("user") || localStorage.getItem("userId");
    if (!id) return;
    var uri = "wss://" + "tiding.sharejoy.cn" + "/websocket?id=" + id+"&group=mweb";
    var websocket = new WebSocket(uri);
    websocket.onopen = function () {
      a = setInterval(function () {
        websocket.send("1");
      }, 30000)
    };
    websocket.onmessage = function (evt) {
      if (evt.data == "success") return false;
      var data = JSON.parse(evt.data);
      data.orderId && $.fn.cookie("order_id", data.orderId, {"path": "/"});
      switch (data.type) {
        case "500000":
          //if (key_json.guestid) {
          //    ajaxUrl("waiting.html?id=" + data.shopId);
          //} else {
          ajaxUrl("waiting.html");
          //}
          break;
        case "500042":
          $.toast("支付完成");
          if (key_json.id) {
            location.href = "admin.html#/payment?id=" + key_json.id + "&order=" + data.orderId;
          } else {
            location.href = "admin.html#/payment?guestid=" + key_json.guestid + "&order=" + data.orderId;
          }
          break;
        case "500051":
          alert("买单被取消");
          chooseIndex();
          break;
        case "500052":
          alert("pad下线");
          chooseIndex();
          break;
        case "500053":
          alert("买单请求超时未处理被取消");
          chooseIndex();
          break;
        case "500054":
          ajaxUrl("strategy.html?oid=" + data.orderId);
          break;
        case "500005":
          if (key_json.id) {
            location.href = "admin.html#/payment?id=" + key_json.id + "&order=" + data.orderId;
          } else {
            location.href = "admin.html#/payment?guestid=" + key_json.guestid + "&order=" + data.orderId;
          }
          break;
        case "500055":
          ajaxUrl("strategy.html?oid=" + data.orderId);
          break;
        case "500050":
          alert("服务员未响应");
          chooseIndex();
          break;
      }
    };
    websocket.onclose = function () {
      //alert("socket关闭");
      setTimeout(function () {
        refresh();
      }, 10000);

      //clearInterval(a);
      //socket();
    };
    websocket.onerror = function () {
      //alert("socket错误");
      //clearInterval(a);
      //socket();
    };
  }, 100)
}

function rest(u, j, h, action) { //json,url,http
  if ($("#loading").hasClass('hide')) {
    $.showIndicator();
  }
  $.fn.cookie("apikey", "6b774cc5eb7d45818a9c7cc0a4b6920f", {expire: 30, path: "/"});
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
    return "timestamp=" + t + "&signature=" + a;
  }

  /*     加密     */
  xh = $.ajax({
    url: url,
    data: data,
    timeout: 20000,
    type: h,
    dataType: "json",
    async: true,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }, //这里设置header
    success: function (data) {
      $.hideIndicator();
      if (data.code == 400000) {
        location.href = "error.html#7";
      } else if (data.code == 403000) {
        $("body").html("");
        $.fn.cookie("token", "", {'expires': 0});
        $.fn.cookie(_id, "false", {"expires": 0});
        $.fn.cookie("url", location.href, {'expires': 0.002});
        ajaxUrl("index.html");
        return;
      } else if (data.code == 403060) {
        ajaxUrl("bind.html");
        alert("请先绑定手机号");
        return;
      } else {
        action(data);
        //$.init();
      }
    },
    complete: function (XMLHttpRequest, status) {
      $.hideIndicator();
      if (status == 'timeout') {
        alert("请检查您的本地网络");
        xh.abort();
      }
    }
  });
  //return redata;
}
