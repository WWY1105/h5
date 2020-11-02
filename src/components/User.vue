<template>
<div class="user" v-if="data">
    <div class="content">
        <!-- 会员卡 -->
        <div class="i-bg" v-if="data.existMemberRule">
            <div class="i-card" v-if="!data.phone" :style="{backgroundImage: 'url('+ (data.cardUrl||'') +')'}" v-on:click="bindFn()">
                <div>
                    <img class="avatar" :src="data.logoUrl">
                    <span class="shop">{{data.brandName}}</span>
                </div>
                <div class="i-footer1">
                    验证手机号
                </div>
            </div>
            <div class="i-card" @click="goto('vip')" v-else :style="{backgroundImage: 'url('+ (data.cardUrl||'') +')'}">
                <div>
                    <img class="avatar" :src="data.logoUrl">
                    <span class="shop">{{data.brandName}}</span>
                </div>
                <div class="i-footer" v-if="data.memberGradeName">
                    <div class="set-content">
                        <div>{{data.memberGradeName}}</div>
                        <div>NO. {{data.memberCardNo}}</div>
                    </div>
                    <div><span class="iconA"></span></div>
                </div>
                <div class="i-footer1" v-else>
                    立即激活
                </div>
            </div>
        </div>

        <div class="benefit-wrapper">
            <div class="point-item" @click="goto('exchange')">
                {{data.point||0}}
            </div>
            <div class="separate"></div>
            <div class="coupon-item" @click="goto('coupon')">
                {{data.couponCount||0}}
            </div>
            <div class="separate"></div>
            <div class="charge-item" @click="goto('charge')">
                {{data.charge||0}}
            </div>
            <div class="separate"></div>
            <div class="reward-item" @click="goto('reward')">
                {{data.reward||0}}
            </div>
        </div>

        <div class="redbox" v-if="data.existSalary">
            <img src="/sui_assets/img/user/pic.png" alt="">
            <div class="redboxcontent">
                <div>您有现金待领取</div>
                <div class="text">邀请好友即可领取</div>
            </div>
            <div @click="goto('rewardlist')">
                <div class="redboxbtn">去赚赏金</div>
            </div>
        </div>
    </div>
    <!--  弹框 -->
    <div v-if="vip">
        <div v-if="vip.needPhone">
            <!--无手机号，只有领卡-->
            <div class="modal addVip2" v-if="vip.memberGradeName">
                <div class="modal-inner">
                    <div class="modal-content">
                        <div class="top">
                            <!-- 测试  -->
                            <div class="card-box" v-bind:style="{backgroundImage:'url('+ vip.cardUrl+')'}"></div>
                            <!-- <div class="card-box" v-bind:style="{backgroundImage:'url(http://img.sharejoy.com.cn/8AT56E3T/86SM2EBK/8AW52EKS/a5f570a982504f82b3bd4e73488d120f_org.jpg)'}"></div>  -->
                            <!-- <div class="card-text">
                                欢迎加入会员
                            </div> -->
                        </div>
                        <div class="modal-phone" style="margin:0">
                            <div v-if="qrcode">
                                <!-- <div v-if="ccode">不强制领卡 -->
                                <div>
                                    <input type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()" />
                                    <input type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" maxlength="6" @blur="temporaryRepair()" />
                                    <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
                                    <div v-on:click.stop="bindPhone1" class="v-button">加入会员</div>
                                </div>

                                <!--不强制领卡 <div class="qrcode" v-if="qrcode" style="display: flex;flex-direction: column;align-items: center;">
                                    <img v-if="!ccode" style="width:6.4rem" :src="qrcode.url" />
                                    <img src="/sui_assets/img/addVip/casblk.png" style="margin-top: 0.55rem ;width:6rem ;height:1.15rem ;" alt="">
                                </div> -->
                            </div>
                            <div v-else>
                                <input type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()" />
                                <input type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" maxlength="6" @blur="temporaryRepair()" />
                                <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
                                <div v-on:click.stop="bindPhone1" class="v-button">加入会员</div>
                            </div>
                        </div>

                        <div class="close" v-on:click="closeAddVip()"></div>
                    </div>
                </div>
            </div>
            <!--无手机号，有新人礼-->
            <div class="modal addVip" v-else>
                <div class="modal-inner modal-innerWX">
                    <div class="modal-content">
                        <!-- <div class="usable">有 {{vip.todayUsableNum}} 张优惠券可【立即抵用】</div> -->
                        <div class="v-item" style="    background-color: transparent;background: none;display: flex;justify-content: center;align-items: center;padding: 0;margin-top: 30px;width: 3rem;margin-bottom:0px;    height: 64px">
                            <p class="left coupon-icon" style="margin-top: 0;margin-bottom: 0;background-position: center;"></p>
                        </div>
                        <!-- <div class="usable2" v-else></div> -->
                        <div class="overflow" style="margin-top:0">
                            <div v-if="vip.benefits" v-for="(coupon,key) in vip.benefits" :key="key" style="position : relative">
                                <div class="v-coupon" v-if="coupon.category == '1016' " :class="coupon.todayUsable?'todayUsable':''">
                                    <div class="v-item">
                                        <div class="left" v-if="coupon.hasOwnProperty('amount')&&coupon.amount != 0 && coupon.couponCategory!=9012">
                                            <span v-if=" coupon.couponCategory=='903' ||coupon.couponCategory=='9031'">{{coupon.amount}}折</span>
                                            <span v-else-if=" coupon.couponCategory=='902' ||coupon.couponCategory=='9021'">
                                                <span class=" dollar"></span>
                                                {{+coupon.amount + +coupon.currentAmount}}
                                            </span>
                                            <span v-else>
                                                <span class="dollar"></span>
                                                {{coupon.amount}}
                                            </span>
                                        </div>
                                        <div class="left coupon-icon" v-else></div>
                                        <div class="right">
                                            <div>{{coupon.name}}</div>
                                            <div class="grey">{{coupon.times}}</div>
                                        </div>
                                        <div class="corn" v-if="coupon.count>1">{{coupon.count}}张</div>
                                    </div>
                                </div>
                                <div class="v-point" v-if="coupon.category == '1015' " :class="coupon.todayUsable?'todayUsable':''">
                                    <div class="v-item">
                                        <div class="left">{{coupon.amount}}</div>
                                        <div class="right">积分</div>
                                        <div class="corn" v-if="coupon.count>1">{{coupon.count}}张</div>
                                    </div>
                                </div>
                                <div class="v-reward" v-if="coupon.category == '1017' " :class="coupon.todayUsable?'todayUsable':''">
                                    <div class="v-item">
                                        <div class="left">{{coupon.amount}}</div>
                                        <div class="right">无门槛代用币</div>
                                        <div class="corn" v-if="coupon.count>1">{{coupon.count}}张</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-phone">
                            <div v-if="qrcode">
                                <!-- <div v-if="ccode"> 不强制领卡-->
                                <div>
                                    <input type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()" />
                                    <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
                                    <input type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" id="validate" maxlength="6" @blur="temporaryRepair()" />
                                    <!-- <div id="bindPhone" v-on:click.stop="bindPhone1" class="v-button" >立即领取</div> -->
                                    <div id="bindPhone" v-on:click.stop="bindPhone1" class="v-button" style="color:#000;font-weight: 900;">免费注册</div>
                                </div>
                                <!-- 不强制领卡<div class="qrcode" v-if="qrcode">
                                    <img v-if="!ccode" style="width:4.5rem ;" :src="qrcode.url" />
                                    <div style="font-size: .7rem;">长按识别,免费注册</div>
                                </div> -->
                            </div>
                            <div v-else>
                                <input type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()" />
                                <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
                                <input type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" id="validate" maxlength="6" @blur="temporaryRepair()" />
                                <div id="bindPhone" v-on:click.stop="bindPhone1" class="v-button" style="color:#000;    font-weight: 900;">免费注册</div>
                            </div>
                        </div>
                        <div class="close" v-on:click="closeAddVip()"></div>
                    </div>
                </div>
            </div>
        </div>
        <!--有手机号，直接领卡-->
        <div class="modal addVip1" v-else>
            <div class="modal-inner">
                <div class="modal-content" ref="content">
                    <!-- <div class="new" ref="new"></div> -->
                    <div class="down" ref="down"></div>
                    <div class="information">
                        <div class="info" ref="info">
                            <div class="content">
                                <div v-for="(coupon,key) in vip.benefits" :key="key">
                                    <!-- <span>{{coupon.name}}</span>
                  <span v-if="coupon.category =='1015'">{{coupon.amount}}积分</span>-->
                                    <div class="v-coupon" v-if="coupon.category == '1016' ">
                                        <div class="v-item">
                                            <div class="left" v-if="coupon.hasOwnProperty('amount')&&coupon.amount != 0">
                                                <span v-if="coupon.couponCategory=='903'||coupon.couponCategory=='9031'">{{coupon.amount}}折</span>
                                                <span v-else-if="coupon.couponCategory=='902'||coupon.couponCategory=='9021'">
                                                    <span class="dollar"></span>
                                                    {{coupon.currentAmount}}
                                                </span>
                                                <span v-else>
                                                    <span class="dollar"></span>
                                                    {{coupon.amount}}
                                                </span>
                                            </div>
                                            <div class="left coupon-icon" v-else></div>
                                            <div class="right">
                                                <div>{{coupon.name}}</div>
                                                <div class="grey">{{coupon.times}}</div>
                                            </div>
                                            <div class="corn" v-if="coupon.count>1">{{coupon.count}}张</div>
                                        </div>
                                    </div>
                                    <div class="v-point" v-if="coupon.category == '1015' ">
                                        <div class="v-item">
                                            <div class="left">{{coupon.amount}}</div>
                                            <div class="right">积分</div>
                                        </div>
                                    </div>
                                    <div class="v-reward" v-if="coupon.category == '1017' ">
                                        <div class="v-item">
                                            <div class="left">{{coupon.amount}}</div>
                                            <div class="right">无门槛代用币</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="v-close" v-on:click="refresh()">我 知 道 了</div>
                        </div>
                    </div>

                    <div class="up" ref="up"></div>
                    <div class="top" ref="top" style="height: 23.45rem ;border-radius:0.3rem ">
                        <!-- 测试 -->
                        <!-- <div class="card-box" v-bind:style="{backgroundImage:'url(http://img.sharejoy.com.cn/8AT56E3T/86SM2EBK/8AW52EKS/a5f570a982504f82b3bd4e73488d120f_org.jpg)'}"></div>  -->
                        <div class="card-box" v-bind:style="{backgroundImage:'url('+ vip.cardUrl+')'}"></div>
                        <div class="card1" ref="card">
                            <!-- 恭喜获赠会员 -->
                            <img src="/sui_assets/img/addVip/gxhzhyk.png" style="margin-top: 0.5rem ;width:7rem ;height:1.15rem ;" alt="">
                        </div>
                        <div class="card-line"></div>
                        <div class="card-text" style="padding:2.9rem 0 1.5rem">
                            使用自助买单可自动抵用优惠
                        </div>
                        <!--  v-if="!vip.benefits" -->
                        <div class="v-button" v-on:click="refresh()">我 知 道 了</div>
                        <!-- <div v-else v-on:click="open()" class="v-button">打开红包</div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 会员特权 -->
    <vip-module v-bind:data="upgrade" :payment="payment" v-bind:upgrade="false" v-bind:canUpgrade="data.canUpgrade"></vip-module>
   
   
   
   
    <div class="bar">
        <div v-on:click="ajaxUrl('record.html')"><span class="icon1"></span>订单记录</div>
        <div @click="goto('setting')" class="i-list">
            <span class="icon2"></span>账户设置
        </div>
    </div>
    <div style="height: 3rem"></div>

    <!-- 二维码 -->
    <!-- <linkPicUrl :linkPicUrl="linkPicUrl" /> -->
</div>
</template>

<script>
import vipModule from "./module/vip"
import wcKeyboard from './wcKeyboard/KeyboardInput.vue'
// import linkPicUrl from './module/linkPicUrl/linkPicUrl'

import Vue from 'vue'
import AwesomePicker from 'vue-awesome-picker';

Vue.use(AwesomePicker);
export default {
    name: "User",

    data() {
        return {
            linkPicUrl: '',
            data: "",
            upgrade: "",
            close: false,
            vip: "",
            init: {},
            phone1: {},
            qrcode: "",
            payment: ''
        }
    },
    watch: {
        'phone1.text': {
            handler(newVal) {},
            deep: true
        }
    },
    components: {
        vipModule,
        wcKeyboard,
        // linkPicUrl
    },
    created() {

        // 判断是否有pid
        if (this.$route.query.pid) {
            this.linkPicUrl = this.$cookie.get(this.$route.query.pid)
        }
        this.initFn();
        this.getModeFn();
    },
    methods: {
        goto(path) {
            this.$router.push({
                path,
                query: this.$route.query
            })
        },
        initFn() {
            let _self = this;
            let para = {};
            this.$http.get("/benefit/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
                if (response.body.code == 200) {
                    this.data = response.body.result;
                    this.$cookie.set("reward", this.data.reward || 0);
                    this.$cookie.set("relation_id", this.data.relationId || '');
                    localStorage.setItem("reward_count", this.data.reward || 0);
                    localStorage.setItem("relation_id", this.data.relationId || '');
                    this.addVip()
                    // 没有手机号
                    // if (!this.data.phone && !this.$cookie.get("phone_take")) {
                    // this.$bind({
                    //   title: "绑定手机号",
                    //   text: "绑定手机号后，获得更多权益",
                    //   submit: function () {
                    //     _self.initFn();
                    //   }
                    // });
                    // this.$cookie.set("phone_take", true, {"expires": '5m'}); //设置五分钟内不会再次出现该弹框
                    // }
                } else if (response.body.code != 403000) {
                    alert(response.body.message);
                }
            });

            this.$http.get("/membership/guest/" + (this.$route.query.id || this.$route.query.guestid) + "/grade").then(response => {
                if (response.body.code == 200) {
                    this.upgrade = response.body.result;
                }

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
                    //  _self.$message("提示", "品牌暂未开通支付，详情请咨询服务员。", function () {
                    //   });
                }
            });
        },
        bindFn() {
            let _self = this;
            this.$bind({
                title: "绑定手机号",
                text: "绑定手机号后，获得更多权益",
                submit: function () {
                    _self.initFn();
                }
            })
        },
        open() {
            this.$refs.top.style.opacity = 0
            this.$refs.card.style.opacity = 0
            this.$refs.new.style.opacity = 0
            this.$refs.up.style.display = 'block'
            this.$refs.down.style.display = 'block'
            this.$refs.info.style.display = 'block'
            this.$refs.content.style.backgroundColor = 'transparent'
            setTimeout(() => {
                this.$refs.top.style.display = 'none'
                this.$refs.new.style.display = 'none'
                this.$refs.up.style.top = '-200%'
                this.$refs.down.style.bottom = '-250%'
                this.$refs.info.style.top = '15%'
                this.$refs.info.style.opacity = "1"
                this.close = true
            }, 500);
        },
        //添加新人礼会员 获取门店升级赠送详情
        addVip() {
            let _self = this;
            this.$http.get("/remind/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    if (data.result.needPhone) {
                        this.vip = data.result;
                        this.phone1 = {
                            text: '获取验证码',
                            able: true
                        };
                        // if(this.vip.needPhone) {
                        //   document.getElementsByTagName("body")[0].className="activebody"
                        // }
                    } else {
                        let jsonA = {
                            id: this.$route.query.id || this.$route.query.guestid
                        };
                        // 推广码
                        if (_self.$route.query.pid) {
                            jsonA.promoteId = _self.$route.query.pid;
                        }
                        this.$http.post("/membership", jsonA).then(response => {
                            let data = response.body;
                            if (data.code == 200) {
                                this.$http.get("/remind/guest/" + (this.$route.query.id || this.$route.query.guestid) + '/result').then(response => {
                                    this.vip = response.body.result;
                                });
                            } else {
                                location.href = "error.html#3"
                            }
                        });
                    }
                } else {
                    this.getFlower();
                }
            });
        },
        temporaryRepair() {
            setTimeout(() => {
                const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        },
        // 打开红包的动画
        open() {
            this.$refs.top.style.opacity = 0
            this.$refs.card.style.opacity = 0
            this.$refs.new.style.opacity = 0
            this.$refs.up.style.display = 'block'
            this.$refs.down.style.display = 'block'
            this.$refs.info.style.display = 'block'
            this.$refs.content.style.backgroundColor = 'transparent'
            setTimeout(() => {
                this.$refs.top.style.display = 'none'
                this.$refs.new.style.display = 'none'
                this.$refs.up.style.top = '-200%'
                this.$refs.down.style.bottom = '-250%'
                this.$refs.info.style.top = '12%'
                this.$refs.info.style.opacity = "1"
                this.close = true
            }, 500);
        },
        closeAddVip() {
            this.vip = null;
            // document.body.removeAttribute("class","activebody");
            if (this.init.existGratuity) {
                this.getFlower();
            }
        },

        // 获取验证码
        validate1Fn() {
            if (!this.phone1.able) return;
            if (!this.phone1.phone || this.phone1.phone.length != 11) {
                this.$toast("手机格式不正确");
                // 
                return;
            }
            this.phone1.able = false;
            let _self = this;
            this.$http
                .post("/validate/bindup", {
                    phone: this.phone1.phone
                })
                .then(response => {
                    let data = response.data;
                    if (data.code == 200) {
                        this.$toast("获取成功");
                        let second = 90;
                        let init = setInterval(function () {
                            second--;
                            // console.log(phone1.text)
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
        getFlower() {
            if (this.init.existGratuity) {
                //服务评价
                let json = {},
                    _self = this;
                json.tableId = this.$route.query.d;
                this.$http.get("/gratuity/shop/" + this.$route.query.id, {
                    key: json
                }).then(response => {
                    let data = response.body;
                    if (data.code == 200) {
                        if (data.result.hasOwnProperty('satisfied')) {
                            //已经评价过了
                            data.result.already = true;
                            data.result.tags = [];
                            //
                            data.result.state = 'close';
                            let arr = data.result.negative;
                            if (data.result.satisfied) {
                                arr = data.result.positive;
                            }
                            for (let i in arr) {
                                if (data.result.commentedTags.includes(arr[i].id)) {
                                    data.result.tags.push(arr[i]);
                                }
                            }
                        }
                        _self.flower = data.result;
                        _self.flower.once = true;
                    }
                });
            }
        },
        // 验证手机立即领取
        bindPhone1() {
            let _self = this;
            if (this.phone1.phone && this.phone1.validateCode && this.phone1.phone.length == 11 && this.phone1.validateCode.length == 6) {
                let jsonA = {
                    shopId: this.$route.query.id
                };
                jsonA.phone = this.phone1.phone;
                jsonA.validateCode = this.phone1.validateCode;
                // 推广码
                if (_self.$route.query.pid) {
                    jsonA.promoteId = _self.$route.query.pid;
                }
                this.$http.post("/phone/bindup", jsonA).then(response => {
                    let data = response.data;
                    if (data.code == 200) {
                        this.vip = null;
                        if (data.result && data.result.token) {
                            this.$cookie.set("token", data.result.token, {
                                "expires": '30d'
                            });
                        }
                        this.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
                            _self.vip = null;
                            _self.initFn();

                        });
                        //              this.closeSuccessAddVip();
                    } else {
                        this.$toast(data.message);
                    }
                });
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import "../sui_assets/scss/user.scss";
</style>
