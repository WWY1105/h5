<template>
  <div class="setting">
    <div class="bg">
      <img class="avatar" :src="data.avatarUrl">
      <div class="nickname">{{data.nickname}}</div>
    </div>
    <div class="wrapper">
      <div class="item" v-on:click="tapBindFn">
        <div class="">
          <span class="icon1"></span>手机号
        </div>
        <div class="">
          <span v-if="!data.phone">绑定手机号</span> <span v-else>{{data.phone}} 修改手机号</span><span class="arrow"></span>
        </div>
      </div>
      <div class="item" @click="tapGenderFn">
        <div class="">
          <span class="icon2"></span>您是？
        </div>
        <div class="">
          <span v-if="data.gender" :class="data.gender">{{data.gender=='F'?"女":data.gender=='N'?"保密":"男"}}</span><span v-else>填写</span><span
          class="arrow"></span>
        </div>
      </div>
      <div class="item" @click="tapBirthFn">
        <div class="">
          <span class="icon3"></span>出生日期
        </div>
        <div class="">
          <span v-if="data.birthday">{{data.birthday}}</span><span v-else>补全您的生日<span
          class="arrow"></span></span>
        </div>
      </div>
    </div>
    <awesome-picker
      ref="picker0"
      :textTitle="picker0.textTitle"
      :data="picker0.data"
      :anchor="picker0.anchor"
      @confirm="handlePicker0Confirm">
    </awesome-picker>

    <awesome-picker
      ref="picker3"
      :textTitle="picker3.textTitle"
      :type="picker3.type"
      :anchor="picker3.anchor"
      @confirm="handlePicker3Confirm">
    </awesome-picker>
  </div>
</template>
<script>

  import Vue from 'vue'
  import AwesomePicker from 'vue-awesome-picker';

  Vue.use(AwesomePicker);
  const gender = ['男', '女','保密'];
  const gender1 = ['M', 'F','N'];

  export default {
    name: "setting",
    data() {
      return {
        data: "",
        post: {},
        picker0: {
          anchor: [],
          textTitle: '性别',
          data: [gender]
        },
        picker3: {
          anchor: [],
          textTitle: '日期选择',
          type: 'date'
        }
      }
    },
    created() {
      this.initFn();
    },
    methods: {
      initFn() {
        this.$http.get("/user").then(response => {
          let data = response.body;
          if (data.code == 200) {
            this.data = data.result;
            this.$cookie.set("phone", this.data.phone||'');
          }
        });
      },
      handlePicker0Confirm(v) {
        this.picker0.anchor = v;
        this.post.gender = gender1[v[0].index];
        let json = {
          gender: this.post.gender
        };
        this.$http.post("/user", json).then(response => {
          let data = response.body;
          if (data.code == 200) {
            this.$toast("提交成功");
            this.initFn();
          } else {
            this.$toast(data.message);
          }
        });
      },
      handlePicker3Confirm(v) {
        this.picker3.anchor = v;
        var m ;
        var d ;
        if(v[1].index + 1 < 10) {
          m = '0' + (v[1].index + 1);
        }else{
          m = v[1].index + 1;
        }
        if(v[2].index + 1 < 10) {
          d = '0' + (v[2].index + 1);
        }else {
          d = v[2].index + 1;
        }
        this.post.birthday = (1900 + v[0].index) + '-' + m + "-" + d;
        // this.post.birthday = (1900 + v[0].index) + '-' + (v[1].index + 1) + "-" + (v[2].index + 1);
        let json = {
          birthday: this.post.birthday
        };
        this.$http.post("/user", json).then(response => {
          let data = response.body;
          if (data.code == 200) {
            this.$toast("提交成功");
            this.initFn();
          } else {
            this.$toast(data.message);
          }
        });
      },
      tapBirthFn() {
        if (this.data.birthday) return;
        this.$refs.picker3.show()
      },
      tapGenderFn() {
        this.$refs.picker0.show()
      },
      tapBindFn() {
        let _self = this;
        if (this.data.phone) {
          this.ajaxUrl("changePhone.html");
        } else {
          this.$bind({
            title: "绑定手机号",
            text: "绑定手机号后，获得更多权益",
            submit: function () {
              _self.initFn();
            }
          });
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../sui_assets/scss/setting.scss";
</style>
