<template>
  <div>
    <div class="login">
      <div>您的常用手机号码</div>
      <input type="tel" v-model="post.phone" id="tel" maxlength="11"/>

      <div class="input-text" v-on:click="validateFn()">发送验证码</div>
      <div>收到的验证码</div>
      <input type="number" v-model="post.validateCode" id="validate" maxlength="6"/>
      <div class="btn" v-on:click="bindFn()">绑定</div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        post: {}
      }
    },
    methods: {
      validateFn() {
        this.$http.post(this.getPostUrl("/auth/phone/validate"), {"phone": this.post.phone}).then(response => {
          alert("操作成功");

        }, response => {
          // error callback
          console.log(response);

        });
      },
      bindFn() {
        this.$http.post(this.getPostUrl("/auth/phone"), this.post).then(response => {
          if (response.body.result.token) {
            this.$cookie.set("token", response.body.result.token, {expires: 7, path: "/"});
          }
          this.$router.go(-1);
        }, response => {
          // error callback
          console.log(response);
        });
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "../sui_assets/scss/login.scss";
</style>
