<template>
  <div>
    <div v-if="data.activity" class="groupon">

      <div class="bg" :style="{backgroundImage: 'url('+ (data.activity.picUrl||'') +')'}">
        <div class="left-scroll" v-if="view&&view.list">
          <div id="Marquee_x">
            <ul>
              <li>
                <div class="ellipsis" v-for="(item,index) in view.list.items">
                  <img :src="item.avatarUrl">{{item.nickname}} 砍价 {{item.amount}}元
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="bottom">
          <div>
            <div class="round-icon" v-on:click="ruleFn">活动规则
            </div>
            <div class="round-icon" v-show="data.activity.state!=='CREATE'" v-on:click="earnFn">我的购买</div>
          </div>
          <div class="time" v-if="data.activity.state=='ENABLED'&&time.length">
            距离活动结束还有 {{time[0]}} 天 {{time[1]}}小时 {{time[2]}} 分 {{time[3]}} 秒
          </div>
          <div class="time" v-if="data.activity.state=='DISABLED'">
            活动已结束
          </div>
        </div>
      </div>
      <div class="groupon-detail">
        <div class="title2">{{data.activity.name}}</div>
        <div class="text">价值 <span class="text-red">{{data.activity.benefits.amount}}元</span>
        </div>
        <div class="process">
          <div class="left">原价
            <div style="font-weight: 700"> ￥{{data.activity.amount}}</div>
          </div>
          <div class="line-anim">
            <div style="padding-right: 4.2rem">
              <div class="move-text"
                   :style="{left: (data.groupon?((data.groupon.amount-data.groupon.remind)/data.groupon.amount*100):2) +'%'}">
                当前价<strong>{{data.purchase}}</strong>元
                <div class="round-circle"></div>
              </div>
            </div>
            <div class="line">
              <div style="background: #f8e71c;height: .7rem;display: inline-block"
                   :style="{'width':(data.groupon?((data.groupon.amount-data.groupon.remind)/data.groupon.amount*100):'0') +'%'}"></div>
            </div>
            <div style="margin: 2rem 0 0.5rem;font-size: .8rem" v-if="data.activity.state=='ENABLED'">
              <div v-if="data.groupon&&data.groupon.remind == 0">{{data.nickname}}已成功砍至<span
                style="font-size: 1.1rem">最低价</span>啦！
              </div>
              <div v-else>{{data.nickname}}正在砍价中！</div>
            </div>
            <div class="btn" style="color: white;margin-top: 0" v-if="data.buyEnable&&data.activity.state=='ENABLED'"
                 v-on:click="buyFn">
              现在就以{{data.purchase}}元购买
            </div>
          </div>
          <div class="right">最低价
            <div style="color: #f83342;font-weight: 700">￥{{data.activity.finalAmount}}</div>
          </div>
        </div>
        <div class="process-after"></div>
        <div class="groupon-rule">
          <div class="title1">兑换说明</div>
          <!--<ul class="step1">-->
          <!--<li >-->
          <!--</li>-->
          <!--<li>本券不找零，不兑现，不做外卖使用</li>-->
          <!--</ul>-->
          <div class="coupons-detail" v-if="data.activity.usedTexts">
            <div class="item">
              <div class="left">使用条件</div>
              <div class="right">{{data.activity.usedTexts.useStrategy}}</div>
            </div>
            <div class="item">
              <div class="left">有效期</div>
              <div class="right">{{data.activity.usedTexts.times}}</div>
            </div>
            <div class="item">
              <div class="left">详情</div>
              <div class="right">
                <div v-for="item in data.activity.usedTexts.content">{{item}}</div>
              </div>
            </div>
            <div class="item">
              <div class="left">备注</div>
              <div class="right">
                <div>本券不找零，不兑现，不做外卖使用</div>
              </div>
            </div>
          </div>

          <div class="addon">本活动在法律允许范围内商家拥有最终解释权</div>
        </div>
        <div class="groupon-content">
          <div class="title1">活动亮点</div>
          <div class="text2">{{data.activity.name}}</div>
          <div class="text1" v-html="replaceMethod(data.activity.descriptor)"></div>
          <div class="img" v-for="item in data.activity.picUrls">
            <img :src="item.url" style="width: 100%">

            <div class="desc">{{item.title}}</div>
          </div>
        </div>
        <div class="groupon-shops">
          <div class="title1">分店列表</div>
          <img :src="data.logoUrl">

          <div class="shop" v-for="(item,index) in data.shops" v-show="state||(index<3)">
            <div class="" style="text-align: left">{{data.brandName}}({{item.name}})</div>
            <div class="grey" style="text-align: left"><span>{{item.address}}</span> <span
              class="pull-right">{{item.tel}}</span></div>
          </div>
          <div class="more" v-if="!state&&(data.shops.length>3)" v-on:click="state=true">查看全部</div>
        </div>
        <div class="process-after">
          <div class="ad" v-if="data.advertisement" v-on:click="replaceUrl(data.advertisement)">
            <img :src="data.advertisement.transversePicUrl">
          </div>
        </div>

        <div class="groupon-list">
          <div class="title1">帮砍好友</div>
          <div class="list-content" v-if="view.list&&view.list.items">
            <div class="i-flex" v-for="(item,index) in view.list.items">
              <div class="i-flex">
                <span class="index reverse">{{index+1}}</span>
                <img :src="item.avatarUrl">

                <div>
                  <div class="ellipsis">{{item.nickname}}<span class="text-red">{{item.myself?'我自己':''}}</span></div>
                  <div class="grey">{{item.createTime}}</div>
                </div>
              </div>

              <div class="text-red">砍价<span style="font-size: .8rem;vertical-align: unset;padding-left: .2rem"> {{item.amount}}元</span>
              </div>
            </div>
            <div v-if="view.list.page<view.list.pageSize" class="text-center"
                 style="color: #ff555f;padding-top: .8rem " v-on:click="pageFn">查看更多
            </div>
          </div>
          <div class="list-empty" v-else>
            <img src="/sui_assets/img/grounpon/sad.svg">

            <div>还没有好友砍价哦~</div>
          </div>
          <div class="g-calc">
            <div class="item">发起次数 {{data.initiatorCount}}</div>
            <div class="item">砍价次数 {{data.bargainCount}}</div>
          </div>
        </div>
      </div>
      <div style="height: 5rem"></div>
      <div class="fixed">
        <div class="time">
          <span v-if="data.activity.unUsedCount">本次优惠还剩<span style="color:#f83342;font-weight: 700;font-size: .7rem"> {{data.activity.unUsedCount}} </span>个名额，</span>
          好友帮砍最低可至<span
          style="color:#f83342;font-weight: 700;font-size: .7rem"> {{data.activity.finalAmount}} </span>元
        </div>
        <div style="background: #ffffff; padding: .7rem .8rem;">
          <div class="btn disabled" v-if="data.activity.state=='DISABLED'">活动已结束</div>
          <div v-else-if="data.groupon&&data.groupon.remind == 0&&data.buyEnable">
            <div class="btn" v-on:click="buyFn"><span v-if="data.activity.finalAmount==0">立即领取</span><span
              v-else>立即购买</span></div>
          </div>
          <div v-else>
            <div v-if="data.bargainEnable" class="btn" v-on:click="bargainFn">点此自己先砍一刀！</div>
            <div v-else class="btn" v-on:click="inviteFn">邀请好友继续帮我砍价</div>
          </div>
        </div>
        <!--<div class="btn" v-on:clic k="inviteFn" v-if="data.activity.state!='DISABLED'&&data.groupon">邀请好友继续帮砍</div>-->
      </div>
    </div>
    <div class="popup-overlay"></div>
    <div class="gmodal" id="modal">
      <div class="g-modal-border" style="margin-top: 30%">
        <div class="text1">活动规则</div>
        <ul v-if="view&&view.rule">
          <li v-if="view.rule.ALL">{{view.rule.ALL}}</li>
          <li v-if="view.rule.timesLimit">{{view.rule.timesLimit}}</li>
          <li v-if="view.rule.buy">{{view.rule.buy}}</li>
          <li v-if="view.rule.countLimit">{{view.rule.countLimit}}</li>
          <li v-if="view.rule.time">{{view.rule.time}}</li>

          <li>本活动在法律允许范围内商家拥有最终解释权</li>
        </ul>
      </div>
      <div v-on:click.stop="closeFn" class="md-close"></div>
    </div>
    <div class="gmodal gmadal-black" v-if="data">
      <div class="canvas" id="canvas" :style="{backgroundImage: 'url('+ (data.activity.picUrl||'') +')'}">
        <div class="red"><img class="logo" :src="data.logoUrl">{{data.brandName}}
        </div>
        <div class="content">
          <div class="big-title">帮我来砍价</div>
          <div class="border">
            <div class="name">{{setCouponText(data.activity.benefits)}}
            </div>
            <div class="min">最低可砍至<span class="text-red"> {{data.activity.finalAmount}}元</span>
            </div>
            <div class="limit" v-if="data.activity.unUsedCount">仅剩{{data.activity.unUsedCount}}份</div>
          </div>
        </div>
        <div class="content">
          <div id="my-code1" style="float: left"></div>
          <div class="addon">长按识别二维码<br>
            <span style=" font-size: 20px;">你也有机会哦！</span>
          </div>
        </div>
      </div>
      <div class="canvas-title">长按下图，保存或直接发给好友砍价</div>
      <img src="#" id="img" class="canvas-img" alt=""/>

      <div v-on:click.stop="closeFn" class="close"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "Groupon",
    data: function () {
      return {
        cover: ""
      }
    },
    watch:{
      'data.groupon.amount':{
        //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
        handler(curVal,oldVal){
          conosle.log(curVal,oldVal)
        },
        deep:true
      }

    },
    beforeCreate: function () {
      var _self = this;
      if (!key_json.aid) {
        ajaxUrl("groupee.html?gid=" + key_json.id);
        return;
      }
      rest("/groupon/activity/" + key_json.aid, {}, "get", function (data) {
        if (data.code == 200) {
          $("#loading").addClass("hide");
          setTitle(data.result.brandName + "邀您来砍价");
          if (data.result.groupon) {
            rest("/groupon/" + data.result.groupon.grouponId + "/record", {}, "get", function (data1) {
              if (data1.code == 200) {
                _self.view = {
                  list: data1.result
                };
                setTimeout(function () {
                  $('#Marquee_x').Marquee({'marquee': 'y', 'speed': 50, 'margin_bottom': '5px'});
                }, 100);
              }
            });
          }
          _self.data = data.result;
          var t = setInterval(leftTimer, 1000);

          function leftTimer() {
            var leftTime = (new Date(_self.data.activity.endTime)) - (new Date()); //计算剩余的毫秒数
            if (!leftTime) {
              clearInterval(t);
              return;
            }
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            Vue.set(_self.time, 0, checkTime(days));
            Vue.set(_self.time, 1, checkTime(hours));
            Vue.set(_self.time, 2, checkTime(minutes));
            Vue.set(_self.time, 3, checkTime(seconds));
          }

          //js config
          if (version == "WXPAY") {
            var wxJson = {};
            wxJson.url = location.href;
            //wxJson.shopId = shopId;
            rest("/auth/sign", wxJson, "post", function (data) {
              if (data.code == 200) {
                var result1 = data.result;
                result1.jsApiList = [
                  'hideMenuItems',
                  'onMenuShareAppMessage',
                  'onMenuShareTimeline'
                ];
                wx.config(result1);
                wx.ready(function () {
                  wx.hideMenuItems({
                    menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                  });
                  wx.onMenuShareAppMessage({
                    title: _self.data.shareTitle, // 分享标题
                    desc: (_self.data.activity.unUsedCount ? ('仅剩' + _self.data.activity.unUsedCount + "份") : '') + "最低砍到" + _self.data.activity.finalAmount + "！你也有机会！猛戳抢", // 分享描述
                    link: _self.data.groupon ? (location.origin + '/groupee.html?gid=' + _self.data.groupon.grouponId + '&guestid=' + key_json.guestid) : location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _self.data.logoUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                      // 用户确认分享后执行的回调函数--分享事件
                      rest("/groupon/activity/" + key_json.aid + "/invitation", {}, "post", function (data) {
                      });
                    },
                    cancel: function () {
                      // 用户取消分享后执行的回调函数
                    }
                  });
                  wx.onMenuShareTimeline({
                    title: _self.data.shareTitle, // 分享标题
                    link: _self.data.groupon ? (location.origin + '/groupee.html?gid=' + _self.data.groupon.grouponId + '&guestid=' + key_json.guestid) : location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _self.data.logoUrl, // 分享图标
                    success: function () {
                      // 用户确认分享后执行的回调函数
                    }
                  });
                });
              }
            });
          }
        } else {
          alert(data.message);
          location.href = "error.html#4";
        }
      });

    },
    methods: {
      bargainFn: function () {
        _self = this;
        rest("/groupon/activity/" + key_json.aid, {}, "post", function (data) {
          if (data.code == 200) {
            $.toast("成功砍减" + data.result.amount + "元");
            setTimeout(function () {
              refresh();
            }, 2500)
          } else {
            alert(data.message);
          }
        });
      },
      ruleFn: function () {
        $.showIndicator();
        var _self = this;
        rest("/groupon/activity/" + key_json.aid + "/content", {}, "get", function (data) {
          if (data.code == 200) {
            Vue.set(_self.view, 'rule', data.result);
            $("#modal").show();
          }
        });
      },
      earnFn: function () {
        ajaxUrl("buyRecord.html?aid=" + key_json.aid);
      },
      closeFn: function () {
        $(".gmodal").hide();
      },
      buyFn: function (e) {
        ajaxUrl("buy.html?aid=" + key_json.aid);
      },
      inviteFn: function () {
        $(".gmadal-black").append("<div id='loading'></div>");
        var _self = this;
        $(".gmadal-black").show();
        if ($("#canvas").html()) {
          rest("/groupon/activity/" + key_json.aid + "/invitation", {}, "post", function (data) {
            if (data.code == 200) {
              _self.qrcode = data.result;
              _self.$nextTick(function () {
                var qrcode = new QRCode($("#my-code1"), {
                  width: 100,
                  height: 100
                });
                //当面付
                qrcode.makeCode(data.result.qrCode);
                var dom = $("#canvas"); //你要转变的dom
                var width = dom.width();
                var height = dom.height();
                setTimeout(function () {
                  var scaleBy = 2;  //缩放比例
                  var canvas = document.createElement('canvas');
                  canvas.width = width * scaleBy;
                  canvas.height = (height) * scaleBy;
                  canvas.style.width = width * scaleBy + 'px';
                  canvas.style.height = height * scaleBy + 'px';
                  var context = canvas.getContext('2d');
                  context.scale(scaleBy, scaleBy);
                  html2canvas($("#canvas"), {
                    useCORS: true,
                    canvas: canvas,
                    onrendered: function (canvas) {
                      //生成base64图片数据
                      var dataUrl = canvas.toDataURL();
                      $("#img").attr("src", dataUrl);
                      $("#canvas").remove();
                      $(".gmadal-black #loading").remove();
                    }
                  })
                }, 100)
              });
            }
          });
        } else {
          $(".gmadal-black #loading").remove();
        }
      },
      pageFn: function () {
        var _self = this;
        if (_self.view.list.page >= _self.view.list.pageSize) {
          return;
        }
        rest("/groupon/" + this.data.groupon.grouponId + "/record", {
          page: ++_self.view.list.page,
          count: _self.view.list.count
        }, "get", function (data1) {
          if (data1.code == 200) {
            // 添加新条目
            _self.view.list.items = _self.view.list.items.concat(data1.result.items);
          }
        })
      }
    }
  }

</script>
<style lang="scss">

  .groupon .groupon-content .desc:empty {
    display: none;
  }
  @import "../sui_assets/scss/groupon.scss";

</style>
