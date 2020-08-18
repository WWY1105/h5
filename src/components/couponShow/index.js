/**
 * 自定义 提示框( Toast )组件
 */
let Coupon = {};
Coupon.install = function (Vue) {
  /*
  * e:点击事件
  * item:coupon包含的json
  * type 'earned'表示已领取的券，其他为未领取
  *
  * */
  Vue.prototype.$couponShow = function (e, item, type,showFlag) {
    if(!showFlag){

    }
    if ("deletefont" == e.target.classList[0]) return;
    if (type != 'earned') {
      let path = "/couponDetail.html?cid=" + item.id + "&";
      if (this.$route.query.id) {
        path += "id=" + this.$route.query.id;
      } else if (this.$route.query.guestid) {
        path += "guestid=" + this.$route.query.guestid;
      }
      if (item.category == '1017') {
        path += '&type=reward';
      }
      location.href = path;
      return;
    }
    if (e.target.getElementsByClassName("a4002").length || e.target.getElementsByClassName("a4003").length) {
      return;
    }

    let toastTpl = Vue.extend({
      data() {
        return {
          data: "",
          id: item.id,
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
      beforeCreate() {
        this.$loading("加载中...");
        this.$http.get("/benefit/userCoupon/" + item.id).then(response => {
          let data = response.body;
          if (data.code == 200) {
            this.data = data.result;
            this.$nextTick(function () {
              this.$loading.close();
              if (data.result.code) {
                let qrcode = new QRCode(document.getElementById("my-code"), {
                  width: 100,
                  height: 100
                });
                //当面付
                qrcode.makeCode(data.result.id);
              }
            })
          }
        });
      },
      
      template: " <transition  name=\"bounceUp\"> <div @touchmove.prevent class=\"popup popup-coupon\" v-if='data'>\n" +
      "    <div class=\"liner\"><span class=\"text2\">{{category[data.category]}}</span><span class=\"md-close\" v-on:click.stop='data=false'></span></div>\n" +
      "    <div class='overflow'>" +
      "    <div class=\"coupon-show-box\">\n" +
      "      <div class=\"name_add\">\n" +
      "        <div class=\"name\">{{data.name}}</div>\n" +
      "        <div class=\"code\">{{data.code}}</div>\n" +
      "        <div id=\"my-code\">\n" +
      "        </div>\n" +
      "      </div>\n" +
      "    </div>\n" +
      "    <div class=\"coupons-detail\">\n" +
      "      <h4>使用说明</h4>\n"+
      "      <div class=\"item\" v-if=\"data.amount\">\n" +
      "        <div class=\"left\" v-if=\"data.category == '902' || data.category == '9021'\">价值：</div>\n" +
      "        <div class=\"right\" v-if=\"data.category == '902' || data.category == '9021'\">\n" +
      "          原价:{{data.amount}}元，现价:{{data.currentAmount}}元\n" +
      "        </div>\n" +
      "        <div class=\"right\" v-else-if=\"data.category == '901' || data.category == '904'\">{{data.amount}}元</div>\n" +
      "      </div>\n" +
      "      <div class=\"item\">\n" +
      "        <div class=\"left\">使用条件：</div>\n" +
      "        <div class=\"right\">{{data.useStrategy}}\n" +
      "          <div>{{((data.category != \"904\" && data.countLimit) ? '每次消费最多可使用' + data.countLimit + \"张\" : \"\")}}</div>\n" +
      "        </div>\n" +
      "      </div>\n" +
      "      <div class=\"item\">\n" +
      "        <div class=\"left\">有效期：</div>\n" +
      "        <div class=\"right\">{{data.times}}</div>\n" +
      "      </div>\n" +
      "      <div class=\"item\">\n" +
      "        <div class=\"left\">详情：</div>\n" +
      "        <div class=\"right\">\n" +
      "          <div v-for=\"item in data.content\">{{item}}</div>\n" +
      "        </div>\n" +
      "      </div>\n" +
      "      <div class=\"item\">\n" +
      "        <div class=\"left\">备注：</div>\n" +
      "        <div class=\"right\">\n" +
      "          <div>本券不找零，不兑现，不做外卖使用</div>\n" +
      "          <div>本活动在法律允许范围内商家拥有最终解释权</div>\n" +
      "        </div>\n" +
      "      </div>\n" +
      "    </div>\n" +
      "    </div>\n" +
      "  </div>\n   </transition>",
      methods: {}
    });
    let tpl = new toastTpl().$mount().$el;
    document.getElementById("app").appendChild(tpl);
  };
}

// 向外暴露接口
module.exports = Coupon;
