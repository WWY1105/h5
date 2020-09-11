<template>
<div class="modal addVip2" v-if="showModal&&linkPicUrl">

    <div class="modal-inner">
        <div class="modal-title">
            <p>充值成功</p>
        </div>
        <div class="modal-content">
             <div class="addon">
                <img :src="linkPicUrl" class="promote_linkPicUrl" alt="">
                <p>长按进群，获取更多优惠</p>
            </div>

        </div>
        <div class="close" @click="close"></div>
    </div>
</div>
</template>

<script>
export default {
    name: '',
    props:['show'],
    data() {
        return {
            linkPicUrl:null,
            showModal:false
        };
    },
    watch:{
        show(a,b){
           this.showModal=a;
        }
    },
    mounted(){
        let linkPicUrl=this.$cookie.get(this.$route.query.pid);
        if(linkPicUrl){
            this.linkPicUrl=linkPicUrl;
        }
        this.showModal=this.show;
        console.log('组件里面')
        console.log(this.show)
        console.log(this.linkPicUrl)
    },
    methods: {
        close(){
            this.showModal=false
        }
    }
}
</script>

<style lang="scss" scoped>
.close:before {
    content: "";
    background: url(/sui_assets/img/pay/close-white.svg) center no-repeat;
    padding: 16px;
    position: absolute;
    top: 1rem;
    border: 1px solid white;
    border-radius: 50%;
    left: 0;
    right: 0;
    width: 1px;
    margin: auto;
}
.modal-title {
   background: url(/sui_assets/img/earnBenefit/succeed_bg.svg) 0 0 no-repeat;
    background-color: #ffffff;
    background-size: cover;
    height: 3.8rem;
    line-height: 3.8rem;
    font-size: .9rem;
    font-weight: bold;
    border-radius: 10px 10px 0 0;
}
.modal-content{
   display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
        background-color: #fff;
    border-radius: 0 0 10px 10px;
    padding: 10px 0;
        height: 170px;
    padding-top: 20px;
}
.addon {
    // background: url(/sui_assets/img/earnBenefit/qrbg.svg) center no-repeat;

    height: 6rem;
    background-size: cover;
    color: #ffffff;
       display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: .8rem;
    font-weight: bold;
    color:#333;

}

.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1;
}

.modal .modal-inner {
    width: 15.5rem;
    position: absolute;
    z-index: 11000;
    left: 50%;
    margin-left: -7.55rem;
    margin-top: 0;
    top: 20%;
    text-align: center;
    border-radius: .35rem;
    animation: show-modal .5s;
    -webkit-animation: show-modal .5s;
    color: #3d4145;
}

.modal .modal-inner .close {
   position: absolute;
    bottom: -15%;
    left: 50%;
    z-index: 1;
    margin-left: -18px;
}

img {
    width:120px;
}
</style>
