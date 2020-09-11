<template>
<div class="content" v-bind:class="post.class" >
    <img :src="post.url" style="width: 100%;" />
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
                name: "link", //链接不存在
                title: "很抱歉，当前链接不存在",
                content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
                url: "/sui_assets/img/error/link.png"
            }, {
                name: "coupon", //领券
                title: "超值礼券已被抢光啦！",
                content: ["您可以关注本店公众号", "更多超值礼券赶早来抢"],
                url: "/sui_assets/img/error/coupon.png",
                class: "black"
            }, {
                name: "resume", //消费活动
                title: "本期超值优惠已结束",
                content: ["您可以关注本店公众号", "更多超值礼券赶早来抢"],
                url: "/sui_assets/img/error/resume.png"
            }, {
                name: "upgrade", //升级
                title: "升级好礼已被抢光啦！",
                content: ["您可以关注本店公众号", "更多超值礼券赶早来抢"],
                url: "/sui_assets/img/error/upgrade.png",
                class: "black"
            }, {
                name: "bargain", //砍价
                title: "本期超值砍价活动已结束",
                content: ["您可以关注本店公众号", "更多超值礼券赶早来抢"],
                url: "/sui_assets/img/error/bargain.png"
            }, {
                name: "lottery", //霸王餐
                title: "本期拉票赢霸王餐活动已结束",
                content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
                url: "/sui_assets/img/error/lottery.png"
            }, {
                name: "raffle", //抽奖
                title: "本期大奖免费抽活动已结束",
                content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
                url: "/sui_assets/img/error/raffle.png"
            }, {
                name: "time", //时间不同步
                title: "很抱歉，本地时间与网络时间不一致",
                content: ["请您通过“手机设置-时间管理”", " 等功能，校对时间"],
                url: "/sui_assets/img/error/time.png"
            }, {
                name: "timeout", //二维码过期
                title: "很抱歉，此二维码已失效",
                content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
                url: "/sui_assets/img/error/timeout.png"
            }, {
                name: "nocashier", //二维码过期
                title: "暂不支持在线付款",
                text: "请至收银台付款,谢谢",
                content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
                url: "/sui_assets/img/error/nocashier.png"
            }, {
                name: "noserver", //商户停止服务
                title: "您所在的商户已被停止服务",
                content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
                url: "/sui_assets/img/error/noserver.png"
            }, {
                name: "noreward", //赏金已被其他人领取
                title: "该赏金已被其他人领取",
                text: "下次请早点来哦",
                content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
                url: "/sui_assets/img/error/noreward.png"
            }, {
                name: "errorNet", //12
                title: "连接服务超时,请重新尝试",
                content: [],
                url: "/sui_assets/img/error/error_net.png"
            }, {
                name: "errorNet", //13
                title: "授权失败,请重新尝试",
                content: [],
                url: "/sui_assets/img/error/error_net.png"
            }, {
                name: "errorNet", //14
                title: "",
                content: [],
                url: "/sui_assets/img/dynamic/noData.png"
            }],

            post: {
                name: "link", //链接不存在
                title: "很抱歉，当前链接不存在",
                content: ["您可以关注本店公众号", "更多精彩优惠活动等待您的参与"],
                url: "/sui_assets/img/error/link.png"
            }
        }
    },
    mounted() {
        if (this.$route.query.code) {
            this.post = this.view[this.$route.query.code];
        }
    }
}
</script>

<style scoped>
html,
body {
    padding: 0;
    margin: 0;
    background: #F4F6FB;
    color: #302C48;
}

.content {
    /* position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0; */
    text-align: center;
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: -20px;
}

.black {
    background: #333333;
    color: #ffffff;
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-top: 10%;
}

.grey {
    padding-top: 24px;
    font-size: 15px;
    line-height: 25px;
}

.position {
    /* position: absolute;
    bottom: 18%;
    left: 0;
    right: 0; */
}
</style>
