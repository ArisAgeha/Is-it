<template>
    <div class="topic">
        <div class="topicContainer">
            <div v-if="isLogin" class="topic-left">
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
            <div class="hintNotLogin" v-else>请先登录！</div>
            <div class="indexSidebar-wrapper" :style="translateY">
                <div class="topic-discoveryTopic">
                    <router-link to="/topics">
                        <button class="topic-gotoTopics">进入话题广场</button>
                    </router-link>
                </div>
                <Sidebar></Sidebar>
            </div>
        </div>
    </div>
</template>

<script>
import req from '../models/req.js';
import QuestionCard from './QuestionCard.vue';
import Sidebar from './Sidebar.vue';
export default {
    data() {
        return {
            dataArray: [],
            topicTabs: null,
            shiftY: 0,
            tab: null,
            skip: 0,
            hasMoreContent: true,
            canLoadMore: false
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
            let url = `/fetch/topicQuestion?skip=${this.skip}&topicID=${topicID}`
            req('get', url).then((res) => {
                this.dataArray = this.dataArray.concat(res);
                this.skip += 20;
                this.canLoadMore = true;
            })
        },
        switchTopic(tab) { 
            this.canLoadMore = false;
            this.hasMoreContent = true;
            this.skip = 0;
            this.dataArray = [];
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
                this.dataArray = [];
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
            this.shiftY = window.pageYOffset;

            if (window.innerHeight + document.documentElement.scrollTop === document.body.scrollHeight) {
                let topicID = this.tab.objectId;
                if (this.hasMoreContent && this.canLoadMore) {
                    let url = `/fetch/topicQuestion?skip=${this.skip}&topicID=${topicID}`
                    req('get', url).then((res) => {
                        this.dataArray = this.dataArray.concat(res);
                        this.skip += 20;
                    }).catch((err) => {
                        this.hasMoreContent = false;
                        this.$store.dispatch('hint', {text: '已无更多内容！', hintStatus: 'fail'});
                    }) 
                } else {
                    this.$store.dispatch('hint', {text: '已无更多内容！', hintStatus: 'fail'});
                }
            }
        }
    }
}
</script>

<style lang="scss">
.topicContainer {
    width: 1000px;
    min-height: 100vh;
    display: flex;
    margin: auto;
    margin-top: 10px;
    justify-content: space-between;
    .topic-left {
        display: flex;
        flex-direction: column;
        width: calc(70% - 5px);
        .topicCard-wrapper {
            background-color: #fff;
            padding: 16px 20px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(26,26,26,.1);
            border-radius: 2px;
            font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
            .topicCard-tabs {
                display: flex;
                flex-wrap: wrap;
            }
            .topicCard-title{
                margin-bottom: 10px;
            }
            .topicCard-tabs .topic-tab {
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
            .topicCard-tabs .topic-tab.active {
                background: #259;
                border-color: #259;
                color: #fff;
            }
        }
    }
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
    font-size: 24px;
    justify-content: center;
    color: #0084ff;
    width: calc(70% - 5px);
}
.topic-discoveryTopic {
    background-color: #fff;
    padding: 16px 20px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
        cursor: pointer;
        background-color: #0084ff;
        color: #fff;
        line-height: 34px;
        border-radius: 3px;
        padding: 0 14px;
    }
}

</style>
