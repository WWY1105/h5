<template>
  <div class="user-reserve" v-if="data">
    <div class="title">好座位·只等你</div>
    <!--<ul>-->
      <!--<li>精选桌台仅对会员开放</li>-->
      <!--<li>会员预定越早优惠越大</li>-->
      <!--<li>分享好友减少定金</li>-->
      <!--<li>定金转优惠消费更省钱</li>-->
    <!--</ul>-->
    <div class="flex">
      <img class="code" :src="data.url">
      <div>
        <div>长按识别二维码</div>
        <div>进入预定小程序</div>
      </div>
    </div>

  </div>
</template>

<script>

  export default {
    name: 'UserReserve',
    data() {
      const self = this;
      return {
        data: "",
      }
    },
    beforeCreate: function () {
      let _self = this;
      this.$http.get("/activities/reserve/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
        let data = response.body;
        if (data.code == 200) {
          _self.data = data.result;
        }
      });
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../sui_assets/scss/user-reserve.scss";
</style>
