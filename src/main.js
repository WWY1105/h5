// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Crypto from 'crypto';
import VueCookie from 'vue-cookie'
import Redirect from './utils/redirect'
import Common from './utils/common'
import 'vue2-animate/dist/vue2-animate.css';

import './components/toast/toast.css';
import Toast from './components/toast/index'
import './components/bind/bind.css';
import Bind from './components/bind/index'
import './components/couponShow/coupon.css';
import Coupon from './components/couponShow/index'
import "babel-polyfill"
import 'es6-promise/auto'

// Tell Vue to use the plugin
Vue.use(VueResource)
Vue.use(VueCookie)
Vue.use(Crypto)
Vue.use(Toast)
Vue.use(Redirect)
Vue.use(Bind)
Vue.use(Coupon)

Vue.prototype.GLOBAL = Common
Vue.config.productionTip = false;
var vm = new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  var ua = window.navigator.userAgent.toLowerCase();
  var _id = to.query.id || to.query.guestid;
  if (document.cookie.indexOf('token') < 0&&location.hash.split("?")[0]!='#/dynamic') {
    auth();
  } else if (!vm.$cookie.get(_id)&&ua.match(/MicroMessenger/i) == 'micromessenger') {
    Vue.http.get("/author/guest/" + _id + "/check").then(response => {
      let data = response.body;
      if (data.code == 200 && !data.result.needAuthGuest) {
        //正确
        if(!_id){
          vm.$cookie.set(_id, "true", {
            expires: '7d'
          });
        }
      }
    })
  }
  next();
})

function auth() {
  let ua = window.navigator.userAgent.toLowerCase();
  let origin = window.location.origin;
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //微信授权比较复杂，跳转到专门的授权页面处理 
     location.replace( origin + '/auth.html?callback='+ encodeURIComponent(location.href))
  } else {
    //支付宝没有检测登陆的接口，直接授权
     window.location.href = "auth/alipay?url=" + encodeURIComponent(location.href);
  }
}

//rest request 请求加密处理
Vue.http.interceptors.push(function (request) {
  let that = this; //此处this为请求所在页面的Vue实例
  const t = "037925fa578c4ed98885d7b28ade5462";
  vm.$cookie.set("apikey", "6b774cc5eb7d45818a9c7cc0a4b6920f", {
    expires: 30,
    path: "/"
  });
  function getmd5(str) {
    let a;
    let md5 = Crypto.createHash("md5");
    md5.update(str);
    a = md5.digest('hex');
    return a;
  }

  let getUrl = function (url, para = {}) {
    url += "?";
    const password = "037925fa578c4ed98885d7b28ade5462";
    let j = JSON.parse(JSON.stringify(para)); //param's json
    j.timestamp = (new Date).getTime();
    let key_json = Object.keys(j);
    key_json.sort();
    let encode_str = "";
    for (let h in key_json) {
      encode_str += key_json[h] + "=" + j[key_json[h]];
      url += key_json[h] + "=" + j[key_json[h]] + "&";
    }
    let i = getmd5(encode_str + password),
      m = "";
    for (let o = 0; o < i.length; o += 2) m += i.charAt(o);
    for (let s = 1; s < i.length; s += 2) m += i.charAt(s);
    return location.origin + url + "signature=" + m;
  }
  request.url = getUrl(request.url, request.key);
  return function (response, next) {
    switch (response.status) {
      case 200:
        if (response.body.code == 403000) {
          vm.$cookie.delete('token');
          auth()
        } else if (response.body.code == 400000) {
          location.href = "error.html#7";
        } else if (response.body.code == 403060) {
          if(location.hash){
            if(location.hash.split("?")[0]!='#/selfpay'&&location.hash.split("?")[0]!='#/vip'&&location.hash.split("?")[0]!='#/upgrade'&&location.hash.split("?")[0]!='#/mallDetail'&&location.hash.split("?")[0]!='#/couponActivity'){
              location.href = "bind.html?" + location.hash.split("?")[1];
              return false;
            } 
          }
       
        }
        break;
      default:
        console.log(response);
    }

  };
});

