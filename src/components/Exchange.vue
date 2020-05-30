<template>
  <div class="exchange" v-if="data">
    <div class="bar">
      <div class="item active">积分兑换</div>
      <router-link class="item" :to="{ path: 'mall', query:  $route.query}">会员商城</router-link>
    </div>
    <div class="header">
      <div class="">
        <div>我的积分</div>
        <div class="amount">{{data.point}}</div>
      </div>
      <div class="btn-record" v-if="data.customerRelationId"
           v-on:click="ajaxUrl('pointRecord.html?rid='+ data.customerRelationId)">积分记录
      </div>
    </div>
    <div class="content" v-if="data.activity">
      <div class="flex" v-for="activity in data.activity" v-on:click="directFn(activity.coupons)">
        <div class="image" 
             :style="{backgroundImage: 'url('+ (activity.coupons?(activity.coupons[0].picUrl||'/sui_assets/img/exchange/placeholder.png'):(activity.orgDesUrl||'/sui_assets/img/exchange/placeholder.png')) +')'}"></div>
        <div class="item">
          <div class="ellipsis bold" v-if="activity.type=='1020'">{{activity.name}}</div>
          <div class="ellipsis bold" v-for="coupon in activity.coupons" v-else>{{coupon.name}}</div>
          <div class="grey">
            <div class="" v-if="activity.from">仅限：{{activity.from}}</div>
            <span v-if="activity.remainCount">仅剩{{activity.remainCount}}份</span>
          </div>
          <div class="amount">{{activity.amount}}积分</div>
          <div class="btn" :class="{'unabled':!activity.usable}"
               v-on:click.stop="submitFn(activity.activityId,activity.ruleTupleId,activity.usable,activity.amount)">
            立即去兑换
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-else></div>
  </div>

</template>

<script>
  export default {
    name: "exchange",
    data() {
      return {
        data: ""
      }
    },
    created() {
      this.initFn();
    },
    methods: {
      initFn() {
        this.$http.get("/activities/exchange/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
          if (response.body.code == 200) {
            this.data = response.body.result;
            this.$cookie.set("point", this.data.point);
            this.$cookie.set("relation_id", this.data.customerRelationId);

          } else {
            this.$toast(response.body.message);
          }
        });
      },
      directFn: function (item) {
        if (item) {
          this.ajaxUrl("couponDetail.html?cid=" + item[0].id + (item[0].type == '1017' ? ('&type=reward') : ''));
        }
      },
      submitFn(aid, rid, usable, number) {
        if (!usable) {
          // this.$toast("您还不满足兑换条件");
          return;
        }
        let _self = this;
        this.$confirm('本次抢兑需要花费' + number + '积分,确认抢兑?', function () {
          let para = {
            activityId: aid,
            ruleTupleId: rid
          };
          _self.$http.post("/benefit/exchange/guest/" + (_self.$route.query.id || _self.$route.query.guestid), para).then(response => {
            if (response.body.code == 200) {
              _self.$message("操作成功！", "请在“会员中心”查看权益，使用自助买单可自动抵用优惠。", function () {
                _self.$router.push({path: 'user', query: _self.$route.query});
              })
            } else if(response.body.code!=403000){
            alert(response.body.message);
          }
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../sui_assets/scss/exchange.scss";

</style>
