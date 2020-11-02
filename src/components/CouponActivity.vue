<template>
<div class="page page-current" style="height: 100vh;">
    <div class="content">
        <div class="coupon-name">{{coupon.name}}</div>
        <div v-for="item in coupon.cells">
            <div class="coupon_show">
                <div class="i-grade">
                    <span>{{item.name}}尊享</span>
                </div>
                <div class="eachCoupon" v-for="i in item.coupons">
                    <div :class="i.category=='904'?'i-flex i-uncoupon flexSpace gift1':i.category=='903'?'i-flex i-uncoupon flexSpace du':i.category=='902'?'i-flex i-uncoupon flexSpace dui':'i-flex i-uncoupon flexSpace'">
                        <div class="item">
                            <div class="i-flex flexStart">
                                <img class="avatar shrink" src="sui_assets/img/logo.png">
                                <div style="padding-left: .7rem">
                                    <div class="text-lg eachName">{{i.name}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="item shrink">
                            <span class="i-btn grey" @click="toUse(i.id)">使用方法</span>
                        </div>
                    </div>
                    <div class="follow-box">
                        <div class="left">
                            <p>{{i.useStrategy}}</p>
                            <p>{{i.times}}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="coupon-detail">
            <div class="name">活动须知</div>

            <div class="key">使用条件</div>
            <ul class="value1" id="content">
                <li>{{coupon.additional}}</li>
            </ul>
            <ul class="value1" id="content">
                <li v-for="a in coupon.limit">{{a}}</li>
            </ul>
        </div>
    </div>

    <div v-if="phoneShow">
        <div v-if="!coupon.existPhone" class="text-center fix-b " id="bind" style="box-shadow: 1px 1px 17px;height: 12rem;background: white;padding: 0 1.5rem">
            <p class="xs">绑定手机领取优惠</p>
            <input type="tel" id="tel" placeholder="您的常用手机号码" v-model="phone1.phone" />

            <div class="input-text" v-on:click="validate1Fn">{{phone1.text}}</div>
            <input type="text" id="validate" placeholder="收到的验证码" v-model="phone1.validateCode" />

            <div class="btn-green flexCenter" id="bindPhone" @click="bindPhone1">
                <p>立即领取</p>
            </div>
        </div>
        <div v-else class="text-center fix-b flexCenter" id="phone" @click="submitFn">
            <div class="btn-green earnCoupon ">立即领取</div>

            <div class="bottomBtn" @click.stop="toUser">
                领券记录
            </div>
        </div>
    </div>

    <!-- 二维码 -->

    <linkPicUrl :show="codeShow" />
</div>
</template>

<script>
import linkPicUrl from './module/linkPicUrl/linkPicUrl'
export default {
    name: 'CouponActivity',
    data() {
        return {
            coupon: {},
            phoneShow:false,
            linkPicUrl: '',
            codeShow:false,
            phone1: {
                phone: '',
                validateCode: '',
                text: '发送验证码',
                able: true
            }
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
        this.getData()
    },
    methods: {
        // 查看领券记录
        toUser() {
            let json = this.$route.query;
            this.$router.push({
                path: "/user",
                query: json
            });
        },
        // 使用方法
        toUse(id) {
            console.log('点击了使用' + id);

            let path = "/couponDetail";
            let json = this.$route.query;
            json.cid = id;

            this.$router.push({
                path,
                query: json
            })
        },
        // 获取券列表
        getData() {
            let that = this;
            this.$http.get("/activities/activity/" + (this.$route.query.aid) + '/coupon').then(response => {
                if (response.body.code == 200) {
                    that.coupon = response.body.result;
                    that.phoneShow=true;
                    console.log(that.coupon.cells.length)
                }
            });
        },
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

                        if (data.result && data.result.token) {
                            this.$cookie.set("token", data.result.token, {
                                "expires": '30d'
                            });
                        }
                        _self.submitFn()
                    } else {
                        this.$toast(data.message);
                    }
                });
            }
        },
        // 领取券
        submitFn() {
            let _self = this;
            let json = {};
            let _id = _self.$route.query.id || _self.$route.query.guestid;
            if (_self.$route.query.aid) {
                json.activityId = _self.$route.query.aid;
            }
            // 推广码
            if (_self.$route.query.pid) {
                json.promoteId = _self.$route.query.pid;
            }
            this.$http.post("/benefit/obtain/guest/" + _id, json).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    _self.codeShow=true;
                    _self.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
                        _self.toUser();
                        return;
                    })
                } else if (data.code == 403060) {
                    this.$loading.close();
                    this.$bind({
                        title: "绑定手机号",
                        text: "绑定手机号后，方可购买",
                        submit: function () {
                            _self.submitFn();
                        }
                    });
                    return;
                } else {

                    this.$toast(data.message);
                    _self.$message("提示", data.message, function () {
                        _self.toUser();
                        return;
                    })

                }

            });
        },
        // rest("/benefit/obtain/guest/" + _id, {activityId: key_json.aid}, "post", function (data) {

    }
}
</script>

<style scoped>
.eachName{
    max-width: 190px;
}
.flexCenter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.flexStart {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
}

.flexSpace {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

#bind {
    box-shadow: 1px 1px 17px;
    height: 12rem;
    background: white;
    padding: 0px 1.5rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    text-align: center;
}

#bind p.xs {
    padding-top: .5rem;
    font-size: .6rem;
}

#bind input,
.bg-green input {
    line-height: 2rem;
    height: 2.2rem;
    border: 1px solid #ED1E37;
    border-radius: 5px;
    width: 100%;
    padding: 0 .5rem;
    font-size: .75rem;
    z-index: 99999;
}

.input-text {
    position: relative;
    top: -1.5rem;
    padding: .3rem .4rem;
    font-size: .5rem;
    margin: -.3rem 0;
    border-left: 1px solid #ED1E37;
    color: #ED1E37;
    float: right;
}

#bind .btn-green {
    color: #fff;
    border-radius: 5px;
    height: 2.2rem;
    line-height: 2.2rem;
    margin-top: 1rem;
    border: 1px solid #FF392E;
    background: #FF392E;
    font-size: .8rem;
    width: 100%;
}

#phone {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    box-shadow: 1px 1px 17px;
    height: 4rem;
    background: white;
    padding: 0 1rem;
    z-index: 99999;

}

.btn-green {
    color: #fff;
    border-radius: 5px;
    height: 2.2rem;
    line-height: 2.2rem;
    border: 1px solid #FF392E;
    background: #FF392E;
    font-size: .8rem;
    width: 70%;
    margin: 0 auto;
    text-align: center;
}

.i-btn.grey {
    padding: 4px 7px 2px;
    border: 1px solid rgb(130, 130, 130);
    ;
    background: #fff;
    border-radius: 50px;
    margin-top: 2px;
    color: #828282;
    font-size: .5rem;
}

.i-flex .avatar {
    width: 1.6rem;
    height: 1.6rem;
}

.text-lg {
    font-size: 1.2rem;
}

.coupon_show {
    padding: 0 .6rem;
    padding-top: 10px;
}

.bottomBtn {
    position: fixed;
    bottom: 5rem;
    right: .5rem;
    width: 2.5rem;
    height: 2.5rem;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FF392E;
}

.page {
    background: #555;
    overflow-x: hidden;
}

.i-uncoupon {
    background-color: #ffffff;
    padding: 1rem .8rem;
    border-radius: 5px 5px 0 0;
}

.i-uncoupon.di {
    background: url("/sui_assets/img/coupon/di.jpg") no-repeat;
    background-size: 100%;
}

.i-uncoupon.dui {
    background: url("/sui_assets/img/coupon/dui.jpg") no-repeat;
    background-size: 100%;
}

.i-uncoupon.gift1 {
    background: url("/sui_assets/img/coupon/gift.jpg") no-repeat;
    background-size: 100%;
}

.more .text-lg {
    font-size: .9rem;
    line-height: 1.6;
}

.i-uncoupon+.follow-box {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -moz-box-orient: horizontal;
    -moz-box-direction: normal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    align-items: center;
    background: url("/sui_assets/img/coupon/oval.svg") bottom;
    background-repeat: repeat-x;
    background-color: #ffffff;
    padding: 0rem .8rem;
    margin: 0rem 0rem .6rem;
    border-top: 1px dashed #d8d8d8;
}

.follow-box .left {
    color: #666;
    font-size: .5rem;
    line-height: 1.6;
}

.follow-box .right {
    color: #eb6658;
    text-align: right;
}

.coupon-name {
    padding: 1rem 0 .4rem;
    color: #ffffff;
    text-align: center;
    position: fixed;
    z-index: 2;
    background: #555;
    width: 100%;
    top: 0;
    left: 0;
}

.coupon-name:before {
    content: "";
    padding: 8px 15px;
    margin-right: .5rem;
    background: url('/sui_assets/img/coupon/sprite.svg') 0 -72px no-repeat;
    display: inline-block;
    vertical-align: text-bottom;
}

.relative-label {
    background: url('/sui_assets/img/label.svg') no-repeat;
    position: fixed;
    top: 10px;
    right: -17px;
    width: 70px;
    text-align: center;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    color: #ffffff;
    font-size: .5rem;
    z-index: 2;
}

.coupon-detail {
    margin-top: 1.2rem;
    padding: .8rem 1.5rem;
    color: #898989;
    font-size: .6rem;
}

.coupon-detail .name {
    font-size: .9rem;
    text-align: center;
    margin-bottom: -.5rem;
}

.coupon-detail .key {
    padding: 1.1rem 0 .5rem;

}

.coupon-detail .value1 {
    color: #ffffff;
    padding: 0;
    margin: 0;
    padding-left: .8rem;
    line-height: 1.7;
}

.i-grade {
    color: #5fa5a1;
    text-align: center;
    padding: .9rem;
    position: relative;
    font-size: .7rem;

}

.i-grade span {
    border-bottom: 2px solid;
    padding: .25rem 0;
}
</style>
