<template>
  <div class="mall">
    <div class="bar">
      <div @click="goto('exchange')" class="item">积分兑换</div>
      <div class="item active">会员商城</div>
    </div>
    <div class="flex" v-if="data">
      <div class="item" v-for="item in data.items" v-on:click="redirectFn(item.id)">
        <div class="label" v-if="item.sales[0].name">仅限{{item.sales[0].name}}</div>
        <div class="img" :style="{backgroundImage: 'url('+ (item.picUrl||'') +')'}"></div>
        <div class="title">{{item.title}}</div>
        <div class="text">
          <div class="amount">¥ {{item.sales[0].price}}</div>
          <div class="time" v-if="item.stock === undefined">不限量</div>
          <div class="time" v-else>剩余{{item.stock}}</div>
        </div>
      </div>
    </div>
    <div class="empty" v-else></div>
    <div  class="record" @click="goto('mallRecord')" ></div >
  </div>
</template>

<script>
  export default {
    name: "",
    data() {
      return {
        data: ""
      }
    },
    created() {
      this.initFn();
    },
    methods: {
        goto(path){
         this.$router.push({path,query:this.$route.query})
      },
      initFn() {
        this.$http.get("/mall/guest/" + (this.$route.query.id || this.$route.query.guestid), {key: {category: '1018'}}).then(response => {
          let data = response.body;
          if (data.code == 200) {
            this.data = data.result;
          }
        });
      },
      redirectFn(id) {
        this.$route.query.aid = id;
        this.$route.query.canNotshare=false;
        this.$router.push({path: '/mallDetail', query: this.$route.query});
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../sui_assets/scss/mall.scss";
</style>
