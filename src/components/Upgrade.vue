<template>
<div class="upgrade" v-if="data">
    <div class="card" :style="{backgroundImage: 'url('+ (data.cardUrl||'') +')',backgroundColor: (data.backgroundColor||'#ffffff')}">
        <img class="avatar" :src="data.logoUrl">
        <span class="shop">{{data.brandName}}</span>
    </div>
    <div class="separate"></div>
    <vip-module v-bind:data="data" :payment="payment" v-bind:upgrade="true"></vip-module>
</div>
</template>

<script>
import vipModule from "./module/vip"

export default {
    name: 'upgrade',
    data() {
        const self = this;
        return {
            data: "",
            payment: "",
            checked: true,
            phone: {
                text: '获取验证码',
                able: true
            },
            activeIndex: 0,
            swiperOption: {
                centeredSlides: true,
                slidesPerView: 1.5,
                spaceBetween: 15,
                on: {
                    click() {
                        self.couponDetailFn(this.activeIndex);
                    }
                }
            }
        }
    },
    components: {
        vipModule
    },

    created: function () {
        this.getData();
        this.getModeFn();
    },
    methods: {
        getData() {
            let _self = this;
            let json = {};
            if (this.$route.query.tid) {
                json.gradeId = this.$route.query.tid;
            }
            this.$http.get("/membership/guest/" + (this.$route.query.id || this.$route.query.guestid) + "/upgrade", {
                key: json
            }).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    _self.data = data.result;
                } else {
                    if (data.code == 4050450) {
                        alert("您已经是最高等级会员");
                        _self.$router.push({
                            path: 'vip',
                            query: _self.$route.query
                        });
                    } else {
                        // location.href = "error.html#3"
                    }
                }
            });
        },
        validateFn() {
            if (!this.phone.able) return;
            if (!this.phone.phone || this.phone.phone.length != 11) {
                this.$toast("手机格式不正确");
                return;
            }
            this.phone.able = false;
            let _self = this;
            this.$http.post("/validate/bindup", {
                "phone": this.phone.phone
            }).then(response => {
                let data = response.data;
                if (data.code == 200) {
                    this.$toast("获取成功");
                    let second = 90;
                    let init = setInterval(function () {
                        second--;
                        if (!second || !_self.phone) {
                            clearInterval(init);
                            _self.phone.text = "重新获取验证码";
                            _self.phone.able = true;
                            return;
                        }
                        _self.phone.text = "已发送 " + second + " s";
                    }, 1000);
                } else {
                    this.phone.able = true;
                    this.$toast(data.message);
                }
            });
        },
        bindPhone() {
            let _self = this;
            if (this.phone.phone && this.phone.validateCode && this.phone.phone.length == 11 && this.phone.validateCode.length == 6) {
                let jsonA = this.$route.query;
                jsonA.shopId = this.$route.query.id;
                jsonA.phone = this.phone.phone;
                jsonA.validateCode = this.phone.validateCode;
                // 推广码
                if (_self.$route.query.pid) {
                    jsonA.promoteId = _self.$route.query.pid;
                }
                this.$http.post("/phone/bindup", jsonA).then(response => {
                    let data = response.data;
                    console.log('hhh')
                    console.log(this.data.strategies)
                    if (data.code == 200) {
                        this.$set(this.data, "needPhone", false);

                        if (data.result && data.result.token) {
                            this.$cookie.set("token", data.result.token, {
                                "expires": '30d'
                            });
                        }
                        for (let i in this.data.strategies) {
                            if (this.data.strategies[i].type == 'FREE') {
                                this.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
                                    _self.redirectUser();
                                })
                            }
                        }
                        this.checked = false;
                    } else {
                        this.$toast(data.message);
                    }
                });
            }
        },
        redirectUser() {
            let _self = this;
            let json = {};
            if (_self.$route.query.id) {
                json.id = _self.$route.query.id;
            } else {
                json.guestid = _self.$route.query.guestid;
            }
            _self.$router.push({
                path: '/user',
                query: json
            });
        },
        getModeFn() {
            let _self = this;
            _self.$http.get("/shop/" + (_self.$route.query.id || _self.$route.query.guestid) + "/paymode", {
                key: {
                    "type": this.getVersion()
                }
            }).then(response => {
                let data1 = response.body;
                if (data1.code == 200) {
                    if (response.body.result.oasis) {
                        _self.authorFuiou();
                        return;
                    }
                    _self.payment = data1.result.payMode;
                } else {

                }
            });
        },
        submitFn: function (index) {
            this.$loading();
            let _self = this;
            if (!index) {
                for (var i in this.data.strategies) {
                    if (this.data.strategies[i].type == 'FREE') {
                        index = i;
                    }
                }
            }
            if (this.data.strategies[index].type == 'FREE') {
                let para = {
                    "id": (this.$route.query.id || this.$route.query.guestid)
                };
                if (this.$route.query.type == "channel") {
                    para.channel = "401"
                }
                // 推广码
                if (_self.$route.query.pid) {
                    para.promoteId = _self.$route.query.pid;
                }

                _self.$http.post("/membership", para).then(response => {
                    let data = response.body;
                    _self.$loading.close();
                    if (data.code == 200) {
                        _self.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
                            _self.redirectUser();
                        });
                    } else {
                        alert(data.message);
                    }
                });
                return;
            }
            let payment = this.payment;
            if (!payment) {
                _self.$message("提示", "品牌暂未开通支付，详情请咨询服务员。", function () {});
                 _self.$loading.close();
                return;
            }
            let para = {
                activityId: this.data.strategies[index].activityId,
                payCategory: payment,
                url: encodeURIComponent(location.href),
                failedUrl: encodeURIComponent(location.href)
            };

            // 推广码
            if (_self.$route.query.pid) {
                para.promoteId = _self.$route.query.pid;
            }
            this.$http.post("/benefit/upgrade/guest/" + (this.$route.query.id || this.$route.query.guestid), para).then(response => {
                let data = response.body;
                if (data.code !== 200) {
                    _self.$loading.close();
                    alert(data.message);
                    return;
                }
                let order_id = data.result.orderId;
                if (data.result.url) {
                    location.href = data.result.url;
                    return;
                }
                switch (payment) {
                    case "1005":
                        let js = data.result.js;
                        let pay = data.result.pay;
                        pay.success = function () {
                            _self.$loading.close();
                            _self.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
                                _self.redirectUser();
                            });
                        };
                        pay.cancel = function () {
                            _self.cancelPay(order_id);
                        };
                        pay.fail = function (res) {
                            _self.cancelPay(order_id);
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
                                _self.cancelPay(order_id);
                            } else if (result.resultCode == "9000") {
                                _self.$loading.close();
                                _self.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
                                    _self.redirectUser();
                                });
                            }
                        });
                        break;
                }
            });
        },
        cancelPay(orderId) {
            this.$loading.close();
            this.$http.post("/order/" + orderId + "/pay/revoke").then(response => {});
        },
        couponDetailFn: function (index) {
            let item = this.data.coupons[index];
            if (item) {
                this.ajaxUrl("couponDetail.html?cid=" + item.id + (item.type == '1017' ? ('&type=reward') : ''));
            }
        },
        redirectFn: function (item) {
            let json = {};
            if (this.$route.query.id) {
                json.id = this.$route.query.id;
            } else {
                json.guestid = this.$route.query.guestid;
            }
            switch (item.category) {
                //送券
                case '6004':
                    this.ajaxUrl('couponActivity.html?aid=' + item.activityId);
                    break;
                    //套餐
                case "6015":
                    this.ajaxUrl('mealActivity.html?aid=' + item.activityId);
                    break;
                    //充值
                case "6002":
                    this.$router.push({
                        path: 'charge',
                        query: json
                    });
                    // this.ajaxUrl('charge.html');
                    break;
                    //入会及升级
                case "6001":
                    this.$route.query.tid = item.activityId
                    this.$router.push({
                        path: '/upgrade',
                        query: this.$route.query
                    });
                    // this.ajaxUrl('upgrade.html?tid=' + item.activityId);
                    break;
                    //积分兑换
                case "6003":
                    this.$router.push({
                        path: '/exchange',
                        query: this.$route.query
                    });
                    // this.ajaxUrl('exchange.html');
                    break;
                    //砍价
                case "6041":
                    this.ajaxUrl('grouponInfo.html?aid=' + item.activityId);
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
                    this.ajaxUrl('activity.html?aid=' + item.activityId);

            }
        }
    }

}
</script>

<style lang="scss" scoped>
@import "../sui_assets/scss/upgrade.scss";
</style>
