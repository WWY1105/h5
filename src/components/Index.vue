<template>
  <div class="hello">
 
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    beforeCreate() {
      //  this.$cookie.set("token", "c0b6453b645944bea95ee7d1e0aeb8a5", {expires: 7, path: "/"});
      let shopId, guestId, query = {}, key_str = location.href.split("?")[1].split("#")[0];
      for (let i = 0; i < key_str.split("&").length; i++) {
        let j = key_str.split("&")[i].split("=");
        query[j[0]] = j[1];
      }
      let getLength = function (json) {
        let i = 0;
        for (let key in json) {
          if (json.hasOwnProperty(key)) {
            i++;
          }
        }
        return i;
      }
      let redirect = function () {
        let url = "";
        if (localStorage.getItem("url")) {
          url = localStorage.getItem('url');
          localStorage.removeItem("url");
        }else {
          if (query.guestid) {
            url = "/index.html#/charge?guestid=" + query.guestid;
          } else {
            url = "/index.html#/charge?id=" + query.id;
          }
        }
        return url;
      }

      // if (!getLength(query)) {
      //   this.$router.replace({name: 'Error', query: {'id': 0}});
      //   return;
      // }
      let ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        if (query.appid && query.code) {
          let json1 = {};
          json1.code = query.code;
          json1.appid = query.appid;
          this.$http.post("/auth/user", json1).then(response => {
            let data1 = response.body;
            if (data1.code == 200) {
              let token = data1.result.token;
              this.$cookie.set("token", token, {expires: 7, path: "/"});
              location.href = redirect();
            } else if (data1.code == 400000) {
              alert(data1.message);
              location.href = "error.html";
            } else {
              window.location.href = "auth?url=" + encodeURIComponent(location.href) + "&durl=" + encodeURIComponent(redirect());
            }
          });
        } else if (query.state == 1) {
          location.href = redirect();
        } else {
          location.href = "auth?url=" + encodeURIComponent(location.href.split("#")[0]) + "&durl=" + encodeURIComponent(redirect());
        }
      } else {
        //支付宝没有检测登陆的接口，直接授权
        if (query.auth_code) {
          this.$http.post("/auth/alipay/user", {"code": query.auth_code}).then(response => {
            let data = response.body;
            if (data.code == 200) {
              let token = data.result.token;
              // let token = 'c0b6453b645944bea95ee7d1e0aeb8a5';
              this.$cookie.set("token", token, {expires: 7, path: "/"});
              location.href = redirect();
            }
          });
        } else if (query.state == 1) {
          location.href = redirect();

        } else {
          location.href = "auth/alipay?url=" + encodeURIComponent(location.href) + "&durl=" + encodeURIComponent(redirect());
        }
      }

      // });
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
