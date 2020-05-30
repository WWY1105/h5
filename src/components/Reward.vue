<template>
  <div class="reward" v-if="data">
    <div class="header">
      <div class="">
        <div>我的代用币</div>
        <div class="amount">{{local.rewardCount}}</div>
      </div>
      <div class="btn-record" v-if="local.rid"
           v-on:click="ajaxUrl('rewardRecord.html')">详细记录
      </div>
    </div>
    <div class="flex" v-if="data.items">
      <div class="item" v-for="item in data.items">
        <div class="amount">{{item.amount}}</div>
        <div class="right">{{item.startTime+'-'+item.endTime}}有效</div>
      </div>
    </div>
    <div class="empty" v-else></div>
  </div>
</template>

<script>
  export default {
    name: 'Charge',
    data() {
      return {
        data: {},
        local: {}
      }
    },
    created() {
      this.local.rid = localStorage.getItem("relation_id");
      this.local.rewardCount = localStorage.getItem("reward_count");
      this.$http.get("/benefit/rewards/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
        if (response.body.code == 200) {
          let data = response.body;
          this.data = data.result;
        } else {
          // alert(response.body.message);
        }
      });
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/css" scoped>
  @import "../sui_assets/scss/reward.scss";
</style>
