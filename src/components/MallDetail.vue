<template>
  <div class="mall" v-if="data">
    <div class="record">
      <div class="left"></div>
      <div class="right" v-on:click="redirectFn">我的记录</div>
    </div>
    <img :src="data.picUrl" class="pic">
    <div class="title">{{data.title}}</div>
    <div class="content">时间：{{data.startDate}}-{{data.endDate}}</div>
    <div class="content" v-if="data.stock === undefined">不限量</div>
    <div class="content" v-else>库存：{{data.stock}}</div>
    <div class="content" v-html="replaceMethod(data.additional)"></div>
    <div class="content" v-for="pic in data.picUrls">
      <div class="desc">{{pic.title}}</div>
      <img :src="pic.url" width="100%">
    </div>
    <div style="height: 3rem"></div>
    <div class="fixed">
      <div class="left">需付款{{data.sales[0].price}}元</div>
      <div class="right" :class="payment&&data.usable?'':'disabled'" v-on:click="submitFn"><span v-if="data.stock===0">已售完</span><span
        v-else>立即购买</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    data() {
      return {
        data: "",
        payment: ""
      }
    },
    created() {
      this.$http.get("/shop/" + (this.$route.query.id || this.$route.query.guestid) + "/paymode", {key: {"type": this.getVersion()}}).then(response => {
        if (response.body.code == 200) {
          if (response.body.result.oasis) {
            this.authorFuiou();
            return;
          }
          this.payment = response.body.result;
        }
      });
      this.initFn();
    },
    methods: {
      initFn() {
        this.$http.get("/mall/" + (this.$route.query.aid)).then(response => {
          let data = response.body;
          if (data.code == 200) {
            this.data = data.result;
          } else if (data.code === 404000) {

          } else {

          }
        });
      },
      submitFn() {
        let show = this.$loading('loading...');
        if (show) return;
        let json = {
          goodsId: this.$route.query.aid,
          count: 1,
          payCategory: this.payment.payMode,
          url: location.href,
          id: this.$route.query.id || this.$route.query.guestid
        };
        let _self = this;
        if(_self.$route.query.pid){
           json.promoteId=_self.$route.query.pid;
        }
        this.$http.post("/mall/buy", json).then(response => {
          let data = response.body;
          if (data.code == 405009) {
            let result = confirm("支付遇到问题，是否重新支付？");
            if (result) {
              this.$http.post("/order/" + data.result.orderId + "/pay/revoke").then(response => {
                this.$loading.close();
                if (response.body.code == 200) {
                  _self.submitFn();
                } else {
                  _self.$loading(response.body.message);
                }
              });
            } else {
              this.$loading.close();
            }
            return;
          }
          if (data.code == 403060) {
            this.$loading.close();
            this.$bind({
              title: "绑定手机号",
              text: "绑定手机号后，方可购买",
              submit: function () {
                _self.submitFn();
              }
            });
            return;
          }
          if (data.code != 200) {
            this.$loading.close();
            this.$toast(data.message);
            return;
          }
          let order_id = response.body.result.orderId;
          if (response.body.result.url) {
            location.href = response.body.result.url;
            return;
          }
          switch (_self.payment.payMode) {
            case "1005":
              let js = response.body.result.js;
              let pay = response.body.result.pay;
              pay.success = function () {
                _self.$loading.close();
                _self.$confirm('购买成功!', function () {
                  _self.$router.push({path: 'user', query: _self.$route.query});
                }, function () {
                  _self.initFn();
                }, "去看看", "继续逛逛");
              };
              pay.cancel = function () {
                _self.cancel(order_id);
              };
              pay.fail = function (res) {
                _self.cancel(order_id);
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
                tradeNO: response.body.result.pay.tradeNO
              }, function (result) {
                _self.$loading.close();
                if (result.resultCode == "6001") {
                  _self.cancel(order_id);
                  return;
                }
                if (result.resultCode == "9000") {
                  _self.$loading.close();
                  _self.$confirm('购买成功!', function () {
                    _self.$router.push({path: 'user', query: _self.$route.query});
                  }, function () {
                    _self.initFn();
                  }, "去看看", "继续逛逛");
                }
              });
              break;
          }
        });
      },
      cancel(orderId) {
        this.$loading.close();
        this.$http.post("/order/" + orderId + "/pay/revoke").then(response => {
        });
      },
      redirectFn() {
        this.$router.push({path: "/mallRecord", query: this.$route.query});
      }
    }

  }
</script>

<style lang="scss" scoped>
  @import "../sui_assets/scss/mallDetail.scss";

</style>
