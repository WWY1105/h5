<template>
    <div class="page">
        <div class="page_top">
            <div class="Invitation">立即邀请</div>
            <div class="title">
                <span>{{profitEstimation}}</span> <img src="/sui_assets/img/payment/title.png" />
            </div>
        </div>
        <div class="method1">
            <div class="title">方法一</div>
            <div class="content">
                <div class="qrcodebox">
                  <img v-show="codeshow" class="qrcodeimg" :src="qrcodeimg" @load="loadimg()">
                  <img v-show="loadingshow" class="qrcodeimg" style="width: 3rem;height: 3rem;"  src="/sui_assets/img/payment/loading.gif" >
                </div>
                <div class="rightbox">
                    <div class="savetitle">保存图片微信识别</div>
                    <div class="savecontent">保存图片，使用微信扫描本地图片进入小程序 </div>
                    <img v-on:click="showcanvas=true" class="savebtn" src="/sui_assets/img/guide/saveimg.png" />
                </div>
            </div>
            
        </div>
        <div class="linebox"><img class="line" src="/sui_assets/img/guide/line.png" alt=""></div>
        <div class="method2">
            <div class="title">方法二</div>
            <div class="content" align="center">
                <div class="topic">第一步</div>
                <div class="describe">进入微信，打开微信顶部搜索框</div>
                <img src="/sui_assets/img/guide/search.png" alt="">
                <div class="topic">第二步</div>
                <div class="describe">搜索“<span style="color:#f0975f;">探长探店</span>”</div>
                <img src="/sui_assets/img/guide/search2.png" alt="">
                <div class="topic">第三步</div>
                <div class="describe">找到“<span style="color:#f0975f;">探长探店</span>”小程序并进入</div>
                <img src="/sui_assets/img/guide/search3.png" alt="">
            </div>
        </div>
        <!-- <div class="rule">
            <div class="title">活动规则</div>
            <div class="content">
                <div>
                    <div class="number">1</div>
                    <span>活动自买单完成起开始计时，限24小时内完成</span>
                </div>
                 <div>
                    <div class="number">2</div>
                    <span>邀请同城好友方可有效计数，非本城好友仅可领取福利</span>
                </div>
            </div>
        </div> -->
        <!-- <canvas id="canvas" width="300" height="500" ref="canvas"></canvas> -->
        <div class="canvasmodle" @touchmove.prevent v-if="showcanvas">
          <div class="canvasimg">
            <p>消费返现{{profitEstimation}}元</p>
            <img :src="qrcodeimg" alt="">
          </div>
          <img class="canvasclose" src="/sui_assets/img/guide/close.png" v-on:click="showcanvas=false">
        </div>
        
    </div>
    
</template>


<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
       profitEstimation:'',
       qrcodeimg:'',
       context: {},
       canvasimg:'',
       showcanvas:false,
       codeshow:false,
        loadingshow:true
      }
    },
    created: function () {
      this.initFn();
    },
    mounted: function() {
      const that= this
      // this.$nextTick(()=>{
      //     const img = new Image();
      //     const qrcodeimg = new Image();
      //     img.setAttribute("crossOrigin", "anonymous");
      //     qrcodeimg.setAttribute("crossOrigin", "anonymous");
      //     const canvas = that.$refs.canvas;
      //     const ctx = canvas.getContext('2d');
      //     img.src = "/sui_assets/img/guide/canvas.png"
      //     console.log(canvas)
      //     img.onload = function(){
      //       ctx.drawImage(img, 0, 0, 300, 500)             
      //       ctx.font = "22px sans-serif";
      //       ctx.fillStyle = "#ee7d4e";
      //       ctx.textAlign = "center";  
      //     }
      //     setTimeout(function(){
      //       qrcodeimg.src = that.qrcodeimg
      //       qrcodeimg.onload = function(){
      //         ctx.drawImage(qrcodeimg, 75, 230, 150, 150)
      //         ctx.fillText("消费返现"+that.profitEstimation+"元",150,160,300)
      //         // that.canvasimg = canvas.toDataURL("image/png")
      //         // var FormDataImg = new FormData()
              
      //         var base64Img  = canvas.toDataURL("image/png")
      //         that.canvasimg = that.dataURLtoFile(base64Img)
      //       }
         
      //     },500)
          
          
      // })
      
      
    },
    methods: {
      initFn: function () {
        var _self = this
        var i = 0
        _self.$http.get("/saler/order/" + (_self.$route.query.order || _self.$route.query.oid)).then(response => {
            let data = response.body;
            if (data.code == 200) {   
                this.profitEstimation = data.result.profitEstimation
                if(data.result.qrCodeUrl){
                  this.qrcodeimg = data.result.qrCodeUrl
                }else{
                  let qrcodetimer = setTimeout(()=>{
                    i=i+1
                    _self.initFn(); 
                    if(i==3){
                      clearTimeout(qrcodetimer);
                    }
                  },5000)
                }
                
            }else{
              
              
            }
        });
        
        
      },
       loadimg: function() {
        this.loadingshow = false
        this.codeshow = true
      }
    } 
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../sui_assets/scss/guide.scss";
</style>
