<template>
<div id="bigContainer">
    <div>
        <!---->
        <div class="m-title">
            <div style="padding: 0.5rem 0px;">
                <div style="font-weight: 700;">{{coupon.name}}</div> <span></span>
            </div>
        </div>
        <div class="separate"></div>
        <!---->
        <!---->
        <div class="groupon">
            <div class="groupon-detail">
                <div class="title1">使用说明</div>
                <div class="coupons-detail">
                    <!---->
                    <!---->
                  
                    <div class="item">
                        <div class="left">有效期</div>
                        <div class="right">{{coupon.times}}</div>
                    </div>
                      <div class="item">
                        <div class="left">使用条件</div>
                        <div class="right">{{coupon.useStrategy}}</div>
                    </div>
                    <div class="item">
                        <div class="left">详情</div>
                        <div class="right">
                            <div v-for="item in coupon.content">{{item}}</div>
                            
                        </div>
                    </div>
                    <div class="item">
                        <div class="left">备注</div>
                        <div class="right">
                            <div>本券不找零，不兑现，不做外卖使用</div>
                            <div>最终解释权归本店所有</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'CouponActivity',
    data() {
        return {
            coupon: {}
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        // 获取券列表
        getData() {
            let that = this;
            this.$http.get("/activities/coupon/" + (this.$route.query.cid)).then(response => {
                if (response.body.code == 200) {
                    that.coupon = response.body.result;
                }
            });
        },
       

    }
}
</script>

<style scoped>
.bigContainer {
    background: rgb(255, 255, 255);
}

.m-title {
    padding: 1rem 1.4rem;
    font-size: 1rem;
    padding-top: 0;
}

.separate {
    height: .4rem;
    background-color: #f7f7f7;
    border: solid 1px #eaeaea;
}

.groupon .groupon-detail {
    padding: 1rem 1.4rem;
}

.groupon .groupon-detail .title1 {
    font-size: .8rem;
    font-weight: 700;
    padding-top: 1rem;
    text-align: center;
    color: black;
    margin: 0;
}

.groupon .coupons-detail {
    padding: .7rem 0;
}

.groupon .coupons-detail .item {
    margin: .6rem;
    clear: both;
    text-align: left;
    overflow: hidden;
}

.groupon .coupons-detail .left {
    float: left;
    width: 3rem;
    text-align: right;
    color: #aaa;
    text-align-last: justify;
    position: relative;
}

.groupon .coupons-detail .right {
    margin-left: 3.5rem;
    color: #000;
}
</style>
