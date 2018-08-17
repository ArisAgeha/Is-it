<template>
    <div class="index">
        <div class="indexCard-wrapper">
            <indexCard class="indexCard" v-for="data in dataArray" :cardInfo="data"></indexCard>
        </div>
        <div class="indexSidebar-wrapper" :style="translateY">
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
    max-height: 80vh;
    z-index: 0;
}
</style>

<script>
let req = require('../models/req.js');
import indexCard from './indexCard.vue';
import indexSidebar from './indexSidebar.vue';
export default {
    data() {
        return {
            dataArray: null,
            shiftY: 0
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
    },
    computed: {
        translateY() {
            return {
                transform: `translateY(${this.shiftY}px)`
            }
        }
    },
    created() {
        window.onscroll = () => {
            let value = window.pageYOffset;
            this.shiftY = value;
        }
    }
}
</script>
