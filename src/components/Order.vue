<template>
  <div class="order">
    <div class="card" >
      <div class="c-record">
        <div class="left-green shop">

        </div>
        <div class="text-lg" id="finalAmount"></div>
        <div id="amount"></div>
        <div class="text-grey"></div>
      </div>
      <div class="c-box">
        <div class="c-text">
          奖励待领取：
        </div>
        <div class="set-coupon"></div>
        <div class="text-sm c-point"></div>
      </div>
      <div class="c-b-box right">
        <!--<a href="#" class="button btn-g">评价分享</a>-->
        <a href="#" class="button btn-w">买单详情</a>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    name: "template",
    data() {
      return {
        data: "",
      }
    },
    created() {
      this.initFn();
    },
    methods: {
      initFn(){

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../sui_assets/scss/vip.scss";
</style>
