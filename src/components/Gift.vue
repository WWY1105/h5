<template>
<div class="gift">
    <div class="content">
        <div class="validate">
        </div>
        <div class="logo">
            <img v-bind:src='_self.gift.logo' alt="">
            <span>{{_self.gift.brandName}}</span>
        </div>
        <!-- 新人礼内容 -->
        <div class="benifit" style="padding-bottom:1rem;" v-for="(item , key) in _self.gift.benefits" :key="key">
            <!-- 代金券 -->
            <div class="v-coupon" v-if="item.couponCategory == '901'" v-on:click="couponDetailFn(key)">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left coupon">
                        <span><span class="dollar"></span>{{item.amount}}<span class="cate">代金券</span></span>
                    </div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                        <div class="userule">查看详情</div>
                    </div>
                    <div class="corn" v-if="item.count>1">{{item.count}}张</div>
                </div>
            </div>
            <!-- 礼品券 -->
            <div class="v-coupon" v-if="item.couponCategory == '904'" v-on:click="couponDetailFn(key)">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left1 coupon1">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                        <div class="userule">查看详情</div>
                    </div>
                    <div class="corn" v-if="item.count>1">{{item.count}}张</div>
                </div>
            </div>
            <!-- 满减券 -->
            <div class="v-coupon" v-if="item.couponCategory == '9012'" v-on:click="couponDetailFn(key)">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left1 coupon1">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                        <div class="userule">查看详情</div>
                    </div>
                    <div class="corn" v-if="item.count>1">{{item.count}}张</div>
                </div>
            </div>
            <!-- 折扣券 -->
            <div class="v-coupon" v-if="item.couponCategory == '9031' || item.couponCategory == '903'" v-on:click="couponDetailFn(key)">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left1 coupon2">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                        <div class="userule">查看详情</div>
                    </div>
                    <div class="corn" v-if="item.count>1">{{item.count}}张</div>
                </div>
            </div>
            <!-- 实物券 -->
            <div class="v-coupon" v-if="item.couponCategory == '9021' || item.couponCategory == '902'" v-on:click="couponDetailFn(key)">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left1 coupon3">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                        <div class="userule">查看详情</div>
                    </div>
                    <div class="corn" v-if="item.count>1">{{item.count}}张</div>
                </div>
            </div>
            <!-- 抵用券 -->
            <div class="v-coupon" v-if=" item.couponCategory == '9011'" v-on:click="couponDetailFn(key)">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left1 coupon4">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                        <div class="userule">查看详情</div>
                    </div>
                    <div class="corn" v-if="item.count>1">{{item.count}}张</div>
                </div>
            </div>
            <!-- 积分 -->
            <div class="v-point" v-if="item.category == '1015'">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left point">{{item.amount}}<span class="cate">积分</span></div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                    </div>
                </div>
            </div>
            <!-- 代用币 -->
            <div class="v-reward" v-if="item.category == '1017'">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left reward">{{item.amount}}<span class="cate">代用币</span></div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                    </div>
                </div>
            </div>
            <!-- 余额 -->
            <div class="v-reward" v-if="item.category == '1014'">
                <div class="v-item" :class="item.todayUsable?'today':''">
                    <div class="left reward">{{item.amount}}<span class="cate">储值卡</span></div>
                    <div class="right">
                        <div class="grey">{{item.times}}</div>
                        <div class="grey">{{item.useStrategy}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 备注 -->
        <div class="additional" v-if="_self.gift.additional">
            <h4>活动说明</h4>
            {{_self.gift.additional}}
        </div>
    </div>
    <!-- 手机弹框 需要手机号+可领取 -->
    <div class="modal-phone" v-if="_self.gift.usable && _self.gift.needPhone&&!show">
        <div>
            <span>+86</span>
            <input class="num" type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()">
            <input class="text" type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" maxlength="6" @blur="temporaryRepair()">
            <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
            <div v-on:click.stop="bindPhone1" class="v-button">立即领取</div>
        </div>
    </div>
    <!-- 按钮 不需要手机号+直接领取-->
    <div class="button" v-else-if="_self.gift.usable && !_self.gift.needPhone&&!show">
        <div v-on:click.stop="bindPhone" class="v-button">立即领取</div>
    </div>
    <!-- 不能领取 -->
    <div class="cannot" v-else>
        <!-- 本活动仅限新用户参加 -->
        <div class="v-button">仅限新用户领取</div>

    </div>
    <!-- 验证手机号成功出现弹框 -->
    <div id="limits" v-if="show">
        <div class="m-out">
            <div class="m-content">
                <div class="modal-title">领取成功</div>

                <div class='m-title'>恭喜获得<span style='color: #ed393a'>新人大礼包</span></div>
                <img src="/sui_assets/img/gift/group.png" alt="">
                <div class='grey'>下次扫码买单时将【自动使用权益】</div>
            </div>
            <div class='addon' v-if="url">
                <div><img v-bind:src='_self.imgUrl' alt="" ref="img"></div>
                <div>长按识别<br>查看获赠权益</div>
            </div>
            <div @click="goto('user')" class="item" >
                <div class='close'>立即查看</div>
            </div>
            <div class="closed" v-on:click="closed"></div>
        </div>
    </div>
     <!-- 二维码 -->

    <linkPicUrl :show="codeShow" />
</div>
</template>

<script>
import Vue from 'vue'
import linkPicUrl from './module/linkPicUrl/linkPicUrl'
export default {
    name: "Gift",
    data() {
        return {
            linkPicUrl:'',
            codeShow:false,
            gift: '',
            phone1: "",
            show: false,
            url: '',
            imgUrl: '',
            id: '',
            guestid: '',

        }
    },
       components: {
        linkPicUrl
    },
    beforeCreate() {
        var _self = this;

   // 判断是否有pid
        if (this.$route.query.pid) {
            this.linkPicUrl = this.$cookie.get(this.$route.query.pid)
        }


        let url;
        if (this.$route.query.aid) {
            url = "/activities/gift/" + this.$route.query.aid + "/guest/" + (this.$route.query.id || this.$route.query.guestid)
        } else {
            url = "/activities/gift/guest/" + (this.$route.query.id || this.$route.query.guestid)
        }
        this.$http.get(url).then(response => {
            if (response.body.code == 200) {
                _self.gift = response.body.result;
                _self.phone1 = {
                    text: '获取验证码',
                    able: true
                };
                // 微信扫的 显示公众号二维码
                let ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {

                    // 获取二维码
                    this.$http.get("/shop/" + (this.$route.query.id || this.$route.query.guestid) + "/mp").then(response => {
                        var wechat = response.body.result;
                        if (wechat && wechat.url) {
                            this.imgUrl = wechat.url
                            this.url = true;
                        }
                    })
                }

            } else if (response.body.code == 40400) {
                location.href = "error.html#2"
            }
        });

    },
    methods: {
        goto(path){
         this.$router.push({path,query:this.$route.query})
      },
        // 券详情页
        couponDetailFn: function (index) {
            let item = this.gift.benefits[index];
            if (item) {
                this.ajaxUrl("couponDetail.html?cid=" + item.id + (item.type == '1017' ? ('&type=reward') : ''));
            }

        },
        temporaryRepair() {
            setTimeout(() => {
                const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);

        },
        //获取验证码
        validate1Fn() {
            if (!this.phone1.able) return;
            if (!this.phone1.phone || this.phone1.phone.length != 11) {
                this.$toast("手机格式不正确");
                return;
            }
            this.phone1.able = false;
            let _self = this;
            this.$http.post("/validate/bindup", {
                "phone": this.phone1.phone
            }).then(response => {
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
        // 验证手机号 领取新人礼
        bindPhone1() {
            let _self = this;
            if (this.phone1.phone && this.phone1.validateCode && this.phone1.phone.length == 11 && this.phone1.validateCode.length == 6) {
                let jsonA = {
                    activityId: this.gift.activityId
                };
                jsonA.phone = this.phone1.phone;
                jsonA.validateCode = this.phone1.validateCode;
                if (_self.$route.query.pid) {
                    jsonA.pid = _self.$route.query.pid;
                }
                this.$http.post("/activities/gift/guest/" + (this.$route.query.id || this.$route.query.guestid), jsonA).then(response => {
                    let data1 = response.data;
                    if (data1.code == 200) {
                        console.log(data1);
                        if(this.linkPicUrl){
                            this.codeShow=true;
                        }else{
                              // 隐藏手机框 显示领取成功弹框
                        this.show = true;
                        }
                      
                        
                    } else {
                        this.$toast(data1.message);
                        // alert(data)
                    }
                });
            }
        },
        // 不用手机号 领取新人礼
        bindPhone() {
            let _self = this;
             let jsonB=this.$route.query;
            jsonB.activityId=this.gift.activityId;
            if (_self.$route.query.pid) {
                jsonB.pid = _self.$route.query.pid;
            }
            this.$http.post("/activities/gift/guest/" + (this.$route.query.id || this.$route.query.guestid), jsonB).then(response => {
                let data = response.data;
                if (data.code == 200) {
                    console.log(data);
                    // 隐藏手机框 显示领取成功弹框
                    this.show = true
                } else {
                    this.$toast(data.message);
                }
            });
        },
        closed() {
            this.refresh();
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../sui_assets/scss/gift1.scss";
</style>
