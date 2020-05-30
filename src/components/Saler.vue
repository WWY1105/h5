<template>
  <div class="saler" id="saler" v-show="data">
    <div class="saler_top">
        <img class="logo" :src="data.logo" @click.prevent="" alt="">
        <div class="brand">{{data.brand}} 现金返现啦</div>
        <div class="timer">距离活动结束: {{time}}</div>
        <div style="margin-top:1rem;"><span>{{data.salary}}</span> <img class="yuan" src="/sui_assets/img/saler/yuan.png">  </div>
    </div>
    <div class="saler_middle">
        <div class="qrcode" v-if="qrCode">
            <img :src="qrCode" alt="">
            <div>长按识别小程序码领取现金</div>
        </div>
        <div class="qrcode" v-else-if="qrCodeUrl">
            <img :src="qrCodeUrl" alt="">
            <div>长按识别小程序码领取现金</div>
        </div>
        <img v-else class="salerimg" @click.prevent="" src="/sui_assets/img/saler/salerimg.png" alt="">
        
    </div>
    <div v-if="!qrCode && !qrCodeUrl">
        <div class="modal-phone" v-show="!data.existPhone">
            <input class="phone" type="tel" v-model="phone1.phone" placeholder="输入手机号" maxlength="11" @blur="temporaryRepair()"> 
            <div class="validate">
                <input class="validateCode" type="tel" placeholder="输入验证码" v-model="phone1.validateCode" maxlength="6" @blur="temporaryRepair()">
                <div class="input-text" v-on:click.stop="validate1Fn">{{phone1.text}}</div>
            </div>
        </div>
        <div class="saler_bottom">
            <div v-on:click.stop="bindPhone1" class="v-button">立即领取</div>
            <div class="text">参加我们的口碑宣传小游戏获得</div>
        </div>
    </div>
      
  </div>

</template>


<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        data: "",
        phone1: {},
        time:'',
        qrCode:'',
        qrCodeUrl:''
      }
    },
    created: function () {
      this.initFn();
      // 获取当前可视区域的高度
      const height = document.documentElement.clientHeight;
      // 在页面整体加载完毕时
      window.onload = function () {
        // 把获取到的高度赋值给根div
        document.getElementById('saler').style.height = `${height}px`;
      }
    },

    methods: {
        initFn: function() {
            console.log(this.$route.query)
            var _self = this;
            
            var browser = navigator.userAgent.toLowerCase();
            if(browser.match(/MicroMessenger/i)!="micromessenger"){
                this.$message("提示", "请使用微信扫一扫", function () {

                });
                return;
            }

            _self.$http.get("/saler/" + _self.$route.query.v).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    _self.data = data.result
                    _self.qrCodeUrl = data.result.qrCodeUrl
                    this.timer = setInterval(function(){
                    _self.countdown(data.result.expiredTime)
                    },1000)
                } else if (data.code == 403000) {
                    _self.cookie.set("url", location.href, {expires: '2m'});
                    localStorage.setItem("url", location.href);
                    // location.href = "index.html?" + location.search;
                    location.href = "index.html?" + location.hash.split("?")[1].split("&state=1")[0];
                } else{
                    location.href = "error.html#11";
                }
            });
            this.bindFn();
        },
        bindFn: function () {
            this.phone1 = {text: '获取验证码', able: true};
        },
        validate1Fn() {
            if (!this.phone1.able) return;
            if (!this.phone1.phone || this.phone1.phone.length != 11) {
            this.$toast("手机格式不正确");
            return;
            }
            this.phone1.able = false;
            let _self = this;
            this.$http.post("/validate/bindup", {"phone": this.phone1.phone}).then(response => {
            let data = response.data;
            if (data.code == 200) {
                this.$toast("获取成功");
                let second = 90;
                let init = setInterval(function () {
                second--;
                if (!second || !_self.phone1) {
                    clearInterval(init);
                    _self.phone1.text = "重新获取验证码";
                    _self.phone1.able = true;
                    return;
                }
                _self.phone1.text = "已发送 " + second + " s";
                }, 1000);
            } else {
                this.phone1.able = true;
                this.$toast(data.message);
            }
            });
        },
        getsaler() {
            var _self = this
            _self.$http.get("/saler/" + _self.$route.query.v).then(response => {
                let data = response.body;
                if (data.code == 200) {
                    _self.data = data.result
                    _self.qrCodeUrl = data.result.qrCodeUrl
                    this.timer = setInterval(function(){
                    _self.countdown(data.result.expiredTime)
                    },1000)
                } else if (data.code == 403000) {
                    _self.cookie.set("url", location.href, {expires: '2m'});
                    localStorage.setItem("url", location.href);
                    // location.href = "index.html?" + location.search;
                    location.href = "index.html?" + location.hash.split("?")[1].split("&state=1")[0];
                } else{
                    location.href = "error.html#11";
                }
            });
        },
        bindPhone1(code) {
            console.log("bindPhone1")
            var _self = this
            if(!this.data.existPhone){
                if (this.phone1.phone && this.phone1.validateCode && this.phone1.phone.length == 11 && this.phone1.validateCode.length == 6) {
                    let jsonA = {id: this.$route.query.v};
                    jsonA.phone = this.phone1.phone;
                    jsonA.validateCode = this.phone1.validateCode;
                    this.$http.post("/saler", jsonA).then(response => {
                        let datas = response.data;
                        if (datas.code == 200) {
                            window.location.reload();
                           if (datas.result && datas.result.token) {
                                this.$cookie.set("token", datas.result.token, {"expires": '30d'});
                            }
                        } else {
                            this.$toast(datas.message);
                        }
                    });
                }else{
                    this.$message("验证码错误", "请检查验证码是否填写正确", function () {

                    });
                }
            }else{
                let jsonA = {id: this.$route.query.v};
                this.$http.post("/saler", jsonA).then(response => {
                    let datas = response.data;
                    if (datas.code == 200) {
                         window.location.reload();
                        if (datas.result && datas.result.token) {
                            this.$cookie.set("token", datas.result.token, {"expires": '30d'});
                        }
                    } else {
                        this.$toast(datas.message);
                    }
                });
            }
            
        },
        temporaryRepair () {
            setTimeout(() => {
            const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);

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
            clearInterval(_self.timer);
            }
            var filter = h + "小时" + m + "分" + s +"秒"
            _self.time = filter
        },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../sui_assets/scss/saler.scss";
</style>
