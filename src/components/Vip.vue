<template>
  <div class="vip" v-if="data">
    <div class="card-wrapper">
      <swiper :options="swiperOption">
        <swiper-slide class="card" v-for="(item,key) in data.strategies"
                      :key="key">
          <div class="card-bg">
            <div class="flex"
                 :style="{backgroundImage: 'url('+ (item.cardUrl||'') +')'}">
              <img class="avatar" :src="data.logoUrl">
              <div class="name">
                <div></div>
                <div>{{data.brandName}}</div>
              </div>
            </div>
            <div class="no">{{item.toName}}</div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination" id="swiper-pagination"></div>
      </swiper>
    </div>
    <div v-if="data.strategies">
      <vip-module v-bind:data="data.strategies[index]" v-bind:upgrade="true" @bindFn="refresh()"></vip-module>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  import 'swiper/dist/css/swiper.css'
  import VueAwesomeSwiper from 'vue-awesome-swiper'
  import vipModule from "./module/vip"

  Vue.use(VueAwesomeSwiper);

  export default {
    name: "User",
    data() {
      const _self = this;
      return {
        data: "",
        index: 0,//当前等级
        swiperOption: {
          initialSlide: 0,
          centeredSlides: true,
          slidesPerView: 1.4,
          spaceBetween: 13,
          pagination: {
            el: '#swiper-pagination',
            clickable: true,
          },
          on: {
            slideChange() {
              _self.toggleFn(this.activeIndex);
            }
          }
        }
      }
    },
    components: {
      vipModule
    },
    created() {
      this.initFn();
    },
    methods: {
       
      initFn() {
        let _self = this;
        this.$http.get("/membership/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
          let data = response.body;
          if (data.code == 200) {
            _self.data = data.result;
            
            if (_self.data.currentGrade) {
              for (let i in _self.data.strategies) {
                _self.data.strategies[i].currentGradeName = _self.data.memberGradeName;
              }
              _self.$set(_self.swiperOption, "initialSlide", _self.data.currentGrade + 0);
              if(_self.data.strategies.length>data.result.currentGrade){
                 _self.index = data.result.currentGrade;
              }else{
                 _self.index = data.result.currentGrade-1;
              }
             
            }else{
              _self.index = 0;
            }
          }
        });
        // this.$http.get("/membership/guest/" + (this.$route.query.id || this.$route.query.guestid) + "/upgrade").then(response => {
        //   let data = response.body;
        //   if (data.code == 200) {
        //     _self.data = data.result;
        //     _self.$nextTick(function () {
        //       window.addEventListener('scroll', function (e) {
        //         if (this.show) {
        //           console.log(1);
        //           e.stopPropagation();
        //           e.preventDefault();
        //         }
        //       });
        //     })
        //   }
        // });
      },
      toggleFn(index) {
        console.log(index);
        // if (!this.grades || !index) return;
        this.index = index;
        console.log('index'+this.index)
        // let json = {
        //   gradeId: this.grades.strategies[index].toId
        // };
        // this.$http.get("/membership/guest/" + (this.$route.query.id || this.$route.query.guestid) + "/upgrade", {key: json}).then(response => {
        //   let data = response.body;
        //   if (data.code == 200) {
        //     this.data = data.result;
        //   }
        // });

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../sui_assets/scss/vip.scss";
</style>
