<template>
<div class="charge" v-if="data">
    <div class="top">
        <div class="header">
            <div class="">
                <div>我的余额</div>
                <div class="amount">¥{{data.charge||0}}</div>
            </div>
            <div class="btn-record" v-if="data.customerRelationId" v-on:click="ajaxUrl('remainder.html?rid='+ data.customerRelationId)">充值记录
            </div>
        </div>
        <!-- 子账户余额 -->
        <!-- <div class="chargeSub" v-bind:class="this.limitHeight ? 'limitHeight'  : ''" v-if="data.chargeSub"> -->
        <div class="chargeSub" v-if="data.chargeSub">
            <span style="padding-top : 5px ; display : block">各门店可用金额 :</span>
            <ul>
                <li :class="item.usable ? 'usable' : '' " v-for="(item,index) in data.chargeSub"><span class="chargeName">{{item.name}} :</span> ¥{{item.amount}}</li>
            </ul>
            <!-- <div class="showmore" v-on:click="checkheight()"> {{this.limitHeight ? "展开全部" : "收起"}}</div> -->
        </div>
        <div class="limit" v-if="data.used&&data.used[0].limit&&data.used[0].limit[0]">{{data.used[0].limit[0]}}</div>
        <div class="limit" v-if="data.used&&data.used[0].limit&&data.used[0].limit[1]">{{data.used[0].limit[1]}}</div>
    </div>
    <div class="detail" v-if="(data.activity&&data.activity.length)||data.used">
        <div class="box" v-for="(item,index) in data.activity" v-on:click="key=index">
            <div class="left" v-bind:class="{'active': (key == index)}"></div>
            <div class="right">
                <span class="label" v-if="item.from&&item.from!='普通顾客'">{{item.from}}</span>
                <span class="">{{item.amount}}元</span><span v-if="item.str">送{{item.str}}</span>
                <div class="grey">{{item.times}}</div>
            </div>
        </div>
        <div class="rule" v-if="data.used">
            <div class="title">使用规则</div>
            <ul>
                <li v-if="data.used[0].additional">{{data.used[0].additional}}</li>
                <!-- <li v-if="data.used[0].time">{{data.used[0].time}}</li>
          <li v-if="data.used[0].periods">{{data.used[0].periods}}</li> -->
                <li v-if="data.used[0].shared">{{data.used[0].shared}}</li>
                <li v-if="data.used[0].shops">{{data.used[0].shops}}</li>
                <li v-if="data.used[0].nonParticipations">{{data.used[0].nonParticipations}}</li>
                <li v-for="item in data.used[0].limit"><span>{{item}}</span></li>
                <li>本活动在法律允许范围内商家拥有最终解释权</li>
            </ul>
        </div>
    </div>
    <div class="empty" v-else></div>
    <div class="submit" v-if="payment&&payment.payMode&&data.activity&&data.activity.length">
        <div class="left">支付{{data.activity[key].amount}}元</div>
        <div class="right" v-on:click="submitFn">确认充值</div>
    </div>

    <!-- 二维码 -->

    <linkPicUrl :show="codeShow" />

</div>
</template>

<script>
import linkPicUrl from './module/linkPicUrl/linkPicUrl'
export default {
    name: 'Charge',
    data() {
        return {
            data: "",
            key: 0,
            payment: {},
            limitHeight: true,
            codeShow: false,
            linkPicUrl: ''
        }
    },
    components: {
        linkPicUrl
    },
    created() {
        // 判断是否有pid
        if (this.$route.query.pid) {
            this.linkPicUrl = this.$cookie.get(this.$route.query.pid)
        }
        this.$http.get("/shop/" + (this.$route.query.id || this.$route.query.guestid) + "/paymode", {
            key: {
                "type": this.getVersion()
            }
        }).then(response => {
            if (response.body.code == 200) {
                if (response.body.result.oasis) {
                    this.authorFuiou();
                    return;
                }
                this.payment = response.body.result;
            }
        });
        this.$http.get("/activities/recharge/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
            if (response.body.code == 200) {
                let data = response.body;
                if (data.result.customerRelationId) {
                    localStorage.setItem("charge", data.result.charge);
                    this.$cookie.set("charge", data.result.charge);
                    this.$cookie.set("relation_id", data.result.customerRelationId);
                }
                if (data.result.activity && data.result.activity.length) {
                    for (let i in data.result.activity) {
                        if (this.$route.query.rid && this.$route.query.rid == data.result.activity[i].ruleTupleId) {
                            this.key = i;
                        }
                        let arr = [];
                        for (let j in data.result.activity[i].benefits) {
                            let benefit = data.result.activity[i].benefits[j];
                            switch (benefit.type) {
                                case "1014":
                                    arr.push(benefit.amount ? (benefit.amount + "元") : '');
                                    break;
                                case "1015":
                                    arr.push(benefit.amount ? (benefit.amount + "积分") : '');
                                    break;
                                case "1016":
                                    arr.push(benefit.name + "（" + benefit.count + "张）");
                                    break;
                            }
                        }
                        data.result.activity[i].str = arr.join("、");
                    }
                }
                this.data = data.result;
            }
        });
    },
    methods: {
        submitFn() {
            this.$loading();
            let _self = this;

            let para = {
                activityId: _self.data.activity[_self.key].activityId,
                ruleTupleId: _self.data.activity[_self.key].ruleTupleId,
                payCategory: _self.payment.payMode,
                url: encodeURIComponent(location.href),
                failedUrl: encodeURIComponent(location.href)
            };

            // 推广码
            if (_self.$route.query.pid) {
                para.promoteId = _self.$route.query.pid;
            }
            if (this.$route.query.type == "channel") {
                para.channel = "401";
            }
            this.$http.post("/benefit/recharge/guest/" + (this.$route.query.id || this.$route.query.guestid), para).then(response => {
                if (response.body.code != 200) {
                    this.$loading.close();
                    if (response.body.code == 405017) {
                        let re = confirm("只有指定级别顾客可参与活动，确定升级为该级别？");
                        if (re) {
                            _self.$router.push({
                                path: 'upgrade',
                                query: _self.$route.query
                            });
                            return;
                        }
                    } else if (response.body.code != 403000) {
                        alert(response.body.message);
                    }
                    this.codeShow = true;
                    return;
                }
                let order_id = response.body.result.orderId;
                _self.$cookie.set("order_id", order_id);
                if (response.body.result.url) {
                    location.href = response.body.result.url;
                    return;
                }
                switch (_self.payment.payMode) {
                    case "1005":
                        let js = response.body.result.js;
                        let pay = response.body.result.pay;
                        pay.success = function () {
                            _self.earnCheck(order_id);
                        };
                        pay.cancel = function () {
                            _self.cancelPay(order_id);
                        };
                        pay.fail = function (res) {
                            _self.cancelPay(order_id);
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
                            if (result.resultCode == "6001") {
                                _self.cancelPay(order_id);
                                return;
                            }
                            if (result.resultCode == "9000") {
                                _self.earnCheck(order_id);
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
        earnCheck(order_id) {
            this.$loading.close();
            let _self = this;
            let y = setInterval(function () {
                _self.$http.get("/order/" + order_id + "/pay/result").then(response => {
                    let data1 = response.body;
                    if (data1.code == "200" || data1.code == "404014") {
                        clearInterval(y);
                        if (_self.$route.query.type == 'channel') {
                            _self.$confirm('操作成功!', function () {
                                history.go(-1);
                            }, function () {
                                _self.$router.push({
                                    path: 'user',
                                    query: _self.$route.query
                                });
                            }, "继续买单", "会员中心")
                        } else {
                            _self.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
                                _self.$router.push({
                                    path: 'user',
                                    query: _self.$route.query
                                });
                            })
                        }
                    } else {
                        _self.$toast("支付结果查询中");
                    }
                });
            }, 1000)
        },
        checkheight() {
            this.limitHeight = !this.limitHeight
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../sui_assets/scss/charge.scss";
</style>
