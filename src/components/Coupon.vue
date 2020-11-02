<template>
  <div class="coupon">
    <div class="content">
      <div class="i-border-top">
        <swiper :options="swiperOption">
          <!-- 未使用 -->
          <swiper-slide>
            <div class="set-coupon" v-if="data.usable.items">
              <div class="coupon_show" 
              v-for="item in data.usable.items" 
              :key="item.id" 
            
              @click="use(item.id)"
              >
                 <div class="i-flex i-coupon" @touchstart="showDeleteButton(item.id)" @touchend="clearLoop">
                  <div class="a4001" :class="'a'+ item.state"></div>
                  <div class="item" style="width : 68%">
                    <div class="name" style="padding-top: 0.4rem">{{item.name}}</div>
                    <div class="amount0" v-if="item.category =='9031'">
                      <span style="font-size: .6rem">{{item.value}}</span>{{item.amount}}
                      <span style="font-size: .6rem">折</span>
                    </div>
                    <div class="amount0" v-else-if="item.category =='902'||item.category =='9021'">
                      <span style="font-size: .6rem">可抵 ￥</span>{{item.amount - item.currentAmount}}
                      <div class="through">{{item.amount}}</div>
                    </div>
                    <div class="amount0" v-else-if="item.category =='904' && item.amount">
                      <span style="font-size: .6rem">价值 ￥</span>{{item.amount}}
                    </div>
                  </div>
                  <div class="item">
                    <span class="i-btn grey">使用方法</span>
                  </div>
                </div>
                <div class="addon">
                  <span class="list" v-text="item.times"></span>
                  <span class="list" v-text="item.useStrategy"></span>
                </div>
              </div>
            </div>
            
            <div class="set-coupon empty" v-else>
             </div>
          </swiper-slide>
          <!-- 已使用 -->
          <swiper-slide>
            <div class="set-coupon" v-if="data.used.items">
              <div class="coupon_show" v-for="item in data.used.items">
                <div class="i-flex i-coupon">
                  <div class="a4001" :class="'a'+ item.state"></div>
                  <div class="item">
                    <div class="name" style="padding-top: 0.4rem">{{item.name}}</div>
                    <div class="amount0" v-if="item.category =='9031'">
                      <span style="font-size: .6rem">{{item.value}}</span>{{item.amount}}
                      <span style="font-size: .6rem">折</span>
                    </div>
                    <div class="amount0" v-else-if="item.category =='902'||item.category =='9021'">
                      <span style="font-size: .6rem">可抵 ￥</span>{{item.amount - item.currentAmount}}
                      <div class="through">{{item.amount}}</div>
                    </div>
                    <div class="amount0" v-else-if="item.category =='904'&&item.amount">
                      <span style="font-size: .6rem">价值 ￥</span>{{item.amount}}
                    </div>
                  </div>
                </div>
                <div class="addon">
                  <span class="list" v-text="item.times"></span>
                  <span class="list" v-text="item.useStrategy"></span>
                </div>
              </div>
            </div>
            <div class="set-coupon" v-else>
              <div class="empty" @click="goto('user')"></div>
            </div>
          </swiper-slide>
          <!-- 已过期 -->
          <swiper-slide>
            <div class="set-coupon" v-if="data.overdue.items">
              <div class="coupon_show" v-for="item in data.overdue.items">
                <div class="i-flex i-coupon">
                  <div class="a4001" :class="'a'+  item.state"></div>
                  <div class="item">
                    <div class="name" style="padding-top: 0.4rem">{{item.name}}</div>
                    <div class="amount0" v-if="item.category =='9031'">
                      <span style="font-size: .6rem">{{item.value}}</span>{{item.amount}}
                      <span style="font-size: .6rem">折</span>
                    </div>
                    <div class="amount0" v-else-if="item.category =='902'||item.category =='9021'">
                      <span style="font-size: .6rem">可抵 ￥</span>{{item.amount - item.currentAmount}}
                      <div class="through">{{item.amount}}</div>
                    </div>
                    <div class="amount0" v-else-if="item.category =='904'">
                      <span style="font-size: .6rem">价值 ￥</span>{{item.amount}}
                    </div>
                  </div>
                </div>
                <div class="addon">
                  <span class="list" v-text="item.times"></span>
                  <span class="list" v-text="item.useStrategy"></span>
                </div>
              </div>
            </div>
            <div class="set-coupon" v-else>
              <div class="empty"  @click="goto('user')"></div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination" id="swiper-pagination"></div>
        </swiper>

      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import 'swiper/dist/css/swiper.css'
  import VueAwesomeSwiper from 'vue-awesome-swiper'

  Vue.use(VueAwesomeSwiper);
  export default {
    name: "User",
    data() {
      const self = this;
      return {
        data: {
          usable: {},//待使用
          used: {},//已使用
          overdue: {}//已过期
        },
        type: ['usable', 'used', 'overdue'],
        active: 0,
        swiperOption: {
          pagination: {
            el: '#swiper-pagination',
            clickable: true,
          },
          spaceBetween: 30,
          centeredSlides: true,
          autoHeight: true,
          on: {
            slideChange() {
              self.toggleMenu(this.activeIndex);
            }
          }
        }
      }
    },
    created() {
      let _self = this;
      this.$http.get("/benefit/coupons/guest/" + (this.$route.query.id || this.$route.query.guestid)).then((response) => {
        if (response.body.code == 200) {
          this.data.usable = response.body.result;
        } else {
          this.data.usable = {total: 0, page: 0, count: 20};
        }
        let sw = true;
        window.addEventListener('scroll', function (e) {
          if (document.getElementsByClassName("popup").length) {
            e.preventDefault();
          }
          // 判断是否滚动到底部
          if ((document.body.scrollTop || document.documentElement.scrollTop) + window.innerHeight >= document.body.offsetHeight) {
            // 如果开关打开则加载数据
            if (sw == true && _self.data[_self.type[_self.active]].page < _self.data[_self.type[_self.active]].pageSize) {
              // 将开关关闭
              sw = false;
              let str = "";
              if (_self.active) {
                str = "/" + _self.type[_self.active];
              }
              _self.$http.get("/benefit/coupons/guest/" + (_self.$route.query.id || _self.$route.query.guestid) + str, {
                key: {
                  page: ++_self.data[_self.type[_self.active]].page,
                  count: 20
                }
              }).then(response => {
                if (response.body.code == 200) {
                  _self.data[_self.type[_self.active]].items = _self.data[_self.type[_self.active]].items.concat(response.body.result.items);
                }
                sw = true;
              });
            }
          }
        });

      });
    },
    methods: {
      use(id){
         this.$router.push({path:'CouponUse',query:{id:id}})
      },
        goto(path){
         this.$router.push({path,query:this.$route.query})
      },

      toggleMenu(index) {
        this.active = index;
        if (index && !this.data[this.type[index]].total) {
          this.$http.get("/benefit/coupons/guest/" + (this.$route.query.id || this.$route.query.guestid) + "/" + this.type[index]).then((response) => {
            if (response.body.code == 200) {
              this.data[this.type[index]] = response.body.result;
            } else {
             
              this.data[this.type[index]] = {total: 0, page: 0, count: 20};
            
            }
          });
        }
      },
      //特别注意:生产环境不允许存在此功能
      showDeleteButton(id) {
          clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
          // this.Loop=setTimeout(() => {
          //   let re = confirm("确认要删除此券吗?");
          //   if (re) {
          //     this.$http.post("/benefit/userCoupon/" + id).then(response => {
          //       let data = response.body;
          //       if (data.code == 200) {
          //         this.refresh();
          //       }
          //     });
          //   }
          // },1000);
      },
      clearLoop() {
          clearInterval(this.Loop);
      },
      // couponFn(event, id) {
      //   event.stopPropagation();
      //   this.$couponShow(event, id, 'earned')
      // }
    }
  }
</script>
<style lang="scss">
  @import "../sui_assets/scss/coupon.scss";
</style>
