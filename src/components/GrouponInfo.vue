<template>
  <div>
    <div class="cover" :style="{backgroundImage: 'url('+ (cover.picUrl||'') +')'}">
      <div class="jump" v-on:click="initFn"><span id="time">3</span>秒<span
        style="font-size: .7rem;padding-left: 5px">跳过</span></div>
      <div class="content">
        <img :src="cover.logoUrl">

        <div class="text">{{cover.brandName}}邀您一起来砍价</div>
        <div class="btn" v-on:click="initFn">立即开始</div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "GrouponInfo",
    data: function () {
      return {
        cover: ""
      }
    },
    created: function () {
      let _self = this;
      this.$http.get("/groupon/activity/" + this.$route.query.aid+ "/cover").then(response => {
        let data = response.body;
        if (data.code == 200) {
          _self.cover = data.result;
          let i = 3;
          let a = setInterval(function () {
            if (i == 1) {
              _self.initFn();
              clearInterval(a);
            }
            i--;
          }, 1000)
        } else {
          location.href = "error.html#4"
        }
      });
    },
    methods: {
      initFn: function () {
        this.$router.push({path:"/groupon",query:this.$route.query});
      }
    }
  }
</script>

<style  scoped>
  .cover {
    background-size: cover;
    background-position: center;
    height: 568px

  }

  .cover img {
    width: 3.5rem;
    border: 1px solid white;
    margin-top: -3rem;
  }

  .cover .content {
    background: #ffffff;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
  }

  .cover .text {
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 1.4px;
    padding-top: 1rem;
  }

  .cover .btn {
    width: 8rem;
    height: 2rem;
    border-radius: 100px;
    background-image: linear-gradient(to bottom, #ff3d49, #e4020f);
    box-shadow: 0 2px 4px 0 #ff999f, inset 0 1px 3px 0 #e4020f;
    border: solid 1px #ff555f;
    color: #ffffff;
    font-size: .9rem;
    line-height: 2rem;
    margin: 1.5rem auto 1.8rem;
  }

  .jump {
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    padding: .2rem .5rem;
    display: inline-block;
    float: right;
    margin: .5rem;
  }
</style>
