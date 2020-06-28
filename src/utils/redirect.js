import Vue from 'vue'

export default {
  install(Vue, options) {
    const t = "037925fa578c4ed98885d7b28ade5462";
    // 安卓手机,键盘盖住弹窗
    Vue.prototype.focusUp = function (e) {
      setTimeout(function () {
        var docHeight = window.innerHeight;
        var bottom = e.target.getBoundingClientRect().bottom
        var scrollHeight = bottom - docHeight
        if (scrollHeight > 0) {
          document.body.scrollTop = scrollHeight + document.body.scrollTop + 10
        }
      }, 400)
    }
    Vue.prototype.ajaxUrl = function (path) {
      if (path.split("?").length > 1) {
        path += "&";
      } else {
        path += "?";
      }
      if (this.$route.query.id) {
        path += "id=" + this.$route.query.id;
        if (this.$route.query.d) {
          path += "&d=" + this.$route.query.d;
        }
        if (this.$route.query.cashier) {
          path += "&cashier=" + this.$route.query.cashier;
        }
      } else if (this.$route.query.guestid) {
        path += "guestid=" + this.$route.query.guestid;
      }
      location.href = path;
    }
    Vue.prototype.replaceMethod = function (value) {
      if (!value) return '';
      let a = value.split("\n");
      return a.join("<br/>");
    }
    Vue.prototype.getVersion = function () {
      let version, ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        version = "WXPAY";
      } else if (ua.match(/AlipayClient/i) == 'alipayclient') {
        version = "ALIPAY";
      } else {
        version = "";
      }
      return version;
    }
    Vue.prototype.refresh = function () {
      location.reload();
    }
    let origin = window.location.origin
    if (!origin) {
      origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
    Vue.prototype.authorFuiou = function () {
      location.href = origin + "/author/" + (this.$route.query.id || this.$route.query.guestid) + "/fuiou?url=" + encodeURIComponent(location.href);
    }
    Vue.prototype.authorGuest = function () {
      location.href = origin + "/author/guest/" + (this.$route.query.id || this.$route.query.guestid) + "?url=" + encodeURIComponent(location.href);
    }
    Vue.prototype.setTitle = function (name) {
      document.title = name;
      let i = document.createElement('iframe');
      i.style.display = 'none';
      i.onload = function () {
        setTimeout(function () {
          i.remove();
        }, 9)
      };
      document.body.appendChild(i);
    }
  }
}
