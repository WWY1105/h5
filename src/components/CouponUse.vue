<template>
  <div class="popup popup-coupon1" v-if='data'>
      <!-- <div class="liner"><span class="text2">{{category[data.category]}}</span><span class="md-close" v-on:click.stop='data=false'></span></div> -->
      <div class="pic">
        <img v-if="data.picUrl" class="picUrl" v-bind:src= "data.picUrl" alt="">
        <!-- <img v-else class="picUrl" src='/sui_assets/img/coupon/picUrl2.png' alt=""> -->
        <div v-else style="height : 3.5rem"></div>
        <img class="change" src="/sui_assets/img/coupon/change.png" alt="">
      </div>
      <div  class='overflow'>
        <div class="coupon-show-box">
          <div class="name_add">
            <div class="name">{{data.name}}</div>
            <div class="use">{{data.useStrategy}}</div>
            <div v-if="data.code" class="usebtn" v-on:click="showcode()">立即使用</div>
            <div v-else class="disable">买单自动抵扣</div>
            <!-- <div class="code">{{data.code}}</div>
            <div id="my-code">
            </div> -->
          </div>
        </div>
        <div class="coupons-detail">
          <h4>使用说明</h4>
          <div class="item" v-if="data.amount">
            <div class="left" v-if="data.category == '902' || data.category == '9021' || data.category == '901' || data.category == '904'">价值：</div>
            <div class="right" v-if="data.category == '902' || data.category == '9021'">
              原价:{{data.amount}}元，现价:{{data.currentAmount}}元
            </div>
            <div class="right" v-else-if="data.category == '901' || data.category == '904'">{{data.amount}}元</div>
          </div>
          <div class="item">
            <div class="left">使用条件：</div>
            <div class="right">{{data.useStrategy}}
              <div>{{((data.category != "904" && data.countLimit) ? '每次消费最多可使用' + data.countLimit + "张" : "")}}</div>
            </div>
          </div>
          <div class="item">
            <div class="left">有效期：</div>
            <div class="right">{{data.times}}</div>
          </div>
          <div class="item">
            <div class="left">详情：</div>
            <div class="right">
              <div v-for="item in data.content">{{item}}</div>
            </div>
          </div>
          <div class="item">
            <div class="left">备注：</div>
            <div class="right">
              <div>本券不找零，不兑现，不做外卖使用</div>
              <div>本活动在法律允许范围内商家拥有最终解释权</div>
            </div>
          </div>
        </div>
      </div>
      <div class="over-bg" style="padding: 0" v-if="show">
            <div class="coupons-item">
              <div class="a4001"
                    style="padding: 22px;position: absolute;top: -.1rem;left: 0"></div>
              <div id="my-code">
              </div>
              <div class="code">{{data.code}}</div>
              <p>请出示给服务员</p>
            </div>
          <!-- <div class="swiper-pagination" slot="pagination" id="swiper-pagination"></div> -->
        <div class="md-close" v-on:click="closeCouponModal"></div>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: "",
    data() {
      return {
        data: "",
        category: {
          "901": "本券买单时自动抵用",
          "902": "本券在买单时出示使用",
          "9021": "本券在买单时出示使用",
          "9011": "本券买单时自动抵用",
          "904": "到店出示给服务员即可使用",
          "9031": "到店出示给服务员即可使用",
          "903": "本券买单时自动抵用"
        },
        show : false ,
      }
    },
    created() {
      this.$http.get("/benefit/userCoupon/" + this.$route.query.id).then(response => {
        let data = response.body;
        if (data.code == 200) {
          this.data = data.result;
          // this.$nextTick(function () {
          //   let qrcode = new QRCode(document.getElementById("my-code"), {
          //     width: 150,
          //     height: 150
          //   });
          //   // 当面付
          //   qrcode.makeCode(this.data.id);
          // })
        }
      });

    },
    methods :{
      showcode () {
        this.show = true;
        this.$nextTick(function () {
            let qrcode = new QRCode(document.getElementById("my-code"), {
              width: 150,
              height: 150
            });
            // 当面付
            qrcode.makeCode(this.data.id);
          })
      },
      closeCouponModal () {
        this.show = false;
      }
    }
  }
</script>


<style lang="scss">
  @import "../sui_assets/scss/couponuse.scss";
</style>
