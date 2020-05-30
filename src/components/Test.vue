<template>
  <div>
    <div v-on:click="open()">打开</div>
    <div class="bg">
      <div class="content">
        <div v-on:click="close()">点我关闭</div>
      </div>
    </div>
  </div>
</template>
<script>

</script>
<style scoped>
  .bg {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .content {
    background: green;
    height: 100%;
  }
</style>
