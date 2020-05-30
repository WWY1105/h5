<template>
  <div class="mallRecord">
    <div class="" v-if="data">
      <div class="g-tips1">
        欲使用已购买的券，请点击券面上的“使用方法”查看
      </div>
      <div class="buy-box" v-for="item in data.items" v-on:click="couponFn($event,item.coupons[0])">
        <div class="left">购买时间：{{item.time}}</div>
        <div class="right"> 花费金额：<span style="color: #e4020f">{{item.amount}}</span>元</div>
        <div class="coupon_show" v-for="coupon in item.coupons" :id="coupon.id">
          <div class="i-flex i-coupon">
            <div class="a4001"  v-bind:class="'a'+coupon.state"  style="padding: 22px;position: absolute;top: -.1rem;left: 0"></div>
            <div class="item">
              <div class="i-flex">

                <div v-if="coupon.category=='901'" style="padding-left: 10px">
                  <div class="name" style="padding-top: 0.4rem">{{coupon.name}}</div>
                  <!--<div><span class="amount0">{{coupon.amount - coupon.currentAmount}}</span></div>-->
                </div>
                <div v-if="coupon.category=='902'" style="padding-left: 10px">
                  <div class="name" style="padding-top: 0.4rem">{{coupon.name}}</div>
                  <div><span class="amount0">现价￥{{coupon.currentAmount}}</span><span
                    class="through">{{coupon.amount}}</span></div>
                </div>
                <div v-if="coupon.category=='908'" style="padding-left: 10px">
                  <div class="name" style="padding-top: 0.4rem">{{coupon.name}}</div>
                </div>

                <div v-if="coupon.category=='904'" style="padding-left: 10px">
                  <div class="name" style="padding-top: 0.4rem">{{coupon.value}}</div>
                  <div v-if="coupon.amount"><span class="amount0">价值{{coupon.amount}}元</span></div>
                </div>
                <div v-if="coupon.category == '909'" style="padding-left: 10px">
                  <div class="name" style="padding-top: 0.4rem;">{{coupon.value}}</div>
                  <div class="amount0">
                    {{ coupon.amount}} <span style="font-size: .6rem">折</span>
                  </div>
                </div>
                <div v-if="coupon.category=='903'" style="padding-left: 10px">
                  <div class="name" style="padding-top: 0.4rem">全场{{coupon.name}}</div>
                </div>
              </div>
            </div>
            <div class="item" style="border-left: 1px dashed #ffdede;padding:1.1rem .5rem;">
              <span class="i-btn grey">使用方法</span>
            </div>
          </div>

          <div class="addon">
            <span>{{coupon.times}}</span><span>{{coupon.useStrategy}}</span></div>
        </div>
      </div>
      <div v-if="data.page<data.pageSize" class="text-center"
           style="color: #ff555f;padding-top: .8rem " v-on:click="pageFn">查看更多
      </div>
    </div>
    <div class="list-empty" v-else>
        <img src="/sui_assets/img/grounpon/sad.svg">

        <div>还没有购买任何东西哦~</div>
    </div>

  </div>

</template>

<script>
  export default {
    name: "",
    data() {
      return {
        data: "",
      }
    },
    created() {
      // this.$couponShow("04427e38cd4549d6879de79d39eff928","earned");
      this.$http.get("/mall/guest/" + (this.$route.query.id || this.$route.query.guestid) + "/record").then(response => {
        if (response.body.code == 200) {
          this.data = response.body.result;
        }
      });
    },
    methods: {
      couponFn(event,id){
        this.$couponShow(event,id,'earned')
      }
    }

  }
</script>

<style lang="scss">
  @import "../sui_assets/scss/mallRecord.scss";

</style>
