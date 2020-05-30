/**
 * 自定义 绑定手机号( bind )组件
 */
let Phone = {};


Phone.install = function (Vue, options) {
  // 参数
  let bindOpt = {
    title: "补全手机 领取权益",
    text: "绑定手机号后，您的权益将立即到账"
  };
  //当前shopid要传过去，绑定后才可领卡
  let ids={};
  Vue.prototype.$bind = function ({title = "补全手机 领取权益", text = "绑定手机号后，您的权益将立即到账", submit = ""} = {}) {
    ids = this.$parent.$route.query;
    let toastTpl = Vue.extend({
      data: function () {
        let defaultPhone = {validateCode: '', phone: ""};
        if(ids.id){
          defaultPhone.shopId= ids.id
        }else{
          defaultPhone.guestId= ids.guestid
        }
        return {
          show: true,
          bind: defaultPhone,
          helpBlock: {text: "获取验证码", usable: true},
          init: "",
          after:submit
        }
      },
      watch: {
        "bind.validateCode": {
          //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
          handler(curVal, oldVal) {
          },
          deep: true
        },
        "bind.phone": {
          //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
          handler(curVal, oldVal) {
          },
          deep: true
        }
      },
      template: "<div class=\"lx-bg\" v-if='show' style=\"display: block;\"><div class=\"content\"><div class=\"title\">" + title + "</div><div class=\"text\">" + text + "</div><input type=\"tel\" v-model='bind.phone' placeholder=\"手机号\" id=\"tel\" maxlength=\"11\"><div class=\"input-text\"  v-on:click.stop='validate()' :class=\"helpBlock.usable?'':'disabled'\">{{helpBlock.text}}</div><input type=\"tel\" placeholder=\"验证码\" v-model='bind.validateCode' id=\"validate\" maxlength=\"6\"><div v-on:click.stop='submit()' :class=\"bind.phone.length == 11 && bind.validateCode.length == 6?'':'disabled'\" class=\"submit\">确定</div><div class=\"close\" v-on:click.stop='show=false'></div></div></div>",
      methods: {
        validate() {
          if (this.bind.phone.length == 11) {
            this.$loading("加载中...");
            let _self = this;
            this.$http.post("/validate/bindup", {"phone": this.bind.phone}).then(response => {
              let data = response.body;
              this.$loading.close();
              if (data.code == 200) {
                let second = 90;
                this.$toast("发送成功");
                this.init = setInterval(function () {
                  second--;
                  if (!second) {
                    clearInterval(_self.init);
                    _self.helpBlock.text = "重新获取验证码";
                    _self.helpBlock.usable = true;
                    return;
                  }
                  _self.helpBlock.text = "已发送 " + second + " s";
                  _self.helpBlock.usable = false;
                }, 1000);
              } else {
                this.helpBlock.usable = true;
                this.$toast(data.message);
              }
            });
          } else {
            this.$toast("请输入正确的手机号");
          }
        },
        submit() {
          let _self = this;
          if (this.bind.phone.length == 11 && this.bind.validateCode.length == 6) {
            let state = this.$loading("加载中...");
            if (!state) {
              this.$http.post("/phone/bindup", this.bind).then(response => {
                let data = response.body;
                this.$loading.close();
                if (data.code == 200) {
                  if (data.result && data.result.token) {
                    this.$cookie.set("token", data.result.token, {"expires": '30d'});
                  }
                  // data.result && data.result.token && Vue.$cookie("token", data.result.token, {"expires": '30d',});
                  this.show = false;
                  if (this.after) {
                    this.after();
                  }
                } else {
                  this.bind.validateCode = "";
                  clearInterval(this.init);
                  this.helpBlock.text = "重新获取验证码";
                  this.helpBlock.usable = true;
                  this.$toast(data.message);
                }
              });
            }
          } else {
            this.$toast("输入框不能为空")
          }
        }
      }
    });
    let tpl = new toastTpl().$mount().$el;
    document.getElementById("app").appendChild(tpl);
  };
}

// 向外暴露接口
module.exports = Phone;
