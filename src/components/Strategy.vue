<template>
<div class="strategy" id="strategy" style="display: flex;flex-direction: column;" v-if="data">
    <div class="xbg-black" v-if="xThanks" @click="xThanks = false"></div>
    <div class="praise" v-if="xThanks">
        <div class="praise_title">
            <img src="/sui_assets/img/selfPay/ganxie.png" />
        </div>
        <div class="praise_text">获赠礼品买单后自动到账</div>
    </div>

    <!-- 选择员工的弹窗 -->
    <van-popup get-container="#app" v-model="menberPopupShow" position="bottom" style="height:auto" closeable close-icon-position="top-left">
        <div class="menberPop">
            <p class="title">请选择想评价的服务员</p>
            <div class="ontent">
                <div class="menberList">
                    <div class="eachMenber" @click.stop="confirmMenber(index)" v-for="item,index in gratuityData.staffs">
                        <img :src="item.avatarUrl?item.avatarUrl:''" v-if="item.avatarUrl" class="menberImg" alt="">
                        <div class="menberImg" v-if="!item.avatarUrl">
                            <van-icon size="30px" name="manager-o" />
                        </div>
                        <p class="name">{{item.nickname}}</p>
                    </div>
                </div>
            </div>
        </div>
    </van-popup>
    <!-- 选中员工的弹窗 -->
    <van-popup get-container="#app" v-model="chooseMenberPopupShow" position="bottom" style="height:auto;overflow:visible" closeable close-icon-position="top-left">
        <div class="chooseMenberPop">
            <img :src="chooseMenberObj.avatarUrl?chooseMenberObj.avatarUrl:''" v-if="chooseMenberObj.avatarUrl" class="userImg" alt="">
            <div class="userImg" v-if="!chooseMenberObj.avatarUrl">
                <van-icon size="30px" name="manager-o" />
            </div>
            <p class="tips">匿名评价服务员</p>
            <div class="ontent">
                <div class="startBox">
                    <p class="icons" v-for="i,j in stars" @click="lightStart(j)">
                        <van-icon name="star" size="30px" v-if="i==0" color="#e3e3e3" />
                        <van-icon name="star" size="30px" v-if="i==1" color="#f5a33c" />
                    </p>
                </div>
                <p class="smallDesc">{{commentTips}}</p>
                <!-- 差评标签 -->
                <div class="tagBox negativeBox" v-if="starNum<=2&&starNum!=0">
                    <div :class="i.active?'eachTag active':'eachTag'" v-for="i,index in gratuityData.negative" @click="chooseMenberTag('n',index)">
                        {{i.content}}
                    </div>
                </div>
                <div class="tagBox positiveBox" v-if="starNum>=3">
                    <div :class="i.active?'eachTag active':'eachTag'" v-for="i,index in gratuityData.positive" @click="chooseMenberTag('p',index)">
                        {{i.content}}
                    </div>
                </div>
                <div class="feeBackBox" v-if="starNum>0">
                    <input type="text" @blur="temporaryRepair()" v-model="menberFeeback" :placeholder="(starNum<=2&&starNum!=0)?'请告诉我你遇到的问题':'你的评价将匿名反馈给我们'">
                    <button @click="submitFeeback" class="submitFeebackBtn active">匿名提交</button>
                </div>
            </div>
        </div>
    </van-popup>

    <van-popup get-container="#app" v-model="menuShow" position="bottom" style="height:auto;overflow:visible" closeable close-icon-position="top-right">
        <div class="menuPop">
            <p class="title">消费账单</p>
            <div class="each" v-for="i,j in menuData.menus">
                <div class="left">{{i.name}} <span class="detailTag" v-if="i.details">套餐</span><span class="menberTag" v-if="i.memberAmount>0&&i.memberAmount!=i.amount">会员价</span>
                    <p class="detail" v-if="i.details">
                        <span v-for="(deta,j) in i.details">{{deta.name}}{{data.count}}{{data.unit}}
                            <span v-if="i.details.length - 1 > j">,</span></span>
                    </p>
                </div>
                <p class="mid">{{i.count}}{{i.unit}}</p>

                <p class="finalPrice"> <span :class="i.memberAmount>0&&i.memberAmount!=i.amount?'oriPrice':'withe  oriPrice'">￥{{i.memberAmount}}</span>￥{{i.amount}}</p>
            </div>
            <div class="bottom" v-if="(menuData.originalTotal-0)==0">
                <!-- menuData.originalTotal==0 不存在部分结账-->
                <p class="finalList">
                    <span class="text">消费合计</span><span class="num">￥{{menuData.amount}}</span>
                </p>
                <p class="finalList finalList1" v-if="menuData.memberReduceAmount>0">
                    <span class="text">会员价优惠</span><span class="num">￥{{menuData.memberReduceAmount}}</span>
                </p>
            </div>
            <div class="bottom" v-if="(menuData.originalTotal-0)>0">
                <!-- menuData.originalTotal>0 存在部分结账-->
                <p class="finalList">
                    <span class="text">消费合计</span><span class="num">￥{{menuData.originalTotal}}</span>
                </p>
                <p class="finalList finalList1" v-if="menuData.memberReduceAmount>0">
                    <span class="text">会员价优惠</span><span class="num">￥{{menuData.memberReduceAmount}}</span>
                </p>
                <p class="finalList finalList2">
                    <span class="text">未结金额</span><span class="num">￥{{menuData.amount}}</span>
                </p>
            </div>
        </div>
    </van-popup>

    <div class="card-wrapper">
        <swiper :options="swiperOption" ref="mySwiper">
            <!-- <swiper-slide class="card cards" v-for="(item,keys) in data.strategies" :class="[keys == key+2 ? 'cards' : '', data.strategies.length == 1 ? 'swiper-no-swiping' : '' ]"  -->
            <swiper-slide class="card x-card" v-for="(item,keys) in data.strategies" :class="[keys != 0 ? 'cards' : '']" :key="keys" v-on:click="key = keys">
                <div class="card-bg x-card-bg">
                    <div class="flex" style="position: relative;overflow: hidden;">
                        <div class="x-title">
                            <!-- 方案1 "-->
                            <span class="min">{{keys+1}}</span>
                            <div class="flexSpace">
                                <p class="sjPrice">实际支付￥
                                    {{(data.comment&&data.comment.hasCommented&&giveRewordFlag&&data.comment.gratuityAmount)
                                ?(parseFloat(item.finalAmount)+
                                parseFloat(data.comment.gratuityAmount)).toFixed(2)
                                :item.finalAmount}}
                                </p>
                                <span :class="!menuData||!menuData.menus||menuData.menus.length==0?'hui button':'button'" @click="menuShow=true">
                                    查看账单
                                </span>
                            </div>

                        </div>
                        <div :class="data.strategies[0].charges?'xtitle':'xtitle hidden'">
                            <div class="xcontent" v-show="keys == 0">
                                <div style="display : inline-block;">
                                    <span>充值{{item.finalAmount}}元<span v-if="!item.automatic">当餐免单,</span>
                                        <span v-else-if="item.charges[1]">送{{_self.arr1}}，</span>
                                    </span>
                                    <span v-if="keys == 0">{{!item.automatic?'买单':'使用充值卡'}}后余额 <span style="display : inline-block" class="num">{{item.remindCharge}}元</span> </span>
                                </div>
                            </div>
                        </div>
                        <!-- <div v-else class="xtitle"></div> -->
                        <div class="x-flex-detail">
                            <div class="flexBox">
                                <div class="left">
                                    <!-- 获得奖励start- -->
                                    <div>
                                        <p class="contentTitle">赠送权益</p>
                                        <div class="contentDetail">
                                            <!-- 有内容 -->
                                            <div v-if="item.charges||item.upgrades||item.got">
                                                <div class="use" v-if="item.charges&&!get.celling" v-for="get in data.strategies[0].charges">
                                                    <div v-if="get.category == '1016'">
                                                        <div class="ellipsis">{{get.name}} </div>
                                                    </div>
                                                    <div v-else-if="get.category == '1013'">
                                                        <div>
                                                            <span v-if="get.category == '1013'">会员等级升为</span>
                                                            <span v-else class="ellipsis">{{get.name}}</span>
                                                            <span class="text-blue " v-if="get.category == '1013'">{{get.name}}</span>
                                                            <span class="text-blue " v-if="get.category == '1015'">{{get.point}}</span>
                                                            <span class="text-blue " v-if="get.category == '1017'">{{get.amount}}</span>
                                                        </div>
                                                    </div>
                                                    <div v-else-if="get.category == '1014'&&get.amount>0&&!get.celling">
                                                        <div>赠送金额<span class="">{{get.amount}}元</span></div>
                                                    </div>
                                                    <div v-else-if="get.category == '1017'">
                                                        <div> 代用币 <span class="">{{get.amount}}</span></div>
                                                    </div>
                                                    <div v-else>
                                                        <div> 积分<span class="">{{get.point}}</span></div>
                                                    </div>
                                                </div>
                                                <div class="use" v-for="upgrade in item.upgrades">
                                                    <div>
                                                        <span v-if="upgrade.category == '1013'">会员等级升为</span>
                                                        <span v-else class="ellipsis">{{upgrade.name}}</span>
                                                        <span class="text-blue" v-if="upgrade.category == '1013'">{{upgrade.name}}</span>
                                                        <span class="text-blue" v-if="upgrade.category == '1015'">{{upgrade.point}}</span>
                                                        <span class="text-blue" v-if="upgrade.category == '1017'">{{upgrade.amount}}</span>
                                                        <!-- <span class="text-blue" v-else-if="upgrade.count">{{upgrade.count}}张</span> -->
                                                    </div>
                                                </div>
                                                <div class="use" v-for="get,getIndex in item.got">
                                                    <div v-if="get.category == '1016'&&getIndex<3">
                                                        <div class="ellipsis"> {{get.name}}</div>
                                                    </div>
                                                    <div v-if="get.category == '1015'&&getIndex<2">
                                                        <div> 积分<span class="">{{get.point}}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- 没有内容 -->
                                            <div class="noData" v-else>无</div>
                                        </div>
                                        <!-- 获得奖励end- -->
                                    </div>
                                    <!-- <div class="contentDetail" v-if="data.strategies[keys].charges">
                                        <p><span>储值卡余额 ￥{{item.remindCharge}}</span></p>
                                    </div> -->
                                </div>
                            </div>
                            <!-- 优惠抵扣 -->
                            <div @click="toastFlag=true">
                                <p class="text-right contentTitle " style="text-align:left">
                                    <span>优惠抵扣</span>
                                    <span class="text-right price" v-if="item.nonPart|| item.useAll.length ||item.segmentAll.length"><span> -￥{{data.strategies[keys].usedAmount}}</span>
                                        <span class="van-icon van-icon-arrow"></span><span class="van-icon van-icon-arrow"></span>
                                    </span>
                                    <span class="text-right price" v-else>-￥0</span>
                                </p>
                            </div>
                            <div class="use" v-if="item.nonPart|| item.useAll.length ||item.segmentAll.length">
                                <div class="all" v-if="item.useAll.length">
                                    <div class="benefit" v-for="use,ii in item.useAll" >
                                        <div class="contentDetail" v-if="ii<2">{{use.content}} -￥{{use.amount + ((use.count&&use.type !== "SETMEAL") ? "(" + use.count + "张)":"")}}</div>
                                    </div>
                                </div>
                                <div class="segment" v-if="item.segmentAll.length&&item.useAll.length<2">
                                    <div class="benefit" :class="use.type=='6011'?'text-blue':''" v-for="use in item.segmentAll">
                                        <div class="contentDetail">
                                            <span class="items" v-if="use.type=='6011'">使用充值卡</span>
                                            <span class="items" v-else>{{use.content}}</span>
                                            <span>-￥{{use.amount + ((use.count&&use.type !== "SETMEAL") ? "(" + use.count + "张)":"")}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="data.strategies[key].segmentAll.length+data.strategies[key].useAll.length>2" style="line-height: 0.5;">......</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 策略页面下是否是会员的提示   开卡 -->
                <div class="midTips" v-if="key==keys">
                    <!-- 不是会员 -->
                    <p class="content" @click="xmodelBind=true" v-if="data.strategies[keys].needValidate||(_self.data.strategies[keys].needPhone)"><span class="qus_icon">?</span> 您还不是会员, 本方案需要先开卡成为本店会员<button>立即开卡</button></p>
                    <!-- 是会员 -->
                    <p class="content" v-else="!data.strategies[keys].needValidate">
                        <span v-if="keys == 0">本方案为推荐方案</span>
                        <span v-if="keys > 0&&keys!=data.strategies.length-1">本方案为{{data.strategies[keys].title}}</span>
                        <span v-if="keys==data.strategies.length-1">不用优惠的你一定是个真土豪~</span>
                    </p>
                </div>
            </swiper-slide>
            <swiper-slide class="" style="width: 5vw;transform: scale(1);text-align : center">
            </swiper-slide>
        </swiper>

    </div>

    <div class="rewardBox" :style="has_reward_activity&&(data.comment.hasCommented==true)?'height:270px':''">
        <!-- 有打赏活动,但是已经评价过了 -->
        <div class=" rewardHead hasCommented" v-if="has_reward_activity&&(data.comment.hasCommented==true)">
            <div class="content flexBox">
                <div class="flexStart left">
                    <!-- 服务员头像 -->
                    <img :src="chooseMenberObj.avatarUrl" v-if="chooseMenberObj.avatarUrl" alt="" class=" hasService">
                    <p class="hasNoService_img" v-if="!chooseMenberObj.avatarUrl"><img src="/sui_assets/img/strategy/server_default.png" class="hasService" alt=""></p>
                    <p class="bdyj">已评价，本单已减{{data.comment?data.comment.reduceAmount:''}}元</p>
                </div>
                <div class="right">

                </div>
            </div>
        </div>
        <!-- 评价完成之后，换购活动 -->
        <div class=" rewardHead hasCommented noBorder" @click="checkout" v-if="has_reward_activity&&data.comment.gratuityAmount&&(data.comment.hasCommented==true)">
            <div class="content flexBox">
                <div class="toReword flexSpace" v-if="(data.comment.hasCommented==true)&&data.comment.gratuityAmount">
                    <p class="left flexStart">
                        <img src="/sui_assets/img/strategy/gift.png" class="hasService" alt="">
                        <span> 加{{data.comment.gratuityAmount}}元<span v-if="data.comment.benefits&&data.comment.benefits.length>0">,换购<a class="coupon">{{data.comment.benefits[0].name}}</a></span>
                        </span>
                    </p>
                    <div class="right">
                        <label class="demo--label">
                            <!-- <input class="demo--radio" type="checkbox" v-if="giveRewordFlag"  checked name="demo-radio">
                            <input class="demo--radio" type="checkbox" v-if="!giveRewordFlag" name="demo-radio"> -->

                            <p class="demo--radioInput" v-if="giveRewordFlag"></p>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <!-- 有打赏活动,还没有评价过 -->
        <div class=" rewardHead noBorder" v-if="has_reward_activity&&(data.comment.hasCommented!=true)" @click="getGratuity">
            <div class="content flexBox" v-if="data.comment.staffName">
                <!-- 左面的服务员信息 -->
                <!-- 如果有默认的服务员 -->
                <div class="flexStart">
                    <p class="hasNoService_img" v-if="!data.comment.staffAvatarUrl"><img src="/sui_assets/img/strategy/server_default.png" class="hasService" alt=""></p>
                    <img :src="data.comment.staffAvatarUrl" alt="" class="hasService" v-if="data.comment.staffAvatarUrl">
                    <div>
                        <p>诚邀评价立减 ￥{{data.comment?data.comment.reduceAmount:''}}</p>
                        <p><span class="name"> 专属服务员：{{data.comment.staffName}}</span></p>
                    </div>
                </div>
                <van-icon name="arrow" size="20px" />
            </div>
            <div class="content flexBox" v-if="!data.comment.staffAvatarUrl&&!data.comment.staffName">
                <!-- 没有服务员 -->
                <div class="flexStart">
                    <p class="hasNoService_img"><img src="/sui_assets/img/strategy/server_default.png" class="hasService" alt=""></p>
                    <p>诚邀评价立减 ￥{{data.comment?data.comment.reduceAmount:''}}</p>
                </div>
                <van-icon name="arrow" size="20px" />
            </div>
        </div>
    </div>
    <div class=" x-dixed" v-if="toastFlag">
        <div class="detailed" style="z-index: 25;">
            <div class="xdetailed modal-inner">
                <div class="x-toastT">方案详情</div>
                <div class="label" v-if="data.strategies[key].useAll.length ||data.strategies[key].segmentAll.length">
                    <img @click.prevent="" class="xtimg" src="/sui_assets/img/strategy/deduction.png" alt="">
                </div>
                <div class="use" v-if="data.strategies[key].nonPart|| data.strategies[key].useAll.length ||data.strategies[key].segmentAll.length">
                    <div class="all" v-if="data.strategies[key].useAll.length">
                        <div class="benefit" v-for="use in data.strategies[key].useAll">
                            <div class="">{{use.content}}</div>
                            <div class="">
                                -￥{{use.amount + ((use.count&&use.type !== "SETMEAL") ? "(" + use.count + "张)":"")}}
                            </div>
                        </div>
                    </div>
                    <div class="segment" v-if="data.strategies[key].segmentAll.length">
                        <div class="benefit" :class="use.type=='6011'?'text-blue':''" v-for="use in data.strategies[key].segmentAll">
                            <div class=""><span class="items" v-if="use.type=='6011'">使用充值卡</span><span class="items" v-else>{{use.content}}</span></div>
                            <div class="">
                                -￥{{use.amount + ((use.count&&use.type !== "SETMEAL") ? "(" + use.count + "张)":"")}}
                            </div>
                        </div>
                    </div>

                </div>
                <div class="got" v-if="data.strategies[key].got||data.strategies[key].charges">
                    <div class="label">
                        <img @click.prevent="" class="xtimg" src="/sui_assets/img/strategy/getRewards.png" alt="">
                    </div>
                    <div class="overflow" style="padding:0;margin:0;">
                        <div class="use" v-if="data.strategies[key].charges&&!get.celling" v-for="get in data.strategies[0].charges">
                            <div class="" v-if="get.category == '1016'">
                                <!-- <img @click.prevent="" src="/sui_assets/img/strategy/coupons1.png" alt=""> -->
                                <div class="ellipsis"> {{get.name}} <span class="xt-float">{{get.count}}张</span> </div>
                                <!-- <div class="text-blue">{{get.count}}张</div> -->
                            </div>
                            <div class="" v-else-if="get.category == '1013'">
                                <!-- <img @click.prevent="" src="/sui_assets/img/strategy/charges1.png" alt=""> -->
                                <div>
                                    <span v-if="get.category == '1013'">会员等级升为</span>
                                    <span v-else class="ellipsis">{{get.name}}</span>
                                    <span class="text-blue xt-float" v-if="get.category == '1013'">{{get.name}}</span>
                                    <span class="text-blue xt-float" v-if="get.category == '1015'">{{get.point}}</span>
                                    <span class="text-blue xt-float" v-if="get.category == '1017'">{{get.amount}}</span>
                                    <span class="text-blue xt-float" v-else-if="get.count">{{get.count}}张</span>
                                </div>
                            </div>
                            <div class="" v-else-if="get.category == '1014'&&get.amount>0&&!get.celling">
                                <!-- <img @click.prevent="" src="/sui_assets/img/strategy/charges1.png" alt=""> -->
                                <div>赠送金额 <span class="xt-float">{{get.amount}}元</span></div>
                                <!-- <div class="text-blue">￥{{get.amount}}</div> -->
                            </div>
                            <div class="" v-else-if="get.category == '1017'">
                                <!-- <img @click.prevent="" src="/sui_assets/img/strategy/coins.png" alt=""> -->
                                <div> 代用币 <span class="xt-float">{{get.amount}}</span></div>
                                <!-- <div class="text-blue">{{get.amount}}</div> -->
                            </div>
                            <div class="" v-else>
                                <!-- <img @click.prevent="" src="/sui_assets/img/strategy/points1.png" alt=""> -->
                                <div> 积分 <span class="xt-float">{{get.point}}</span></div>
                                <!-- <div class="text-blue">{{get.point}}</div> -->
                            </div>
                        </div>

                        <div class="use" v-for="upgrade in data.strategies[key].upgrades">
                            <!-- <img @click.prevent="" src="/sui_assets/img/strategy/upgrade1.png" alt=""> -->
                            <div>
                                <span v-if="upgrade.category == '1013'">会员等级升为</span>
                                <span v-else class="ellipsis">{{upgrade.name}}</span>
                                <span class="text-blue xt-float" v-if="upgrade.category == '1013'">{{upgrade.name}}</span>
                                <span class="text-blue xt-float" v-if="upgrade.category == '1015'">{{upgrade.point}}</span>
                                <span class="text-blue xt-float" v-if="upgrade.category == '1017'">{{upgrade.amount}}</span>
                                <span class="text-blue xt-float" v-else-if="upgrade.count">{{upgrade.count}}张</span>
                            </div>
                        </div>
                        <div class="use" v-for="get in data.strategies[key].got">
                            <div class="" v-if="get.category == '1016'">
                                <!-- <img @click.prevent="" src="/sui_assets/img/strategy/coupons1.png" alt=""> -->
                                <div class="ellipsis"> {{get.name}}<span class="xt-float">{{get.count}}张</span></div>
                                <!-- <div class="text-blue">{{get.count}}张</div> -->
                            </div>
                            <div class="" v-else>
                                <!-- <img @click.prevent="" src="/sui_assets/img/strategy/points1.png" alt=""> -->
                                <div> 积分 <span class="xt-float">{{get.point}}</span></div>
                                <!-- <div class="text-blue">{{get.point}}</div> -->
                            </div>
                        </div>

                    </div>
                </div>
                <div v-if="key == data.strategies.length-1">
                    <img @click.prevent="" src="/sui_assets/img/strategy/nothing.png" alt="" style=" width: 85%; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto;">
                </div>
                <img @click="toastFlag = false" src="/sui_assets/img/selfPay/close2.png" alt="" style="width:10%;position: absolute; bottom: -3rem; left: 45%;border-radius: 50%; border: 1px solid #ffffff; padding: 0.2rem;">
            </div>

        </div>

    </div>
    <div class="xsubmitBox">
        <button class="xsubmit" v-if="(payment&&payment.payMode)||data.strategies[key].finalAmount ==0" v-on:click="submitFn(data.strategies[key].task)">支付 ¥ {{(data.comment&&data.comment.hasCommented&&giveRewordFlag&&data.comment.gratuityAmount)?(parseFloat(data.strategies[key].finalAmount)
                  +
                  parseFloat(data.comment.gratuityAmount)).toFixed(2):data.strategies[key].finalAmount}}</button>
    </div>
    <!-- 充值详细内容   ---------------end  -->
    <div class="paypop" v-if="popswitch && data.strategies[key].task">
        <div>
            <div class="colorline"></div>
            <div class="titile">感谢消费,返<span style="color:#ed7a5f;font-size:1.5rem;">{{data.strategies[key].task[0].amount}}</span>元现金</div>
        </div>
        <div>
            <img src="/sui_assets/img/strategy/paypop1.png" alt="" style="width: 100%;margin-top: 1.5rem;margin-bottom: 1.5rem;">
        </div>
        <div class="paypop_btn" v-on:click="paypop">知道了</div>
        <div class="paypop_bottom">现金奖励将直接发放至“微信钱包”</div>
    </div>
    <div class="model" v-if="popswitch && data.strategies[key].task"></div>
    <div class="xmodel-bindphone" v-if="xmodelBind"></div>
    <div class="xbind-phone" v-if="xmodelBind">
        <div>
            <div class="xbind-phone-body">
                <div class="xpb-top">
                    <img src="/sui_assets/img/selfPay/close2.png" alt="" @click="needValidateClick">
                    <div class="xt-top">
                        <span>本买单方案将<span v-if="chargesModel">赠送福利到</span><span v-if="!chargesModel">充值进</span>您的账户</span>
                        <span class="line"></span>
                        <span>需要您领卡加入会员</span>
                    </div>
                    <div class="xt-body">
                        <div style="height: 2rem;">
                            <input type="tel" v-model='bind.phone' placeholder="请输入您的手机号码" maxlength='11' @blur="temporaryRepair()">
                        </div>
                        <div style="height: 2rem;">
                            <input type="tel" v-model='bind.validateCode' placeholder="请输入短信验证码" @blur="temporaryRepair()">
                            <div @click="validate">{{helpBlock.text}}</div>
                        </div>
                        <div @click="submit">现在领卡</div>
                    </div>
                </div>
                <div v-if="chargesModel" class="xpb-btn" v-on:click="skipClick">先跳过, 回头再说</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import 'swiper/dist/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// import linkPicUrl from './module/linkPicUrl/linkPicUrl'
import {
    Popup,
    Collapse,
    CollapseItem,
    Dialog,
    Icon,
    Toast
} from 'vant';
Vue.use(Popup);
Vue.use(Dialog);
Vue.use(VueAwesomeSwiper);
Vue.use(Collapse).use(CollapseItem);
Vue.use(Icon);
Vue.use(Toast);
import 'vant/lib/popup/style';
import 'vant/lib/dialog/style';
import 'vant/lib/icon/style';
import 'vant/lib/toast/style';
export default {
    name: "Strategy",
    components: {
        Popup,
        // linkPicUrl
    },
    data() {
        const _self = this;
        return {
            strageTimer:null,
            linkPicUrl:'',
            // 本单账单
            menuData: {
                menus: []
            },
            menuShow: false,
            // 动画完成标志
            bounceInDownFlag: 'animated_none',
            // 是否打赏服务员
            giveRewordFlag: false,
            // 没有打赏活动
            no_reward_activity: false,
            has_reward_activity: true,
            // 员工底部弹窗
            menberPopupShow: false,
            // 选中某个员工底部弹窗
            chooseMenberPopupShow: false,
            confirmMenberShow: false,
            chooseMenberObj: {},
            // 获取打赏活动
            gratuityData: {},
            activeNames: ['1'],
            stars: [1, 1, 1, 1, 1], //评价服务员的星星
            commentType: '',
            starNum: 5,
            commentTips: '你的评价会帮助我们做的更好',
            menberFeeback: '',
            chargesModel: false,
            bindPhoneFlag: null,
            skipFlag: false,
            init: "",
            // after:this.submit(),
            helpBlock: {
                text: "获取验证码",
                usable: true
            },
            bind: {},
            xmodelBind: false,
            xThanks: false,
            toastFlag: false,
            data: false,
            id: "", //orderId
            key: 0,
            bgc: '',
            payment: {},
            popswitch: false,
            more: false,
            modal: false,
            showFlower: false,
            name: "",
            arr1: [],
            lock: false,
            timer: '',
            time: '',
            popimg: '/sui_assets/img/strategy/wxbg.png',
            index: 0, //当前等级
            backgrounds: ['linear-gradient(to bottom, #5d9cec, #326acf)', 'linear-gradient(to bottom, #ef87a8, #ed7794)', 'linear-gradient(to bottom, #be9cf8, #9e79f7)', 'linear-gradient(to bottom, #48CFAD, #19A784)', 'linear-gradient(to bottom, #F9CD89, #F5A778)'],
            shadows: ['0 0px 25px 5px rgba(50, 106, 207, 0.4)', '0 0px 25px 5px rgba(237,119,148, 0.4)', '0 0px 25px 5px rgba(158, 121, 247, 0.4)', '0 0px 25px 5px rgba(25, 167, 132, 0.4)', '0 0px 25px 5px rgba(242, 194, 111, 0.4)'],

            swiperOption: {
                initialSlide: 0,
                centeredSlides: false,
                slidesPerView: 'auto',
                spaceBetween: 0,
                slideToClickedSlide: true,
                slidesOffsetBefore: 15,
                slidesOffsetAfter: 60,
                // touchRatio:0.5,  
                speed: 1000,
                longSwipesRatio: 0.3,
                // threshold:15,  
                // direction: 'horizontal',
                // followFinger:false,  
                // observer: true,//修改swiper自己或子元素时，自动初始化swiper  /
                // observeParents: true,//修改swiper的父元素时，自动初始化swiper  
                // loop : true,
                pagination: {
                    el: '#swiper-pagination',
                    clickable: true,
                },
                on: {
                    slideChange() {
                        console.log('改变饿了')
                        console.log(this.activeIndex)

                        _self.toggleFn(this.activeIndex);

                    }
                }
            },
        }
    },
    beforeCreate() {
        sessionStorage.setItem('jumpFlag', "true")
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            let wxJson = {};
            wxJson.url = location.href;
            this.$http.post("/auth/sign", wxJson).then(response => {
                if (response.body.code == 200) {
                    let result1 = response.body.result;
                    result1.jsApiList = [
                        'hideMenuItems',
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline'
                    ];
                    wx.config(result1);
                    wx.ready(function () {
                        wx.hideMenuItems({
                            menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                        wx.hideOptionMenu();

                    })

                }
            })
        }

    },
    created() {
           // 判断是否有pid
        if (this.$route.query.pid) {
            this.linkPicUrl = this.$cookie.get(this.$route.query.pid)
        }
        this.initFn();
        this.getMenu()
    },
    mounted() {

        if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', this.backbtn); //false阻止默认事件
        }
        // 加一个动画
        let that = this;
        setTimeout(function () {
            that.bounceInDownFlag = 'animated_none';
        }, 100)
        setTimeout(function () {
            that.bounceInDownFlag = 'bounceInDown';
        }, 300)
        setTimeout(function () {
            that.bounceInDownFlag = 'swing';
        }, 1500)

    },
    watch: {
        giveRewordFlag(VAL) {
            console.log(VAL)
        }
    },
    methods: {
        checkout() {
            this.giveRewordFlag = !this.giveRewordFlag
            console.log(this.giveRewordFlag)
        },
        // 获取账单
        getMenu() {
            let that = this;
            const id = that.$route.query.oid || that.$cookie.get("order_id");
            that.$http.get("/order/" + id + "/menus", {}).then(response => {
                if (response.body.code == 200) {
                    that.menuData = response.body.result;
                }
            })
        },
        // 选中某个员工
        confirmMenber(index) {
            this.confirmMenberShow = true;
            console.log(Number(index) >= 0)
            if (Number(index) >= 0) {
                this.chooseMenberObj = this.gratuityData.staffs[index];
            }

            this.stars = [1, 1, 1, 1, 1];
            this.giveRewordFlag = false;
            this.menberPopupShow = false;
            this.chooseMenberPopupShow = true;

        },
        // 点亮星星
        lightStart(index) {
            this.stars = [0, 0, 0, 0, 0];
            this.stars.splice(index, 1, 1);
            for (var i = 0; i <= index; i++) {
                this.stars.splice(i, 1, 1);
            };
            this.starNum = index + 1;
            sessionStorage.setItem('starNum', this.starNum)
            if (this.starNum >= 3) {
                this.giveRewordFlag = true;
            } else {
                this.giveRewordFlag = false;
            }
            switch (index) {
                // 一星两星是差评
                case 0:
                    this.commentTips = '非常不满意，各方面都很差';
                    break;
                case 1:
                    this.commentTips = '不满意，比较差';
                    break;
                case 2:
                    this.commentTips = '一般,需要改进';
                    break;
                case 3:
                    this.commentTips = '比较满意,仍可改进';
                    break;
                case 4:
                    this.commentTips = '非常满意,各方面都很好';
                    break;
            }
        },
        // 选择好评差评标签
        chooseMenberTag(type, i) {
            this.commentType = type;
            if (type == 'n') {
                // 差评
                this.$set(this.gratuityData.negative[i], 'active', this.gratuityData.negative[i]['active'] ? false : true)
            } else {
                this.$set(this.gratuityData.positive[i], 'active', this.gratuityData.positive[i]['active'] ? false : true)
            }
        },
        // 提交所有评价
        submitFeeback() {
            let that = this;

            let json = {
                activityId: "",
                content: "",
                ruleTupleId: "",
                staffId: "",
                starts: 0,
                tags: []
            }
            sessionStorage.setItem('starNum', that.starNum)

            if (that.starNum > 0) {
                json.content = that.menberFeeback;

                json.starts = that.starNum;
                if (that.starNum >= 3) {
                    json.satisfied = true
                } else {
                    json.satisfied = false
                }
                json.staffId = that.chooseMenberObj.id;
                json.activityId = that.gratuityData.activityId;
                json.ruleTupleId = that.gratuityData.ruleTupleId;
                let tagArr = [];
                if (that.commentType == 'n') {
                    // 差评
                    tagArr = that.gratuityData.negative.filter(function (item) {
                        if (item.active == true) {
                            return true;
                        }
                    })
                } else {
                    tagArr = that.gratuityData.positive.filter(function (item) {
                        if (item.active == true) {
                            return true;
                        }
                    })
                }
                json.tags = tagArr.map((i, j) => {
                    return i.id;
                })
            } else {
                that.$toast('请打星')

            }

            const id = that.$route.query.oid || that.$cookie.get("order_id");
            that.$http.post("/gratuity/order/" + id + "/comment", json).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    that.chooseMenberPopupShow = false;
                    Toast({
                        message: '感谢您的评价,\n已为你减免' + that.data.comment.reduceAmount + '元',
                        duration: 5000
                    });
                    // 评价完成,刷新页面
                    that.getStrategies();

                } else {

                    that.$toast(data.message);
                }
            });
        },
        // 获取打赏活动,给服务员的标签
        getGratuity() {
            let _self = this;
            const id = _self.$route.query.oid || _self.$cookie.get("order_id");
            _self.$http.get("/gratuity/order/" + id + "/comment", {
                key: {
                    // "type": this.getVersion()
                }
            }).then(response => {
                if (response.body.code == 200) {
                    _self.gratuityData = response.body.result;
                    if (response.body.result.staff) {
                        _self.chooseMenberObj.id = response.body.result.staff.id
                    }
                    // 将服务员排序,有头像的在前面
                    let staffsArr = [];
                    if (response.body.result.staffs) {
                        for (var i = 0; i < response.body.result.staffs.length; i++) {
                            if (response.body.result.staffs[i].avatarUrl) {
                                staffsArr.unshift(response.body.result.staffs[i])
                            } else {
                                staffsArr.push(response.body.result.staffs[i])
                            }
                        }
                    }
                    _self.gratuityData.staffs = staffsArr;
                    //  
                    if (_self.data.comment && _self.data.comment.staffName) {
                        _self.chooseMenberObj.avatarUrl = _self.data.comment.staffAvatarUrl ? _self.data.comment.staffAvatarUrl : '';
                        _self.chooseMenberObj.name = _self.data.comment.staffName;
                        // 绑定了服务员
                        _self.confirmMenber();
                        console.log('绑定了服务员')
                    } else {
                        _self.chooseMenberObj = {};
                        // 没有绑定服务员
                        _self.menberPopupShow = true;
                        console.log('没有绑定服务员')

                    }

                } else {
                    alert(response.body.message)
                }
            });
        },
        temporaryRepair() {
            setTimeout(() => {
                const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);

        },
        getStrategies() {
            let _self = this;
            const id = _self.$route.query.oid || _self.$cookie.get("order_id");
            _self.id = id;
            _self.$http.get("/check/" + id).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    if (data.result.amount && data.result.tableNo) {
                        _self.setTitle(data.result.tableNo + "号桌消费" + data.result.amount + "元") //设置页面的头
                    } else if (data.result.amount) {
                        _self.setTitle("消费 " + data.result.amount + " 元") //设置页面的头
                    }
                    if (data.result.comment) {
                        // 有评价立减活动
                        _self.has_reward_activity = true;
                        if (data.result.comment.hasCommented && sessionStorage.getItem('starNum') >= 3) {
                            _self.giveRewordFlag = true;
                        }
                    } else {
                        _self.has_reward_activity = false;
                    }

                    if (!data.result.strategy && !data.result.strategies) {
                       this.strageTimer= setTimeout(function () {
                            _self.getStrategies();
                        }, 1000);
                        return;
                    }
                    if (data.result.strategy) {
                        data.result.strategies = [data.result.strategy];
                    }
                    if (data.result.strategies[0].charges) {
                        data.result.charge = data.result.strategies[0];
                    }
                    var item1 = data.result.strategies[0];
                    if (item1.used || item1.nonPart) {
                        item1.check = true;
                    }
                    // console.log(data.result.strategies[1].got)
                    for (let i in data.result.strategies[0]) {
                        let arr = [];
                        for (let j in data.result.strategies[0].charges) {
                            let benefit = data.result.strategies[0].charges[j];
                            if (!benefit.celling) {
                                switch (benefit.category) {
                                    case "1014":
                                        arr.push(benefit.amount ? (benefit.amount + "元") : '');
                                        break;
                                    case "1015":
                                        arr.push(benefit.amount ? (benefit.amount + "积分") : '');
                                        break;
                                    case "1016":
                                        arr.push(benefit.name + "（" + benefit.count + "张）");
                                        break;
                                    case "1017":
                                        arr.push(benefit.amount ? (benefit.amount + "元") : '');
                                        break;
                                }
                            }
                        }
                        // data.result.strategies[0].charges.str = arr.join("、");
                        _self.arr1 = arr.join("+");
                    }

                    for (let i in data.result.strategies) {
                        let useAll = [],
                            segmentAll = [],
                            usedAmount = 0;
                        if (data.result.strategies[i].used) {
                            let item = data.result.strategies[i].used;
                            for (let j in item) {
                                usedAmount = item[j].amount - 0 + usedAmount;
                                let type = item[j].type;
                                //自己的权益放在segment中
                                if (type == '6010' || type == '6009' || type == '6011' || type == '6016') {
                                    segmentAll.push(item[j]);
                                } else {
                                    if (type == '6017') {
                                        data.result.strategies[i].chargeFree = item[j];
                                    }
                                    // 抹零---不计入优惠---不显示
                                    if (type != '6042') {
                                        useAll.push(item[j]);
                                    }

                                }
                            }
                        }
                        data.result.strategies[i].usedAmount = usedAmount.toFixed(2);
                        data.result.strategies[i].useAll = useAll;
                        data.result.strategies[i].segmentAll = segmentAll;
                        data.result.strategies[i].color = _self.backgrounds[i % 5];
                        data.result.strategies[i].shadows = _self.shadows[i % 5];
                    }
                    _self.data = data.result;

                    // _self.socket();
                    // 只有一条策略且没有打赏活动,且实付金额大于零,直接拉起支付
                    if (!_self.has_reward_activity) {
                        if (data.result.strategies.length == 1 && !_self.has_reward_activity && ((data.result.strategies[_self.key].finalAmount - 0) > 0)) {
                            _self.submitFn(data.result.strategies[_self.key].task)
                        }
                    } else {
                        if (data.result.strategies.length == 1 && !_self.has_reward_activity && (((_self.data.comment.gratuityAmount + data.result.strategies[_self.key].finalAmount) - 0) > 0)) {
                            _self.submitFn(data.result.strategies[_self.key].task)
                        }
                    }

                } else {
                    if (data.code == 404014) {

                        _self.$router.replace({
                            path: '/selfPay',
                            query: _self.$route.query
                        })
                    }
                    if (_self.bindPhoneFlag != null && _self.bindPhoneFlag != true) {
                        _self.$router.replace({
                            path: '/selfPay',
                            query: _self.$route.query
                        });
                    }

                }
            });
        },
        initFn() {
            let _self = this;
            _self.showFlower = true
            _self.$loading('正在匹配适合您的优惠');
            setTimeout(function () {
                _self.$loading.close();
            }, 1000);
            _self.$http.get("/shop/" + (_self.$route.query.id || _self.$route.query.guestid) + "/paymode", {
                key: {
                    "type": _self.getVersion()
                }
            }).then(response => {
                if (response.body.code == 200) {
                    if (response.body.result.oasis) {
                        _self.authorFuiou();
                        return;
                    }
                    _self.payment = response.body.result;
                    _self.getStrategies();
                } else {
                    _self.getStrategies();
                }
            });

        },
        goBack() {
            this.cancelPay();
            window.removeEventListener('popstate', this.goBack, false);
            this.$router.go(-1);
            // this.$router.replace({path: '/'});
            //replace替换原路由，作用是避免回退死循环
        },
        switchStateFn(item) {
            // console.log(item);
            this.$set(item, "check", !item.check);
        },
        showMore: function (index) {
            this.$set(this.data.strategies[index], "check", !this.data.strategies[index].check);
        },
        backbtn: function () {
            var _self = this
            this.popswitch = false;
            if (_self.timer) {
                clearInterval(_self.timer)
            }

        },
        chargeFn: function () {
            this.$route.query.type = "channel";
            if (this.data.recommend && this.data.recommend.ruleTupleId) {
                this.$route.query.rid = this.data.recommend.ruleTupleId;
            }
            this.$router.push({
                path: '/charge',
                query: this.$route.query
            });

        },
        skipClick() {
            this.xmodelBind = false;
            this.skipFlag = true;
            this.data.strategies[this.key].needValidate = false;
            this.lock = false
            this.submitFn();
        },
        needValidateClick() {
            this.xmodelBind = false
            this.lock = false
        },
        validate() {
            if (!this.helpBlock.usable) {
                return
            }
            if (this.bind.phone && this.bind.phone.length == 11) {
                this.$loading("加载中...");
                let _self = this;
                this.$http.post("/validate/bindup", {
                    "phone": this.bind.phone
                }).then(response => {
                    let data = response.body;
                    this.$loading.close();
                    if (data.code == 200) {
                        let second = 90;
                        this.$toast("发送成功");
                        this.init = setInterval(function () {
                            second--;
                            if (!second) {
                                clearInterval(_self.init);
                                _self.helpBlock.text = "重新获取";
                                _self.helpBlock.usable = true;
                                return;
                            }
                            _self.helpBlock.text = "已发送 " + second + " s";
                            _self.helpBlock.usable = false;
                        }, 1000);
                    } else {
                        this.helpBlock.usable = true;
                        this.$toast(data.message);
                    }
                });
            } else {
                this.$toast("请输入正确的手机号");
            }
        },
        submit() {
            let _self = this;
            if (_self.bind.phone && _self.bind.phone.length == 11 && _self.bind.validateCode && _self.bind.validateCode.length == 6) {
                let state = _self.$loading("加载中...");
                if (!state) {
                    if (_self.$route.query.id || _self.$route.query.guestid) {
                        _self.bind.shopId = _self.$route.query.id || _self.$route.query.guestid;
                    }
                    // 推广码
                    if (_self.$route.query.pid) {
                        _self.bind.promoteId = _self.$route.query.pid;
                    }
                    _self.$http.post("/phone/bindup", _self.bind).then(response => {
                        console.log(data)
                        let data = response.body;
                        _self.$loading.close();
                        if (data.code == 200) {
                            if (data.result && data.result.token) {
                                console.log(data.result.token)
                                _self.$cookie.set("token", data.result.token, {
                                    "expires": '30d'
                                });
                            }
                            _self.xmodelBind = false
                            _self.data.strategies[_self.key].needValidate = false;
                            let p = new Promise(function (reslove, reject) {
                                _self.bindPhoneFlag = true;
                                _self.initFn();
                            })
                            p.then(() => {
                                _self.lock = false;
                            })

                            // _self.submitFn();

                        } else {
                            _self.bind.validateCode = "";
                            clearInterval(_self.init);
                            _self.helpBlock.text = "重新获取验证码";
                            _self.helpBlock.usable = true;
                            _self.$toast(data.message);
                        }
                    });
                }
            } else {
                _self.$toast("输入框不能为空")
            }
        },
        submitFn: function (task) {
            let _self = this;
            if (this.lock && this.bindPhoneFlag != null && _self.bindPhoneFlag != true) {
                return;
            }
            this.lock = true

            if (_self.data.strategies[_self.key].needValidate == true) {
                _self.xmodelBind = true;
                _self.chargesModel = false
                return;

            } else if (_self.data.strategies[_self.key].needValidate == false) {
                if (!_self.skipFlag) { //还没有点击过一次 
                    if (_self.data.strategies[_self.key].needPhone) {
                        console.log(3)
                        _self.xmodelBind = true;
                        _self.chargesModel = true;
                        return;
                    } else {
                        _self.chargesModel = false
                    }

                }

            }

            console.log(4)

            _self.popswitch = true;
            console.log(_self.data)
            if (_self.popswitch && task) {
                _self.time = 8;
                _self.timer = setInterval(function () {
                    console.log(_self.time)
                    _self.time = _self.time - 1
                    if (_self.time == 0) {
                        _self.paypop();
                    }
                }, 1000)
            } else {
                _self.paypop();
            }

            // let mode = _self.payment;

        },
        paypop: function () {
            let _self = this;
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', _self.goBack, false);
            }
            console.log('进入支付');

            if (_self.timer) {
                clearInterval(_self.timer);
            }

            this.popswitch = false;
            this.$loading();
            let mode = _self.payment;
            if (mode.payMode && mode.payMode == '1005') {
                this.popimg = '/sui_assets/img/strategy/wxbg.png'
            } else if (mode.payMode && mode.payMode == '1101') {
                this.popimg = '/sui_assets/img/strategy/zfbbg.png'
            }
            let param = {
                orderId: _self.id,
                strategyId: _self.data.strategies[_self.key].id,
                payCategory: mode ? mode.payMode : '',
                url: encodeURIComponent(location.origin + "/admin.html#/payment" + location.search),
                failedUrl: encodeURIComponent(location.href)
            };
            if (_self.data.comment && _self.data.comment.id && _self.giveRewordFlag) {
                param.gratuityId = _self.data.comment.id;
            }
            // 推广码
            if (_self.$route.query.pid) {
                param.promoteId = _self.$route.query.pid;
            }
            this.$http.post("/check/pay", param).then(response => {
                let data = response.body;
                var lockTimer = setTimeout(() => {
                    _self.lock = false
                    clearTimeout(lockTimer)
                }, 2000)
                if (data.code == 404014) {
                    _self.lock = false
                    _self.$loading.close();
                    alert("订单不存在！");
                    _self.$router.replace({
                        path: '/selfPay',
                        query: _self.$route.query
                    })
                } else if (data.code == 405009) {
                    _self.lock = false
                    _self.$loading.close();
                    _self.$confirm("支付遇到问题，是否重新支付？", function () {
                        console.log(1)
                        _self.$http.post("/order/" + _self.id + "/pay/revoke").then(response => {
                            let data = response.body;
                            if (data.code == 200) {
                                _self.submitFn();
                            } else {
                                alert(data.message);
                            }
                        });
                    }, function () {
                        _self.$http.get("/order/" + _self.id + "/pay/result").then(response => {
                            if (response.body.code == 200) {
                                _self.$router.replace({
                                    path: '/payment',
                                    query: json
                                });
                            } else if (response.body.code == 403055) {
                                alert("此订单正在支付中，请稍后再试！");
                            } else {
                                alert(response.body.message);
                            }
                        });
                    }, "重新支付", "我已支付");
                    return;
                } else if (data.code == 405098) {
                    alert('账单已变化，请返回账单')
                    _self.$http
                        .post("/check/" + _self.id + "/cancel", {})
                        .then(response => {
                            let data1 = response.body;
                            if (data1.code != 200) {
                                _self.$toast(data1.message);

                            } else {
                                // delete _self.init.order;
                                setTimeout(function () {
                                    _self.$router.replace({
                                        path: '/selfPay',
                                        query: _self.$route.query
                                    })
                                }, 200);
                            }
                        });

                } else if (data.code == 405099) {
                    _self.$toast('账单已变化，请重新扫描二维码', 'center');
                    _self.$http
                        .post("/check/" + _self.id + "/cancel", {})
                        .then(response => {
                            let data1 = response.body;
                            if (data1.code != 200) {
                                _self.$toast(data1.message);

                            } else {
                                // delete _self.init.order;
                                setTimeout(function () {
                                    _self.$router.replace({
                                        path: '/selfPay',
                                        query: _self.$route.query
                                    })
                                }, 200);
                            }
                        });
                } else if (data.code != 200) {
                    _self.lock = false
                    _self.$loading.close();
                    alert(data.message);
                    return;
                }
                _self.$loading.close();
                //跳转链接参数
                let json = _self.$route.query;
                json.oid = json.oid || _self.id;
                // alert(_self.data.strategies[_self.key].finalAmount == 0)
                if (_self.data.strategies[_self.key].finalAmount == 0) {
                    // 有评价立减活动&&有评价&&已经评价&&评价奖励金额为0
                    if (_self.has_reward_activity && (_self.data.comment && _self.data.comment.hasCommented && (_self.data.comment.gratuityAmount) - 0 == '0') || _self.has_reward_activity && (!_self.data.comment || !_self.data.comment.hasCommented)) {
                        _self.$router.push({
                            path: '/payment',
                            query: json
                        });
                        return;
                    } else if (!_self.has_reward_activity) {
                        _self.$router.push({
                            path: '/payment',
                            query: json
                        });
                        return;
                    }
                }
           
                switch (mode.payMode) {
                    case "1005":
                        let js = data.result.js;
                        let pay = data.result.pay;
                        pay.success = function () {
                            //查询支付结果
                            _self.$http.get("/order/" + _self.id + "/pay/result").then(response => {
                                _self.$router.push({
                                    path: '/payment',
                                    query: json
                                });
                            });
                        };
                        pay.cancel = function () {
                            _self.cancelPay();
                        };
                        pay.fail = function () {
                            _self.cancelPay();
                            alert("支付失败");
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
                                _self.cancelPay();
                                return;
                            }
                            if (result.resultCode == "9000") {
                                _self.$http.get("/order/" + _self.id + "/pay/result").then(response => {
                                    _self.$router.push({
                                        path: '/payment',
                                        query: json
                                    });
                                });
                            }
                        });
                        break;
                }

            }).catch((res) => {
                console.log(res)
                var lockTimer = setTimeout(() => {
                    _self.lock = false
                    console.log("catch: " + _self.lock)
                    clearTimeout(lockTimer)
                }, 2000)
            })
        },
        cancelPay: function () {
            var _self = this
            // _self.lock = true
            this.$http.post("/order/" + this.id + "/pay/revoke").then(response => {
                //  var lockTimer = setTimeout(()=>{
                //     _self.lock = false
                //     clearTimeout(lockTimer)
                //   },500)
            });
        },
        toggleFn(index) {
            // this.index = index;
            var i = document.querySelectorAll('.flex')[index].style.backgroundImage;
            this.key = document.querySelectorAll('.swiper-slide')[index].getAttribute('data-swiper-slide-index') || index;
            this.bgc = i;
            console.log(this.key);
            for (let m = 0; m < document.querySelectorAll('.swiper-slide').length; m++) {
                if (m != index) {
                    // document.querySelectorAll('.swiper-slide')[m].setAttribute('style','transform: scale(0.8)');
                    // document.querySelectorAll('.swiper-slide')[m].classList.add('cards');
                } else {
                    // document.querySelectorAll('.swiper-slide')[m].setAttribute('style','transform: scale(1)');
                    // document.querySelectorAll('.swiper-slide')[m].classList.remove('cards');
                }
            }
            // document.querySelectorAll('.swiper-slide')[index].setAttribute('style','transform: scale(1)');
            // document.querySelector('.swiper-slide-active').setAttribute('style','transform: scale(1)');
            // document.querySelectorAll('.swiper-slide-active')[0].setAttribute('style','transform: scale(1)');
            // console.log(document.querySelectorAll('.swiper-pagination-bullet')[this.data.strategies.length]);
            // console.log(this.data.strategies.length-1);
            // if(this.key == this.data.strategies.length-1) {
            //   this.swiperOption.slidesOffsetBefore = 100;
            //   console.log(this.swiperOption.slidesOffsetBefore);
            // }

        }
    },
    destroyed() {
        window.removeEventListener('popstate', this.goBack, false);
        window.removeEventListener('popstate', this.backbtn); //false阻止默认事件
        clearInterval(this.strageTimer)
    }

}
</script>

<style lang="scss" scoped>
@import "../sui_assets/scss/strategy.scss";

.text-right.price {
    color: #c33b35;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    margin-left: 10px;
}

.text-right.price .van-icon {
    width: 3px;
}

.origin-header.x-header {
    background: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: unset;
    box-shadow: none;

    .content {
        width: 323px;
        height: 123px;
        background: url(/sui_assets/img/strategy/noRewardBg.png) 0 0 no-repeat;
        background-size: 100% 100%;
        position: relative;

        .strategiesLength {
            font-size: 1.5rem;
            font-weight: 500;
            color: #d5ffc3;
            position: absolute;
            right: 42%;
            bottom: 31%;
            text-align: center;
        }
    }
}

.menuPop {
    color: #000;
    font-size: 0.7rem;
    padding: 0 0.8rem 0.8rem;

    .bottom {
        color: #000;
        text-align: right;
        font-size: 0.7rem;
        border-top: 1px solid #e4e4e4;
        margin-top: 0.5rem;
        padding-top: 0.5rem;

        .finalList {
            margin: 0;
            margin-bottom: 0.5rem;

            .num {
                // margin-left: 2.9rem;
                width: 26%;
                display: inline-block;
            }

            .text {
                width: 20%;
                text-align: right;
            }
        }

        .finalList1 {
            color: #ee5d00;
        }

        .finalList2 {
            color: #000;
            font-size: 0.8rem;
            font-weight: 800;

            .num {
                color: #ee5d00;

            }
        }
    }

    .title {
        color: #000;
        font-size: 0.9rem;
        font-weight: 500;
        text-align: center;
        border-bottom: 1px solid #e4e4e4;
        padding-bottom: 0.75rem;
    }

    .each {
        display: flex;
        text-align: right;

        p {
            margin: 0
        }

        .left {
            width: 50%;
            text-align: left;
            font-size: 0.7rem;

            .detailTag {
                font-size: 0.5rem;
                color: #df1212;
                border: 1px solid #df1212;
                padding: 0;
                border-radius: 0.2rem;
            }

            .menberTag {
                font-size: 0.5rem;
                color: #ee5d00;
                border: 1px solid #ee5d00;
                padding: 0;
                border-radius: 0.2rem;
            }

            .detail {
                font-size: 0.6rem;
                color: #a1a1a1;
                margin-bottom: 0.3rem;
            }
        }

        .mid {
            width: 10%;
        }

        .finalPrice {
            width: 40%;

            .oriPrice {
                //  width: 20%;
                text-decoration: line-through;
                color: #a1a1a1;

            }

            .oriPrice.withe {
                color: transparent;
            }
        }

    }
}

.strategy {
    background: #f7f7f7;

    .x-header {
        // box-shadow: none;
    }

    .swiper-wrapper {
        padding-top: 0.4rem;
    }

    .order_menu {
        margin: 0rem .8rem 0.5rem;
        color: #808080;
        font-size: 0.8rem;

        .flexSpace {
            display: flex;
            justify-content: space-between;

            .left {
                span {
                    color: #000;

                    &.small {
                        font-size: 0.7rem;
                    }

                    &.num {
                        font-size: 1.2rem;
                        font-weight: 500;
                    }
                }
            }

            .right {
                .button {
                    width: 86px;
                    height: 22px;
                    border-radius: 11px;
                    border: solid 1px #ee7c34;
                    background: #fff;
                    font-size: 0.6rem;
                    text-align: center;
                    color: #ee7c34;
                    line-height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 0.2rem;
                }
            }
        }
    }
}

.xbind-phone {
    text-align: center;
    font-size: .8rem;
    font-family: PingFangSC;

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

.praise {
    animation: show-modal .5s;
    -webkit-animation: show-modal .5s;
    width: 17.15rem;
    height: 8rem;
    border-radius: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    background: #fff;
    z-index: 30;
    overflow: hidden;
    text-align: center;

    .praise_title {
        width: 17.15rem;
        height: 4rem;
        line-height: 4rem;
        margin: auto;
        background: url(/sui_assets/img/selfPay/flowerbg.png) center no-repeat/100% 100%;

        img {
            object-fit: contain;
            height: 2rem;
            margin-top: 1rem;
        }
    }

    .praise_text {
        color: #e8524a;
        font-size: 0.9rem;
        position: absolute;
        bottom: 1.5rem;
        left: 0;
        right: 0;
        margin: auto;
    }
}
</style><style>
.strategy P {
    line-height: 1.2rem;
    padding: 0;
    margin: 0 !important;

    /* font-size: 0.8rem; */
}

.strategy P.sjPrice {
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
}

.strategy P.contentTitle {
    font-size: 10px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    /* text-align: center; */
    color: #919191;
    text-align: left;
    line-height: 22px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.strategy .contentDetail {
    font-size: 13px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;

    max-height: 53px;
}

.xn-flower {
    line-height: 1.1rem;
    height: auto;
    padding: .5rem .8rem;
    text-align: center;
    background: #ffffff;
    font-size: .7rem;
}

.xtimg {
    width: 10rem;
    margin: auto;
    display: block;
}

.strategy .detailed .use {
    padding: 0 !important;
}

.strategy .detailed .use {
    box-shadow: none !important;
    background: none !important;
    margin: .2rem 4% .2rem !important;
}

.xt-float {
    float: right;
}

.modal-inner {
    animation: show-modal .5s;
    -webkit-animation: show-modal .5s;
}

@keyframes show-modal {
    from {
        opacity: 0;
        transform: translate(0, -150%);
        -webkit-transform: translate(0, -150%);
    }

    to {
        opacity: 1;
        transform: translate(0, 0);
        -webkit-transform: translate(0, 0);
    }
}

.x-max-size {
    font-size: .8rem;
}

.x-dixed,
.xbg-black,
.xmodel-bindphone,
.xbind-phone {
    background: rgba(0, 0, 0, .5) !important;
    position: fixed !important;
    bottom: 0;
    z-index: 24 !important;
    width: 100%;
    height: 100%;
    -ms-flex-align: end;
    align-items: flex-end;
    padding: .5rem .8rem;
}

.x-dixed {
    padding: 0;
}

.strategy .detailed {
    padding: 0 !important;
    margin: 0 !important;
    background: none !important;
    width: 100%;
    /* height: 50%; */
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.x-toastT {
    font-size: .8rem;
    font-weight: bold;
    text-align: center;
    line-height: 3rem;
}

.xdetailed {
    /* position: absolute;
    width: 80%;
    top: 100vh;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: auto;
    display: table;
    background: #fff;
    border-radius: .8rem;
    background: url('/sui_assets/img/strategy/toastBg.png') center no-repeat/cover;
    background-size: 100% 100%;
} */
    position: absolute;
    width: 300px;
    top: 25%;
    /* left: 10%; */
    /* bottom: 0; */
    /* right: 0; */
    margin: auto;
    /* height: 300px; */
    display: table;
    background: #fff;
    border-radius: .8rem;
    background: url(/sui_assets/img/strategy/toastBg.png) center no-repeat/cover;
    background-size: cover;
    /* height: 300px!important; */
}

.x-min-size {
    font-weight: bold !important;
    font-size: .7rem;
    color: #ed7a32;
    /* font-weight: 100 !important; */
    /* padding: .1rem .2rem; */
    float: right;
    line-height: calc(1.5rem - 2px) !important;
    padding-left: .1rem;
}

.xb {
    border: solid 1px #ed7a32;
}

html,
body {
    height: 100% !important;
}

#app {
    height: 100% !important;
}

.liping {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    /* width: 6.6rem; */
    vertical-align: middle;
}

.x-header {
    margin: .5rem .8rem 1rem;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
    /* background-image: linear-gradient(to left, #ed762f, #f0994e);
    border-radius: .2rem !important; */
}

.x-header {
    height: 6.75rem;
    background-color: #fff;
    border-radius: 0;
}

.xh-top {
    display: flex;
    padding-top: .5rem;
    padding-bottom: .5rem;
}

.xh-top>div {
    flex: 1;
    text-align: center;
    color: #ffffff;
    font-size: .8rem;
    font-weight: bold;
}

.strategy .pay-fixed {
    position: relative !important;
}

.strategy .pay-fixed .flower,
.strategy .pay-fixed {
    box-shadow: none !important;
}

/* .swiper-slide {
    width: 80% !important;
  } */
.x-card {
    width: 80vw !important;
    /* height: 66vh !important; */
    background: #ffffff;
    border-radius: .4rem !important;
    margin-right: 1rem;
}

.x-card-bg {
    color: #000000 !important;
    position: relative;
}

.strategy .card-wrapper .card .card-bg .flex {
    text-align: left !important;
}

.strategy .card-wrapper .card .card-bg .flex .title div {
    text-align: left !important;
}

.x-title,
.x-title-n {
    position: relative;
}

.x-title::before,
.x-title-n::before {
    content: '';
    position: absolute;
    left: -2.9rem;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    height: 28px;
    width: 52px;
    border-radius: 14px;
    background-color: #c33b35;
}

.x-card-bg::after {
    position: absolute;
    display: inline-block;
    bottom: -14px;
    left: 24px;
    width: 0;
    height: 0px;
    content: '';
    border-style: solid;
    border-width: 15px;
    border-color: #fff #fff transparent transparent;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    -webkit-box-shadow: 2px -2px 2px rgba(0, 0, 0, 0.1);
    box-shadow: 2px -2px 2px rgba(0, 0, 0, 0.1);
}

.x-title-n::before {
    background-color: #e6e6e6;
}

.xsubmitBox {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70px;
    background-color: #f7f7f7;
    z-index: 3;
}

.xsubmit {
    width: 335px;
    text-align: center;
    height: 2.3rem;
    line-height: 2.3rem;
    border-radius: 2rem;
    letter-spacing: 1px;
    border: none;
    border-radius: 30px;
    box-shadow: 0 5px 10px 0 rgba(195, 59, 53, 0.5);
    background-image: linear-gradient(to top, #c33b35, #e3605a);
    font-family: PingFangSC;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
}

.strategy .card-wrapper .card .card-bg .flex .name {
    font-size: 1.1rem !important;
    padding: 0;
    font-weight: bold !important;
    color: #000000 !important;
}

.x-flex-detail {
    font-size: .7rem;
    color: #999999;

}

.x-flex-detail .flexBox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.btns {
    font-size: 13px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #c33b35;
    position: absolute;
    width: 220px;
    bottom: 40px;
    pointer-events: all;
    display: flex;
    justify-content: space-between;
    padding-top: 0;
}

.hui {
    color: #d7d7d7;
    pointer-events: none;
}

.x-right {
    float: right;
}

.x-blod {
    font-weight: bold;
    color: #000000 !important;
}

.x-liping {
    color: #333333 !important;
}

.overflow {
    font-size: 0.6rem;
}

/* 底部弹窗 */
.menberPop .van-cell {
    padding-top: 7px !important;
    padding-bottom: 7px !important;
    background: #f7f7f7 !important;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 15px;
    color: #000000
}
</style>
