<template>
  <div v-if="init.user" style="background: #f5f5f5;height:100vh;overflow:hidden;">
    <div class="header" v-if="!init.memberGradeName">
      <div class="header_left">
        <img :src="init.user.avatarUrl" v-if="init.user.avatarUrl" style="width:1.6rem;height:1.6rem;border-radius:100px;" alt />
        <img src="sui_assets/img/selfPay/vip.png" v-else alt />       
        <div class="header_text">
          <div class="header_text_top">您还不是本店会员</div>
          <div class="header_text_right">加入会员立享更多优惠</div>
        </div>
      </div>
      <div class="header_right">加入会员</div>
    </div>
    <div class="header" v-if="init.memberGradeName">
      <div class="header_left">
        <img :src="init.user.avatarUrl" v-if="init.user.avatarUrl" style="width:1.6rem;height:1.6rem;border-radius:100px;" alt />
        <img src="sui_assets/img/selfPay/vip.png" v-else alt />       
        <div class="header_text">
          <div class="header_text_top">{{init.user.nickname}}</div>
          <div class="header_text_right">您有{{init.needShowCoupons}}项权益可使用</div>
        </div>
      </div>
      <router-link class="item" :to="{ path: 'user', query: { id: $route.query.id }}">
        <div class="header_right">会员中心</div>
      </router-link>
    </div>
    <div class="nr">
      <div class="zhuo">【03桌】</div>
      <wc-keyboard
        inter="5"
        decimal="2"
        class="amount"
        v-bind:value="post.amount"
        v-bind:unabled="init.preCheckData?true:false"
        placeholder="询问服务员后在此输入"
        label="消费金额"
        @input="inputFn"
      />
      <div v-if="init.nonPart" style="padding-top: .5rem;">
        <wc-keyboard
          inter="5"
          v-bind:value="post.nonParticationAmount"
          decimal="2"
          v-bind:unabled="init.preCheckData?true:false"
          class="nodiscount"
          v-bind:placeholder="init.nonPart"
          label="不参与优惠项"
          @input="nonPartsFn"
        />
      </div>
      <div class="btnBox">
        <div class="btnBox_left" @click="submit()">不要优惠买单</div>
        <div class="btnBox_right" @click="toStrategy()">推荐优惠买单</div>
      </div>
    </div>
    
  </div>
  
</template>

<script>
import Vue from "vue";
import "swiper/dist/css/swiper.css";
import wcKeyboard from "./wcKeyboard/KeyboardInput.vue";
import VueAwesomeSwiper from "vue-awesome-swiper";
import $ from "jquery";
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.use(VueAwesomeSwiper);
export default {
  name: "newselfpay",
  components: {
    wcKeyboard
  },
  data() {
    return {
      data: "",
      post: { amount: "", nonParticationAmount: "" },
      init: {},
      timer: "",
      key_json: {},
      shopId: "ALIPAY",
      cursor: true,
      version: "ALIPAY",
      payment: "",
      ads:[],
      phone1:{text: '获取验证码', able: true}
    };
  },
  created() {
    var _self = this;
    if (this.$route.query.cashier) {
      this.$router.push({ path: "/cashier", query: this.$route.query });
    }
    if (window.localStorage.getItem("postsIndex")) {
      let oldtimestamp = window.localStorage.getItem("timestamp");
      let newtimestamp = Date.parse(new Date());
      if (oldtimestamp && newtimestamp - oldtimestamp > 600000) {
        window.localStorage.removeItem("postsIndex");
        this.posts.index = 0;
        console.log("重置index" + this.posts.index);
      } else {
        this.posts.index = window.localStorage.getItem("postsIndex");
        console.log("获取index" + this.posts.index);
      }
    }
    var tableId= "ALIPAY";
    if (location.hash) {
      var key_str = location.hash.substr(13);
      for (var i = 0; i < key_str.split("&").length; i++) {
        var j = key_str.split("&")[i].split("=");
        _self.key_json[j[0]] = j[1];
      }
      console.log(_self.key_json)
      if (_self.key_json.id) {
        localStorage.setItem("id", _self.key_json.id);
        localStorage.setItem("d", _self.key_json.d || "");
        _self.shopId = _self.key_json.id;
        tableId = _self.key_json.d;
      } else if (localStorage.getItem("id")) {
        _self.shopId = localStorage.getItem("id");
        tableId = localStorage.getItem("d");
      }
    }
    if (!_self.shopId && !_self.key_json.code) {
      location.href = "error.html?url=" + location.href;
    }
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      _self.version = "WXPAY";
      
    }

    
    _self.$http.get("/shop/" + _self.shopId+ "/paymode" ,{key:{"type":_self.version}}).then((response) => {
      var data1 = response.body;
      if (data1.code == 200) {
            if (data1.result.oasis) {
                location.href = location.origin + "/author/" + shopId + "/fuiou?url=" + encodeURIComponent(location.href);
                return;
            }
            _self.payment = data1.result.payMode;
        } else if (data1.code == 403000) {
          _self.$cookie.set("cookie", "","0")
            _self.auth();
        }
    });
    

    var parm = {};
    parm.type = _self.version == "WXPAY" ? "wx" : "ali";

    if (_self.key_json.d) {
        parm.tableId = _self.key_json.d;
    }
    if (this.$route.query.cashier) {
      parm.cashierOrderId = this.$route.query.cashier;
    }
    _self.$http.get("/shop/" + _self.shopId ,{key:parm}).then((response) => {
      var data1 = response.body;
      if (data1.code == 200) {
            _self.data = data1.result;
            _self.intervalID = setInterval(function () {
                _self.cursor = !_self.cursor;
            }, 500);
        }
    });

    this.initFn();
  },
  mounted() {
    var _self = this;
    if (!this.$cookie.isKey("token")) {
      auth();
    }
    
  },
  methods: {
    initFn() {
      let _self = this;
      let para = {};
      para.type = this.getVersion() == "WXPAY" ? "wx" : "ali";
      if (this.$route.query.d) {
        para.tableId = this.$route.query.d;
      }
      if (this.$route.query.cashier) {
        para.cashierOrderId = this.$route.query.cashier;
      }
      this.$http
        .get("/shop/" + this.$route.query.id, { key: para })
        .then(response => {
          let data = response.body;

          if (data.code == 200) {
            _self.setTitle(
              data.result.brandName + "(" + data.result.name + ")"
            );
            localStorage.setItem("userId", data.result.user.id);
            _self.shopId = data.result.id
            _self.init = data.result;
            if (_self.init.preCheckData) _self.post = _self.init.preCheckData;
            //有进行中的自助买单
            if (_self.init.order && _self.init.checkType == "102") {
              _self.$confirm(
                "您" +
                  (_self.init.order.tableNo
                    ? "在" + _self.init.order.tableNo + "号桌"
                    : "") +
                  "有个买单未完成,放弃这笔交易？",
                function() {
                  _self.$http
                    .post("/check/" + _self.init.order.orderId + "/cancel", {})
                    .then(response => {
                      let data1 = response.body;
                      if (data1.code != 200) {
                        _self.$toast(data1.message);
                        if (data1.code == 403108) {
                          setTimeout(function() {
                            let json = _self.$route.query;
                            json.oid = _self.init.order.orderId;
                            _self.$router.push({
                              path: "/strategy",
                              query: json
                            });
                          }, 200);
                        } else {
                          _self.initFn();
                        }
                      } else {
                        _self.initFn();
                      }
                    });
                },
                function() {
                  let json = _self.$route.query;
                  json.oid = _self.init.order.orderId;
                  _self.$router.push({ path: "/strategy", query: json });
                },
                "确定放弃",
                "继续买单"
              );
            } else {
              _self.$nextTick(function() {
                _self.socket();
                 // 封面
                this.$http.get("/activities/shop/" + this.$route.query.id + "/placards").then(response => {
                  let data = response.body;
                  if (data.code == 200) {
                    let _self = this;
                    _self.ads = data.result;
                  }
                });
                /*----------------------*/
              });
            }

            // if (!this.data.phone && !this.$cookie.get("phone_take")) {
            //
            //   this.$cookie.set("phone_take", true, {"expires": '5m'}); //设置五分钟内不会再次出现该弹框
            // }
          } else {
            alert(data.message);
            // location.href = "error.html";
          }
        });
    },
     replaceUrl(item) {
        if (!item.activityCategory) {
          if (item.linkUrl) {
            location.href = item.linkUrl;
          }
          return;
        }
        this.$route.query.aid = item.activityId;
        switch (item.activityCategory) {
          //送券
          case '6004':
            let json=this.$route.query;
                    json.aid = item.activityId;
                    that.$router.push({
                        path: '/couponActivity',
                        query: json
                    })
            break;
          //套餐
          case "6015":
            this.ajaxUrl('mealActivity.html?aid=' + item.activityId);
            break;
          //充值
          case "6002":
            this.$router.push({path: '/charge', query: this.$route.query});
            break;
          //入会及升级
          case "6001":
            this.$route.query.tid = item.activityId
            this.$router.push({path: '/upgrade', query: this.$route.query});
            // this.ajaxUrl('upgrade.html?tid=' + item.activityId);
            break;
          //积分兑换
          case "6003":
            this.$router.push({path: '/exchange', query: this.$route.query});
            // this.ajaxUrl('exchange.html');
            break;
          //砍价
          case "6041":
            // this.$router.push({path: "/grouponInfo", query: this.$route.query});
            location.href = '/grouponInfo.html?aid=' + item.activityId + "&guestid=" + item.guestId;
            break;
          //评赏
          case "6050":
            location.href = '/lottery.html?aid=' + item.activityId + "&guestid=" + item.guestId;
            break;
          //抽奖
          case "6051":
            // this.$router.push({path: "/more", query: this.$route.query})
            location.href = '/raffleActivity.html?aid=' + item.activityId + "&guestid=" + item.guestId;
            break;
          default:
            this.ajaxUrl('activity.html?aid=' + item.activityId);

        }
      },
    inputFn: function (value) {
      this.post.amount = value;
    },
    nonPartsFn: function (value) {
      this.post.nonParticationAmount = value;
    },
    socket: function() {
      let _self = this;
      setTimeout(function() {
        let a;
        let uri =
          "wss://" + location.hostname + "/websocket?id=" + _self.init.user.id;
        let websocket;
        websocket = new WebSocket(uri);
        websocket.onopen = function() {
          a = setInterval(function() {
            websocket.send("1");
          }, 30000);
        };
        websocket.onmessage = function(evt) {
          console.log(evt);
          if (evt.data == "success") return false;
          let data = JSON.parse(evt.data);
          data.orderId &&
            _self.$cookie.set("order_id", data.orderId, { path: "/" });
          let json = _self.$route.query;
          if (data.orderId) json.oid = data.orderId;
          switch (data.type) {
            case "500000":
              _self.ajaxUrl("waiting.html");
              break;
            case "500042":
              _self.$toast("支付完成");
              _self.$router.push({ path: "/payment", query: json });
              break;
            case "500051":
              alert("买单被取消");
              // _self.$router.push({path: '/selfPay', query: json});
              _self.initFn();
              break;
            case "500052":
              alert("pad下线");
              // _self.$router.push({path: '/selfPay', query: json});
              _self.initFn();
              break;
            case "500053":
              alert("买单请求超时未处理被取消");
              // _self.$router.push({path: '/selfPay', query: json});
              _self.initFn();
              break;
            case "500054":
              _self.$router.push({ path: "/strategy", query: json });
              break;
            case "500005":
              _self.$router.push({ path: "/payment", query: json });
              break;
            case "500055":
              _self.$router.push({ path: "/strategy", query: json });
              break;
            case "500050":
              alert("服务员未响应");
              _self.initFn();
              break;
            case "500100":
            case "500101":
              _self.getCouponData();
              break;
          }
        };
        websocket.onclose = function() {};
        websocket.onerror = function() {};
      }, 3000);
    },
    
    bindPhone1() {
      let _self = this;
      if (this.phone1.phone && this.phone1.validateCode && this.phone1.phone.length == 11 && this.phone1.validateCode.length == 6) {
        let jsonA = {shopId: this.$route.query.id};
        jsonA.phone = this.phone1.phone;
        jsonA.validateCode = this.phone1.validateCode;
        this.$http.post("/phone/bindup", jsonA).then(response => {
          let data = response.data;
          if (data.code == 200) {
            this.vip = null;
            if (data.result && data.result.token) {
              this.$cookie.set("token", data.result.token, {"expires": '30d'});
            }
            this.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
              _self.vip = null;
              _self.initFn();

            });
          } else {
            this.$toast(data.message);
          }
        });
      }
    },
    validate1Fn() {
      if (!this.phone1.able) return;
      if (!this.phone1.phone || this.phone1.phone.length != 11) {
        this.$toast("手机格式不正确");
        return;
      }
      this.phone1.able = false;
      let _self = this;
      this.$http.post("/validate/bindup", {"phone": this.phone1.phone}).then(response => {
        let data = response.data;
        if (data.code == 200) {
          this.$toast("获取成功");
          let second = 90;
          let init = setInterval(function () {
            second--;
            if (!second || !_self.phone1) {
              clearInterval(init);
              _self.phone1.text = "重新获取验证码";
              _self.phone1.able = true;
              return;
            }
            _self.phone1.text = "已发送 " + second + " s";
          }, 1000);
        } else {
          this.phone1.able = true;
          this.$toast(data.message);
        }
      });
    },
    toStrategy: function() {
      this.$loading();
      var _self = this
      var json = {};
      if (!(this.post.amount && parseFloat(this.post.amount))) {
          this.$loading.close();
          this.$toast.center("请先填写消费总额");
          return;
        }
        if (this.init.nonPart) {
          if (!this.post.nonParticationAmount && this.post.nonParticationAmount != "0") {
            this.$loading.close();
            this.$toast.center("请先填写不参与优惠项金额，<br>如未消费此类项目，请输入0");
            // this.$toast.show({text: "请先填写不参与优惠项金额，如未消费此类项目，请输入0", position: 'bottom'});
            return;
          } else {
            if (parseInt(this.post.nonParticationAmount) > parseInt(this.post.amount)) {
              this.$loading.close();
              this.$toast.center("不参与金额不得大于总金额");
              return;
            }
            json.nonParticationAmount = this.post.nonParticationAmount;
          }
        }
      json.amount = this.post.amount;

        if (this.$route.query.d) {
          json.tableId = this.$route.query.d;
        }
        if (this.$route.query.cashier) {
          json.cashierOrderId = this.$route.query.cashier;
        }
          // 微信扫的 显示公众号二维码
            let ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
              json.terminalType = "WX"
            }else{
              json.terminalType = "ALI"
            }
          if (navigator.onLine) { 
            console.log(json);
            
            this.$http.post("/check/shop/" + this.$route.query.id + "/autonomy", json).then(response => {
              let data = response.body;
              this.$loading.close();
              if (data.code == 200) {
                _self.$cookie.set("order_id", data.result.orderId);
    
                json = _self.$route.query;
                json.oid = data.result.orderId;
                _self.$router.push({path: '/strategy', query: json})
              } else if (data.code == 405004) {
                _self.$confirm("您在" + (data.result.shopname || ("本店" + data.result.tableNo + "号桌")) + "有一个买单正在进行中,是否放弃此订单？",function ()  {
                   _self.$http.post("/check/shop/" + data.result.shopId + "/cancel", {}).then(response => {
                    let data = response.body;
                    if (data.code == 200) {
                      alert("取消成功！");
                      // _self.submitFn();
                    }
                    });
                },function () {
                    
                },"放弃", "取消")
                // let re = confirm("您在" + (data.result.shopname || ("本店" + data.result.tableNo + "号桌")) + "有一个买单正在进行中,是否放弃此订单？")
                // if (re) {
                //   this.$http.post("/check/shop/" + data.result.shopId + "/cancel", {}).then(response => {
                //     let data = response.body;
                //     if (data.code == 200) {
                //       alert("取消成功！");
                //       _self.submitFn();
                //     }
                //   });
                // }
              } else if (data.code == 405807) {
                _self.$toast("本次消费金额系统已为您读取，将继续为您买单");
                setTimeout(function () {
                  _self.refresh();
                }, 1000)
              } else {
                alert(data.message);
              }
            })
          } else { 
            var tmid = setTimeout(function () {
              _self.num ++ ;
              if(_self.num == 3) {
                clearTimeout(tmid);
                _self.num = 0;
                alert('网络已断开,请检查网络后刷新页面');
                _self.$loading.close();
                return false;
              }
              // _self.submitFn()
            },1000);
          } 
    },
    submit: function() {
      var that = this;
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        that.submits();
      }, 100);
    },
    submits: function() {
      this.$loading();
      var _self = this;
        let result = this.data.result;
        if (!(this.post.amount && parseFloat(this.post.amount))) {
          this.$loading.close();
          this.$toast.center("请先填写消费总额");
          return;
        }
        // if(parseFloat(this.post.amount) > 3000) {
        //   this.$loading.close();
        //   this.$toast.center("消费总额不能超过3000");
        //   return;
        // }
        
      var json = {
        "amount": this.post.amount,
        "url": location.href,
        "payCategory": _self.payment
      };
      if (this.init.nonPart) {
          if (!this.post.nonParticationAmount && this.post.nonParticationAmount != "0") {
            this.$loading.close();
            this.$toast.center("请先填写不参与优惠项金额，<br>如未消费此类项目，请输入0");
            // this.$toast.show({text: "请先填写不参与优惠项金额，如未消费此类项目，请输入0", position: 'bottom'});
            return;
          } else {
            if (parseInt(this.post.nonParticationAmount) > parseInt(this.post.amount)) {
              this.$loading.close();
              this.$toast.center("不参与金额不得大于总金额");
              return;
            }
            json.nonParticationAmount = this.post.nonParticationAmount;
          }
        }
      if (_self.key_json.d) {
        json.tableId = _self.key_json.d;
      }
      if (navigator.onLine) {
        this.$http.post("/check/shop/"+ this.$route.query.id + "/pay", json).then(response => {
            let data = response.body;
         if (data.code == 200) {
           this.$loading.close();
              switch (_self.payment) {
                case "1005":
                  var js = data.result.js;
                  var pay = data.result.pay;
                  pay.success = function() {
                    _self.disable = false;
                    alert("支付成功");
                  };
                  pay.cancel = function() {
                    _self.disable = false;
                     _self.$http.post("/order/" + data.result.orderId + "/pay/revoke").then(() => {});
                    
                  };
                  pay.fail = function(res) {
                     _self.$http.post("/order/" + data.result.orderId + "/pay/revoke").then(() => {});
                    _self.disable = false;
                    alert("支付失败");
                  };
                  js.debug = false;
                  js.jsApiList = ["chooseWXPay"];
                  delete js.url;
                  wx.config(js);
                  wx.ready(function() {
                    wx.chooseWXPay(pay);
                  });
                  break;
                case "1101":
                  AlipayJSBridge.call(
                    "tradePay",
                    {
                      tradeNO: data.result.pay.tradeNO
                    },
                    function(result) {
                      if (result.resultCode == "6001") {
                         _self.$http.post("/order/" + data.result.orderId + "/pay/revoke").then(() => {});
                        _self.disable = false;
                        return;
                      }
                      if (result.resultCode == "9000") {
                        _self.disable = false;
                        alert("支付成功");
                      }
                    }
                  );
                  break;
              }
            } else {
              _self.disable = false;
              alert(data.message);
            }
        });
      } else {
        var tmid = setTimeout(function() {
          _self.num++;
          if (_self.num == 3) {
            clearTimeout(tmid);
            _self.num = 0;
            this.$loading.close();
            alert("网络已断开,请检查网络后刷新页面");
            _self.disable = false;
            return false;
          }
          _self.submit();
        }, 1000);
      }
    },
    closeAddVip() {
        
      },
    // submits: function() {
    //   this.$loading();
    //   var _self = this;
    //     let result = this.data.result;
    //     if (!(this.post.amount && parseFloat(this.post.amount))) {
    //       this.$loading.close();
    //       this.$toast.center("请先填写消费总额");
    //       return;
    //     }
    //     // if(parseFloat(this.post.amount) > 3000) {
    //     //   this.$loading.close();
    //     //   this.$toast.center("消费总额不能超过3000");
    //     //   return;
    //     // }
        
    //   var json = {
    //     amount: this.post.amount,
    //     url: location.href,
    //     payCategory: _self.payment
    //   };
    //   if (this.init.nonPart) {
    //       if (!this.post.nonParticationAmount && this.post.nonParticationAmount != "0") {
    //         this.$loading.close();
    //         this.$toast.center("请先填写不参与优惠项金额，<br>如未消费此类项目，请输入0");
    //         // this.$toast.show({text: "请先填写不参与优惠项金额，如未消费此类项目，请输入0", position: 'bottom'});
    //         return;
    //       } else {
    //         if (parseInt(this.post.nonParticationAmount) > parseInt(this.post.amount)) {
    //           this.$loading.close();
    //           this.$toast.center("不参与金额不得大于总金额");
    //           return;
    //         }
    //         json.nonParticationAmount = this.post.nonParticationAmount;
    //       }
    //     }
    //   if (_self.key_json.d) {
    //     json.tableId = _self.key_json.d;
    //   }
    //   if (navigator.onLine) {
    //     _self.rest(
    //       "/check/shop/" + _self.shopId + "/pay",
    //       json,
    //       "post",
    //       function(data) {
    //         if (data.code == 200) {
    //           switch (_self.payment) {
    //             case "1005":
    //               var js = data.result.js;
    //               var pay = data.result.pay;
    //               pay.success = function() {
    //                 _self.disable = false;
    //                 alert("支付成功");
    //               };
    //               pay.cancel = function() {
    //                 _self.disable = false;
    //                 _self.rest(
    //                   "/order/" + data.result.orderId + "/pay/revoke",
    //                   {},
    //                   "post",
    //                   function(data) {}
    //                 );
    //               };
    //               pay.fail = function(res) {
    //                 _self.rest(
    //                   "/order/" + data.result.orderId + "/pay/revoke",
    //                   {},
    //                   "post",
    //                   function(data) {}
    //                 );
    //                 _self.disable = false;
    //                 alert("支付失败");
    //               };
    //               js.debug = false;
    //               js.jsApiList = ["chooseWXPay"];
    //               delete js.url;
    //               wx.config(js);
    //               wx.ready(function() {
    //                 wx.chooseWXPay(pay);
    //               });
    //               break;
    //             case "1101":
    //               AlipayJSBridge.call(
    //                 "tradePay",
    //                 {
    //                   tradeNO: data.result.pay.tradeNO
    //                 },
    //                 function(result) {
    //                   if (result.resultCode == "6001") {
    //                     _self.rest(
    //                       "/order/" + data.result.orderId + "/pay/revoke",
    //                       {},
    //                       "post",
    //                       function(data) {}
    //                     );
    //                     _self.disable = false;
    //                     return;
    //                   }
    //                   if (result.resultCode == "9000") {
    //                     _self.disable = false;
    //                     alert("支付成功");
    //                   }
    //                 }
    //               );
    //               break;
    //           }
    //         } else {
    //           _self.disable = false;
    //           alert(data.message);
    //         }
    //       }
    //     );
    //   } else {
    //     var tmid = setTimeout(function() {
    //       _self.num++;
    //       if (_self.num == 3) {
    //         clearTimeout(tmid);
    //         _self.num = 0;
    //         alert("网络已断开,请检查网络后刷新页面");
    //         _self.disable = false;
    //         return false;
    //       }
    //       _self.submit();
    //     }, 1000);
    //   }
    // },
    rest: function(u, j, h, f) {
      //json, url,http
      this.$cookie.set("apikey", "6b774cc5eb7d45818a9c7cc0a4b6920f","30d",'/')
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
        var t = "037925fa578c4ed98885d7b28ade5462",
          e = [];
        if (Object.keys(r).length) {
          for (var a in r) e.push(a);
        }
        (r.timestamp = new Date().getTime()), e.push("timestamp"), e.sort();
        var n = "",
          f = {};
        for (var h in e) (n += e[h] + "=" + r[e[h]]), (f[e[h]] = r[e[h]]);
        n += t;
        for (var i = hex_md5(n), m = "", o = 0; o < i.length; o += 2)
          m += i.charAt(o);
        for (var s = 1; s < i.length; s += 2) m += i.charAt(s);
        f.signature = m;
        return f;
      }

      function sortUrl() {
        for (
          var r = "037925fa578c4ed98885d7b28ade5462",
            t = new Date().getTime(),
            e = hex_md5("timestamp=" + t + r),
            a = "",
            n = 0;
          n < e.length;
          n += 2
        )
          a += e.charAt(n);
        for (var f = 1; f < e.length; f += 2) a += e.charAt(f);
        var h = "";
        return (h = "timestamp=" + t + "&signature=" + a);
      }

      /*     加密     */
      $.ajax({
        url: url,
        data: data,
        timeout: 10000,
        type: h,
        dataType: "json",
        async: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }, //这里设置header
        success: function(data) {
          if (data.code == 400000) {
            location.href = "error.html#7";
          } else {
            f(data);
          }
        },
        complete: function(XMLHttpRequest, status) {
          if (status == "timeout") {
            a.abort();
            alert("超时");
          }
        }
      });
    },
    auth: function() {
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        if (_self.key_json.appid && _self.key_json.code) {
          var json1 = {};
          json1.code = _self.key_json.code;
          json1.appid = _self.key_json.appid;
          _self.$http.post("/auth/user",json1).then((data1) => {
            var data1 = response.body;
            if (data1.code == 200) {
              var token = data1.result.token;
              this.$cookie.set("token", token,"30d")
            } else {
              redirectFn(function() {
                location.href =
                  "auth?url=" +
                  encodeURIComponent(location.href) +
                  "&durl=" +
                  encodeURIComponent(redirect);
              });
            }
          });
          // rest("/auth/user", json1, "post", function(data1) {
          //   if (data1.code == 200) {
          //     var token = data1.result.token;
          //     this.$cookie.set("token", token,"30d")
          //     pay();
          //   } else {
          //     redirectFn(function() {
          //       location.href =
          //         "auth?url=" +
          //         encodeURIComponent(location.href) +
          //         "&durl=" +
          //         encodeURIComponent(redirect);
          //     });
          //   }
          // });
        } else {
          redirectFn(function() {
            location.href =
              "auth?url=" +
              encodeURIComponent(location.href) +
              "&durl=" +
              encodeURIComponent(redirect);
          });
        }
      } else {
        //支付宝没有检测登陆的接口，直接授权
        if (_self.key_json.auth_code) {
           _self.$http.post("/auth/alipay/user",{ code: _self.key_json.auth_code }).then((data) => {
            var data = response.body;
            if (data.code == 200) {
                var token = data.result.token;
                this.$cookie.set("token", token,"30d")
              }
          });
          // rest(
          //   "/auth/alipay/user",
          //   { code: _self.key_json.auth_code },
          //   "post",
          //   function(data) {
          //     if (data.code == 200) {
          //       var token = data.result.token;
          //       this.$cookie.set("token", token,"30d")
          //     }
          //   }
          // );
        } else {
          redirectFn(function() {
            location.href =
              "auth/alipay?url=" +
              encodeURIComponent(location.href) +
              "&durl=" +
              encodeURIComponent(redirect);
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../sui_assets/scss/newSelfPay.scss";
</style>