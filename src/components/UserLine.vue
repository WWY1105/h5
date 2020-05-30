<template>
  <div class="user-line" v-if="data">
    <div v-html="replaceMethod(data.additional)"></div>
    <div class="time">{{data.time}}</div>
  </div>
</template>

<script>

  export default {
    name: 'userLine',
    data() {
      return {
        data: "",
      }
    },
    beforeCreate: function () {
      this.$http.get("/activities/lineup/guest/" + (this.$route.query.id || this.$route.query.guestid)).then(response => {
        let data = response.body;
        if (data.code == 200) {
          this.data = data.result;
        }
      });
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../sui_assets/scss/user-line.scss";
</style>
