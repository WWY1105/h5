<template>
<transition name="bounceUp">
    <div class="popup popup-coupon modal-in" v-if='data'>
        <div class="liner"><span class="text2">{{category[data.category]}}</span><span class="md-close" v-on:click.stop='data=false'></span></div>
        <div class="coupon-show-box">
            <div class="name_add">
                <div class="name">{{data.name}}</div>
                <div class="code">{{data.code}}</div>
                <div id="my-code">
                </div>
            </div>
        </div>
        <div class="coupons-detail">
            <h4>使用说明</h4>
            <div class="item" v-if="data.amount">
                <div class="left" v-if="data.category == '902' || data.category == '9021'">价值：</div>
                <div class="right" v-if="data.category == '902' || data.category == '9021'">
                    原价:{{data.currentAmount}}元，现价:{{data.amount}}元
                </div>
                <div class="right" v-else-if="data.category == '902' || data.category == '9021'">{{data.amount}}元</div>
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
</transition>
</template>

<script>
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
            }
        }
    },
    props:[],
    created() {
        if ("deletefont" == e.target.classList[0]) return;
        var uri;
        var node = $(this);
        if ($(this).attr("index")) {
            this.ajaxUrl("couponDetail.html?cid=" + $(this).attr("index"))
        } else {
            uri = "/benefit/userCoupon/" + $(this).attr("id");
            if ($(this).find(".a4002").length || $(this).find(".a4003").length) {
                return;
            }
        }
        this.$http.get("/remind/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
            let data = response.body;
            if (data.code == 200) {
                if (node.attr("id") && (result.category == "902" || result.category == "9021" || result.category == "904" || result.category == "9031")) {
                    var qrcode = new QRCode($("#my-code"), {
                        width: 100,
                        height: 100
                    });
                    //当面付
                    qrcode.makeCode(result.id);
                }

            }
        });
    }
}
</script>

<style scoped>

</style>
