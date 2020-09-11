<template>
<div>

</div>
</template>

<script>
export default {
    name: 'Promote',
    data() {
        return {
            key_json: {},
            data: {}
        }
    },
    created() {
        let json = this.$route.query;
        this.key_json = json;
        
    },
    mounted(){
        this.initFn();
    },
    methods: {
        initFn() {
            let that = this;
            this.$http.get("/promotes/" + this.key_json.pid + '/staff', {
                key: {
                    'shopId': this.key_json.id
                }
            }).then(response => {
                if (response.body.code == 200) {
                    this.data = response.body.result;
                    // alert(JSON.stringify(response.body.result))
                    // 消费    CONSUME("1000"),
                    // 免费发卡，需要独立出来  FREE("1001"),升级
                    // 升级  UPGRADE("1002")
                    // 充值   RECHARGE("1003"),
                    // 商城    MALL("1004"),
                    // 门店新人礼 FIRSTGIFT("1005");
                    // 
                    switch (response.body.result.business) {
                        case '1000':
                            that.$router.push({
                                path: 'selfPay',
                                query: that.key_json
                            })
                            break;
                        case '1001':
                        case '1002':
                            if (this.data.activityId) {
                                that.key_json.tid = this.data.activityId
                            }
                            that.$router.push({
                                path: 'upgrade',
                                query: that.key_json
                            })
                            break;
                        case '1003':
                            that.$router.push({
                                path: 'charge',
                                query: that.key_json
                            })
                            break;
                        case '1004':
                            that.$router.push({
                                path: 'mall',
                                query: that.key_json
                            })
                            break;
                        case '1005':
                            that.$router.push({
                                path: 'gift',
                                query: that.key_json
                            })
                            break;

                    }
                }
            });
        },
    }
}
</script>
