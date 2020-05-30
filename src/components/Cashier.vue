<template>
<div v-if="init.user">
    <div class="selfpay">

        <div class="top">
            <img class="avatar" v-if="init.user.avatarUrl" :src="init.user.avatarUrl">
            <div class="avatar" v-else></div>
            <div class="right" v-if="init.needShowCoupons > 0" style="float:left;vertical-align: middle;">
                <div class="level" v-if="init.memberGradeName">您是本店{{init.memberGradeName}},<router-link class="touser" :to="{ path: 'user', query: { id: $route.query.id }}">查看会员中心</router-link>
                </div>
                <div class="level" v-else>
                    <div class="touser2" v-on:click="addVip()"><img src="/sui_assets/img/selfPay/join.png" alt=""></div>
                </div>
                <div class="hascoupon" v-on:click="getCoupons()"><span>{{init.needShowCoupons}}</span></div>
            </div>
            <div class="right right2" v-else>
                <!-- <div class="level" v-if="init.memberGradeName"><span>您是{{init.memberGradeName}}，</span> <router-link class="touser" :to="{ path: 'user', query: { id: $route.query.id }}"><img src="/sui_assets/img/selfPay/my.png" alt=""></router-link> </div> -->
                <div class="level" v-if="init.memberGradeName">您是本店{{init.memberGradeName}},<router-link class="touser" :to="{ path: 'user', query: { id: $route.query.id }}">查看会员中心</router-link>
                </div>
                <div class="level" v-else>
                    <div class="touser2" v-on:click="addVip()"><img src="/sui_assets/img/selfPay/join.png" alt=""></div>
                </div>
            </div>
        </div>
        <div class="second-pay">
            <div class="fixed" v-if="init.existGratuity">
                <!--<img class="avatar" :src="init.logo" width="30">-->
                <!-- <span class="table"><span v-if="init.tableNo">【{{init.tableNo+ "桌"}}】</span><span
            v-else>【前台】</span></span> -->
                <span class="staff" v-if="flower.staffs" v-on:click="flowerStateFn()" :style="{'backgroundImage':'url('+ (flower.staffs[posts.index].avatarUrl||'/sui_assets/img/avatar.png')+')'}"></span>

                <div class="coupontxt" v-on:click="flowerStateFn()" v-for="item in flower.benefits">
                    <span style="color:black;">评价得</span>
                    <span>{{item.name}}</span>
                </div>
            </div>

            <div class="amounts">
                <div class="num1" v-if="init.preCheckData.state == 1">
                    消费金额</br>
                    <div class="part"><span class="dollar">￥</span><span>{{init.preCheckData.amount}}</span></div>
                    <div class="nopart" v-if="init.preCheckData.nonParticationAmount > 0">(不计优惠项¥{{init.preCheckData.nonParticationAmount}})</div>
                    <div class="btn-green" @touchstart.stop.prevent="submitFn">
                        完成优惠买单
                    </div>
                </div>
                <div class="num1 num2" v-else-if="init.preCheckData.state == -1">
                    订单已支付完成
                </div>
                <div class="num1 num2" style="font-size : 1rem" v-else>
                    订单已超时,请重新扫描桌台二维码
                </div>
            </div>
            <!-- <div class="tips">
          <img src="/sui_assets/img/selfPay/shagnbin.png" alt="">
        </div>   -->
        </div>
        <!-- 首页广告 -->
        <div class="ad-show" v-for="(item,index) in ads" v-on:click="replaceUrl(item)" v-if="ads" v-show="index==0">
            <!-- <div style="border: 1px solid #e8e8e8;overflow : hidden"> -->
            <div class="cbg" :style="{backgroundImage: 'url('+ (item.transversePicUrl||'') +')'}">
            </div>
        </div>
        <div class="ad-show" v-else>

        </div>
        <!-- </div> -->
        <div class="tips">
            <img src="/sui_assets/img/selfPay/shagnbin.png" alt="">
        </div>
        <div style="height: 3rem"></div>
        <!---->
        <div class="bottom">
            <div class="flower-bg opacity" v-if="flower.staffs && flower.state != 'close'&& this.showflower">
                <!-- 已评价 -->
                <div :class="closeAnimat ? 'flower closezoom' : 'flower zoom'" v-if="flower.already">

                    <div class="already">
                        <div v-if="posts.satisfied">
                            <!-- <div class="alreadybg">
                  <img @click.prevent="" class="alreadyimg" :src="benefitsPic" alt="">
                  <img @click.prevent="" class="modalimg" src="/sui_assets/img/selfPay/modalimg2.png" alt="">
                </div> -->
                            <div class="already_title"><img style="margin-top:1rem;height:2rem;" src="/sui_assets/img/selfPay/ganxie.png" alt=""></div>
                            <div style="margin-top: 1rem;">
                                <div style="margin-top:1rem;">
                                    <div class="avatar" :style="{'backgroundImage':'url('+ (flower.staffs[posts.index].avatarUrl||'/sui_assets/img/avatar.png')+')'}"></div>
                                </div>
                                <div class="nickname">{{flower.staffs[posts.index].nickname}}</div>
                            </div>
                            <img @click.prevent="" class="alreadyimg" :src="benefitsPic" alt="">
                            <div class="already_text">{{benefitsname}}</div>
                            <div class="already_content">获赠礼品买单后自动到账</div>
                            <div class="closebtn" v-on:click="flowerStateFn('close')"><img src="/sui_assets/img/selfPay/closetext.png" alt=""></div>
                        </div>
                        <div v-else>
                            <div class="already_title"><img src="/sui_assets/img/selfPay/tucao2.png" alt=""></div>
                            <div style="margin-top: 1rem;">
                                <div>
                                    <div class="avatar" :style="{'backgroundImage':'url('+ (flower.staffs[posts.index].avatarUrl||'/sui_assets/img/avatar.png')+')'}"></div>
                                </div>
                                <div class="nickname">{{flower.staffs[posts.index].nickname}}</div>
                            </div>
                            <div class="sorry">非常抱歉给您带来不好的体验，我们将根据您的反馈及时整改</div>
                            <div class="decs">
                                <div class="dec active" v-for="item in flower.tags">{{item.content}}
                                </div>
                            </div>
                            <div class="closebtn" v-on:click="flowerStateFn('close')"><img src="/sui_assets/img/selfPay/closetext.png" alt=""></div>
                        </div>
                    </div>

                    <!-- <div class="header" style="height : 4rem ;border-bottom: 0px solid #d9d9d9">
              <div class="title" style="color : #fff">感谢您对我的评价</div>
              <div class="pull-right" v-on:click="flowerStateFn('close')"></div>
            </div>
            <div class="content1">
              <div class="avatar"
                   :style="{'backgroundImage':'url('+ (flower.staffs[posts.index].avatarUrl||'/sui_assets/img/avatar.png')+')'}"></div>
              <div class="nickname">{{flower.staffs[posts.index].nickname}}</div> -->
                    <!-- <div class="thanks" style="color : #fff">感谢您对我的评价</div> -->
                    <!-- <div class="labels">
                <div class="label active" v-if="posts.satisfied == true"><span class="up"></span>满意</div>
                <div class="label active" v-else><span class="up down"></span>不满意</div>
              </div>
              <div class="decs">
                <div class="dec active"
                     v-for="item in flower.tags">{{item.content}}
                </div>
              </div>
            </div>
            <div class="behind">
              <div class="submit" v-on:click="flowerStateFn('close')">关闭</div>
            </div> -->
                </div>
                <!-- 未评价 -->

                <div :class="closeAnimat ? 'flower closezoom' : 'flower zoom'" v-else-if="!flower.state && !praise">
                    <!--<div class="close" v-on:click="flowerStateFn('close')"></div>-->
                    <div class="content1" v-if="!tucao">
                        <div class="title"><img src="/sui_assets/img/selfPay/titletext.png" alt=""></div>
                        <div class="avatarbg">
                            <div class="avatar" v-on:click="flowerStateFn('other')" :style="{'backgroundImage':'url('+ (flower.staffs[posts.index].avatarUrl||'/sui_assets/img/avatar.png')+')'}"></div>
                        </div>
                        <div><span class="evaluate">请评价我的服务(点击头像切换)</span></div>
                        <div class="nickname">{{flower.staffs[posts.index].nickname}}</div>
                        <div class="box">
                            <div class="give" v-on:click="setSatisfied(true)">
                                <div>
                                    <img @click.prevent="" class="box_img" :src="benefitsPic" alt="">
                                </div>
                                <p class="box_title"><img src="/sui_assets/img/selfPay/praisetext.png" alt=""></p>
                                <div class="box_text">{{benefitsname}}</div>
                            </div>
                            <div class="give" v-on:click="setSatisfied(false)">
                                <div>
                                    <img @click.prevent="" class="box_img" src="/sui_assets/img/selfPay/tucao.png" alt="">
                                </div>
                                <p class="box_title"><img src="/sui_assets/img/selfPay/tucaotext.png" alt=""></p>
                            </div>
                        </div>
                    </div>
                    <div class="content1 content2" v-if="tucao">
                        <img class="leftback" v-if="leftback" @click.prevent="back()" src="/sui_assets/img/selfPay/leftback2.png" alt="">
                        <div class="title"><img src="/sui_assets/img/selfPay/tucaotiltle.png" alt=""></div>
                        <div class="content2_text">非常抱歉给您带来不好的体验，我们将根据您的反馈及时整改</div>
                        <div class="decs" style="margin-top:3.5rem;">
                            <div class="dec" v-show="!posts.satisfied" :class="item.check?'active':''" v-on:click="chooseTagFn(item)" v-for="item in flower.negative">{{item.content}}
                            </div>
                            <div class="dec" v-show="posts.satisfied" :class="item.check?'active':''" v-on:click="chooseTagFn(item)" v-for="item in flower.positive">{{item.content}}
                            </div>
                        </div>
                        <div class="submitbtn" v-on:click="sendFlowerFn"><img src="/sui_assets/img/selfPay/nimin.png" alt=""></div>
                    </div>

                    <img v-if="!tucao" class="closeflower" v-on:click.prevent="closeFlower" src="/sui_assets/img/selfPay/close2.png" alt="">

                </div>

                <!-- <div class="praise" v-if="praise && !flower.already">
              <div class="praise_title"><img src="/sui_assets/img/selfPay/ganxie.png" > </div>
                <div class="praise_text">获赠礼品买单后自动到账</div>
          </div> -->

                <!-- <div :class="closeAnimat ? 'flower closezoom' : 'flower zoom'" v-else-if="false">
            <!--<div class="close" v-on:click="flowerStateFn('close')"></div>-->
                <!-- <div class="content1">
              <div class="pull-right" v-on:click="flowerStateFn('close')"></div>  
              <div class="nickname">{{flower.staffs[posts.index].nickname}}</div>                       
               <div class="avatar" v-on:click="flowerStateFn('other')"
                   :style="{'backgroundImage':'url('+ (flower.staffs[posts.index].avatarUrl||'/sui_assets/img/avatar.png')+')'}"></div>
                <div class="addon">点击头像切换专属服务员</div>
              <div class="labels">
                <div class="label" :class="posts.satisfied?'active':''" v-on:click="setSatisfied(true)">
                  <span class="up"></span>
                  <span style="vertical-align : middle">满意, 送{{flower.gratuity.name}}</span>  -->
                <!-- <img class="flowericon2" src="../sui_assets/img/addVip/icon.svg" alt=""> -->
                <!-- <span class="flowericon"></span> -->
                <!-- <span  style="display: inline-block; background: url(../../../sui_assets/img/addVip/icon.svg) center no-repeat; background-size: 55px; background-position: -2px -69px;width: 14px;height: 14px;"></span> -->
                <!--</div>
                <div class="label" :class="posts.satisfied?'':'active'" v-on:click="setSatisfied(false)">
                  <span class="up down"></span>
                  <span style="vertical-align : middle">不满意, 吐槽</span>
                </div>
              </div>
              <div class="decs">
                <div class="dec" v-show="!posts.satisfied" :class="item.check?'active':''"
                     v-on:click="chooseTagFn(item)"
                     v-for="item in flower.negative">{{item.content}}
                </div>
                <div class="dec" v-show="posts.satisfied" :class="item.check?'active':''"
                     v-on:click="chooseTagFn(item)"
                     v-for="item in flower.positive">{{item.content}}
                </div>
              </div>
            </div>

            <div class="behind">
              <div  v-show="posts.satisfied" class="newgift">
                <div class="thanks"></div>
                <!-- <div class="coupon" v-on:click="$couponShow($event,item)" v-for="item in flower.benefits">
                  <div>{{item.name}}</div>
                </div> -->
                <!-- </div>
              <div  v-show="!posts.satisfied" class="newgift1">
                <div class="thanks">很抱歉让您有了不愉快的体验<br/>我们会努力做的更好!</div> -->
                <!-- <div class="coupon" v-on:click="$couponShow($event,item)" v-for="item in flower.benefits">
                  <div>{{item.name}}</div>
                </div> -->
                <!-- </div>
              <div  style="color: #b6b6b6; font-size: .6rem;font-weight: normal;font-style: normal; font-family: PingFangSC;margin-top:1.2rem;">
                您的反馈将实时通知给店员和老板
              </div>
              <div class="submit" v-on:click="sendFlowerFn">
                <div v-if="posts.satisfied"><span  style="font-family: PingFangSC; font-size: 16px; font-weight: 500; font-style: normal;">满意, 鼓励一下</span><span class="bigflow"></span></div>
                <span v-else style="font-family: PingFangSC; font-size: 16px; font-weight: 500; font-style: normal;">提交</span>
              </div> -->
                <!-- <div class="gift" v-show="posts.satisfied">
                <div class="transform">
                  送{{flower.staffs[posts.index].gender=='2'?'她':'他'}}{{flower.countLimit}}{{flower.gratuity.unit}}{{flower.gratuity.name}}，回馈给您：<span
                  class="blue-text"
                  v-on:click="$couponShow($event,item)"
                  v-for="item in flower.benefits">{{item.name}} </span>
                </div>
              </div> -->
                <!-- </div>
          </div> -->

                <!-- <div class="submitpop" v-show="submitpop">
            <div class="txt">
              <div class="flowertit">感谢您的小红花鼓励</div>
              <div class="flowercontent" v-on:click="$couponShow($event,item)" v-for="item in flower.benefits">
                <div>回赠您{{item.name}}</div>
              </div>
              <div class="coupon" v-on:click="$couponShow($event,item)" v-for="item in flower.benefits">
                  <div>{{item.name}}</div>
              </div>
              <div class="instraction">*代金券将在买单完成后发放至您的账户</div>
            </div>
            <div class="knowbtn" @click="closeSubPop()">我知道了</div>
          </div> -->
                <!-- 其他服务员 -->
                <div class="flower" v-if="flower.state == 'other'" style="background: rgb(255, 255, 255);">
                    <div class="header">
                        <div class="title">请选择您的服务员</div>
                        <div class="pull-right back" v-on:click="flowerStateFn()"></div>
                    </div>
                    <div class="content">
                        <div class="staff">
                            <div class="item" v-for="(item,key) in flower.staffs" v-on:click="choosedStaffFn(key)">
                                <span class="avatar" :style="{'background':'url('+(item.avatarUrl||'/sui_assets/img/avatar.png')+') center center no-repeat/102%'}"></span>
                                <span class="nickname">{{item.nickname}}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <!-- 优惠券 -->
        <div id="all" style="text-align: center">
            <div class="over-bg" style="padding: 0" v-if="visible.couponModal">
                <div v-if="visible.timer&&coupons&&coupons.length>1" class="indirect">
                    <div>左右滑动卡片查看 ({{visible.timer}}s)</div>
                </div>
                <div class="info">
                    下列优惠券可立即出示使用
                </div>
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(coupon,index) in coupons" :key="index">
                        <div class="coupons-item">
                            <div class="a4001" v-bind:class="'a'+coupon.state" style="padding: 22px;position: absolute;top: -.1rem;left: 0"></div>
                            <div class="addon2" v-if="coupon.state!='4001'" v-on:click.stop="cancel(coupon.id)">放弃使用本券</div>

                            <div class="coupon-item">
                                <div class="big-title">{{coupon.name}}</div>
                                <div class="blue-border">
                                    <div v-bind:id="'code'+index"></div>
                                    <div class="" style="padding-top: 2px;font-size: 14px">{{coupon.code}}</div>
                                </div>
                                <div class="coupons-detail">
                                    <div class="item">
                                        <div class="left">价值：</div>
                                        <div class="right">
                                            <span v-if="coupon.category=='903'||coupon.category=='9031'">
                                                {{coupon.amount}}<span style="font-size: 14px">折</span>
                                            </span>
                                            <span v-else-if="coupon.category=='904'">
                                                <span v-if="coupon.amount">{{coupon.amount}}元</span>
                                            </span>
                                            <span v-else>
                                                {{coupon.currentAmount?('原价：'+ coupon.amount +'元，现价'+ coupon.currentAmount):coupon.amount}}元
                                            </span>
                                        </div>
                                    </div>
                                    <div class="item">
                                        <div class="left">使用条件：</div>
                                        <div class="right">{{coupon.useStrategy}}</div>
                                    </div>
                                    <div class="item">
                                        <div class="left">有效期：</div>
                                        <div class="right">{{coupon.times}}</div>
                                    </div>
                                    <div class="item">
                                        <div class="left">详情：</div>
                                        <div class="right">
                                            <div v-for="content in coupon.content">{{content}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination" id="swiper-pagination"></div>
                </swiper>
                <div class="md-close" v-on:click="closeCouponModal"></div>
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
                            <div class="card-box" v-bind:style="{backgroundImage:'url('+ vip.cardUrl+')'}"></div>
                            <div class="card-text">欢迎新人，送您一张会员卡<br>希望您常来光顾！</div>
                        </div>
                        <div class="modal-phone">
                            <input type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()">
                            <input type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" maxlength="6" @blur="temporaryRepair()">
                            <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
                            <div v-on:click.stop="bindPhone1" class="v-button">领取会员卡</div>
                        </div>

                        <div class="close" v-on:click="closeAddVip()"></div>
                    </div>
                </div>
            </div>
            <!--无手机号，有新人礼-->
            <div class="modal addVip" v-else>
                <div class="modal-inner">
                    <div class="modal-content">
                        <div class="usable" v-if="vip.todayUsableNum">领取后，将有 {{vip.todayUsableNum}} 张优惠券可立即使用</div>
                        <div class="usable2" v-else></div>
                        <div class="overflow">
                            <div v-if="vip.benefits" v-for="(coupon,key) in vip.benefits" :key="key" style="position : relative">

                                <div class="v-coupon" v-if="coupon.category == '1016' " :class="coupon.todayUsable?'todayUsable':''">

                                    <div class="v-item">
                                        <div class="left" v-if="coupon.hasOwnProperty('amount')&&coupon.amount != 0">
                                            <span v-if="coupon.couponCategory=='903'||coupon.couponCategory=='9031'">
                                                {{coupon.amount}}折
                                            </span>
                                            <span v-else-if="coupon.couponCategory=='902'||coupon.couponCategory=='9021'"><span class="dollar"></span>{{+coupon.amount + +coupon.currentAmount}}</span>
                                            <span v-else><span class="dollar"></span>{{coupon.amount}}</span>
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
                            <input type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()">
                            <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
                            <input type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" id="validate" maxlength="6" @blur="temporaryRepair()">
                            <div id="bindPhone" v-on:click.stop="bindPhone1" class="v-button">立即领取</div>
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

                    <div class="new" ref="new"></div>
                    <div class="down" ref="down"></div>
                    <div class="information">
                        <div class="info" ref="info">
                            <div class="content">
                                <div v-for="(coupon,key) in vip.benefits" :key="key">
                                    <!-- <span>{{coupon.name}}</span>
                    <span v-if="coupon.category =='1015'">{{coupon.amount}}积分</span> -->
                                    <div class="v-coupon" v-if="coupon.category == '1016' ">

                                        <div class="v-item">
                                            <div class="left" v-if="coupon.hasOwnProperty('amount')&&coupon.amount != 0">
                                                <span v-if="coupon.couponCategory=='903'||coupon.couponCategory=='9031'">
                                                    {{coupon.amount}}折
                                                </span>
                                                <span v-else-if="coupon.couponCategory=='902'||coupon.couponCategory=='9021'"><span class="dollar"></span>{{coupon.currentAmount}}</span>
                                                <span v-else><span class="dollar"></span>{{coupon.amount}}</span>
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
                    <div class="top" ref="top">
                        <div class="card-box" v-bind:style="{backgroundImage:'url('+ vip.cardUrl+')'}"></div>
                        <div class="card1" ref="card">恭喜获赠会员卡</div>
                        <div class="card-line"></div>
                        <div class="card-text">打开红包查看权益<br>
                            使用自助买单可自动抵用优惠
                        </div>
                        <div v-if="!vip.benefits" class="v-button" v-on:click="refresh()">我 知 道 了</div>
                        <div v-else v-on:click="open()" class="v-button">打开红包</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="toastPop" class="toastPop">即将为您计算优惠</div>
</div>
</template>

<script>
import Vue from 'vue'
import 'swiper/dist/css/swiper.css'
import wcKeyboard from './wcKeyboard/KeyboardInput.vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.use(VueAwesomeSwiper)

export default {
    name: 'SelfPay',
    components: {
        wcKeyboard
    },
    data() {
        return {
            data: "",
            submitpop: false,
            closeAnimat: false,
            view: {},
            visible: {
                coupon: false,
                couponModal: false,
                timer: 3,
                count: 4
            },
            post: {
                amount: '',
                nonParticationAmount: ''
            },
            coupons: [],
            init: {},
            swiper: "",
            ads: [],
            vip: "",
            tucao: false,
            praise: false,
            benefitsname: '',
            leftback: true,
            toastPop: false,
            lock: true,
            swiperOption: {
                pagination: {
                    el: '#swiper-pagination',
                    clickable: true,
                },
                spaceBetween: 30,
                centeredSlides: true,
            },
            phone1: "",
            flower: {},
            posts: {
                satisfied: true,
                index: 0
            }, //评赏
            // qrcode: "",
            showflower: true,
            num: 0
        }
    },
    created() {
        if (this.$cookie.get("flower_take")) {
            this.flower.state = "close"
            this.showflower = false
        }
        if (window.localStorage.getItem("postsIndex")) {
            let oldtimestamp = window.localStorage.getItem("timestamp");
            let newtimestamp = Date.parse(new Date());
            console.log(newtimestamp - oldtimestamp);
            if (oldtimestamp && newtimestamp - oldtimestamp > 300000) {
                window.localStorage.removeItem("postsIndex");
                this.posts.index = 0;
                console.log("重置index" + this.posts.index)
            } else {
                this.posts.index = window.localStorage.getItem("postsIndex");
                console.log("获取index" + this.posts.index)
            }

        }
        this.initFn();
    },
    methods: {
        initFn() {
            let _self = this;
            let para = {};
            if (window.localStorage.getItem("satisfieds") !== null) {
                this.posts.satisfied = window.localStorage.getItem("satisfieds");
            } else {
                this.posts.satisfied = true
                window.localStorage.setItem("satisfieds", 'true');
            }

            console.log(this.posts.satisfied)
            if (this.posts.satisfied === 'true') {
                this.posts.satisfied = true
            }
            if (this.posts.satisfied === 'false') {
                this.posts.satisfied = false
            }

            para.type = this.getVersion() == "WXPAY" ? "wx" : "ali";
            if (this.$route.query.d) {
                para.tableId = this.$route.query.d;
            }

            if (this.$route.query.cashier) {
                para.cashierOrderId = this.$route.query.cashier;
            }

            // this.$http.get("/shop/" + this.$route.query.id + '/cashier', {key: para}).then(response => {
            this.$http.get("/shop/" + this.$route.query.id + '/cashier', {
                key: para
            }).then(response => {
                let data = response.body;

                if (data.code == 200) {

                    _self.setTitle(data.result.brandName + "(" + data.result.name + ")");
                    if (data.result.user) {

                        localStorage.setItem("userId", data.result.user.id);
                    }

                    _self.init = data.result;
                    if (_self.init.preCheckData) _self.post = _self.init.preCheckData;
                    //有进行中的自助买单

                    if (_self.init.order) {
                        _self.$confirm('您' + (_self.init.order.tableNo ? ("在" + _self.init.order.tableNo + "号桌") : "") + '有个买单未完成,放弃这笔交易？', function () {
                            _self.$http.post("/check/" + _self.init.order.orderId + "/cancel", {}).then(response => {
                                let data1 = response.body;
                                if (data1.code != 200) {
                                    _self.$toast(data1.message);
                                    if (data1.code == 403108) {
                                        setTimeout(function () {
                                            let json = _self.$route.query;
                                            json.oid = _self.init.order.orderId;
                                            _self.$router.push({
                                                path: '/strategy',
                                                query: json
                                            });
                                        }, 200)
                                    } else {
                                        _self.initFn();
                                    }
                                } else {
                                    _self.initFn();
                                    _self.lock = false;
                                }
                            });
                        }, function () {
                            let json = _self.$route.query;
                            json.oid = _self.init.order.orderId;
                            _self.$router.push({
                                path: '/strategy',
                                query: json
                            });
                        }, "确定放弃", "继续买单");
                    } else {
                        _self.$nextTick(function () {
                            _self.socket();

                            /*----------------------*/
                            //买单状态
                            this.$http.get("/activities/shop/" + this.$route.query.id, {
                                key: para
                            }).then(response => {
                                let data1 = response.body;
                                if (data1.code == 200) {
                                    _self.init = JSON.parse((JSON.stringify(_self.init) + JSON.stringify(data1.result)).replace(/}{/, ','));
                                    if (_self.init.order) {
                                        _self.init.existGratuity = false
                                    } else if (_self.init.existRemindBenefit) {
                                        //有新人礼
                                        _self.addVip();
                                    } else if (_self.init.needShowCoupons > 0) {
                                        //有券
                                        _self.getCouponsModal();
                                    } else if (_self.init.existGratuity) {
                                        //有打赏
                                        _self.getFlower();
                                    } else {
                                        if (_self.lock && _self.init.preCheckData != 1) {
                                            _self.submitFn();
                                        }

                                    }
                                    //ads
                                } else {
                                    // location.href = "error.html";
                                }
                            });
                            // 封面
                            this.$http.get("/activities/shop/" + this.$route.query.id + "/placards").then(response => {
                                let data = response.body;
                                if (data.code == 200) {
                                    let _self = this;
                                    _self.ads = data.result;
                                }
                            });
                            /*----------------------*/
                        })
                    }
                } else {
                    alert(data.message);
                }
            });

        },
        back() {
            this.tucao = false
        },
        setSatisfied(satisfied) {
            window.localStorage.setItem("satisfieds", satisfied);
            this.posts.satisfied = satisfied;
            this.satisfied = satisfied;
            if (satisfied) {
                this.sendFlowerFn();
            } else {
                this.tucao = true;
            }
        },
        choosedStaffFn(index) {
            this.posts.index = index;
            this.$set(this.flower, 'state', '');
        },
        opneToast() {
            var that = this
            if (that.init.preCheckData.state != 1) {
                return false;
            }
            that.submitFn();
            // that.toastPop = true
            // var timer = setTimeout(()=>{
            //   that.toastPop = false
            //   that.submitFn();
            //   clearTimeout(timer)
            // },3000)
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
                            this.posts.satisfied = data.result.satisfied
                            for (let i in arr) {
                                if (data.result.commentedTags && data.result.commentedTags.includes(arr[i].id)) {
                                    data.result.tags.push(arr[i]);
                                }
                            }
                        }
                        _self.flower = data.result;
                        _self.flower.once = true;
                        if (data.result.benefits) {
                            _self.benefitsname = data.result.benefits[0].name
                            if (data.result.benefits[0].picUrl) {
                                _self.benefitsPic = data.result.benefits[0].picUrl
                            } else {
                                _self.benefitsPic = '/sui_assets/img/selfPay/default.png'
                            }
                        }
                    }
                });
            }
        },
        flowerStateFn(state) {
            /* if (state == 'close' && !this.flower.once) {
               this.flower.once = trnue;
               this.addVip();
             }*/
            let that = this;
            if (state == "close") {
                this.closeAnimat = true;
                let cleartime = setTimeout(function () {
                    that.$set(that.flower, 'state', state);
                    clearTimeout(cleartime);
                }, 500)
                this.tucao = false
                this.$cookie.set("flower_take", true, {
                    "expires": '1m'
                }); //设置五分钟内不会再次出现该弹框
            } else {
                this.closeAnimat = false;
                this.$set(this.flower, 'state', state);
                this.showflower = true;
            }
        },
        closeFlower() {
            var that = this
            this.closeAnimat = true;
            let cleartime = setTimeout(function () {
                that.$set(that.flower, 'state', "close");
                clearTimeout(cleartime);
            }, 500)
            this.tucao = false
            this.$cookie.set("flower_take", true, {
                "expires": '1m'
            }); //设置五分钟内不会再次出现该弹框
            this.opneToast();
        },
        chooseTagFn(item) {
            this.$set(item, 'check', !item.check);
        },
        sendFlowerFn() {
            let json = {
                count: 1
            };
            json.activityId = this.flower.activityId;
            json.satisfied = this.posts.satisfied;
            json.staffId = this.flower.staffs[this.posts.index].id;
            json.gratuityId = this.flower.gratuity.id;
            json.tableId = this.$route.query.d;
            json.tags = [];
            let tags = [];
            if (json.satisfied == true) {
                tags = this.flower.positive;
            } else {
                tags = this.flower.negative;
            }
            for (let i in tags) {
                if (tags[i].check) {
                    json.tags.push(tags[i].id);
                }
            }
            this.$http.post("/gratuity/shop/" + this.$route.query.id + "/staff", json).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    this.leftback = false;
                    //改变视图
                    let _self = this;
                    let timer = setTimeout(() => {
                        _self.flowerStateFn('close')
                        _self.$set(this.flower, 'state', 'x');
                        _self.getFlower();
                    }, 3000)
                    // this.flower.already = true;
                    this.flower.tags = [];
                    for (let i in tags) {
                        if (tags[i].check) {
                            this.flower.tags.push(tags[i]);
                        }
                    }
                    //
                    let timestamp = Date.parse(new Date());
                    window.localStorage.setItem("timestamp", timestamp);
                    window.localStorage.setItem("postsIndex", this.posts.index);
                    console.log("设置index" + this.posts.index)
                    if (json.satisfied) {
                        let bet = ""
                        for (let j in this.flower.benefits) {
                            bet += this.flower.benefits[j].name + ",";
                        }
                        bet = bet.slice(0, -1);
                        _self.praise = true;
                        // this.submitpop = true;
                        // this.$message("感谢您的评价", bet + "将在买单后发放<br>到您的账户", function () {
                        // });
                    } else {
                        clearTimeout(timer)
                        // this.$message("感谢您的评价", "我们会重视您本次的反馈", function () {
                        //   _self.closeSubPop();
                        // });
                    }
                    this.opneToast();
                } else {
                    this.$toast(data.message);
                }
            });

        },
        closeSubPop() {
            this.$set(this.flower, 'state', 'close');
            this.flower.already = true;
            this.submitpop = false;
        },
        //添加新人礼会员 获取门店升级赠送详情
        addVip() {
            let _self = this;
            this.$http.get("/remind/guest/" + this.$route.query.id).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    if (data.result.needPhone) {
                        this.vip = data.result;
                        this.phone1 = {
                            text: '获取验证码',
                            able: true
                        };
                    } else {
                        this.$http.post("/membership", {
                            id: this.$route.query.id
                        }).then(response => {
                            let data = response.body;
                            if (data.code == 200) {
                                this.$http.get("/remind/guest/" + this.$route.query.id + '/result').then(response => {
                                    this.vip = response.body.result;
                                });
                            } else {
                                // location.href = "error.html#3"
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
            document.body.removeAttribute("class", "activebody");
            if (this.init.existGratuity) {
                this.getFlower();
            }
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
                    this.ajaxUrl('couponActivity.html?aid=' + item.activityId);
                    break;
                    //套餐
                case "6015":
                    this.ajaxUrl('mealActivity.html?aid=' + item.activityId);
                    break;
                    //充值
                case "6002":
                    this.$router.push({
                        path: '/charge',
                        query: this.$route.query
                    });
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
        textFn(obj) {
            let str = "";
            for (let i in obj) {
                if (i == 'period' || i == 'shops' || i == 'time') {
                    str += obj[i] + ";"
                }
            }
            return str;
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
                    } else {
                        this.$toast(data.message);
                    }
                });
            }
        },
        inputFn: function (value) {
            this.post.amount = value;
        },
        nonPartsFn: function (value) {
            this.post.nonParticationAmount = value;
        },
        closeCouponModal: function () {
            this.visible.couponModal = false;
            this.$cookie.set(this.$route.query.id + "modal", true, {
                "expires": "30m",
                "path": "/"
            });
            if (document.getElementsByClassName("a4005").length) {
                this.init.couponCount = document.getElementsByClassName("a4005").length;
            } else {
                delete this.init.couponCount;
                // this.init.needShowCoupons = 1;
            }
            if (this.init.existRemindBenefit) {
                this.addVip();
            } else if (this.init.existGratuity && !this.flower.once) {
                this.getFlower();
            }
        },
        cancel: function (id) {
            let _self = this;
            let re = confirm("确认放弃后您需要重新出示给店员才可使用");
            if (re) {
                this.$http.delete("/check/shop/" + this.$route.query.id + "/coupons/" + id).then(response => {
                    let data = response.data;
                    if (data.code == 200) {
                        _self.getCouponData();
                    } else {
                        alert(data.message);
                    }
                })
            }
        },
        socket: function () {
            let _self = this;
            setTimeout(function () {
                let a;
                let uri = "wss://" + location.hostname + "/websocket?id=" + _self.init.user.id;
                let websocket;
                websocket = new WebSocket(uri);
                websocket.onopen = function () {
                    a = setInterval(function () {
                        websocket.send("1");
                    }, 30000)
                };
                websocket.onmessage = function (evt) {
                    console.log(evt);
                    if (evt.data == "success") return false;
                    let data = JSON.parse(evt.data);
                    data.orderId && _self.$cookie.set("order_id", data.orderId, {
                        "path": "/"
                    });
                    let json = _self.$route.query;
                    if (data.orderId) json.oid = data.orderId;
                    switch (data.type) {
                        case "500000":
                            _self.ajaxUrl("waiting.html");
                            break;
                        case "500042":
                            _self.$toast("支付完成");
                            _self.$router.push({
                                path: '/payment',
                                query: json
                            });
                            break;
                        case "500051":
                            alert("买单被取消");
                            _self.initFn();
                            break;
                        case "500052":
                            alert("pad下线");
                            _self.initFn();
                            break;
                        case "500053":
                            alert("买单请求超时未处理被取消");
                            _self.initFn();
                            break;
                        case "500054":
                            _self.$router.push({
                                path: '/strategy',
                                query: json
                            });
                            break;
                        case "500005":
                            _self.$router.push({
                                path: '/payment',
                                query: json
                            });
                            break;
                        case "500055":
                            _self.$router.push({
                                path: '/strategy',
                                query: json
                            });
                            break;
                        case "500050":
                            alert("服务员未响应");
                            _self.initFn();
                            break;
                            //coupon state
                        case "500100":
                        case "500101":
                            _self.getCouponData();
                            break;
                    }
                };
                websocket.onclose = function () {};
                websocket.onerror = function () {};
            }, 3000)
        },
        getCouponData: function () {
            let _self = this;
            let json = {};
            json.amount = _self.init.preCheckData.amount;
            this.$http.get("/check/coupons/" + this.$route.query.id, {
                key: json
            }).then(response => {
                let data1 = response.body;
                if (data1.code == 200) {
                    _self.coupons = data1.result;
                } else {
                    //this.$toast("没有可用的券");
                }
            });
        },
        getCoupons: function () {
            let _self = this;
            let json = {};
            // if (this.post.amount) json.amount = this.post.amount;
            json.amount = _self.init.preCheckData.amount;
            console.log(_self.init.preCheckData.amount);
            this.$http.get("/check/coupons/" + this.$route.query.id, {
                key: json
            }).then(response => {
                let data1 = response.body;
                if (data1.code == 200) {
                    _self.coupons = data1.result;
                    _self.visible.couponModal = true;
                    _self.$nextTick(function () {
                        for (let index in _self.coupons) {
                            let qrcode = new QRCode(document.getElementById("code" + index), {
                                width: 100,
                                height: 100,
                            });
                            qrcode.makeCode(_self.coupons[index].id);
                        }
                        // !_self.socketObj && _self.socket();
                    })
                }
            });
        },
        getCouponsModal: function (state) {
            if (state) {
                this.visible.timer = 0;
            } else if (this.$cookie.get(this.$route.query.id + "modal")) {
                this.visible.timer = 0;
                if (this.init.existRemindBenefit) {
                    this.addVip();
                } else if (this.init.existGratuity) {
                    this.getFlower();
                }
                return;
            }
            if (this.init.couponCount || this.init.needShowCoupons) {
                this.getCoupons();
                let _self = this;
                let t = setInterval(function () {
                    if ((!_self.visible) || (_self.visible.timer == 0)) {
                        clearInterval(t);
                    } else {
                        _self.visible.timer--;
                    }
                }, 1000);
            } else {
                this.visible.timer = 0;
                if (this.init.existRemindBenefit) {
                    this.addVip();
                } else if (this.init.existGratuity) {
                    this.getFlower();
                }
            }
        },
        submitFn: function (event) {
            // this.$loading();
            let _self = this;
            _self.toastPop = true
            let json = {};
            let result = this.data.result;
            // if (!(this.post.amount && parseFloat(this.post.amount))) {
            //   this.$loading.close();
            //   this.$toast.center("请先填写消费总额");
            //   return;
            // }
            // if (this.init.nonPart) {
            //   if (!this.post.nonParticationAmount && this.post.nonParticationAmount != "0") {
            //     this.$loading.close();
            //     this.$toast.center("请先填写不参与优惠项金额，<br>如未消费此类项目，请输入0");
            //     return;
            //   } else {
            //     if (parseInt(this.post.nonParticationAmount) > parseInt(this.post.amount)) {
            //       this.$loading.close();
            //       this.$toast.center("不参与金额不得大于总金额");
            //       return;
            //     }
            //     json.nonParticationAmount = this.post.nonParticationAmount;
            //   }
            // }
            json.amount = _self.init.preCheckData.amount;
            json.nonParticationAmount = _self.init.preCheckData.nonParticationAmount;

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
            } else {
                json.terminalType = "ALI"
            }
            if (navigator.onLine) {
                this.$http.post("/check/shop/" + this.$route.query.id + "/autonomy", json).then(response => {
                    let data = response.body;
                    // this.$loading.close();
                    _self.toastPop = false
                    if (data.code == 200) {
                        _self.$cookie.set("order_id", data.result.orderId);

                        json = _self.$route.query;
                        json.oid = data.result.orderId;
                        _self.$router.push({
                            path: '/strategy',
                            query: json
                        })
                    } else if (data.code == 405004) {
                        _self.$confirm("您在" + (data.result.shopname || ("本店" + data.result.tableNo + "号桌")) + "有一个买单正在进行中,是否放弃此订单？", function () {
                            _self.$http.post("/check/shop/" + data.result.shopId + "/cancel", {}).then(response => {
                                let data = response.body;
                                if (data.code == 200) {
                                    alert("取消成功！");
                                    _self.submitFn();
                                }
                            });
                        }, function () {

                        }, "放弃", "取消")
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
                }).catch(() => {
                    _self.toastPop = false
                })
            } else {
                var tmid = setTimeout(function () {
                    _self.num++;
                    if (_self.num == 3) {
                        clearTimeout(tmid);
                        _self.num = 0;
                        alert('网络已断开,请检查网络后刷新页面');
                        _self.toastPop = false
                        // _self.$loading.close();
                        return false;
                    }
                    _self.submitFn()
                }, 1000);
            }
        },

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.swiper-container-horizontal>.swiper-pagination-bullets {
    bottom: -5px;

    span {
        background: #fff !important;
    }
}

@import "../sui_assets/scss/cashier.scss";
</style>
