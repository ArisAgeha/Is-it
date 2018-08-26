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
.index .QuestionCard-wrapper {
    width: calc(70% - 5px);
}
.index .indexSidebar-wrapper {
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
            dataArray: [],
            shiftY: 0,
            skip: 0,
            hasMoreContent: true,
            canLoadMore: false
        }
    },
    components: {
        QuestionCard,
        Sidebar
    },
    beforeCreate() {
        let url = '/fetch/index?skip=' + this.skip;
        req('get', url).then((res) => {
            this.dataArray = this.dataArray.concat(res);
            this.skip += 20;
            console.log(this.skip)
            this.canLoadMore = true;
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
        window.addEventListener('scroll', () => {
            this.shiftY = window.pageYOffset;

            if (window.innerHeight + document.documentElement.scrollTop === document.body.scrollHeight) {
                if (this.hasMoreContent && this.canLoadMore) {
                    console.log(this.skip)
                    let url = '/fetch/index?skip=' + this.skip;
                    console.log(url)
                    req('get', url).then((res) => {
                        this.dataArray = this.dataArray.concat(res);
                        this.skip += 20;
                    }).catch((err) => {
                        this.hasMoreContent = false;
                        this.$store.dispatch('hint', {text: '已无更多内容！', hintStatus: 'fail'});
                    }) 
                }
            }
            
        }) 
    }
}
</script>
