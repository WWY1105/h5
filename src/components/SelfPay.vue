<template>
<div v-if="init.user">
    <div class="selfpay" id="selfpay">
        <div class="second-pay">
            <div>
                <!-- 顶部用户信息start -->
                <div class="userHeader" v-if="!init.memberGradeName">
                    <div class="header_left">
                        <img :src="init.user.avatarUrl" v-if="init.user.avatarUrl" style="width: 1.6rem; height: 1.6rem; border-radius: 5rem" alt />
                        <img src="sui_assets/img/selfPay/vip.png" v-else alt />
                        <div class="header_text">
                            <div class="header_text_top">您还不是本店会员</div>
                            <div class="header_text_right" v-if="
                    !post.memberReduceAmount || post.memberReduceAmount == 0
                  ">
                                加入会员立享更多优惠
                            </div>
                            <div class="header_text_right" v-if="post.memberReduceAmount && post.memberReduceAmount > 0">
                                加入会员享会员价,<span style="color: #ffede0">立减{{ post.memberReduceAmount }}元</span>
                            </div>
                        </div>
                    </div>
                    <div class="header_right" @click="addVip()">加入会员</div>
                </div>
                <div class="userHeader" v-if="init.memberGradeName">
                    <div class="header_left">
                        <img :src="init.user.avatarUrl" v-if="init.user.avatarUrl" style="width: 1.6rem; height: 1.6rem; border-radius: 5rem" alt />
                        <img src="sui_assets/img/selfPay/vip.png" v-else alt />
                        <div class="header_text">
                            <div class="header_text_top">
                                <span style="font-size: 0.6rem; margin-right: 0.6rem">{{
                    init.memberGradeName
                  }}</span>
                                {{ init.user.nickname }}
                            </div>
                            <div class="header_text_right" v-if="init.needShowCoupons > 0">
                                您有{{ init.needShowCoupons }}项权益需出示使用
                            </div>
                        </div>
                    </div>
                    <div class="item" @click="goto('user')">
                        <div class="header_right">会员中心</div>
                    </div>
                </div>
                <div class="checknr">
                    <div class="zhuo zhuo-flex">
                        <div>
                            <span v-if="init.tableNo">【{{ init.tableNo + "桌" }}】</span>
                            <span v-else>【前台】</span>
                        </div>
                        <div class="zhuo-tr" v-if="post.menus ? true : false">
                            <!-- post.originalTotal==0 不存在部分结账-->
                            <div v-if="post.originalTotal - 0 == 0">
                                <p style="margin: 0">
                                    <span class="zhuo-color">消费金额</span>
                                    <span class="zhuo-cred" style="font-weight: 700; padding-left: 0.3rem">¥ {{ post.amount }}</span>
                                </p>
                                <p style="margin: 0" v-if="init.memberGradeName && post.memberReduceAmount > 0">
                                    <span class="zhuo-color">会员价优惠</span>
                                    <span class="zhuo-cred" style="font-weight: 700; padding-left: 0.3rem">¥ {{ post.memberReduceAmount }}</span>
                                </p>
                            </div>
                            <!-- post.originalTotal>0 存在部分结账-->
                            <div v-if="post.originalTotal - 0 > 0">
                                <div style="text-decoration: line-through">
                                    <span class="zhuo-color" style="color: #333">消费金额</span>
                                    <span class="zhuo-color" style="
                        font-weight: 700;
                        padding-left: 0.3rem;
                        color: #333;
                      ">¥ {{ post.originalTotal }}</span>
                                </div>
                                <div>
                                    <span class="zhuo-color" style="color: #333">未结金额</span>
                                    <span class="zhuo-cred" style="font-weight: 700; padding-left: 0.3rem">¥ {{ post.amount }}</span>
                                </div>
                                <div v-if="init.memberGradeName && post.memberReduceAmount > 0">
                                    <span class="zhuo-color" style="color: #333">会员价优惠</span>
                                    <span class="zhuo-cred" style="font-weight: 700; padding-left: 0.3rem">¥ {{ post.memberReduceAmount }}</span>
                                </div>
                            </div>
                            <div style="font-size: 0.68rem" v-if="init.nonPart" class="zhuo-color">
                                <div v-if="post.nonParticationAmount != 0">
                                    不参与优惠金额<span style="font-weight: 700; padding-left: 0.3rem">
                                        ¥ {{ post.nonParticationAmount }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="init.checkType == '102'">
                        <div v-if="post.menus ? true : false">
                            <div class="menu-list xmenu-list">
                                <div class="xlist">
                                    <div v-for="(item, index) in post.menus" class="xlist-body">
                                        <div class="xbody-first">
                                            <div class="mtl xbl">
                                                <span v-if="item.kind == 2" style="
                              border: 1px solid #d52a2a;
                              color: #d52a2a;
                              padding: 0.1rem 0.2rem;
                              font-size: 0.5rem;
                              border-radius: 0.2rem;
                            ">套餐</span>
                                                {{ item.name }}
                                            </div>
                                            <div class="xbr" style="justify-content: space-between">
                                                <div class="mtr" style="flex: none">
                                                    {{ item.count }}{{ item.unit }}
                                                </div>
                                                <div class="mtr">
                                                    <!-- 会员价 -->
                                                    <p v-if="init.memberGradeName" style="margin: 0">
                                                        <span v-if="
                                  item.memberAmount > 0 &&
                                    item.memberAmount != item.amount
                                ">¥{{ item.memberAmount }}</span>
                                                        <span v-if="item.memberAmount != item.amount" :class="
                                  item.memberAmount == 0 ? '' : 'originPrice'
                                ">¥ {{ item.amount }}</span>
                                                        <span v-if="item.memberAmount == item.amount" class="">¥ {{ item.amount }}</span>
                                                    </p>
                                                    <!-- 不是会员,显示原价 -->
                                                    <p v-if="!init.memberGradeName" style="margin: 0">
                                                        <span class="">¥ {{ item.amount }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="item.details" class="xbody-min">
                                            <div>
                                                <span v-for="(deta, i) in item.details">+{{ deta.name }}{{ item.count }}{{ item.unit }}
                                                    <span v-if="item.details.length - 1 > i">,</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- </tbody> -->
                                <!-- </table> -->
                            </div>
                        </div>
                        <div v-else>
                            <wc-keyboard inter="5" decimal="2" class="amount" v-bind:value="post.amount" v-bind:unabled="init.preCheckData ? true : false" placeholder="询问服务员后在此输入" label="消费金额" @input="inputFn" />
                            <div v-if="init.nonPart" style="padding-top: 0.5rem">
                                <wc-keyboard inter="5" v-bind:value="post.nonParticationAmount" decimal="2" v-bind:unabled="init.preCheckData ? true : false" class="nodiscount" v-bind:placeholder="init.nonPart" label="不参与优惠项" @input="nonPartsFn" />
                            </div>
                        </div>
                        <!-- 不是会员 -->
                        <!-- <div class="btnBox" v-if="!init.memberGradeName">
                            <div class="btnBox_left" @click="submit()">不要优惠买单</div>
                            <div class="btnBox_right" @click.self="getShareCard()">
                                推荐优惠买单
                            </div>
                        </div> -->
                        <!-- 是会员   -->
                        <!-- v-if="init.memberGradeName" -->
                        <div class="btnBox">
                            <div class="btnBox_right memberGradeName" @click.self="getShareCard()">
                                优&nbsp;&nbsp;&nbsp;&nbsp;惠&nbsp;&nbsp;&nbsp;&nbsp;买&nbsp;&nbsp;&nbsp;&nbsp;单
                            </div>
                        </div>
                    </div>
                    <div v-if="init.checkType == '103'">
                        <div v-if="post.amount ? true : false">
                            <div class="menu-list xmenu-list" v-if="post&&post.menus&&post.menus.length>0?true:false">
                                <div class="xlist">
                                    <div v-for="(item, index) in post.menus" class="xlist-body">
                                        <div class="xbody-first">
                                            <div class="mtl xbl">
                                                <span v-if="item.kind == 2" style="
                              border: 1px solid #d52a2a;
                              color: #d52a2a;
                              padding: 0.1rem 0.2rem;
                              font-size: 0.5rem;
                              border-radius: 0.2rem;
                            ">套餐</span>
                                                {{ item.name }}
                                            </div>
                                            <div class="xbr" style="justify-content: space-between">
                                                <div class="mtr" style="flex: none">
                                                    {{ item.count }}{{ item.unit }}
                                                </div>
                                                <div class="mtr">
                                                    <!-- 会员价 -->
                                                    <p v-if="init.memberGradeName" style="margin: 0">
                                                        <span v-if="
                                  item.memberAmount > 0 &&
                                    item.memberAmount != item.amount
                                ">¥{{ item.memberAmount }}</span>
                                                        <span v-if="item.memberAmount != item.amount" :class="
                                  item.memberAmount == 0 ? '' : 'originPrice'
                                ">¥ {{ item.amount }}</span>
                                                        <span v-if="item.memberAmount == item.amount" class="">¥ {{ item.amount }}</span>
                                                    </p>
                                                    <!-- 不是会员,显示原价 -->
                                                    <p v-if="!init.memberGradeName" style="margin: 0">
                                                        <span class="">¥ {{ item.amount }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="item.details" class="xbody-min">
                                            <div>
                                                <span v-for="(deta, i) in item.details">+{{ deta.name }}{{ item.count }}{{ item.unit }}
                                                    <span v-if="item.details.length - 1 > i">,</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- </tbody> -->
                                <!-- </table> -->
                            </div>
                            <div v-else>
                                <wc-keyboard inter="5" decimal="2" class="amount" v-bind:value="post.amount" v-bind:unabled="post.amount ? true : false" placeholder="询问服务员后在此输入" label="消费金额" />
                                <div style="padding-top: 0.5rem">
                                    <wc-keyboard inter="5" v-bind:value="post.nonParticationAmount" decimal="2" v-bind:unabled="post.nonParticationAmount ? true : false" class="nodiscount" label="不参与优惠项" />
                                </div>
                            </div>

                            <div class="btnBox">
                                <div class="btnBox_right memberGradeName" @click.self="getShareCard()">
                                    优&nbsp;&nbsp;&nbsp;&nbsp;惠&nbsp;&nbsp;&nbsp;&nbsp;买&nbsp;&nbsp;&nbsp;&nbsp;单
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p class="noMenuTips">未成功拉取本桌账单，请稍后再扫码重试，<br>您也可以向服务员寻求帮助</p>
                        </div>
                    </div>

                </div>
            </div>
            <!-- 顶部用户信息end -->
        </div>
        <div class="other-pay" v-if="init.checkType != '102'&&init.checkType != '103'">
            <div class="state" v-if="init.order" v-on:click="stateFn()">
                <img src="sui_assets/img/coupon/run.gif" style="height: 2rem" />
                买单进行中...
                <span class="pull-right">点击查看 ></span>
            </div>
            <div v-else-if="init.checkType == '101'" class="flexCenter flexColumn mycodeBox">
                <div class="text">请将身份码出示给服务员</div>
                <div id="mycode"></div>
            </div>
            <div v-else>
                <div class="btn-green" @touchstart.stop.prevent="submitForAutoFn">
                    呼叫服务员进行买单
                </div>
            </div>
        </div>
        <!---->
        <!-- 首页广告 -->
        <div class="ad-show" v-for="(item, index) in ads" v-on:click="replaceUrl(item)" v-if="ads" v-show="index == 0">
            <div class="cbg" :style="{
            backgroundImage: 'url(' + (item.transversePicUrl || '') + ')'
          }"></div>
            <div class="pull-left">{{ item.title }}</div>
            <div v-if="item.activityCategory || item.linkUrl" class="pull-right">
                看一看 >
            </div>
        </div>
    </div>

    <!--  弹框 -->
    <div v-if="vipShow">
        <!--vip-->
        <div v-if="vip.type == 1">
            <!--没有权益，只有领卡  -->
            <div class="modal addVip2" v-if="vip.memberGradeName">
                <div class="modal-inner">
                    <div v-if="vip.needPhone">
                        <div class="xbind-phone-box">
                            <div>
                                <div class="xbind-phone-body">
                                    <div class="xpb-top">
                                        <img src="/sui_assets/img/selfPay/close2.png" alt="" @click="closeAddVip">
                                        <div class="xt-top">
                                            <span>加入会员</span>
                                            <span class="line"></span>
                                            <span>开启会员特权</span>
                                        </div>
                                        <div class="xt-body">
                                            <div style="height: 2rem;">
                                                <input type="tel" v-model='phone1.phone' placeholder="请输入您的手机号码" maxlength='11' @blur="temporaryRepair()">
                                            </div>
                                            <div style="height: 2rem;">
                                                <input type="tel" v-model='phone1.validateCode' placeholder="请输入短信验证码" @blur="temporaryRepair()">
                                                <div @click="validate1Fn">{{ phone1.text }}</div>
                                            </div>
                                            <div @click="bindPhone1">确认</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div v-else style="background-color:#fff" class="hasNothing">
                        <div class="top" ref="top" style="height: 23.45rem ;border-radius:0.3rem ">
                            <div class="card-box">
                                <img :src="vip.cardUrl" alt="">
                            </div>
                            <div class="card1" ref="card">
                                <!-- 恭喜获赠会员 -->
                                <img src="/sui_assets/img/addVip/gxhzhyk.png" style="margin-top: 0.5rem ;width:7rem ;height:1.15rem ;" alt="">
                            </div>
                            <div class="card-line"></div>
                            <div class="card-text" style="padding:1.7rem 0 3rem">
                                使用自助买单可自动抵用优惠
                            </div>
                            <div class="v-button iknow" v-on:click="bindPhone1()">我 知 道 了</div>
                        </div>
                    </div>

                </div>
            </div>
            <!--无手机号，有新人礼     (加入会员即可拥有) -->
            <div class="modal addVip" v-else>
                <div class="modal-inner modal-innerWX">
                    <div class="modal-content">
                        <div class="v-item" style="
                    background-color: transparent;
                    background: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0;
                    margin-top: 30px;
                    width: 3rem;
                    margin-bottom: 0px;
                    height: 64px;
                  ">
                            <p class="left coupon-icon couponIcon"></p>
                        </div>
                        <div class="overflow" style="margin-top: 0">
                            <div v-if="vip.benefits" v-for="(coupon, key) in vip.benefits" :key="key" style="position: relative">
                                <div class="v-coupon" v-if="coupon.category == '1016'" :class="coupon.todayUsable ? 'todayUsable' : ''">
                                    <div class="v-item">
                                        <div class="left" v-if="
                          coupon.hasOwnProperty('amount') &&
                            coupon.amount != 0 &&
                            coupon.couponCategory != 9012
                        ">
                                            <span v-if="
                            coupon.couponCategory == '903' ||
                              coupon.couponCategory == '9031'
                          ">{{ coupon.amount }}折</span>
                                            <span v-else-if="
                            coupon.couponCategory == '902' ||
                              coupon.couponCategory == '9021'
                          ">
                                                <span class="dollar"></span>
                                                {{ +coupon.amount + +coupon.currentAmount }}
                                            </span>
                                            <span v-else>
                                                <span class="dollar"></span>
                                                {{ coupon.amount }}
                                            </span>
                                        </div>
                                        <div class="left coupon-icon" v-else></div>
                                        <div class="right">
                                            <div>{{ coupon.name }}</div>
                                            <div class="grey">{{ coupon.times }}</div>
                                        </div>
                                        <div class="corn" v-if="coupon.count > 1">
                                            {{ coupon.count }}张
                                        </div>
                                    </div>
                                </div>
                                <div class="v-point" v-if="coupon.category == '1015'" :class="coupon.todayUsable ? 'todayUsable' : ''">
                                    <div class="v-item">
                                        <div class="left">{{ coupon.amount }}</div>
                                        <div class="right">积分</div>
                                        <div class="corn" v-if="coupon.count > 1">
                                            {{ coupon.count }}张
                                        </div>
                                    </div>
                                </div>
                                <div class="v-reward" v-if="coupon.category == '1017'" :class="coupon.todayUsable ? 'todayUsable' : ''">
                                    <div class="v-item">
                                        <div class="left">{{ coupon.amount }}</div>
                                        <div class="right">无门槛代用币</div>
                                        <div class="corn" v-if="coupon.count > 1">
                                            {{ coupon.count }}张
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-phone">
                            <div v-if="vip.needPhone" class="phoneBox">
                                <input type="tel" v-model="phone1.phone" placeholder="输入您的手机号码" maxlength="11" @blur="temporaryRepair()" />
                                <div :class="
                        phone1.phone && phone1.phone.length == 11
                          ? 'input-text'
                          : 'input-text default'
                      " v-on:click.stop="validate1Fn">
                                    {{ phone1.text }}
                                </div>
                                <input type="tel" placeholder="输入收到的验证码" v-model="phone1.validateCode" id="validate" maxlength="6" @blur="temporaryRepair()" />
                            </div>
                            <div v-on:click.stop="bindPhone1" class="v-button addMenber">
                                {{vip.needPhone?'免费注册':'加入会员'}}
                            </div>
                        </div>
                        <div class="close" v-on:click="closeAddVip()"></div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="vip.type == 2">
            <div class="modal addVip2">
                <div class="modal-inner">
                    <div class="">
                        <div class="xbind-phone-box">
                            <div>
                                <div class="xbind-phone-body">
                                    <div class="xpb-top">
                                        <img src="/sui_assets/img/selfPay/close2.png" alt="" @click="closeAddVip">
                                        <div class="xt-top">
                                            <span>未检测到账户权益</span>
                                            <span class="line"></span>
                                            <span>请验证手机</span>
                                        </div>
                                        <div class="xt-body">
                                            <div style="height: 2rem;">
                                                <input type="tel" v-model='phone1.phone' placeholder="请输入您的手机号码" maxlength='11' @blur="temporaryRepair()">
                                            </div>
                                            <div style="height: 2rem;">
                                                <input type="tel" v-model='phone1.validateCode' placeholder="请输入短信验证码" @blur="temporaryRepair()">
                                                <div @click="validate1Fn">{{ phone1.text }}</div>
                                            </div>
                                            <div @click="bindPhone1">确认</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 分享卡 -->
    <div class="modal shareCardModal" v-show="shareCardFlag">
        <div class="modal-inner">
            <div class="modal-content">
                <div class="title">
                    <p>您拥有本店共享卡</p>
                    <p>请确认使用</p>
                </div>
                <div class="cardList">
                    <div class="eachCard" v-for="(i, index) in shareCardList" @click="chooseShareCard(i.id, index)">
                        <div class="radioBox" v-if="shareCardList.length > 1">
                            <img v-show="!i.select" class="selectIcon unselect" src="/sui_assets/img/selfPay/shareCard/unselect.png" alt="" />
                            <img v-show="i.select" class="selectIcon selected" src="/sui_assets/img/selfPay/shareCard/selected.png" alt="" />
                        </div>
                        <div class="cards">
                            <div class="cardName">{{ i.name }}</div>
                            <div class="cardDesc">
                                <span class="coupon">共{{ i.couponCount }}张优惠券</span>
                                <p class="disCount">
                                    当前<span class="amount">{{ i.amount }}</span>折
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="btnBox">
                        <button :class="shareCardId?'confirmBtn':'confirmBtn disable'" @click="toStrategy()">确定使用</button>

                    </div>

                </div>
                <img @click="closeShareCard()" class="closeIcon" src="/sui_assets/img/selfPay/shareCard/close.png" alt="">
            </div>
        </div>
    </div>

    <!-- 共享卡活动 -->
    <div class="modal shareActivityModal" v-show="shareActivityShow">
        <div class="modal-inner flexCenter">
            <div class="modal-content">
                <img @click.stop="closeShareActivity()" class="closeIcon" src="/sui_assets/img/selfPay/shareCard/close.png" alt="">
                <img class="shareActivityBg" src="/sui_assets/img/selfPay/shareCard/shareActivity1.png" alt="" />
                <div class="topTitleBox">
                    <p class="smallTitle">恭喜您获得</p>
                    <p class="bigTitle">本单立减
                        <countTo separator="" :startVal='startVal' decimals='2' :endVal='shareActivity.reduce' :duration='2000' class="bigTitle"></countTo>元</p>
                </div>
                <div class="shareActivityContent">
                    <p class="bigTitle">全年通用低至{{shareActivity.cardLimit}}折共享卡</p>
                    <div class="icons flexSpace">
                        <div class="eachItem flexCenter flexColumn">
                            <div class="imgBox">
                                <img src="/sui_assets/img/selfPay/shareCard/icons/couponIcon.png" class="icon" alt="">
                                <p class="tag">开卡{{shareActivity.cardValue}}折</p>
                            </div>

                            <p class="lightTitle">低至{{shareActivity.cardLimit}}折</p>
                            <p class="rule">越用越便宜</p>
                        </div>
                        <!-- <span class="li"></span> -->
                        <div class="eachItem flexCenter flexColumn">
                            <div class="imgBox">
                                <img src="/sui_assets/img/selfPay/shareCard/icons/giftIcon.png" class="icon" alt="">

                                <p class="tag">当场可用</p>
                            </div>
                            <p class="lightTitle">{{shareActivity.couponValue}}元券包</p>
                            <div class="rule coupons">
                                <div v-for="(c,z) in shareActivity.coupons" :key="z">
                                    <p v-if="z<=1">{{c}}</p>

                                </div>
                                <p class="else" v-if="shareActivity.coupons&&shareActivity.coupons.length>2">...</p>
                            </div>
                        </div>
                        <!-- <span class="li"></span> -->
                        <div class="eachItem flexCenter flexColumn">
                            <div class="imgBox">
                                <img src="/sui_assets/img/selfPay/shareCard/icons/shareIcon.png" class="icon" alt="">
                                <p class="tag">{{shareActivity.cardExpiresDays}}天有效</p>
                            </div>
                            <p class="lightTitle">亲友共享</p>
                            <p class="rule">折扣与优惠券</p>
                        </div>
                    </div>
                </div>
                <div class="flexCenter btnBox">
                    <button class="shareActivityBtn  flexCenter" @click="tapBindFn()">
                        <!-- <p class="leftTag">全年优惠</p> -->
                        <div class="topTitle leftText" v-if="shareActivity.price">￥{{shareActivity.price}}开通&nbsp;&nbsp;</div>
                        <div class="topTitle rightText">
                              <!-- <img src="/sui_assets/img/selfPay/shareCard/shareCardBtnBg1.png" class="bg" alt="">
                             <img src="/sui_assets/img/selfPay/shareCard/shareCardBtnBg2.png" class="bg topBg" alt="">
                               <img src="/sui_assets/img/selfPay/shareCard/icons/arrowRight.png" class="arrowRight" alt=""> -->
                            <span class="smallText">本单</span> 
                            <span class="numtext">立减{{shareActivity.reduce}}</span> 
                            <span class="smallText"> 元</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from "vue";
import "swiper/dist/css/swiper.css";
import wcKeyboard from "./wcKeyboard/KeyboardInput.vue";
import VueAwesomeSwiper from "vue-awesome-swiper";
import $ from "jquery";
import VueCookies from "vue-cookies";
Vue.use(VueCookies);
import countTo from 'vue-count-to';
Vue.use(VueAwesomeSwiper);
// import linkPicUrl from './module/linkPicUrl/linkPicUrl'
export default {
    name: "SelfPay",
    components: {
        wcKeyboard,
        countTo
    },
    data() {
        return {
            linkPicUrl: "",
            data: "",
            submitpop: false,
            view: {},
            popswitch: false,
            unclaimed: false,
            lock: false,
            popimg: '/sui_assets/img/strategy/wxbg.png',
            timer: '',
            payment: {},
            version: "ALIPAY",
            key_json: {},
            disk: {
                dish: 0,
                meal: 0
            },
            visible: {
                dish: false,
                coupon: false,
                couponModal: false,
                timer: 3,
                count: 4
            },
            post: {
                amount: "",
                nonParticationAmount: "",
                originalTotal: 0
            },
            coupons: [],
            init: {},
            swiper: "",
            ads: [],
            vip: "",
            vipShow: false,
            tucao: false,
            praise: false,
            benefitsPic: "",
            benefitsname: "",
            leftback: true,
            swiperOption: {
                pagination: {
                    el: "#swiper-pagination",
                    clickable: true
                },
                spaceBetween: 30,
                centeredSlides: true
            },
            phone1: "",
            posts: {
                satisfied: true,
                index: 0
            }, //评赏
            qrcode: "",
            ccode: "",
            num: 0,
            shareCardFlag: false, // 共享卡弹窗
            shareCardList: [], // 共享卡列表
            shareActivityShow: false, //共享卡活动展示
            shareActivity: {}, //共享卡活动
            shareCardId: false,
            bind: {},
            startVal: 0
        };
    },

    beforeCreate() {
        // 判断是否有pid
        if (this.$route.query.pid) {
            this.linkPicUrl = this.$cookie.get(this.$route.query.pid);
        }
    },
    created() {
        var _self = this;
        if (location.hash) {
            let index = location.hash.lastIndexOf("?");
            var key_str = location.hash.substr(index + 1);
            for (var i = 0; i < key_str.split("&").length; i++) {
                var j = key_str.split("&")[i].split("=");
                _self.key_json[j[0]] = j[1];
            }
        }

        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            _self.version = "WXPAY";
        }
    },

    mounted() {
        let that = this;
        this.initFn();
        //微信内置浏览器浏览H5页面弹出的键盘遮盖文本框的解决办法
        window.addEventListener("resize", function () {
            if (
                document.activeElement.tagName == "INPUT" ||
                document.activeElement.tagName == "TEXTAREA"
            ) {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        });
        // 安卓手机物理返回键
        if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener("popstate", this.goBack, false);
        }
    },
    //页面销毁时，取消监听。否则其他vue路由页面也会被监听
    destroyed() {
        window.removeEventListener("popstate", this.goBack, false);
    },
    computed: {},

    methods: {

        // 获取共享卡
        getShareCard() {
            let _self = this;
            let json = {};
            if (!(_self.post.amount && parseFloat(_self.post.amount))) {
                _self.$loading.close();
                _self.$toast("请先填写消费总额", "center");
                return;
            }
            if (_self.init.nonPart) {
                if (
                    !_self.post.nonParticationAmount &&
                    _self.post.nonParticationAmount != "0"
                ) {
                    _self.$loading.close();
                    _self.$toast(
                        "请先填写不参与优惠项金额，<br>如未消费此类项目，请输入0",
                        "center"
                    );
                    return;
                } else {
                    if (
                        parseInt(_self.post.nonParticationAmount) >
                        parseInt(_self.post.amount)
                    ) {
                        _self.$loading.close();
                        _self.$toast("不参与金额不得大于总金额", "center");
                        return;
                    }
                    json.nonParticationAmount = _self.post.nonParticationAmount;
                }
            }
            json.amount = _self.post.amount;
            console.log(json)
            // return;
            // -----------------------
            if (_self.$route.query.id || _self.$route.query.guestid) {
                _self.$http.get(
                        "/shares/" +
                        (_self.$route.query.id || _self.$route.query.guestid), {
                            key: json
                        }
                    )
                    .then(response => {
                        if (response.body.code == 200) {
                            let result = response.body.result;
                            if (result.activity) { //有活动
                                _self.shareActivityShow = true;
                                _self.shareActivity = result.activity;
                            } else if (result.cards) {
                                // 只有卡
                                if (result.cards.length == 1) {
                                    this.shareCardId = result.cards[0].id;
                                } else {
                                    result.cards.map(i => {
                                        i.select = false;
                                    });
                                }
                                _self.shareCardList = result.cards;
                                _self.shareCardFlag = true;
                            }

                        } else {
                            _self.toStrategy();
                        }
                    });

            }
        },
        buyCard(bind) {
            let _self = this;
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', _self.goBack, false);
            }
            console.log('进入支付');
            console.log(_self.payment)

            this.popswitch = false;
            let mode = _self.init;
            if (mode.payMode && mode.payMode == '1005') {
                this.popimg = '/sui_assets/img/strategy/wxbg.png'
            } else if (mode.payMode && mode.payMode == '1101') {
                this.popimg = '/sui_assets/img/strategy/zfbbg.png'
            }
            let json = {
                payCategory: mode ? mode.payMode : '',
                goodsId: _self.shareActivity.id,
                url: location.href,
                id: _self.$route.query.id || _self.$route.query.guestid,
            };
            // 推广码
            if (_self.$route.query.pid) {
                json.promoteId = _self.$route.query.pid;
            }
            if (bind && bind.phone) {
                json.phone = bind.phone
            }
            if (bind && bind.validateCode) {
                json.validateCode = bind.validateCode
            }
            _self.$http.post("/shares", json)
                .then(response => {
                    let data1 = response.body;
                    _self.shareActivityShow = false;
                    if (data1.code == 200) {
                        // 支付过程---------
                        switch (mode.payMode) {
                            case "1005":
                                let js = data1.result.js;
                                let pay = data1.result.pay;
                                pay.success = function () {
                                    //查询支付结果
                                    _self.$http.get("/shares/order/" + data1.result.orderId).then(res1 => {
                                        console.log('支付结果')
                                        console.log(res1)
                                        let data2 = res1.body;
                                        if (data2.code == 200) {
                                            _self.shareCardId = data2.result.id;
                                            _self.toStrategy();
                                        }
                                    });
                                };
                                pay.cancel = function () {
                                    _self.cancelPay(data1.result.orderId);
                                };
                                pay.fail = function () {
                                    _self.cancelPay(data1.result.orderId);
                                    alert("支付失败");
                                };
                                js.debug = false;
                                js.jsApiList = ['chooseWXPay'];
                                delete js.url;
                                wx.config(js);
                                console.log(pay)
                                wx.ready(function () {
                                    wx.chooseWXPay(pay);
                                });
                                break;
                            case "1101":
                                AlipayJSBridge.call("tradePay", {
                                    tradeNO: data1.result.pay.tradeNO
                                }, function (result) {

                                    if (result.resultCode == "6001") {
                                        _self.cancelPay(data1.result.orderId);
                                        return;
                                    }
                                    if (result.resultCode == "9000") {
                                        // _self.$http.get("/order/" + _self.id + "/pay/result").then(response => {
                                        //     _self.$router.push({
                                        //         path: '/payment',
                                        //         query: json
                                        //     });
                                        // });
                                        //查询支付结果
                                        _self.$http.get("/shares/order/" + data1.result.orderId).then(res1 => {
                                            console.log('支付结果')
                                            console.log(res1)
                                            let data2 = res1.body;
                                            if (data2.code == 200) {
                                                _self.shareCardId = data2.result.id;
                                                _self.toStrategy(shareCardId);
                                            }
                                        });
                                    }
                                });
                                break;
                        }
                        // 支付过程---------
                    } else {
                        _self.$loading.close();
                        _self.shareCardId = false;
                        _self.$toast(data1.message, "center");
                        _self.initFn()
                    }
                })

        },
        cancelPay: function (id) {
            var _self = this;
            this.shareCardId = null;
            this.$http.post("/order/" + id + "/pay/revoke").then(response => {

            });
        },
        tapBindFn() {
            let _self = this;
            if (!_self.init.existPhone) {
                _self.$bind({
                    loadingText:"即将为您拉起支付",
                    justShow: true,
                    title: "绑定手机号",
                    text: "绑定手机号后，获得即可参与此活动",
                    submit: function (res) {
                        console.log('提交手机号')
                        _self.shareActivityShow = false;
                        _self.buyCard(res)
                    }
                });
            } else {
                _self.buyCard()
            }

        },
        // 选择共享卡
        chooseShareCard(id, index) {
            this.shareCardList.map(i => {
                i.select = false;
            });
            this.shareCardList[index].select = true;
            this.shareCardId = id;
            console.log(id);
        },
        closeShareCard() {
            this.shareCardFlag = false;
            this.shareCardId = false;
            this.toStrategy();
        },
        closeShareActivity() {

            this.shareActivityShow = false;
            this.shareCardId = false;
            this.toStrategy();
        },

        goto(path) {
            this.$router.push({
                path,
                query: this.$route.query
            });
        },

        goBack() {
            let _self = this;
            let json = _self.$route.query;
            _self.$router.push({
                path: "/selfpay",
                query: json
            });
        },
        focusUp(e) {
            setTimeout(function () {
                document.querySelector("#inputId").scrollIntoView();
            }, 400);
        },
        getPayMode() {
            let _self = this;
            if (_self.$route.query.id || _self.$route.query.guestid) {
                _self.$http.get(
                        "/shop/" +
                        (_self.$route.query.id || _self.$route.query.guestid) +
                        "/paymode", {
                            key: {
                                type: _self.getVersion()
                            }
                        }
                    )
                    .then(response => {
                        if (response.body.code == 200) {
                            if (response.body.result.oasis) {
                                _self.authorFuiou();
                                return;
                            }
                            _self.payment = response.body.result;
                        } else {}
                    });
            }
        },
        initFn() {
            let _self = this;
            let para = {};
            let ua = window.navigator.userAgent.toLowerCase();

            if (_self.getVersion() == "WXPAY") {
                para.type = "WXPAY";
            }

            // // 路由带过来的桌号
            if (_self.$route.query.d) {
                para.tableId = _self.$route.query.d;
            } else {
                para.tableId = _self.key_json.d;
            }
            // 路由带过来的二维火
            if (_self.$route.query.cashier) {
                para.cashierOrderId = _self.$route.query.cashier;
            } else {
                para.cashier = _self.key_json.cashier;
            }
            //  路由带过来的shopId
            if (_self.$route.query.id) {
                para.shopId = _self.$route.query.id;
            } else {
                para.shopId = _self.key_json.id;
            }

            _self.$http
                .get("/shop/" + para.shopId, {
                    key: para
                })
                .then(response => {
                    let data = response.body;
                    if (data.code == 200) {
                        _self.setTitle(
                            data.result.brandName + "(" + data.result.name + ")"
                        );
                        _self.init = data.result;
                        _self.unclaimed = _self.init.existRemindBenefit;
                        _self.ads = _self.init.placards;

                        if (!_self.init.memberGradeName) {
                            if (_self.init.existRemindBenefit) {
                                _self.addVip();
                            }

                            _self.getPayMode();
                        }

                        localStorage.setItem("userId", _self.init.user.id);
                        if (_self.init.preCheckData) _self.post = _self.init.preCheckData;
                        console.log(_self.post)

                        //有进行中的自助买单
                        if (_self.init.order && _self.init.checkType == "102") {
                            _self.$confirm(
                                "您" +
                                (_self.init.order.tableNo ?
                                    "在" + _self.init.order.tableNo + "号桌" :
                                    "") +
                                "有个买单未完成,放弃这笔交易？",
                                function () {
                                    _self.$http
                                        .post("/check/" + _self.init.order.orderId + "/cancel", {})
                                        .then(response => {
                                            let data1 = response.body;
                                            if (data1.code != 200) {
                                                _self.$toast(data1.message);
                                                if (data1.code == 403108) {
                                                    setTimeout(function () {
                                                        let json = _self.$route.query;
                                                        json.oid = _self.init.order.orderId;
                                                        _self.$router.push({
                                                            path: "/strategy",
                                                            query: json
                                                        });
                                                    }, 200);
                                                } else {
                                                    _self.initFn();
                                                }
                                            } else {
                                                delete _self.init.order;
                                            }
                                        });
                                },
                                function () {
                                    let json = _self.$route.query;
                                    json.oid = _self.init.order.orderId;
                                    _self.$router.push({
                                        path: "/strategy",
                                        query: json
                                    });
                                },
                                "确定放弃",
                                "继续买单"
                            );
                        } else {
                            _self.$nextTick(function () {
                                if (_self.init.checkType == "101") {
                                    //扫码买单
                                    let qrcode = new QRCode(document.getElementById("mycode"), {
                                        width: 160,
                                        height: 160
                                    });
                                    qrcode.makeCode(_self.init.checkUserCode);
                                    _self.refreshCode();
                                    _self.interval = setInterval(_self.refreshCode, 30000);
                                }
                            });
                        }
                    } else if (data.code == 403013) {
                        location.href = "error.html#12";
                    } else if (data.code == 403010) {
                        location.href = "error.html#10";
                    } else {
                        // alert(data.message);
                    }
                });
        },

        back() {
            this.tucao = false;
        },

        refreshCode() {
            this.$http.get("/check/code").then(response => {
                let data = response.body;
                if (data.code == 200) {
                    if (!document.getElementById("mycode")) {
                        clearInterval(this.interval);
                        return;
                    }
                    document.getElementById("mycode").innerHTML = "";
                    let qrcode = new QRCode(document.getElementById("mycode"), {
                        width: 160,
                        height: 160
                    });
                    //当面付
                    qrcode.makeCode(data.result.code);
                }
            });
        },

        //添加新人礼会员 获取门店升级赠送详情
        addVip() {
            if (!this.init.existRemindBenefit) {
                let query = {
                    id: this.$route.query.id
                };
                if (this.$route.query.pid) {
                    query.pid = this.$route.query.pid;
                }
                this.$router.push({
                    path: "/user",
                    query: query
                });

                return false;
            }

            let _self = this;
            this.$http.get("/remind/guest/" + this.$route.query.id).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    this.vip = data.result;
                    this.vipShow = true;
                    if (data.result.needPhone) {
                        this.phone1 = {
                            text: "获取验证码",
                            able: true
                        };
                    }
                }
            });
        },
        temporaryRepair() {
            setTimeout(() => {
                const scrollHeight =
                    document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        },

        closeAddVip() {
            console.log("关闭弹窗");
            console.log(this.vip)
            let that = this;
            this.vipShow = false;
            document.body.removeAttribute("class", "activebody");
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
                case "6004":
                    let json = this.$route.query;
                    json.aid = item.activityId;
                    that.$router.push({
                        path: "couponActivity",
                        query: json
                    });
                    break;
                    //套餐
                case "6015":
                    this.ajaxUrl("mealActivity.html?aid=" + item.activityId);
                    break;
                    //充值
                case "6002":
                    this.$router.push({
                        path: "/charge",
                        query: this.$route.query
                    });
                    break;
                    //入会及升级
                case "6001":
                    this.$route.query.tid = item.activityId;
                    this.$router.push({
                        path: "/upgrade",
                        query: this.$route.query
                    });
                    // this.ajaxUrl('upgrade.html?tid=' + item.activityId);
                    break;
                    //积分兑换
                case "6003":
                    this.$router.push({
                        path: "/exchange",
                        query: this.$route.query
                    });
                    // this.ajaxUrl('exchange.html');
                    break;
                    //砍价
                case "6041":
                    // this.$router.push({path: "/grouponInfo", query: this.$route.query});
                    location.href =
                        "/grouponInfo.html?aid=" +
                        item.activityId +
                        "&guestid=" +
                        item.guestId;
                    break;
                    //评赏
                case "6050":
                    location.href =
                        "/lottery.html?aid=" + item.activityId + "&guestid=" + item.guestId;
                    break;
                    //抽奖
                case "6051":
                    // this.$router.push({path: "/more", query: this.$route.query})
                    location.href =
                        "/raffleActivity.html?aid=" +
                        item.activityId +
                        "&guestid=" +
                        item.guestId;
                    break;
                default:
                    this.ajaxUrl("activity.html?aid=" + item.activityId);
            }
        },

        validate1Fn() {
            if (!this.phone1.able) return;
            if (!this.phone1.phone || this.phone1.phone.length != 11) {
                this.$toast("手机格式不正确", "center");
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
                        this.$toast("获取成功", "center");
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
                        this.$toast(data.message, "center");
                    }
                });
        },
        bindPhone1() {
            let _self = this;
            let jsonA = {
                id: this.$route.query.id || this.$route.query.guestid || this.$route.query.shopId
            };
            // 推广码
            if (_self.$route.query.pid) {
                jsonA.promoteId = _self.$route.query.pid;
            }

            if (_self.vip.needPhone) {
                if (
                    this.phone1.phone &&
                    this.phone1.validateCode &&
                    this.phone1.phone.length == 11 &&
                    this.phone1.validateCode.length == 6
                ) {

                    jsonA.phone = this.phone1.phone;
                    jsonA.validateCode = this.phone1.validateCode;

                } else {
                    // 没有填写手机号
                    _self.$toast("请填写手机号", "center");
                    return;
                }
            }
            this.$http.post("/membership", jsonA).then(response => {
                let data = response.data;
                if (data.code == 200) {
                    this.vipShow = false;
                    if (data.result && data.result.token) {
                        this.$cookie.set("token", data.result.token, {
                            expires: "90d"
                        });
                    }
                    this.$toast(
                        "操作成功！,请在“会员中心”查看权益，使用自助买单可自动抵用优惠。",
                        "center"
                    );
                    setTimeout(function () {
                        _self.vipShow = false;
                        _self.initFn();
                    }, 1000);
                } else {
                    this.$toast(data.message, "center");
                }
            });
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
                expires: "30m",
                path: "/"
            });
            if (document.getElementsByClassName("a4005").length) {
                this.init.couponCount = document.getElementsByClassName("a4005").length;
            } else {
                delete this.init.couponCount;
                this.init.needShowCoupons = 1;
            }
            if (this.init.existRemindBenefit) {
                this.addVip();
            }
        },
        clear: function () {
            if (this.data.result.specialDishes) {
                for (let i = 0; i < this.data.result.specialDishes.length; i++) {
                    this.data.result.specialDishes[i].count = 0;
                }
            }
            if (this.data.result.setmealDishes) {
                for (let j = 0; j < this.data.result.setmealDishes.length; j++) {
                    this.data.result.setmealDishes[j].count = 0;
                }
            }
            this.disk.dish = 0;
            this.disk.meal = 0;
        },
        cancel: function (id) {
            let _self = this;
            let re = confirm("确认放弃后您需要重新出示给店员才可使用");
            if (re) {
                this.$http
                    .delete("/check/shop/" + this.$route.query.id + "/coupons/" + id)
                    .then(response => {
                        let data = response.data;
                        if (data.code == 200) {
                            _self.getCouponData();
                        } else {
                            alert(data.message);
                        }
                    });
            }
        },
        socket: function () {
            let _self = this;
            setTimeout(function () {
                let a;
                let uri =
                    "wss://" + location.hostname + "/websocket?id=" + _self.init.user.id;
                let websocket;
                websocket = new WebSocket(uri);
                websocket.onopen = function () {
                    //   a = setInterval(function() {
                    //     websocket.send("1");
                    //   }, 30000);
                };
                websocket.onmessage = function (evt) {
                    console.log(evt);
                    if (evt.data == "success") return false;
                    let data = JSON.parse(evt.data);
                    data.orderId &&
                        _self.$cookie.set("order_id", data.orderId, {
                            path: "/"
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
                                path: "/payment",
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
                                path: "/strategy",
                                query: json
                            });
                            break;
                            // case "500005":
                            //     _self.$router.push({
                            //         path: "/payment",
                            //         query: json
                            //     });
                            //     break;
                        case "500055":
                            _self.$router.push({
                                path: "/strategy",
                                query: json
                            });
                            break;
                        case "500050":
                            alert("服务员未响应");
                            _self.initFn();
                            break;

                        case "500100":
                        case "500101":
                            //_self.getCouponData();
                            break;
                    }
                };
                websocket.onclose = function () {};
                websocket.onerror = function () {};
            }, 3000);
        },

        getCouponData: function () {
            let _self = this;
            let json = {};
            if (this.post.amount) json.amount = this.post.amount;
            this.$http
                .get("/check/coupons/" + this.$route.query.id, json)
                .then(response => {
                    let data1 = response.body;
                    if (data1.code == 200) {
                        _self.coupons = data1.result;
                    } else {
                        //this.$toast.center("没有可用的券");
                    }
                });
        },
        getCoupons: function () {
            let _self = this;
            let json = {};
            if (this.post.amount) json.amount = this.post.amount;
            this.$http
                .get("/check/coupons/" + this.$route.query.id, json)
                .then(response => {
                    let data1 = response.body;
                    if (data1.code == 200) {
                        _self.coupons = data1.result;
                        _self.visible.couponModal = true;
                        _self.$nextTick(function () {
                            for (let index in _self.coupons) {
                                let qrcode = new QRCode(
                                    document.getElementById("code" + index), {
                                        width: 100,
                                        height: 100
                                    }
                                );
                                qrcode.makeCode(_self.coupons[index].id);
                            }
                            // !_self.socketObj && _self.socket();
                        });
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
                }
                return;
            }
            if (this.init.couponCount || this.init.needShowCoupons) {
                this.getCoupons();
                let _self = this;
                let t = setInterval(function () {
                    if (!_self.visible || _self.visible.timer == 0) {
                        clearInterval(t);
                    } else {
                        _self.visible.timer--;
                    }
                }, 1000);
            } else {
                this.visible.timer = 0;
                if (this.init.existRemindBenefit) {
                    this.addVip();
                }
            }
        },
        checked: function () {
            this.visible.checked = !this.visible.checked;
            this.visible = JSON.parse(JSON.stringify(this.visible));
        },

        submitFn: function (event) {
            this.$loading();
            let _self = this;
            let json = {};
            let result = this.data.result;

            if (!(this.post.amount && parseFloat(this.post.amount))) {
                this.$loading.close();
                this.$toast("请先填写消费总额", "center");
                return;
            }

            if (this.init.nonPart) {
                if (
                    !this.post.nonParticationAmount &&
                    this.post.nonParticationAmount != "0"
                ) {
                    this.$loading.close();
                    this.$toast(
                        "请先填写不参与优惠项金额，<br>如未消费此类项目，请输入0",
                        "center"
                    );
                    // this.$toast.show({text: "请先填写不参与优惠项金额，如未消费此类项目，请输入0", position: 'bottom'});
                    return;
                } else {
                    if (
                        parseInt(this.post.nonParticationAmount) >
                        parseInt(this.post.amount)
                    ) {
                        this.$loading.close();
                        this.$toast("不参与金额不得大于总金额", "center");
                        return;
                    }
                    json.nonParticationAmount = this.post.nonParticationAmount;
                }
            }
            json.amount = this.post.amount;

            if (this.$route.query.d) {
                json.tableId = this.$route.query.d;
            }
            if (this.$route.query.cashier) {
                json.cashierOrderId = this.$route.query.cashier;
            }
            // 微信扫的 显示公众号二维码
            let ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                json.terminalType = "WX";
            } else {
                json.terminalType = "ALI";
            }
            // 推广码
            if (this.$route.query.pid) {
                json.promoteId = this.$route.query.pid;
            }
            // 分享卡id
            console.log("分享卡id" + this.shareCardId);
            if (this.shareCardId) {
                json.userCardId = this.shareCardId;
            }
            console.log(json);
            if (navigator.onLine) {
                this.$http
                    .post("/check/shop/" + this.$route.query.id + "/autonomy", json)
                    .then(response => {
                        let data = response.body;
                        this.$loading.close();
                        if (data.code == 200) {
                            _self.$cookie.set("order_id", data.result.orderId);

                            json = _self.$route.query;
                            json.oid = data.result.orderId;
                            _self.$router.push({
                                path: "/strategy",
                                query: json
                            });
                        } else if (data.code == 405004) {
                            _self.$confirm(
                                "您在" +
                                (data.result.shopname ||
                                    "本店" + data.result.tableNo + "号桌") +
                                "有一个买单正在进行中,是否放弃此订单？",
                                function () {
                                    _self.$http
                                        .post("/check/shop/" + data.result.shopId + "/cancel", {})
                                        .then(response => {
                                            let data = response.body;
                                            if (data.code == 200) {
                                                alert("取消成功！");
                                                _self.submitFn();
                                            }
                                        });
                                },
                                function () {},
                                "放弃",
                                "取消"
                            );
                        } else if (data.code == 405807) {
                            _self.$toast("本次消费金额系统已为您读取，将继续为您买单");
                            setTimeout(function () {
                                _self.refresh();
                            }, 1000);
                        } else {
                            alert(data.message);
                        }
                    });
            } else {
                var tmid = setTimeout(function () {
                    _self.num++;
                    if (_self.num == 3) {
                        clearTimeout(tmid);
                        _self.num = 0;
                        alert("网络已断开,请检查网络后刷新页面");
                        _self.$loading.close();
                        return false;
                    }
                    _self.submitFn();
                }, 1000);
            }
        },

        submitForAutoFn() {
            let json = {},
                _self = this;
            if (this.$route.query.d) {
                json = {
                    tableId: this.$route.query.d
                };
            }
            this.$http
                .post("/check/shop/" + this.$route.query.id, json)
                .then(response => {
                    let data = response.body;
                    switch (data.code) {
                        case 200:
                            this.$cookie.set("order_id", data.result.orderId);
                            this.$cookie.set("table_no", data.result.tableNo);
                            this.ajaxUrl("waiting.html");
                            break;
                        case 405004:
                            this.$confirm(
                                "您在" +
                                (data.result.shopname ||
                                    "本店" + data.result.tableNo + "号桌") +
                                "有一个买单正在进行中,是否取消？",
                                function () {
                                    this.$http
                                        .post("/check/shop/" + data.result.shopId + "/cancel", json)
                                        .then(response => {
                                            let data = response.body;
                                            if (data.code == 200) {
                                                alert("取消成功！");
                                                _self.submitForAutoFn();
                                            }
                                        });
                                }
                            );
                            $("#loading").addClass("hide");
                            break;
                        case 405007:
                            alert("当前桌台有个请求正在处理，请让服务员处理");
                            break;
                        default:
                            alert(data.message);
                    }
                });
        },

        toStrategy: function (shareCardId) {
            if(shareCardId){
                this.$loading('购卡成功，正在为您计算优惠');
            }else{
                this.$loading('正在为您计算优惠');
            }
            
            var _self = this;
            var json = {};

            if (!(this.post.amount && parseFloat(this.post.amount))) {
                this.$loading.close();
                this.$toast("请先填写消费总额", "center");
                return;
            }
            if (this.init.nonPart) {
                if (
                    !this.post.nonParticationAmount &&
                    this.post.nonParticationAmount != "0"
                ) {
                    this.$loading.close();
                    this.$toast(
                        "请先填写不参与优惠项金额，<br>如未消费此类项目，请输入0",
                        "center"
                    );
                    // this.$toast.center.show({text: "请先填写不参与优惠项金额，如未消费此类项目，请输入0", position: 'bottom'});
                    return;
                } else {
                    if (
                        parseInt(this.post.nonParticationAmount) >
                        parseInt(this.post.amount)
                    ) {
                        this.$loading.close();
                        this.$toast("不参与金额不得大于总金额", "center");
                        return;
                    }
                    json.nonParticationAmount = this.post.nonParticationAmount;
                }
            }
            json.amount = this.post.amount;

            if (this.$route.query.d) {
                json.tableId = this.$route.query.d;
            }
            if (_self.init.preCheckData && _self.init.preCheckData.cashierOrderId) {
                json.cashierOrderId = _self.init.preCheckData.cashierOrderId;
            }
            // 微信扫的 显示公众号二维码
            let ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                json.terminalType = "WX";
            } else {
                json.terminalType = "ALI";
            }

            if (json.amount - 0 == 0) {
                alert("当前未结金额0元，无法付款，如账单有变化，请关闭页面，重新扫码");
                this.$loading.close();
                return false;
            }
            // 推广码
            if (this.$route.query.pid) {
                json.promoteId = this.$route.query.pid;
            }
            // 分享卡id
            if (this.shareCardId) {
                json.userCardId = this.shareCardId;
            }
            // if (this.shareActivity && this.shareActivity.id) {
            //     json.userCardId = this.shareActivity.id;
            // }
            // console.log("分享卡id" + this.shareCardId);
            if (navigator.onLine) {
                this.$http
                    .post("/check/shop/" + this.$route.query.id + "/autonomy", json)
                    .then(response => {
                        let data = response.body;
                        this.$loading.close();
                        if (data.code == 200) {
                            _self.$cookie.set("order_id", data.result.orderId);

                            json = _self.$route.query;
                            json.oid = data.result.orderId;
                            _self.$router.push({
                                path: "/strategy",
                                query: json
                            });
                        } else if (data.code == 405004) {
                            _self.$confirm(
                                "您在" +
                                (data.result.shopname ||
                                    "本店" + data.result.tableNo + "号桌") +
                                "有一个买单正在进行中,是否放弃此订单？",
                                function () {
                                    _self.$http
                                        .post("/check/shop/" + data.result.shopId + "/cancel", {})
                                        .then(response => {
                                            let data = response.body;
                                            if (data.code == 200) {
                                                alert("取消成功！");
                                                // _self.submitFn();
                                            }
                                        });
                                },

                                function () {},
                                "放弃",
                                "取消"
                            );
                        } else if (data.code == 405807) {
                            _self.$toast("本次消费金额系统已为您读取，将继续为您买单");
                            setTimeout(function () {
                                _self.refresh();
                            }, 1000);
                        } else if (data.code == 405098) {
                            _self.$toast("账单已变化，请刷新账单", "center");
                            _self.$loading.close();
                            setTimeout(function () {
                                _self.refresh();
                            }, 1000);
                        } else if (data.code == 405099) {
                            this.$loading.close();
                            _self.disable = false;
                            _self.$toast("账单已变化，请重新扫描二维码", "center");
                        } else {
                            alert(data.message);
                        }
                    });
            } else {
                var tmid = setTimeout(function () {
                    _self.num++;
                    if (_self.num == 3) {
                        clearTimeout(tmid);
                        _self.num = 0;
                        alert("网络已断开,请检查网络后刷新页面");
                        _self.$loading.close();
                        return false;
                    }
                    // _self.submitFn()
                }, 1000);
            }
        },

        // 不要优惠
        submit: function () {
            var that = this;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            // if (that.init.needAuthFuiou) {
            //     that.authorFuiou();
            //     return false;
            // }
            this.timer = setTimeout(() => {
                that.submits();
            }, 100);
        },
        submits: function () {
            this.$loading();
            var _self = this;
            let result = this.data.result;
            if (!(this.post.amount && parseFloat(this.post.amount))) {
                this.$loading.close();
                this.$toast("请先填写消费总额", "center");
                return;
            }

            var json = {
                amount: this.post.amount,
                url: location.href,
                payCategory: _self.init.payMode
            };
            if (json.amount - 0 == 0) {
                alert("当前未结金额0元，无法付款，如账单有变化，请关闭页面，重新扫码");
                this.$loading.close();
                return false;
            }

            if (_self.key_json.d) {
                json.tableId = _self.key_json.d;
            }
            if (_self.init.preCheckData && _self.init.preCheckData.cashierOrderId) {
                json.cashierOrderId = _self.init.preCheckData.cashierOrderId;
            }
            let ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                json.terminalType = "WX";
            } else {
                json.terminalType = "ALI";
            }
            if (navigator.onLine) {
                this.$http
                    .post("/check/shop/" + this.$route.query.id + "/pay", json)
                    .then(response => {
                        let data = response.body;
                        if (data.code == 200) {
                            this.$loading.close();
                            switch (_self.init.payMode) {
                                case "1005":
                                    var js = data.result.js;
                                    var pay = data.result.pay;
                                    pay.success = function () {
                                        _self.disable = false;
                                        alert("支付成功");
                                    };
                                    pay.cancel = function () {
                                        _self.disable = false;
                                        _self.$http
                                            .post("/order/" + data.result.orderId + "/pay/revoke")
                                            .then(() => {
                                                // 关掉支付
                                                //   _self.shareCardId = false;
                                                //   _self.toStrategy();

                                            });
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
                                    AlipayJSBridge.call(
                                        "tradePay", {
                                            tradeNO: data.result.pay.tradeNO
                                        },
                                        function (result) {
                                            if (result.resultCode == "6001") {
                                                _self.$http
                                                    .post("/order/" + data.result.orderId + "/pay/revoke")
                                                    .then(() => {
                                                        // 关掉支付
                                                        // _self.shareCardId = false;
                                                        // _self.toStrategy();
                                                    });

                                                return;
                                            }
                                            if (result.resultCode == "9000") {
                                                _self.disable = false;
                                                alert("支付成功");
                                            }
                                        }
                                    );
                                    break;
                            }
                        } else if (data.code == 405098) {
                            _self.$loading.close();
                            _self.disable = false;
                            _self.$toast("账单已变化，请刷新账单", "center");
                            setTimeout(function () {
                                _self.refresh();
                            }, 1000);
                        } else if (data.code == 405099) {
                            _self.$loading.close();
                            _self.disable = false;
                            _self.$toast("账单已变化，请重新扫描二维码", "center");
                        } else {
                            _self.$loading.close();
                            _self.disable = false;
                            alert(data.message);
                        }
                    });
            } else {
                var tmid = setTimeout(function () {
                    _self.num++;
                    if (_self.num == 3) {
                        clearTimeout(tmid);
                        _self.num = 0;
                        this.$loading.close();
                        alert("网络已断开,请检查网络后刷新页面");
                        _self.disable = false;
                        return false;
                    }
                    _self.submit();
                }, 1000);
            }
        },
        stateFn() {
            let _self = this;
            this.$http.get("/check/" + this.init.order.orderId).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    let result = data.result;
                    if (result.step == 1) {
                        if (result.online) {
                            this.$cookie.set("order_id", data.result.orderId);
                            this.$cookie.set("table_no", data.result.tableNo);

                            this.ajaxUrl("waiting.html");
                        } else {
                            this.$toast("上宾正在加速为您配置专属优惠方案", "center");
                        }
                    } else if (result.state >= 2) {
                        let json = _self.$route.query;
                        json.oid = data.result.orderId;
                        _self.$router.push({
                            path: "/strategy",
                            query: json
                        });
                    } else {
                        this.initFn();
                    }
                } else {
                    this.initFn();
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../sui_assets/scss/selfPay.scss";

.xbind-phone-box {
    position: fixed !important;
    bottom: 0;
    z-index: 24 !important;
    width: 100%;
    height: 100%;
    left: 0;

    >div {
        color: #ffffff;
        height: 100%;
        width: 100%;

        .xbind-phone-body {
            animation: show-modal .5s;
            -webkit-animation: show-modal .5s;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 17.15rem;
            height: 17.15rem;

            .xpb-top {
                width: 14.98rem;
                height: 16.14rem;
                background: url(/sui_assets/img/strategy/bg2.png) 50% no-repeat/cover;
                margin: auto;
                position: relative;

                >img {
                    width: 1.5rem;
                    height: 1.5rem;
                    position: absolute;
                    right: 0;
                    top: -2.5rem;
                    border-radius: 50%;
                    color: #fff;
                    border: 1px solid rgb(255, 255, 255);
                    padding: 0.2rem;
                }

                .xt-body {
                    padding-top: 2rem;

                    >div {
                        background: #ffffff;
                        width: 88%;
                        margin: 0.5rem auto;
                        position: relative;
                        padding-left: 1rem;
                        padding-right: 1rem;
                        border-radius: .1rem;

                        >input {
                            color: #000;
                            height: 2rem;
                            width: 100%;
                            border: none;
                            font-size: .75rem;
                        }

                        >div {
                            color: #e09c17;
                            line-height: 2rem;
                            position: absolute;
                            right: 1rem;
                            bottom: 0;
                            font-size: .7rem;
                        }

                        &:last-child {
                            font-weight: bold;
                            font-style: normal;
                            font-stretch: normal;
                            line-height: normal;
                            letter-spacing: 5px;
                            color: #cf4737;
                            background-color: #f9d76c;
                            height: 2rem;
                            border-radius: 3rem;
                            line-height: 2rem;
                            margin: 1rem auto;
                        }
                    }
                }

                .xt-top {
                    color: #cd3f2f;
                    width: 79%;
                    height: 31%;
                    padding-top: 1.7rem;
                    margin: auto;
                    line-height: 1.8rem;

                    >span {
                        display: block;

                        &:first-child {
                            font-size: .7rem;
                            letter-spacing: 1px;
                        }

                        &:last-child {
                            font-weight: bold;
                            font-size: 1rem;
                            border-top: 1px solid #ebc9c7;
                            letter-spacing: 2px;
                        }
                    }

                    .line {}
                }
            }

            .xpb-btn {
                text-decoration: underline;
                padding-top: 1rem;
            }
        }
    }
}

.hasNothing {
    .card-box {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-items: center;
        flex-direction: column;

        img {
            width: 260px;
            height: 166px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

    }

    .iknow {
        height: 2.2rem;
        font-size: 1rem;
        color: #b06336;
        line-height: 2.2rem;
        text-align: center;
        margin: 0 auto;
        border-radius: 20px;
        margin-top: 1rem;
        letter-spacing: 3px;
        width: 9rem;
        border-radius: 1.4rem;
        box-shadow: 0 3px 0 0 #bc8a47;
        background-image: linear-gradient(to right, #f7dd86, #f4dc7e 21%, #fcefb8 53%, #efd576 85%, #f8e388);
        z-index: 999999999999999999;
    }
}

.noMenuTips {
    text-align: center;
    margin: 20px 0 60px;
    color: #999;
    font-weight: 600;
    font-size: .8rem;
}

.mycodeBox {
    margin: 20px 0 60px;

    .text {
        margin-bottom: 10px;
    }
}
</style>
