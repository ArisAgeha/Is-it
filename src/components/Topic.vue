<template>
    <div class="topic">
        <div v-if="isLogin" class="topicContainer">
            <div class="topic-left">
                <div class="topicCard-wrapper">
                    <h4 class="topicCard-title">已关注的话题</h4>
                    <div class="topicCard-tabs">
                        <div class="topic-tab" v-for="(tab, index) in topicTabs" :class="{active: isActive(tab)}" @click="switchTopic(tab)">{{ topicTabs[index].topicName }}</div>
                    </div>
                </div>
                <div v-if="tab" class="QuestionCard-wrapper">
                    <QuestionCard class="QuestionCard" v-for="data in dataArray" :cardInfo="data"></QuestionCard>
                </div>
                <div class="hintNotFollow" v-else>您尚未关注任何话题！</div>
            </div>
            <div class="indexSidebar-wrapper" :style="translateY">
                <Sidebar></Sidebar>
            </div>
        </div>
        <div class="hintNotLogin" v-else>请先登录！</div>
    </div>
</template>

<script>
let req = require('../models/req.js');
import QuestionCard from './QuestionCard.vue';
import Sidebar from './Sidebar.vue';
export default {
    data() {
        return {
            dataArray: null,
            topicTabs: null,
            shiftY: 0,
            tab: null
        }
    },
    components: {
        QuestionCard,
        Sidebar
    },
    methods: {
        isActive(tab) {
            return tab === this.tab;
        },
        fetchTopic() {
            req('get', '/fetch/topic').then((res) => {
                this.topicTabs = res;
                this.tab = res[0];
                this.fetchTopicQuestion(this.tab.objectId);
            });
        },
        fetchTopicQuestion(topicID) {
            let body = {
                skip: 0,
                topicID
            }
            req('POST', '/fetch/topicQuestion', body).then((res) => {
                this.dataArray = res;
            })
        },
        switchTopic(tab) { 
            this.dataArray = null;
            let topicID = tab.objectId;
            this.fetchTopicQuestion(topicID);
            this.tab = tab;
        }
    },
    computed: {
        isLogin() {
            if (this.$store.state.isLogin) {
                this.fetchTopic();
                return true;
            } else {
                this.dataArray = null;
                this.topicTabs = null;
                this.tab = null;
                return false;
            }
        },

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

<style>
.topicContainer {
    width: 1000px;
    min-height: 100vh;
    display: flex;
    margin: auto;
    margin-top: 10px;
    justify-content: space-between;
}
.topic-left {
    display: flex;
    flex-direction: column;
    width: calc(70% - 5px);
}
.topic-left .topicCard-wrapper {
    background-color: #fff;
    padding: 16px 20px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    border-radius: 2px;
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
}
.topic-left .topicCard-tabs {
    display: flex;
}
.topic-left .topicCard-title{
    margin-bottom: 10px;
}
.topic-left .topicCard-tabs .topic-tab {
    margin: 0 10px 10px 0;
    border-radius: 30px;
    text-decoration: none;
    border: 1px solid #daecf5;
    color: #259;
    font-size: 13px;
    line-height: 1.7;
    word-wrap: break-word;
    padding: 0 10px;
    cursor: pointer;
}
.topic-left .topicCard-tabs .topic-tab.active {
    background: #259;
    border-color: #259;
    color: #fff;
}
.QuestionCard-wrapper {
    width: 100%;
}
.indexSidebar-wrapper {
    width: calc(30% - 5px);
    max-height: 80vh;
    z-index: 0;
}
.hintNotLogin {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #0084ff;
}
</style>
