<!--<template>-->
  <!--<div class="more-css">-->
    <!--<div class="i-bg" v-if="data.cardUrl">-->
      <!--<div class="i-card" v-on:click="ajaxUrl('vip.html')"-->
           <!--:style="{backgroundImage: 'url('+ (data.cardUrl||'') +')'}">-->
        <!--<div>-->
          <!--<img class="avatar" :src="data.logo">-->
          <!--<span class="shop">{{data.brandName}}</span>-->
        <!--</div>-->
        <!--<div class="i-footer">-->
          <!--<div class="set-content">-->
            <!--<div style="font-size: .7rem">加入会员 尊享特权</div>-->
          <!--</div>-->
          <!--<div><span class="i-icon i-icon6"></span></div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

    <!--<div class="code">-->
      <!--<div v-for="item in data.activities1">-->
        <!--<div v-if="item.activityCategory=='6004'||item.activityCategory=='6007'">-->
          <!--<div v-for="activity in item.activities"  v-on:click="ajaxUrl('couponActivity.html?aid='+ activity.activityId)"-->
               <!--class="padded"-->
               <!--:class="types[item.activityCategory]">-->
            <!--<div class="set-title">-->
              <!--<div class="content-title">-->
                <!--<span class="text">{{activity.name}}</span>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="row">-->
              <!--<div class="set_coupon col-66">-->
                <!--<div class="coupon-content"-->
                     <!--:class="activity.strategy[0].coupons[0].category =='901'?'money-box':'good-box'">-->
                  <!--<div class="coupon-left">-->
                    <!--<div class="name">{{activity.strategy[0].coupons[0].name}}</div>-->
                    <!--<ul class="text-grey">-->
                      <!--<li>{{activity.strategy[0].coupons[0].times}}</li>-->
                      <!--<li>{{activity.strategy[0].coupons[0].useStrategy}}</li>-->
                      <!--&lt;!&ndash;<li>到店出示给服务员即可获得测试礼品券</li>&ndash;&gt;-->
                    <!--</ul>-->
                  <!--</div>-->
                  <!--<div class="coupon-right">-->
                    <!--<div class="limit-label" v-if="activity.strategy[0].remainCount !== undefined">{{"剩" +-->
                      <!--activity.strategy[0].remainCount + "份"}}-->
                    <!--</div>-->

                    <!--<div class="coupon-amount">-->
                      <!--<div v-if="activity.strategy[0].coupons[0].category =='901'">-->
                        <!--<div class="current-amount">-->
                          <!--<div class="text-gold">{{activity.strategy[0].coupons[0].value}}</div>-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div-->
                        <!--v-else-if="activity.strategy[0].coupons[0].category =='902'||activity.strategy[0].coupons[0].category =='9021'">-->
                        <!--<div class="current-amount">-->
                          <!--{{activity.strategy[0].coupons[0].currentAmount ? ("￥" +-->
                          <!--activity.strategy[0].coupons[0].currentAmount) : "免费"}}-->
                        <!--</div>-->
                        <!--<div class="amount" style="font-size: .6rem;margin-top: -2px">{{"￥" +-->
                          <!--activity.strategy[0].coupons[0].amount}}-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div v-else-if="activity.strategy[0].coupons[0].category =='9011'">-->
                        <!--<div class="current-amount">-->
                          <!--<img src="/sui_assets/img/card/dikou.svg"-->
                               <!--style="width: 2.2rem;margin: 0 -.5rem 0 0;display: inline">-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div-->
                        <!--v-else-if="activity.strategy[0].coupons[0].category =='903'||activity.strategy[0].coupons[0].category =='9031'">-->
                        <!--<div class="current-amount">-->
                          <!--{{activity.strategy[0].coupons[0].amount+'折'}}-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div v-else class="current-amount">-->
                        <!--<img src="/sui_assets/img/card/coupon.svg"-->
                             <!--style="width: 2.2rem;margin: -1.1rem -.5rem 0 0;display: inline">-->
                      <!--</div>-->
                      <!--<div class="amount" style="font-size: .6rem;margin-top: -2px"></div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="coupon-button col-33">-->
                <!--<button class="btn-green-light"><span v-if="item.activityCategory=='6004'">立即领取</span>-->
                  <!--<span v-else>买单即享</span></button>-->
                <!--<div class="text-grey text-center">{{activity.from}}</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div v-else-if="item.activityCategory=='6003'"-->
             <!--class="coupons padded EXCHANGE"-->
             <!--v-on:click="ajaxUrl('exchange.html')">-->
          <!--<div class="set-title" v-if="item.activities.length">-->
            <!--<div class="content-title">-->
              <!--<span class="text">{{item.activities[0].name}}</span>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="row" v-for="(activity,index) in item.activities">-->

            <!--<div class="set_coupon col-66">-->
              <!--<div class="card1">-->
                <!--<div class="charge-content" v-for="strategy in activity.strategy">-->
                  <!--<div class="row no-gutter exchange">-->
                    <!--<div class="col-33">-->
                      <!--<div class="">{{strategy.amount}}积分</div>-->
                    <!--</div>-->
                    <!--<div class="col-25 gift1">-->
                    <!--</div>-->
                    <!--<div class="col-40">-->
                      <!--<ul class="text-grey">-->
                        <!--<li>{{strategy.coupons[0].name}}</li>-->
                      <!--</ul>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
                <!--<div class="text-center">-->
                  <!--<span class="square"></span>-->
                  <!--<span class="square"></span>-->
                  <!--<span class="square"></span>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="coupon-button col-33">-->
              <!--<button class="btn-green-light">立即兑换</button>-->
              <!--<div class="text-grey text-center">{{activity.strategy[0].from}}</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div v-else-if="item.activityCategory=='6002'" class="coupons padded CHARGE"-->
             <!--v-on:click="ajaxUrl('charge.html')">-->
          <!--<div class="set-title">-->
            <!--<div class="content-title">-->
              <!--<span class="text">{{item.activities[0].name}}</span>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="row" v-for="activity in item.activities">-->
            <!--<div class="set_coupon col-66">-->
              <!--<div class="card1">-->
                <!--<div class="charge-content" v-for="strategy in activity.strategy">-->
                  <!--<div class="row no-gutter">-->
                    <!--<div class="col-33">-->
                      <!--<div class="name">{{strategy.amount}}元</div>-->
                    <!--</div>-->
                    <!--<div class="col-25 gift">-->
                    <!--</div>-->
                    <!--<div class="col-40">-->
                      <!--<ul class="text-grey">-->
                        <!--<li>-->
                          <!--<span v-if="strategy.benefits[0].type=='1014'">{{strategy.benefits[0].amount}}元</span>-->
                          <!--<span v-else-if="strategy.benefits[0].type=='1015'">{{strategy.benefits[0].amount}}积分</span>-->
                          <!--<span v-else>{{strategy.benefits[0].name}} {{strategy.benefits[0].count ?strategy.benefits[0].count +'张':''}}</span>-->
                        <!--</li>-->
                      <!--</ul>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
                <!--<div class="text-center">-->
                  <!--<span class="square"></span>-->
                  <!--<span class="square"></span>-->
                  <!--<span class="square"></span>-->
                <!--</div>-->

              <!--</div>-->
            <!--</div>-->
            <!--<div class="coupon-button col-33">-->
              <!--<button class="btn-green-light">立即充值</button>-->
              <!--<div class="text-grey text-center">{{activity.strategy[0].from}}</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div v-else class="padded" :class="types[item.activityCategory]"-->
             <!--v-on:click="ajaxUrl('activity.html?aid=' + item.activities[0].activityId)">-->
          <!--<div class="set-title">-->
            <!--<div class="content-title">-->
              <!--<span-->
                <!--class="text">{{item.activities.length>1?texts[item.activityCategory]:item.activities[0].name}}</span>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="row no-gutter" style="position: relative" v-for="activity in item.activities">-->
            <!--<div class="content-desc" v-if="item.activities.length>1">{{activity.name}}</div>-->
            <!--<div class="set_coupon col-66">-->
              <!--<div class="list-block">-->
                <!--<ul>-->
                  <!--<li class="item-content" v-for="strategy in activity.strategy">-->
                    <!--<div class="item-media" v-if="strategy.desUrl">-->
                      <!--<img class="space" :src="strategy.desUrl">-->
                    <!--</div>-->
                    <!--<div class="item-inner">-->
                      <!--<div class="item-title" v-if="strategy.type=='1001'">-->
                        <!--<div class="name">消费满<span class="orange-lg">{{strategy.amount}}</span>元 享<span-->
                          <!--class="orange-lg">{{strategy.benefit}}</span>折-->
                        <!--</div>-->
                        <!--<div class="text-grey text-xs">-->
                          <!--{{activity.time}}-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div class="item-title" v-if="strategy.type=='1005'">-->
                        <!--<div class="name">{{strategy.name}}</div>-->
                        <!--<div class="text-grey text-xs">-->
                          <!--{{activity.time}}-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div class="item-title" v-if="strategy.type=='1008'">-->
                        <!--<div class="name">{{strategy.from}}:消费<span-->
                          <!--class="orange-lg">{{strategy.amount}}</span>元积<span-->
                          <!--class="orange-lg">{{strategy.benefit}}</span>分-->
                        <!--</div>-->
                        <!--<div class="text-grey">-->
                          <!--{{activity.time}}-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div class="item-title" v-if="strategy.type=='1000'">-->
                        <!--<div class="name">-->
                          <!--<span class='orange-lg'> {{strategy.amount}} </span>套餐现价<span class='orange-lg'>{{strategy.benefit}}</span>元-->
                        <!--</div>-->
                        <!--<div class="text-grey">-->
                          <!--{{activity.time}}-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div class="item-title" v-if="strategy.type=='1013'">-->
                        <!--<div class="name">-->
                          <!--{{strategy.from}}：满{{strategy.amount}}减{{strategy.benefit}}-->
                        <!--</div>-->
                        <!--<div class="text-grey">-->
                          <!--{{activity.time}}-->
                        <!--</div>-->
                      <!--</div>-->
                      <!--<div class="item-title" v-if="strategy.type=='1014'">-->
                        <!--<div class="name">-->
                          <!--{{strategy.from}}：充值{{strategy.amount}}倍免单-->
                        <!--</div>-->
                        <!--<div class="text-grey">-->
                          <!--{{activity.time}}-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</li>-->
                <!--</ul>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="coupon-button col-33 up">-->
              <!--<button class="btn-green-light">买单即享</button>-->
              <!--<div class="text-grey text-center"></div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->

      <!--</div>-->
    <!--</div>-->

  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--export default {-->
    <!--name: "More",-->
    <!--data() {-->
      <!--return {-->
        <!--data: "",-->
        <!--types: {-->
          <!--"6001": "MEMBERUPGRADE",-->
          <!--"6002": "CHARGE coupons",-->
          <!--"6003": "EXCHANGE",-->
          <!--"6004": "COUPONFREE coupons",-->
          <!--"6005": "DISCOUNT",-->
          <!--"6006": "SPECIAL_PRICE",-->
          <!--"6007": "COUPON",-->
          <!--"6008": "POINT",-->
          <!--"6011": "CHRGEFREE",-->
          <!--"6012": "SPENDAS",-->
          <!--"6014": "LIMITREDUCE",-->
          <!--"6015": "SETMEAL",-->
          <!--"6017": "CHARGEFREE"-->
        <!--},-->
        <!--texts: {-->
          <!--"6005": "会员折扣有力度",-->
          <!--"6006": "特价促销",-->
          <!--"6007": "返券",-->
          <!--"6008": "小积分大用处",-->
          <!--"6012": "抵扣活动",-->
          <!--"6014": "满额减免",-->
          <!--"6015": "套餐活动"-->
        <!--}-->
      <!--}-->
    <!--},-->
    <!--created() {-->
      <!--let para = {};-->
      <!--para.type = this.getVersion() == "WXPAY" ? "wx" : "ali";-->
      <!--let url = "/activities/shop";-->
      <!--if (this.$route.query.id) {-->
        <!--para.id = this.$route.query.id;-->
      <!--} else {-->
        <!--url = "/activities/guest/" + this.$route.query.guestid;-->
      <!--}-->
      <!--this.$http.get(url, {key: para}).then(response => {-->
        <!--if (response.body.code == 200) {-->
          <!--let data = response.body.result;-->
          <!--let activities = [];-->
          <!--if (data.topActivity) {-->
            <!--activities = [data.topActivity];-->
          <!--}-->
          <!--data.activities1 = activities.concat(data.activeActivities || []).concat(data.checkActivities || []);-->
          <!--this.data = data;-->
        <!--}-->
      <!--})-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style lang="scss" rel="stylesheet/scss" scoped>-->
  <!--@import "../sui_assets/scss/more.scss";-->

<!--</style>-->
