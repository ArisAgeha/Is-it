<template>
    <div class="index">
        <div class="QuestionCard-wrapper">
            <QuestionCard class="QuestionCard" v-for="data in dataArray" :cardInfo="data"></QuestionCard>
        </div>
        <div class="indexSidebar-wrapper" :style="translateY">
            <Sidebar></Sidebar>
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
.QuestionCard-wrapper {
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
import QuestionCard from './QuestionCard.vue';
import Sidebar from './Sidebar.vue';
export default {
    data() {
        return {
            dataArray: null,
            shiftY: 0
        }
    },
    components: {
        QuestionCard,
        Sidebar
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
