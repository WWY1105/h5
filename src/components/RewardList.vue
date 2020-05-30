<template>
    <div class="rewardlist">
        <div class="rewardlist_box" v-for="(item , key) in data.items" :key="key">
            <div class="position">
                <div class="rewardlist_empty">
                <div class="leftbox">
                    <div class="left-green">
                        <span>{{item.shopName}}</span>
                    </div>

                    <div class="starttime">任务开始时间</div>
                    <div class="text-grey">  
                        <span>{{item.createTime}}</span>
                    </div>
                </div>
                <div class="rightbox">
                    <div class="starttime">本次活动赏金</div>
                    <div class="text-lg">
                        <span>{{item.salary}}</span><span style="font-size:1rem;">元</span>
                    </div>
                    
                    <div class="text-grey">
                        <span style="font-size: 0.7rem;color: #828282;">赏金剩余时间 </span>
                        <span>{{endtime(item,key)}}</span>
                        <span style="color: red;">{{timeobj["t"+key]}}</span>
                    </div>
                </div>
            </div>
            <div class="rewardlist_info">
                <div class="rewardlist_btn" @click="topayment(item.id)">去赚赏金</div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "rewardlist",
    data() {
      return {
        data: "",
        page:1,
        timer:'',
        timearr:[],
        timeobj:{}
      }
    },
    created() {
        window.addEventListener('scroll', this.onScroll);
      this.initFn();
    },
    beforeDestroy() {
        var _self = this
        clearTimeout(_self.timer)
    },
    methods: {
        initFn() {
            var _self = this
            var json={'page':this.page,'count':10}
            this.$http.get("/saler/guest/" + (this.$route.query.id || this.$route.query.guestid),json).then(response => {
                console.log(response)
                if (response.body.code == 200) {
                   this.data = response.body.result
                   console.log("this.data" )
                   console.log(this.data)
                }

            });
        },

        onScroll() {
            //可滚动容器的高度
            let innerHeight = document.querySelector('#app').clientHeight;
            //屏幕尺寸高度
            let outerHeight = document.documentElement.clientHeight;
            //可滚动容器超出当前窗口显示范围的高度
            let scrollTop = document.documentElement.scrollTop;
            //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
            if (innerHeight < (outerHeight + scrollTop)) {
                //加载更多操作
                if(this.data.page == this.data.pageSize){
                    return;
                }else{
                    this.page += 1
                    this.initFn();
                }

            }
        },

        topayment(id){
            var json = {'order':id,"id":this.$route.query.id}
            this.$router.push({path: '/payment', query: json});
        },

        countdown: function(time) {
            var _self = this
            var leftTime =new Date(time).getTime()  - new Date().getTime();
            var d, h, m, s, ms;
            if (leftTime >= 0) {
                d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                h = Math.floor(leftTime / 1000 / 60 / 60);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                ms = Math.floor(leftTime % 1000);
                if (ms < 100) {
                    ms = "0" + ms;
                }
                if (s < 10) {
                    s = "0" + s;
                }
                if (m < 10) {
                    m = "0" + m;
                }
                if (h < 10) {
                    h = "0" + h;
                }
            } else {
                h = "00"
                m = "00"
                s = "00"
            }
            var filter = h + ":" + m + ":" + s 
            return filter;
        },

        endtime(item,key) {
            var _self = this
            let timer;
            var endtime =  _self.countdown(item.expiredTime);
            this.timearr[key] = endtime;
            this.timer = timer = setTimeout(function(){
               endtime =  _self.countdown(item.expiredTime)
              
              console.log(endtime)
              clearTimeout(timer);
                // _self.timeobj["t"+key] = endtime
                _self.$set(_self.timeobj,"t"+key,endtime)
               
            //   _self.timearr.splice(key,1,endtime)
            //   _self.$set(_self.timearr,key,endtime)
            },1000)
        }

    }
}
</script>

<style lang="scss" scoped>
  @import "../sui_assets/scss/rewardlist.scss";
</style>
