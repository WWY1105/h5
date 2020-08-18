<template>
<div class="vipModule" v-if="data">
    <div class="current-grade" v-if="data.currentGradeName||data.toName">{{data.toName||data.currentGradeName}}</div>
    <!-- 新人赠礼 -->
    <div class="box" v-if="data.firstBenefit">
        <div class="gift-title1"></div>
        <div class="gift-wrapper1">
            <div class="gift-wrapper">
                <div class="swiper-slide" v-for="(item,key) in data.firstBenefit" :key="key">
                    <div v-on:click="couponDetailFn(0,key)" v-if="item.category=='1016'" class="add">
                        <div class="corn" v-if="item.count>1">{{item.count}}张</div>
                        <div class="coupon-bg" :class="item.todayUsable?'today':''" :style="{backgroundImage: 'url('+ (item.picUrl||'./sui_assets/img/mass/place-coupon.png') +')'}" style="margin-bottom: 1rem"></div>
                        <div class="name ellipsis" style="-webkit-box-orient: vertical;">{{item.name}}</div>
                        <div class="limit ellipsis" style="-webkit-box-orient: vertical;">{{item.times}};{{item.useStrategy}}</div>
                    </div>
                    <div v-if="item.category=='1017'">
                        <div class="coupon-bg" style="background-image: url('./sui_assets/img/mass/place-reward.png');margin-bottom: 1rem;"></div>
                        <div class="name">{{item.amount}}元代用币</div>
                        <div class="limit">直接发放到账户</div>
                    </div>
                    <div v-if="item.category=='1015'">
                        <div class="coupon-bg" style="background-image: url('./sui_assets/img/mass/place-point.png');margin-bottom: 1rem;"></div>
                        <div class="name">{{item.amount}}积分</div>
                        <div class="limit">直接发放到账户</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 升级赠礼 -->
    <div class="box" v-if="data.upgradeBenefit">
        <div class="gift-title"></div>
        <div class="gift-wrapper1">
            <div class="gift-wrapper">
                <div class="swiper-slide" v-for="(item,key) in data.upgradeBenefit" :key="key">
                    <div v-on:click="couponDetailFn(1,key)" v-if="item.category=='1016'" class="add">
                        <div class="corn" v-if="item.count>1">{{item.count}}张</div>
                        <div class="coupon-bg" :class="item.todayUsable?'today':''" :style="{backgroundImage: 'url('+ (item.picUrl||'./sui_assets/img/mass/place-coupon.png') +')'}" style="margin-bottom: 1rem"></div>
                        <div class="name ellipsis" style="-webkit-box-orient: vertical;">{{item.name}}</div>
                        <div class="limit ellipsis" style="-webkit-box-orient: vertical;">{{item.times}};{{item.useStrategy}}</div>
                    </div>
                    <div v-if="item.category=='1017'">
                        <div class="coupon-bg" style="background-image: url('./sui_assets/img/mass/place-reward.png');margin-bottom: 1rem;"></div>
                        <div class="name">{{item.amount}}元代用币</div>
                        <div class="limit">直接发放到账户</div>
                    </div>
                    <div v-if="item.category=='1015'">
                        <div class="coupon-bg" style="background-image: url('./sui_assets/img/mass/place-point.png');margin-bottom: 1rem;"></div>
                        <div class="name">{{item.amount}}积分</div>
                        <div class="limit">直接发放到账户</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 生日特权 -->
    <div class="box" v-if="data.activity">
        <div class="coupon-title"></div>
        <div class="label" v-if="data.activity.birth"><span class="icon3"></span>生日礼券，让你每个生日都有惊喜</div>
        <div class="birth-wrapper" v-if="data.activity.birth">
            <ul>
                <li v-if="data.activity.birth[0].content">生日当月会赠送<span v-for="text in data.activity.birth[0].content">{{text}};</span>
                </li>
                <li>{{data.activity.birth[0].times}}</li>
                <li>仅限本人持券使用</li>
                <li>不与其他优惠叠加</li>
            </ul>
            <div class="birth-inner" v-if="data.activity.birthday" style="padding-top: 1.5rem;">
                <!-- <span class="bold">{{data.activity.birthday.split("-")[0]}}</span>
          <span>年</span> -->
                <span class="bold">{{data.activity.birthday?data.activity.birthday.split("-")[1]:''}}</span>
                <span>月</span>
                <span class="bold">{{data.activity.birthday?data.activity.birthday.split("-")[2]:''}}</span>
                <span>日</span>
            </div>
            <div class="birth-inner" @click="tapBirthFn" v-else>
                <!--<div class="number">-->
                <!--<div type="number" class="number" v-model="post.month">月</div>-->
                <!--<div type="number" class="number" v-model="post.day">日</div>-->
                <!--</div>-->
                <div class="btn">完善生日信息</div>
            </div>
        </div>
        <div class="label" v-if="data.activity.irregular"><span class="icon2"></span>不定期礼券，随时给你小惊喜</div>
        <div class="coupon-wrapper" v-if="data.activity.irregular">
            <ul>
                <li style="list-style-type: none;" v-html="replaceMethod(data.activity.irregular.contents[0])"></li>
                <li style="list-style-type: none;">{{data.activity.irregular.time}}</li>
            </ul>
        </div>

    </div>
    <!-- 账户特权 -->
    <div class="box">
        <div class="account-title"></div>
        <div class="account-wrapper">
            <router-link :to="{ path: 'activity', query:  $route.query}" class="account-item account-item1">
                <div class="title">热门活动</div>
                <div>海量活动等你来</div>
            </router-link>
            <router-link :to="{ path: 'charge', query:  $route.query}" class="account-item account-item2">
                <div class="title">充值回馈</div>
                <div>充的多送的多</div>
            </router-link>
            <router-link :to="{ path: 'exchange', query:  $route.query}" class="account-item account-item3">
                <div class="title">会员商城</div>
                <div>积分兑换特价秒杀</div>
            </router-link>
        </div>

    </div>
    <!-- 门店特权 -->
    <div class="box" v-if="data.shopActivities">
        <div class="shop-title"></div>
        <div class="shop-wrapper">
            <div class="shop-item" v-for="item in data.shopActivities" v-on:click="replaceUrl(item)">
                <div class="title"><span :class="'type'+item.category"></span>{{type[item.category]}}</div>
                <div class="text">
                    <div class="ellipsis" style="-webkit-box-orient: vertical;">{{item.contents.join(";")}}</div>
                    <div class="period" v-if="item.period">{{item.period}}</div>
                </div>
            </div>
        </div>
    </div>
    <!-- 服务特权 -->
    <div class="box" v-if="data.serviceActivities">
        <div class="service-title"></div>
        <div class="service-wrapper">
            <router-link :to="{ path: 'userLine', query:  $route.query}" class="service-item1" v-if="data.serviceActivities.includes('6060')">
            </router-link>
            <router-link :to="{ path: 'userReserve', query:  $route.query}" class="service-item2" v-if="data.serviceActivities.includes('6054')">
            </router-link>
        </div>
    </div>
    <!-- 会员级别 -->
    <div class="uploadBottom">
        <!-- <div style="height: 3rem"></div> -->
        <!-- <div class="upgrade-btn" v-on:click="showFn" v-if="data.strategies||!data.currentGradeName">升级为{{data.toName}}</div>
        <div class="upgrade-btn disabled" style="box-shadow: none" v-on:click="showFn" v-else>
            您已是{{data.currentGradeName}}
        </div> -->
        <div class="otherRules" v-if="notActiveArr.length>0" v-on:click="showFn">
            <p class="title">
                <span class="left">其他升级方式</span>
                <span class="right">查看
                    <van-icon name="arrow-up" v-if="!show" />
                    <van-icon name="arrow-down" v-if="show" /></span>
            </p>
            <div class="content" v-if="show">
                <ul>
                    <li v-for="item,index in notActiveArr"><span class="text">{{item.content}}</span></li>
                </ul>
            </div>
        </div>
        <div class="uploadBtnBox" v-if="upgrade">
            <div @click="submitFn(index)" class="upgrade-btn" v-for="item,index in activeArr" :style="activeArr.length==1?'width:100%!important;':activeArr.length==3?'width:30%!important;':''">
                <span v-if="item.type=='BUY'">花费{{item.amount}}元购买升级</span>
                <span v-if="item.type=='FREE'">免费领取升级</span>
                <span v-if="item.type=='CHARGE'">充值{{item.amount}}元升级</span>
                <span v-if="item.type=='POINT_EXCHANGE'">兑换升级</span>
            </div>
        </div>
        <div class="uploadBtnBox" v-if="!upgrade&&canUpgrade">
            <router-link :to="{ path: 'vip', query:  $route.query}" class="upgrade-btn" style="width:100%!important">
                <span v-if="data.currentGradeName">您当前是{{data.currentGradeName}}</span><span v-else>您还不是本店会员</span>，升级为更高级别会员
            </router-link>
        </div>
    </div>

    <!-- 选择升级方式 -->
    <!-- <div class="upgradeModal" v-if="show">
        <div class="upgrade-wrapper">
            <div class="title">请选择升级方式</div>
            <div class="content">
                <div class="item" v-for="(item,key) in data.strategies">
                    <div class="text">{{item.content}}</div>
                    <div class="click" @click="submitFn(key)" v-if="rule[item.type]" :class="{'unusable':!item.usable}">
                        立即{{rule[item.type]}}
                    </div>
                </div>
            </div>
            <div class="close">
                <div class="close-btn" v-on:click="showFn">关闭</div>
            </div>
        </div>
    </div> -->
    <awesome-picker ref="picker3" :textTitle="picker3.textTitle" :type="picker3.type" :anchor="picker3.anchor" @confirm="handlePicker3Confirm">
    </awesome-picker>
</div>
</template>

<script>
import Vue from 'vue';
import {
    Icon
} from 'vant';

import AwesomePicker from 'vue-awesome-picker';
import 'vant/lib/icon/style';
Vue.use(Icon);
Vue.use(AwesomePicker);
export default {
    name: "VipModule",
    props: ['data', 'upgrade', 'canUpgrade', 'payment'],
    data() {
        return {
            // data: "",
            post: {},
            show: false, //升级弹窗
            rule: {
                "FREE": "领取",
                "BUY": "购买",
                "CHARGE": "充值",
                "POINT_EXCHANGE": "兑换"
            },
            type: {
                // "6001": "升级",
                '6000': '享会员价',
                "6002": "充值好礼",
                "6003": "积分兑换",
                "6004": "免费领券",
                "6005": "满额打折",
                "6006": "特价菜品",
                "6007": "消费返券",
                "6008": "消费积分",
                "6009": "积分抵现",
                "6012": "以少抵多",
                "6014": "满额立减",
                "6015": "优惠套餐",
                "6017": "充值免单",
                '6013': '评价立减'
            },
            payment: "",
            picker3: {
                anchor: [],
                textTitle: '日期选择',
                type: 'date'
            },
            activeArr: [],
            notActiveArr: [],
            activeIndex: null
        }
    },
    watch: {
        data() {
            let that = this;
            that.activeArr = [],
                that.notActiveArr = []
            if (this.data.strategies && this.data.strategies.length > 0) {
                this.data.strategies.forEach(function (item) {
                    if (that.rule[item.type] && item.usable) {
                        that.activeArr.push(item)
                    } else {
                        that.notActiveArr.push(item)
                    }
                })
            }
            console.log('变')
            console.log(that.activeArr)
            console.log(that.notActiveArr)
        }

    },
    created() {
        let that = this;

        // 对传入的策略进行筛选
        console.log('传入的数据' + that.upgrade + "--" + that.canUpgrade)
        // console.log(this.data.strategies)
        if (this.data.strategies && this.data.strategies.length > 0) {
            this.data.strategies.forEach(function (item) {
                if (that.rule[item.type] && item.usable) {
                    that.activeArr.push(item)
                } else {
                    that.notActiveArr.push(item)
                }
            })
        }

    },
    methods: {
        bindFn() {
            console.log('hfuiafhdasiofhdosfhsdo')
            let _self = this;
            this.$bind({
                title: "绑定手机号",
                text: "绑定手机号后，获得更多权益",
                submit: function () {
                    // window.location.reload()
                    _self.redirectUser()

                }
            })
        },
       
        showFn() {
            this.$set(this, "show", !this.show);
        },
        tapBirthFn() {
            this.$refs.picker3.show()
        },
        handlePicker3Confirm(v) {
            this.picker3.anchor = v;
            var m;
            var d;
            if (v[1].index + 1 < 10) {
                m = '0' + (v[1].index + 1);
            } else {
                m = v[1].index + 1;
            }
            if (v[2].index + 1 < 10) {
                d = '0' + (v[2].index + 1);
            } else {
                d = v[2].index + 1;
            }
            // this.post.birthday = (1900 + v[0].index) + '-' + (v[1].index + 1) + "-" + (v[2].index + 1);
            this.post.birthday = (1900 + v[0].index) + '-' + m + "-" + d;
            let json = {
                birthday: this.post.birthday
            };
            this.$http.post("/user", json).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    this.$toast("提交成功");
                    location.reload();
                    // this.$emit('refresh')
                } else {
                    this.$toast(data.message);
                }
            });
        },
        replaceUrl(item) {
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
        },
        redirectUser() {
            let _self = this;
            let json =_self.$route.query;
            _self.$router.push({
                path: '/user',
                query: json
            });
        },
        couponDetailFn: function (t, index) {
            var item;
            if (t == 0) {
                item = this.data.firstBenefit[index];
            } else {
                item = this.data.upgradeBenefit[index];
            }
            if (item) {
                this.ajaxUrl("couponDetail.html?cid=" + item.id + (item.type == '1017' ? ('&type=reward') : ''));
            }

        },
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
        submitFn: function (index) {

            this.$loading();
            let _self = this;
            console.log()

            _self.activeIndex = index;

            if (_self.activeIndex != 0 && !_self.activeIndex) {
                for (var i in this.activeArr) {
                    if (this.activeArr[i].type == 'FREE') {
                        index = i;
                    }
                }
            }
            console.log(_self.activeArr[_self.activeIndex].type == 'FREE')
            if (_self.activeArr[_self.activeIndex].type == 'FREE') {
                let para = {
                    "id": (_self.$route.query.id || _self.$route.query.guestid)
                };
                if (_self.$route.query.type == "channel") {
                    para.channel = "401"
                }
                console.log('执行了1111')
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
                    } else if (data.code == 403060) {
                        _self.bindFn()
                    } else if (data.code == 405053) {
                        // 您已经是会员了，若要升级为更高等级的会员，请查看会员升级规则
                        _self.redirectUser();
                    } else {
                        alert(data.message);
                    }
                });
                return;
            }
            let payment = _self.payment || sessionStorage.getItem('payMode');

            if (!payment) {
                _self.$message("提示", "品牌暂未开通支付，详情请咨询服务员。", function () {});
                _self.$loading.close();
                return;
            }

            let para = {
                activityId: this.activeArr[index].activityId,
                payCategory: payment,
                url: encodeURIComponent(location.href),
                failedUrl: encodeURIComponent(location.href)
            };
            // 推广码
            if (this.$route.query.pid) {
                para.promoteId = this.$route.query.pid;
            }
            this.$http.post("/benefit/upgrade/guest/" + (this.$route.query.id || this.$route.query.guestid), para).then(response => {
                let data = response.body;
                if (data.code !== 200) {
                    if (data.code == 403060) {
                        _self.$loading.close();
                        _self.bindFn()
                    } else {
                        _self.$loading.close();
                        alert(data.message);
                        return;
                    }

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
    }
}
</script>

<style lang="scss" scoped>
@import "./vip.scss";
</style>
