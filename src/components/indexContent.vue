<template>
    <div class="index">
        <div class="indexCard-wrapper">
            <indexCard class="indexCard" v-for="data in dataArray" :cardInfo="data"></indexCard>
        </div>
        <div class="indexSidebar-wrapper">
            <indexSidebar></indexSidebar>
        </div>
    </div>
</template>

<style>
.index {
    width: 1000px;
    min-height: 100vh;
    display: flex;
    margin: auto;
    margin-top: 10px;
    justify-content: space-between;
}
.indexCard-wrapper {
    width: calc(70% - 5px);
}
.indexSidebar-wrapper {
    width: calc(30% - 5px);
    background-color: #ddd;
}
</style>

<script>
let req = require('../models/req.js');
import indexCard from './indexCard.vue';
import indexSidebar from './indexSidebar.vue';
export default {
    data() {
        return {
            dataArray: null
        }
    },
    components: {
        indexCard,
        indexSidebar
    },
    beforeCreate() {
        req('get', '/fetch/index?skip=0').then((res) => {
            this.dataArray = res;
        })
    }
}
</script>
