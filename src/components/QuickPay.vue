<template>
<div>
    <div class="top">
        <img :src="data.logo" class="logo">
        <span class="shopName" v-text="data.name"></span>
        <span class="pull-right" v-text="data.tableNo?('（'+data.tableNo+'桌）'):'前台'"></span>
    </div>
    <div class="center">
        <div class="label">消费金额</div>
        <div class="amount">
            <div v-text="post.amount"></div>
            <div class="cursor" :style="{visibility: cursor ? 'visible' : 'hidden'}"></div>
        </div>
    </div>
    <div class="bottom">
        <table>
            <tr>
                <td @touchstart="typing('1')">1</td>
                <td @touchstart="typing('2')">2</td>
                <td @touchstart="typing('3')">3</td>
                <td @touchstart="typing('')" class="delete"></td>
            </tr>
            <tr>
                <td @touchstart="typing('4')">4</td>
                <td @touchstart="typing('5')">5</td>
                <td @touchstart="typing('6')">6</td>
                <td rowspan="3" class="submit" :style="{background:submitBg}" @touchstart.stop="disable=true;submit()" ref="submit">确认支付</td>
            </tr>
            <tr>
                <td @touchstart="typing('7')">7</td>
                <td @touchstart="typing('8')">8</td>
                <td @touchstart="typing('9')">9</td>
            </tr>
            <tr>
                <td colspan="2" @touchstart="typing('0')">0</td>
                <td @touchstart="typing('.')">.</td>
            </tr>
        </table>
    </div>

    <div class="lx-load-mark" v-bind:class="{ hide: !disable }">
        <div class="lx-load-box">
            <div class="lx-loading">
            </div>
        </div>

    </div>
</div>
</template>

<script>
import Vue from 'vue'
export default {
    name: 'quickPay',
    data() {
        return {
            data: {},
            post: {
                amount: ''
            },
            version: '',
            payMode: "",
            cursor: true,
            aIllegal: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0..', '.'],
            decimal: 2,
            inter: 5,
            disable: false,
            num: 0,
            timer: '',
            submitBg: ''
        }
    },
    created() {
        var version = 'ALIPAY';
        this.id = this.$route.query.id || this.$route.query.guestId;
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            version = 'WXPAY';
        }
        this.version = version;
        this.getData()
    },
    methods: {
        // 获取店铺数据
        getData() {
            let id = this.$route.query.id || this.$route.query.guestId;
            let that = this;
            this.$http.get("/shop/" + id, {
                key: {
                    type: that.version
                }

            }).then(response => {
                if (response.body.code == 200) {
                    this.data = response.body.result;
                }
            })
        },
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
            event.preventDefault();
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
            var that = this
            if (this.timer) {
                clearTimeout(this.timer)
            }

            this.timer = setTimeout(() => {
                that.submits()
            }, 100)
        },
        // 确认支付
        submits: function () {
            var _self = this;
            this.disable = true;

            this.submitBg = 'grey'
            setTimeout(() => {
                this.submitBg = '#ff4747'
            }, 300);

            if (!this.post.amount || !parseFloat(this.post.amount)) {
                alert("请先输入金额");
                _self.disable = false;
                return;
            }

            if (!_self.data.payMode) {
                _self.disable = false;
                alert("没有可用的支付方式");
                return;
            }
            if (this.post.amount.charAt(this.post.amount.length - 1) == '.') {
                this.post.amount += '0';
            }
            var json = {
                "amount": this.post.amount,
                "url": encodeURIComponent(location.href.split('?')[0]),
                "payCategory": _self.data.payMode
            };
            if (this.$route.query.d) {
                json.tableId = this.$route.query.d;
            }
            if (navigator.onLine) {
                _self.$http
                    .post("/check/shop/" + this.id + "/pay", json)
                    .then(response => {
                        let data = response.body;

                        if (data.code == 200) {
                            switch (_self.data.payMode) {
                                case "1005":
                                    var js = data.result.js;
                                    var pay = data.result.pay;
                                    pay.success = function () {
                                        // _self.post.amount=0;
                                        // _self.disable = false;
                                        let json = _self.$route.query;
                                        json.oid = data.result.orderId;
                                        _self.$http.get("/order/" + data.result.orderId + "/pay/result").then(response => {
                                            _self.$router.push({
                                                path: 'payment',
                                                query: json
                                            });
                                        });
                                        // alert("支付成功");
                                    };
                                    pay.cancel = function () {
                                        _self.disable = false;
                                        _self.$http
                                            .post("/order/" + data.result.orderId + "/pay/revoke")
                                            .then(() => {});
                                    };
                                    pay.fail = function (res) {
                                        _self.$http
                                            .post("/order/" + data.result.orderId + "/pay/revoke")
                                            .then(() => {});
                                        _self.disable = false;
                                        alert("支付失败");
                                    };
                                    js.debug = false;
                                    js.jsApiList = ["chooseWXPay"];
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
                                            _self.$http
                                                .post("/order/" + data.result.orderId + "/pay/revoke")
                                                .then(() => {});
                                            _self.disable = false;
                                            alert("支付失败");
                                        }
                                        if (result.resultCode == "9000") {
                                            _self.disable = false;
                                            let json = _self.$route.query;
                                            json.oid = data.result.orderId;
                                            _self.$http.get("/order/" + data.result.orderId + "/pay/result").then(response => {
                                                _self.$router.push({
                                                    path: 'payment',
                                                    query: json
                                                });
                                            });
                                        }
                                    });
                                    break;
                            }

                        } else {
                            _self.disable = false;
                            alert(data.message);
                        }
                    })
            } else {
                var tmid = setTimeout(function () {
                    _self.num++;
                    if (_self.num == 3) {
                        clearTimeout(tmid);
                        _self.num = 0;
                        alert('网络已断开,请检查网络后刷新页面');
                        _self.disable = false;
                        return false;
                    }
                    _self.submit()
                }, 1000);
            };
        }

    }
}
</script>

<style scoped>
@media only screen and (min-width: 320px) and (max-width: 374px) {
    html {
        font-size: 17.0666667px;
    }
}

@media only screen and (min-width: 375px) and (max-width: 413px) {
    html {
        font-size: 20px;
    }
}

@media only screen and (min-width: 414px) {
    html {
        font-size: 21.33333333px !important;
    }
}

.shopName {
    max-width: 12rem;
    display: inline-block;
    height: 1.5rem;
    overflow: hidden;
    font-weight: bold;
    color: rgb(255, 71, 71);

}

#loading {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    background: url("/sui_assets/img/loading.gif") center no-repeat;
    background-size: 3rem;
}

.container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    background: #f5f5f5;
}

.top {
    height: 6.6rem;
    /* background: url("/sui_assets/img/bg.png");
    background-color: #91e2df; */
    color: white;
    padding: .8rem .9rem;
    font-size: 1rem;
    line-height: 2rem;
    box-sizing: border-box;
}

.logo {
    width: 2rem;
    height: 2rem;
    vertical-align: middle;
}

.pull-right {
    float: right;
}

.center {
    /*height: 61px;*/
    background-color: #ffffff;
    border: solid 0.5px #979797;
    margin: -2.6rem .8rem 0;
    padding: .8rem 1rem;
}

.label {
    color: #8c8c8c;
    font-size: .7rem;
}

.amount {
    font-size: 2rem;
    color: #333;
    text-align: right;
    position: relative;
    height: 2.7rem;
}

.amount:before {
    content: "￥";
    position: absolute;
    left: 0;
    font-size: 1.3rem;
    line-height: 3rem;
}

.cursor {
    position: absolute;
    right: -7px;
    display: block;
    width: 2px;
    height: 1.5rem;
    background: #4788c5;
    top: 0;
    bottom: 0;
    margin: auto;
}

.bottom {
    position: absolute;
    bottom: -1px;
    left: -1px;
    right: -1px;
}

table {
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid #d8d8d8;
    box-sizing: border-box;
    text-align: center;
    background: white;
}

td {
    height: 3.5rem;
    line-height: 71px;
    width: 25%;
    border: 1px solid #d8d8d8;
    font-size: 1.4rem;
}

.submit {
    background: #ff4747;
    color: white;
    padding: 0 1rem;
    line-height: 1.4;
    font-size: 1rem;
    letter-spacing: 2px;
}

.delete {
    background: url("/sui_assets/img/delete.svg") center no-repeat;
    background-size: 40px;
}

.toast {}

.lx-load-mark {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 20400;
}

.lx-load-box {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: .4rem;
    margin-left: -1.25rem;
    margin-top: -1.25rem;
    background: rgba(0, 0, 0, .8);
    z-index: 11000;
    border-radius: .25rem;
}

.lx-loading {
    display: block;
    width: 1.7rem;
    height: 1.7rem;
    animation: preloader-spin 1s steps(12, end) infinite;
}

.lx-loading:after {
    display: block;
    content: "";
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

@-webkit-keyframes preloader-spin {
    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes preloader-spin {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

.hide {
    visibility: hidden;
}
</style>
