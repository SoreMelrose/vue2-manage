<template>
    <div id="app" class="fillcontain">
        <router-view :key="$router.fullPath"></router-view>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="less">
    @import './style/common';
</style>
