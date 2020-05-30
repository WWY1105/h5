<template>

</template>

<script>
    export default {
        beforeCreate () {
            // console.log(this.$route.query);
            // console.log(this.$route.query.pid);
            // console.log(this.$route.query.guestid);
            location.href = 'paymentee.html?pid=' + this.$route.query.pid + (this.$route.query.guestid ? "&guestid=" + this.$route.query.guestid : "&id=" + this.$route.query.id );

        }
    }
</script>

<style>

</style>
