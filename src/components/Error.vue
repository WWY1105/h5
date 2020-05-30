<template>
  <div class="content" v-bind:class="post.class" id="app">
    <img :src="post.url" style="width: 100%;"/>
    <div class="position">
      <div class="title">{{post.title}}</div>
      <!--<div class="grey">-->
      <!--<div v-for="text in post.content">{{text}}</div>-->
      <!--</div>-->
    </div>
  </div>

</template>

<script>
  export default {
    name: "Error",
    data() {
      return {
        view: [{
          name: "link",//链接不存在0
          title: "很抱歉，当前链接不存在",
          content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
          url: "/assets/img/error/link.png"
        }, {
          name: "coupon",//领券1
          title: "超值礼券已被抢光啦！",
          content: ["您可以关注本店公众号", "更多超值礼券赶早来抢"],
          url: "/assets/img/error/coupon.png",
          class: "black"
        }, {
          name: "resume",//消费活动2
          title: "本期超值优惠已结束",
          content: ["您可以关注本店公众号", "更多超值礼券赶早来抢"],
          url: "/assets/img/error/resume.png"
        }, {
          name: "upgrade",//升级3
          title: "升级好礼已被抢光啦！",
          content: ["您可以关注本店公众号", "更多超值礼券赶早来抢"],
          url: "/assets/img/error/upgrade.png",
          class: "black"
        }, {
          name: "bargain",//砍价4
          title: "本期超值砍价活动已结束",
          content: ["您可以关注本店公众号", "更多超值礼券赶早来抢"],
          url: "/assets/img/error/bargain.png"
        },{
          name: "lottery",//霸王餐5
          title: "本期拉票赢霸王餐活动已结束",
          content: ["您可以关注本店公众号","更多精彩优惠活动等待您的参与"],
          url: "/assets/img/error/lottery.png"
        }, {
          name: "raffle",//抽奖6
          title: "本期大奖免费抽活动已结束",
          content: ["您可以关注本店公众号","更多精彩优惠活动等待您的参与"],
          url: "/assets/img/error/raffle.png"
        }, {
          name: "time",//时间不同步7
          title: "很抱歉，本地时间与网络时间不一致",
          content: ["请您通过“手机设置-时间管理”"," 等功能，校对时间"],
          url: "/assets/img/error/time.png"
        }, {
          name: "timeout",//二维码过期8
          title: "很抱歉，此二维码已失效",
          content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
          url: "/assets/img/error/timeout.png"
        }],
        post: {
          name: "link",//链接不存在9
          title: "很抱歉，当前链接不存在",
          content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
          url: "/assets/img/error/link.png"
        }
      }
    },
    mounted () {
      if (this.$route.query.id) {
        this.post = this.view[this.$route.query.id];
      }
    }
  }
</script>

<style scoped>
  html, body {
    padding: 0;
    margin: 0;
    background: #F4F6FB;
    color: #302C48;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
  }

  .black {
    background: #333333;
    color: #ffffff;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .grey {
    padding-top: 24px;
    font-size: 15px;
    line-height: 25px;
  }
  .position{
    position: absolute;
    bottom: 18%;
    left: 0;
    right: 0;
  }
</style>
