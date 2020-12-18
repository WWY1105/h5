<template>
<div>
    <!-- 二维码 -->
    <linkPicUrl :show="codeShow1" />
    <div class="payment" v-show="data && show">
        <div class="topBg"></div>
        <!-- <div class="order" v-if="data.order">
      <img src="/sui_assets/img/payment/success.png" class="logo">
      <span class="text-lg">
        支付完成
      </span>
      <div class="text-md">本次支付 <span class="text-xl">{{data.order.strategy.finalAmount}}</span> 元</div>
      <div class="award border">
        <div class="left">消费门店</div>
        <div class="left text-bold">{{data.order.shopName}}</div>
      </div>
      <div class="award border">
        <div class="left">原单金额</div>
        <div class="left text-bold">{{data.order.amount}}元</div>
      </div>
      <div class="award border">
        <div class="left">消费时间</div>
        <div class="left text-bold">{{data.order.checkTime}}</div>
      </div>
      <div class="award border">
        <div class="left">付款信息</div>
        <div class="left text-bold">{{data.order.strategy.finalAmount}}元（{{data.order.paymentModeText}}支付）</div>
        <div class="right text-bold"></div>
      </div>
      <div class="award border" v-if="data.order.strategy.used">
        <div class="left">金额抵用</div>
        <div class="left">
          <div v-for="item in data.order.strategy.used">{{item.content}} -{{item.amount}}</div>
        </div>
      </div>
      <div class="award border" v-if="data.order.strategy.got||data.order.gratuity">
        <div class="left">获得奖励</div>
        <div class="left text-bold">
          <div class="c-coupon" v-for="item in data.order.strategy.got">{{item.point}}{{item.name}} <span
            v-if="item.count">x{{item.count}}</span></div>
          <div class="c-point" v-if="data.order.strategy.points">{{data.order.strategy.points.point}}积分</div>
          <div class="" v-if="data.order.gratuity&&data.order.gratuity.benefits">
            <div v-for="gift in data.order.gratuity.benefits">
              <span v-if="gift.category == '1017'">{{gift.amount}}元</span>{{gift.name}}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="button"
               v-if="(data.order.obtained == false)&&(data.order.gratuity||data.order.strategy.got)"
               v-on:click="bindFn">领取奖励
          </div>
        </div>
      </div>

    </div>-->

        <div class="order 111" v-if="data">
            <div class="header" style=" padding-left: 0.8rem;padding-right: 0.8rem;border-bottom:none">
                <div style="text-align: center;">
                    <img src="/sui_assets/img/payment/success2.png" class="logo" />
                    <div class="header_title">支付成功</div>
                </div>
                <div style="text-align: center;color: #000000;margin-top: 1rem;">
                    <div style="font-size: 0.7rem;">{{data.shopName}}</div>
                    <div style="font-size: 1rem;font-weight: 500;">¥ {{data.strategy.finalAmount}}</div>
                </div>
                <div class="header_content">
                    <div class="header_list">
                        <span class="header_list_label" style=" color: #999999;">时间</span>
                        <span class="header_list_text">{{data.checkTime}}</span>
                    </div>
                    <div class="header_list">
                        <span class="header_list_label" style=" color: #999999;">原单</span>
                        <span class="header_list_text">¥ {{data.amount}}</span>
                    </div>
                    <div class="header_list" v-if="data.strategy.used" v-for="item in data.strategy.used">
                        <span class="header_list_label" style=" color: #999999;">{{item.content}}</span>
                        <span class="header_list_text">-¥ {{item.amount}}</span>
                    </div>
                    <div class="header_list reward" v-if="data.strategy.got||data.gratuity">
                        <div class="header_list_label" style=" color: #999999;">获得奖励</div>
                        <div class="header_list_text" style="width: 7rem;color: #7f7f7f;font-weight: 300;">
                            <div v-for="item in data.strategy.got" style="display: flex;justify-content: space-between;">
                                <span>{{item.point}}{{item.name}}</span>
                                <span v-if="item.count">x{{item.count}}</span>
                            </div>
                            <div v-if="data.strategy.points">{{data.strategy.points.point}}积分</div>
                            <div class v-if="data.gratuity&&data.gratuity.benefits">
                                <div v-for="gift in data.gratuity.benefits">
                                    <span v-if="gift.category == '1017'">{{gift.amount}}元</span>
                                    {{gift.name}}
                                </div>
                            </div>
                        </div>
                        <div class="header_list_text button" v-if="(data.obtained == false)&&(data.gratuity||data.strategy.got)" v-on:click="bindFn3">领取奖励</div>
                    </div>
                    <div class="header_list reward" v-if="existPhone && userbrowser === 'alipay' && qrinit">
                        <span class="header_list_label" style=" color: #999999;">现金奖励</span>
                        <div>赏金¥ {{profitEstimation}}</div>
                        <div class="header_list_text button" v-on:click="bindFn3">领取{{profitEstimation}}元现金</div>
                    </div>
                </div>
            </div>
            <!-- <div class="box" v-if="qrinit && userbrowser !== 'alipay'">
        <img @click.prevent="" class="salertiltle" src="/sui_assets/img/payment/salertitle.png" alt="">
        <div class="box_yuan_border"><p class="box_yuan">{{profitEstimation}}元人民币</p></div>
        <p class="time">─── 剩余时间 {{time}} ───</p>
        <div class="redbox">
          <img v-show="codeshow" class="qrcodeimg"  :src="qrcodeimg" @load="loadimg()">
          <img v-show="loadingshow" class="qrcodeimg" style="width: 3rem;height: 3rem;"  src="/sui_assets/img/payment/loading.gif" >
          <p>长按识别小程序码</br>立即领取</p>
        </div>         
      </div>-->

            <!-- 没钱 -->
            <div class="content1" v-if="rebates&&rebates.redEnvelope&&!rebates.total" style="position:relative" v-on:click.stop="jumpWXShow_coupon=true">
                <img :src="data.logo" class="shopImg" alt="" style="position:absolute;top:5px;left:50%;margin-left:-0.7rem;max-height: 1.5rem ;max-width: 5rem">
                <img src="/sui_assets/img/payment/payment_no_money1.png" style="height:155px;width:100%" />
            </div>
            <!-- 有钱 -->
            <div class="content" v-if="rebates&&rebates.total" v-on:click.stop="jumpWXShow_money=true">
                <div class="top" style="position:relative">
                    <img :src="data.logo" class="shopImg" alt="" style="position:absolute;top:5px;left:50%;margin-left:-0.7rem;max-height: 1.5rem ;max-width: 5rem ">
                    <p style="width:100%;text-align:center;position:absolute;top:8px;color:#fff; font-size: 30px;font-weight: 600;">{{rebates.total}}元现金红包</p>
                    <img src="/sui_assets/img/payment/red_payment1.png" alt="" style="height:155px;width:100%">
                </div>
            </div>

            <div class="box" v-if="qrinit">
                <div style="margin-top: 0.5rem;">
                    <img src="/sui_assets/img/payment/ninyou.png" alt style="width: 3rem;" />
                    <span class="money">{{profitEstimation}}</span>
                    <img src="/sui_assets/img/payment/yuanxianjin.png" alt style="width: 4.5rem;" />
                </div>
                <div>
                    <img src="/sui_assets/img/payment/dailingqu.png" alt style="height: 1.4rem;margin-top: 0.25rem;" />
                </div>
                <div class="box_info">30分钟内有效，不领就过期了</div>
                <div class="redbox" v-if="receiveBtn">
                    <img src="/sui_assets/img/payment/salerimg.png" alt style="width: 100%;" />
                    <div style="margin-top: 1.5rem;overflow: hidden;">
                        <div class="lingqu" v-on:click="alipop">立即领取</div>
                        <div class="lingquLine"></div>
                    </div>
                </div>
                <div class="redbox" v-if="!receiveBtn">
                    <img v-show="codeshow" class="qrcodeimg" :src="qrcodeimg" @load="loadimg()" />
                    <img v-show="loadingshow" class="qrcodeimg" style="width: 3rem;height: 3rem;" src="/sui_assets/img/payment/loading.gif" />
                    <p>
                        长按识别小程序码
                        <br />立即领取
                    </p>
                </div>
            </div>
        </div>

        <div class="benefit" v-if="data.redEnvelopes||data.lottery||data.commentBenefit">
            <div class="title">精彩活动</div>
            <div class="activity" :style="{backgroundImage: 'url('+ (data.redEnvelopes[0].picUrl||'/sui_assets/img/payment/activity1.jpg') +')'}" v-on:click="openFn()" v-if="data.redEnvelopes" style="line-height: 1.4">
                <div class="text-red">{{data.redEnvelopes[0].name}}</div>
                <div class="button">发红包给好友</div>

                <div class="addon" v-if="data.commentBenefit">自己还可获得{{data.commentBenefit[0].name}}</div>
            </div>
            <div class="activity" :style="{backgroundImage: 'url('+ (data.commentBenefit[0].picUrl||'/sui_assets/img/payment/activity1.jpg') +')'}" v-on:click="openFn()" v-else-if="data.commentBenefit">
                <div class="text-red">评论红包</div>
                <div v-if="data.commentBenefit[0].category == '1016'">
                    <div v-if="data.commentBenefit[0].couponCategory == '901'">
                        <span class="lg">￥{{data.commentBenefit[0].amount}}</span>代金券
                    </div>
                    <div class="lg" v-if="data.commentBenefit[0].couponCategory == '9011'">
                        <span class="lg">{{data.commentBenefit[0].name}}</span>
                    </div>
                    <div v-if="data.commentBenefit[0].couponCategory == '9021'||data.commentBenefit[0].couponCategory == '902'">
                        现价
                        <span class="lg">￥{{data.commentBenefit[0].currentAmount}}</span>
                        <span>价值￥{{data.commentBenefit[0].amount}}</span>
                        {data.commentBenefit[0].name}}
                    </div>
                    <div class="lg" v-if="data.commentBenefit[0].couponCategory == '903'">
                        <span class="lg">{{data.commentBenefit[0].amount}}折</span>
                        全场折扣券
                    </div>
                    <div v-if="data.commentBenefit[0].couponCategory == '9031'">
                        <div class="lg">{{data.commentBenefit[0].amount}}折</div>
                        {{data.commentBenefit[0].name}}
                    </div>
                    <div v-if="data.commentBenefit[0].couponCategory == '904'">
                        <div v-if="data.commentBenefit[0].amount">
                            价值
                            <span class="lg">￥{{data.commentBenefit[0].amount}}</span>
                        </div>
                        {{data.commentBenefit[0].name}}
                    </div>
                </div>
                <div v-if="data.commentBenefit[0].category !== '1016'">
                    <div>
                        价值
                        <span class="lg">￥{{data.commentBenefit[0].amount}}</span>代用币
                    </div>
                </div>
                <div>提交评论后获得</div>
                <div class="button">领红包</div>
            </div>

            <div class="activity" :style="{backgroundImage: 'url('+ (data.lottery[0].picUrl||'/sui_assets/img/payment/activity.jpg') +')'}" v-if="data.lottery" v-on:click="openFn()">
                <div class="text-red">
                    <div v-if="data.lottery[0].couponCategory == '901'&&data.lottery[0].category == '1016'">代金券</div>
                    <div v-if="data.lottery[0].category == '1017'">代用币</div>
                    <div v-else>{{data.lottery[0].name}}</div>
                </div>
                <div class="button">立即报名发红包赢大礼</div>
            </div>
        </div>

        <div class="modal" v-if="phone1 && userbrowser === 'alipay' && qrinit && alipaypop">
            <div class="modal-inner">
                <div class="modal-content2">
                    <div class="modal-title">
                        <span>{{profitEstimation}}</span>
                        <img src="/sui_assets/img/payment/title.png" />
                    </div>
                    <div class="whitebg">
                        <div class="top">
                            <div class="share">分享本店红包给好友，指定时间内邀请本地好友领取，即可获现金返现</div>
                            <!-- <div class="share2">好友到店更享好友消费额2%现金奖励</div> -->
                            <div class="share3">现金奖励将会自动发放至微信钱包，请留意微信通知</div>
                            <div class="share4">
                                <span style="color:red;">*</span>如未及时领取，可在会员中心再次领取
                            </div>
                        </div>
                        <div class="modal-phone">
                            <div class="phone">
                                <input type="tel" v-model="phone1.phone" placeholder="手机号码" maxlength="11" @blur="temporaryRepair()" />
                            </div>
                            <div class="validateCode">
                                <input type="tel" placeholder="验证码" v-model="phone1.validateCode" maxlength="6" @blur="temporaryRepair()" />
                            </div>
                            <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
                            <div v-on:click.stop="bindPhone1('1')" class="v-button2">立即领取</div>
                        </div>
                    </div>

                    <div class="close" v-on:click="alipaypop=''"></div>
                </div>
            </div>
        </div>

        <div class="modal" v-else-if="phone2 && userbrowser !== 'alipay'">
            <div class="modal-inner">
                <div class="modal-content">
                    <div class="top">
                        <!--<div class="card-box" v-bind:style="{backgroundImage:'url('+ vip.cardUrl+')'}">></div>-->
                        <div class="card-text">红包未到账提醒</div>
                        <div class="overflow">
                            <div class="coupon" v-for="item in data.strategy.got">
                                {{item.point}}{{item.name}}
                                <span v-if="item.count">x{{item.count}}</span>
                            </div>
                            <div class="coupon" v-if="data.strategy.points">{{data.strategy.points.point}}积分</div>
                            <div class="coupon" v-if="data.gratuity&&data.gratuity.benefits">
                                <span v-for="gift in data.gratuity.benefits">
                                    <span v-if="gift.category == '1017'">{{gift.amount}}元</span>
                                    {{gift.name}}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-phone">
                        <input type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()" />
                        <input type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" maxlength="6" @blur="temporaryRepair()" />
                        <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
                        <div v-on:click.stop="bindPhone1" class="v-button">立即领取</div>
                    </div>

                    <div class="close" v-on:click="phone2='',alipaypop=''"></div>
                </div>
            </div>
        </div>

        <!-- 支付完成,弹窗小程序  有钱-->
        <div class="modal jumpWX" v-show="jumpWXShow_money&&(rebates&&rebates.total)">
            <div class="modal-inner">
                <div class="modal-content" @click.stop="showQrCode1=true" style="position:relative;background: url(/sui_assets/img/payment/qian_tan_bg.png) 100% 100% no-repeat;background-size: contain;width: 294px;height: 391px;">
                    <!-- 还没点击领取红包的时候  显示 -->
                    <img :src="data.logo" class="shopImg" alt="" style="max-height: 1.5rem ;max-width: 5rem ;margin-top:23px;">
                    <p class="title" style="position:absolute;top:11%;font-size:30px;color:#fff;width:100%;text-align:center">{{rebates.total}}元现金红包</p>
                    <!-- 显示小程序码 -->
                    <img style="background:#fff;height: 104px;width: 104px;position: absolute;margin: 0px auto;border: 1px solid #fff;top: 43%;left: 50%; margin-left: -52px;" :src="rebates.rebateQrCode" alt="" v-if="showQrCode1">
                    <!-- 还没点击发红包的时候显示 -->

                    <!-- 立即领取按钮 -->
                    <!-- <img  v-if="!showQrCode1" src="/sui_assets/img/payment/ljlq_btn.png" class="shopImg" alt="" style="left: 50%;margin-left: -80px;height: 40px;width: 160px;position: absolute;bottom: 36px;"> -->

                    <!-- 识别小程序码, 马上发红包 -->
                    <img v-if="showQrCode1" src="/sui_assets/img/payment/red_tips_btn.png" class="shopImg" alt="" style="left: 50%;margin-left: -104px;height:22px;width: 208px;position: absolute;bottom: 36px;">
                </div>
                <div class="modal-title" style="min-height:5rem ;width: 294px;text-align:center" v-on:click.stop="jumpWXShow_money=false">
                    <p class="closeModal" style="right:50%;margin-right: -10px;border: 2px solid #fff;border-radius: 50%;padding: 10px;background-position-x: center;"></p>
                </div>
            </div>
        </div>
        <!-- 支付完成,弹窗小程序  有券-->
        <div class="modal jumpWX jumpWX_coupon" v-show="jumpWXShow_coupon&&(rebates&&rebates.redEnvelope&&!rebates.total)">
            <div class="modal-inner">
                <div class="modal-content" @click.stop="showQrCode1=true" style="position:relative;background: url(/sui_assets/img/payment/quan_tan_bg.png) 100% 100% no-repeat;background-size: contain;width: 294px;height: 391px;">
                    <!-- 还没点击领取红包的时候  显示 -->
                    <img :src="data.logo" class="shopImg" alt="" style="max-height: 1.5rem ;max-width: 5rem ;margin-top:23px;">
                    <!-- 显示小程序码 -->
                    <img style="background:#fff;height: 104px;width: 104px;position: absolute;margin: 0px auto;border: 1px solid #fff;top: 43%;left: 50%; margin-left: -52px;" :src="rebates.rebateQrCode" alt="" v-if="showQrCode1">
                    <!-- 还没点击发红包的时候显示 -->

                    <!-- 立即领取按钮 -->
                    <!-- <img  v-if="!showQrCode1" src="/sui_assets/img/payment/ljlq_btn.png" class="shopImg" alt="" style="left: 50%;margin-left: -80px;height: 40px;width: 160px;position: absolute;bottom: 36px;"> -->

                    <!-- 识别小程序码, 马上发红包 -->
                    <img v-if="showQrCode1" src="/sui_assets/img/payment/red_tips_btn.png" class="shopImg" alt="" style="left: 50%;margin-left: -104px;height:22px;width: 208px;position: absolute;bottom: 36px;">
                </div>
                <div class="modal-title" style="min-height:5rem ;width: 294px;text-align:center" v-on:click.stop="jumpWXShow_coupon=false">
                    <p class="closeModal" style="right:50%;margin-right: -10px;border: 2px solid #fff;border-radius: 50%;padding: 10px;background-position-x: center;"></p>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import linkPicUrl from './module/linkPicUrl/linkPicUrl'
export default {
    name: "payment",
    data() {
        return {
            codeShow1: null,
            linkPicUrl: '',
            data: "",
            phone1: "",
            phone2: "",
            qrcodeimg: "",
            profitEstimation: "",
            imgurl: "",
            canvasimg: "",
            qrinit: false,
            time: "",
            timer: "",
            show: false,
            userbrowser: "",
            existPhone: "",
            codeshow: false,
            loadingshow: true,
            i: 0,
            alipaypop: false,
            receiveBtn: true,
            salerId: "",
            jumpWXShow_money: false,
            jumpWXShow_coupon: false,
            rebates: {},
            qrCodeShow: false,
            qrCodeShow1: false,
            showQrCode1: false,
            showQrCode: false,
        };
    },
    components: {
        linkPicUrl
    },
    beforeCreate(){
     
    },
    created: function () {
   // 判断是否有pid
        if (this.$route.query.pid) {
            this.linkPicUrl = this.$cookie.get(this.$route.query.pid)
        }
        
      
    },
    mounted(){
          this.initFn();
        window.localStorage.removeItem('shangbin_amount')
        window.localStorage.removeItem('shangbin_nonParticationAmount')
        this.getRebates()
    },
    methods: {
        initFn: function () {
            this.$loading("加载中...");
            let _self = this;
            //分享
            let wxJson = {};
            wxJson.url = location.href;

            var browser = navigator.userAgent.toLowerCase();
            if (browser.match(/Alipay/i) == "alipay") {
                this.userbrowser = "alipay";
            } else if (browser.match(/MicroMessenger/i) == "micromessenger") {
                this.userbrowser = "micromessenger";
                this.$http.post("/auth/sign", wxJson).then(response => {
                    if (response.body.code == 200) {
                        // let result1 = response.body.result;
                        // result1.jsApiList = [
                        //     "hideMenuItems",
                        //     "onMenuShareAppMessage",
                        //     "onMenuShareTimeline"
                        // ];
                        // wx.config(result1);
                        // wx.ready(function () {
                        //     wx.hideMenuItems({
                        //         menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        //     });
                        //     wx.hideOptionMenu();
                        // });
                    }
                });
            } else {
                this.userbrowser = "other";
            }

            // if(this.qrinit == false){
            //   let qrcodetimer = setTimeout(function(){
            //     _self.getqrcode();
            //     clearTimeout(_self.qrcodetimer);
            //   },1000)
            // }
            let a = setInterval(function () {
                if (!_self.$route.query.oid || !_self.$route.query.order) {
                    clearInterval(a);
                }
                _self.$http
                    .get("/order/" + (_self.$route.query.oid || _self.$route.query.order))
                    .then(response => {
                        let data = response.body;
                        if (data.code == 200) {
                            clearInterval(a);
                            if (data.result.step < 3) {
                                _self.ajaxUrl("praise.html?pid=" + data.result.id);
                                return;
                            }
                            if (data.result.step == 3) {
                                _self.ajaxUrl("prize.html?cid=" + data.result.candidateId);
                            }
                            _self.data = data.result;

                            console.log(
                                _self.data.paymentModeText +
                                ", " +
                                !_self.phone1 +
                                ", " +
                                _self.qrinit
                            );
                            if (data.result.strategy && data.result.strategy.task) {
                                _self.getqrcode();
                            }
                        } else {
                            if (data.code == 404000) {
                                _self.$toast("正在查询支付结果");
                            } else {
                                alert(data.message);
                            }
                        }
                    });
            }, 1000);

            let timer = setTimeout(function () {
                _self.$loading.close();

                _self.show = true;

            }, 1500);
        },
        loadimg: function () {
            this.loadingshow = false;
            this.codeshow = true;
        },
        // 弹出券的弹窗
        getCoupon() {
            let that = this;
            that.jumpWXShow_coupon = true;

        },

        // 弹出有钱的弹窗
        getMoney() {
            let that = this;
            that.jumpWXShow_money = true;

        },
        // 获取红包信息
        getRebates: function () {
            var _self = this;
            _self.$http
                .get(
                    "/rebates/" + _self.$route.query.id
                )
                .then(response => {
                    let data = response.body;
                    if (data.code == 200) {
                        console.log('成功'+_self.linkPicUrl)
                        _self.rebates = data.result;

                        if (_self.linkPicUrl) {
                            console.log('有')
                            _self.codeShow1 = true
                            return;
                        } else {
                            console.log('这些')
                            if (_self.rebates && _self.rebates.redEnvelope && !_self.rebates.total) {
                                _self.jumpWXShow_coupon = true;
                            }
                            if (_self.rebates && _self.rebates.total) {
                                _self.jumpWXShow_money = true;
                            }
                        }

                    }
                })
        },
        getqrcode: function () {
            var _self = this;
            _self.$http
                .get(
                    "/saler/order/" + (_self.$route.query.oid || _self.$route.query.order)
                )
                .then(response => {
                    let data = response.body;
                    if (data.code == 200) {
                        this.qrinit = true;
                        this.salerId = data.result.id;
                        if (data.result.qrCodeUrl) {
                            this.qrcodeimg = data.result.qrCodeUrl;
                            // if(_self.userbrowser=="alipay"){
                            //   if(_self.$route.query.oid && _self.$route.query.order){
                            //     location.href = '/admin.html#/guide?&oid=' + _self.$route.query.oid + '&order=' + _self.$route.query.order;
                            //   }
                            // else if(_self.$route.query.order){
                            //     location.href = '/admin.html#/guide?&order=' + _self.$route.query.order;
                            //   }
                            // else if(_self.$route.query.oid){
                            //     location.href = '/admin.html#/guide?&oid=' + _self.$route.query.oid;
                            //   }

                            // }
                        } else {}

                        this.profitEstimation = data.result.profitEstimation;
                        this.existPhone = !data.result.existPhone;
                        if (!data.result.existPhone) {
                            _self.bindFn();
                        }
                        this.timer = setInterval(function () {
                            _self.countdown(data.result.expiredTime);
                        }, 1000);
                    } else {
                        this.qrinit = false;
                        let qrcodetimer = setTimeout(() => {
                            this.i = this.i + 1;
                            if (this.i >= 6) {
                                clearTimeout(qrcodetimer);
                            } else {
                                _self.getqrcode();
                            }
                        }, 1000);
                    }
                });
        },
        countdown: function (time) {
            var _self = this;
            var leftTime = new Date(time).getTime() - new Date().getTime();
            var d, h, m, s, ms;
            if (leftTime >= 0) {
                d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                h = Math.floor(leftTime / 1000 / 60 / 60);
                m = Math.floor((leftTime / 1000 / 60) % 60);
                s = Math.floor((leftTime / 1000) % 60);
                ms = Math.floor(leftTime % 1000);
                if (ms < 100) {
                    ms = "0" + ms;
                }
                if (s < 10) {
                    s = "0" + s;
                }
                if (m < 10) {
                    m = "0" + m;
                }
                if (h < 10) {
                    h = "0" + h;
                }
            } else {
                h = "00";
                m = "00";
                s = "00";
                clearInterval(_self.timer);
            }
            var filter = h + ":" + m + ":" + s;
            _self.time = filter;
        },
        html2image: function (source) {
            var that = this;
            html2canvas(source, {
                onrendered: function (canvas) {
                    var imageData = canvas.toDataURL(1);
                    console.log(imageData);
                    that.imgurl = imageData;
                },
                width: 300,
                height: 300,
                allowTaint: true
            });
        },
        temporaryRepair() {
            setTimeout(() => {
                const scrollHeight =
                    document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        },
        openFn: function () {
            this.ajaxUrl(
                "comment.html?oid=" + (this.$route.query.order || this.$route.query.oid)
            );
        },
        bindFn: function () {
            if (!this.phone1) {
                this.phone1 = {
                    text: "获取验证码",
                    able: true
                };
            }
        },
        bindFn3: function () {
            this.phone1 = {
                text: "获取验证码",
                able: true
            };
            this.phone2 = {
                text: "获取验证码",
                able: true
            };
        },
        alipop: function () {
            var _self = this;
            if (_self.existPhone) {
                this.bindFn();
                this.alipaypop = true;
                this.phone2 = true;
            } else {
                if (_self.userbrowser == "alipay") {
                    var jsonA = {
                        id: _self.salerId,
                        type: "ali"
                    };
                } else {
                    var jsonA = {
                        id: _self.salerId,
                        type: "wx"
                    };
                }

                this.$http.post("/saler", jsonA).then(response => {
                    let datas = response.data;
                    if (datas.code == 200) {
                        _self.receiveBtn = false;
                        if (datas.result && datas.result.token) {
                            this.$cookie.set("token", datas.result.token, {
                                expires: "30d"
                            });
                        }
                        if (_self.userbrowser == "alipay") {
                            if (_self.$route.query.oid && _self.$route.query.order) {
                                location.href =
                                    "/admin.html#/guide?&oid=" +
                                    _self.$route.query.oid +
                                    "&order=" +
                                    _self.$route.query.order;
                            } else if (_self.$route.query.order) {
                                location.href =
                                    "/admin.html#/guide?&order=" + _self.$route.query.order;
                            } else if (_self.$route.query.oid) {
                                location.href =
                                    "/admin.html#/guide?&oid=" + _self.$route.query.oid;
                            }
                        }
                        this.initFn();
                    } else {
                        this.$toast(datas.message);
                    }
                });
            }
        },
        bindFn1: function () {
            this.phone1 = {
                text: "获取验证码",
                able: true
            };
            (this.phone2 = true), (this.alipaypop = true);
        },
        validate1Fn() {
            if (!this.phone1.able) return;
            if (!this.phone1.phone || this.phone1.phone.length != 11) {
                this.$toast("手机格式不正确");
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
        bindPhone1(code) {
            console.log("bindPhone1");
            var _self = this;
            if (!this.qrinit) {
                if (
                    this.phone1.phone &&
                    this.phone1.validateCode &&
                    this.phone1.phone.length == 11 &&
                    this.phone1.validateCode.length == 6
                ) {
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
                            this.phone = "";
                            this.phone1 = "";
                            this.phone2 = "";
                            this.alipaypop = "";
                            if (data.result && data.result.token) {
                                this.$cookie.set("token", data.result.token, {
                                    expires: "30d"
                                });
                            }
                            this.$toast("操作成功");
                            if (code === "1") {
                                if (_self.$route.query.oid && _self.$route.query.order) {
                                    location.href =
                                        "/admin.html#/guide?&oid=" +
                                        _self.$route.query.oid +
                                        "&order=" +
                                        _self.$route.query.order;
                                } else if (_self.$route.query.order) {
                                    location.href =
                                        "/admin.html#/guide?&order=" + _self.$route.query.order;
                                } else if (_self.$route.query.oid) {
                                    location.href =
                                        "/admin.html#/guide?&oid=" + _self.$route.query.oid;
                                }
                            }
                            this.initFn();
                        } else {
                            this.$toast(data.message);
                        }
                    });
                } else {
                    this.$message(
                        "验证码错误",
                        "请检查验证码是否填写正确",
                        function () {}
                    );
                }
            } else {
                if (
                    this.phone1.phone &&
                    this.phone1.validateCode &&
                    this.phone1.phone.length == 11 &&
                    this.phone1.validateCode.length == 6
                ) {
                    if (_self.userbrowser == "alipay") {
                        var jsonA = {
                            id: this.salerId,
                            type: "ali"
                        };
                    } else {
                        var jsonA = {
                            id: this.salerId,
                            type: "wx"
                        };
                    }
                    jsonA.phone = this.phone1.phone;
                    jsonA.validateCode = this.phone1.validateCode;
                    this.$http.post("/saler", jsonA).then(response => {
                        let datas = response.data;
                        if (datas.code == 200) {
                            this.phone = "";
                            this.phone1 = "";
                            this.phone2 = "";
                            this.alipaypop = "";
                            _self.receiveBtn = false;
                            if (datas.result && datas.result.token) {
                                this.$cookie.set("token", datas.result.token, {
                                    expires: "30d"
                                });
                            }

                            if (code === "1") {
                                if (_self.$route.query.oid && _self.$route.query.order) {
                                    location.href =
                                        "/admin.html#/guide?&oid=" +
                                        _self.$route.query.oid +
                                        "&order=" +
                                        _self.$route.query.order;
                                } else if (_self.$route.query.order) {
                                    location.href =
                                        "/admin.html#/guide?&order=" + _self.$route.query.order;
                                } else if (_self.$route.query.oid) {
                                    location.href =
                                        "/admin.html#/guide?&oid=" + _self.$route.query.oid;
                                }
                            }
                            this.initFn();
                        } else {
                            this.$toast(datas.message);
                        }
                    });
                } else {
                    this.$message(
                        "验证码错误",
                        "请检查验证码是否填写正确",
                        function () {}
                    );
                }
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import "../sui_assets/scss/payment.scss";
</style>
