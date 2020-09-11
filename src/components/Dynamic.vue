<template>
<div class="dynamic">
    <div class="content">
        <div class="shopLogo">
            <img :src="data.logo" alt="">
        </div>
        <p class="shopName">{{data.shopName}}</p>
        <p class="tips">我是您的专属客服</p>
        <div class="waiterName flexCenter">
            <p class="name">{{data.staffName}}</p>
        </div>
        <p class="smallTips">
            长按识别下方二维码办理推荐业务
        </p>
        <div class="codeBox">
            <div class="codeImg">
               <img :src="data.linkPicUrl"  alt="">
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'dynamic',
    data() {
        return {
            data: {}
        }
    },
    created() {
        this.setTitle('您的专属客服')
        this.getData()
    },
    methods: {
        getData() {
            let that = this;
            let id = this.$route.query.id;
            
            if (this.$route.query.id) {
                that.$http.get("/dynamics/" + id).then((response) => {
                    if (response.body.code == 200) {
                        if(!response.body.result.forceLink){
                            // pid:二维码url
                            that.$cookie.set(response.body.result.businessId, response.body.result.linkPicUrl, {
                                 "expires": '1d'
                             });
                            // 引导进群，跳转业务页面
                            location.href=response.body.result.url;
                        }
                        that.data = response.body.result;
                      
                    } else if(response.body.code== 404000){
                        this.$router.push({
                            path:'error',
                            query:{
                                code:14
                            }
                        })
                    }else {
                        that.$toast(response.body.message);
                    }
                })
            }

        }

    }
}
</script>

<style scoped>
p{
    margin: 0;
}
.dynamic {
    padding: 88px 15px 43px;
    background: url(/sui_assets/img/dynamic/bg.png) 0 0 no-repeat;
    background-size: 100% auto;
    margin-top: -20px;
}

.dynamic .content {
    position: relative;
    background-color: white;
    border-radius: 12px;
    padding-top: 67px;
    text-align: center;
}

.dynamic .content .shopLogo {
    position: absolute;
    padding: 10px;
    height: 105px;
    width: 105px;
    box-sizing: border-box;
    top: -50px;
    left: 50%;
    margin-left: -53px;
    background: #fff;
    border-radius: 50%;
}

.dynamic .content .shopLogo img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.dynamic .content .shopName {
    font-size: 18px;
    color: #333;
    margin-bottom: 35px;
}

.dynamic .content .tips {
    font-size: 16px;
    color: #333;
    font-weight: bolder;
    margin-bottom: 17px;
}
.dynamic .content .waiterName,.dynamic .content  .codeBox {
    display: flex;
    align-items: center;
    justify-content: center;
}
.dynamic .content .waiterName .name{
  background: #FF9E00;
  border-radius: 24px;
  color: #fff;
  padding:14px  70px;
  width: fit-content;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 24px;
}
.dynamic .content  .smallTips{
color: #423C3A;
font-size: 12px;
text-align: center;
margin-bottom:17px;
}
.dynamic .content  .codeBox .codeImg{
width: 195px;
height: 195px;
background: url(/sui_assets/img/dynamic/codeBg.png) 0 0 no-repeat;
background-size: cover;
padding: 13px;
}
.dynamic .content  .codeBox .codeImg img{
    width: 167px;
    height: 167px;
}
</style>
