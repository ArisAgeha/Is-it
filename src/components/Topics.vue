<template>
    <div class="topics">
        <div class="topicsContainer">
            <div class="topics-left">
                <div class="topicsCard-wrapper">
                    <h4 class="topicsCard-title">话题广场</h4>
                    <div class="topicsCard-tabs">
                        <div class="topics-tab" v-for="(tab, index) in topicTabs" :class="{active: isActive(tab)}" @click="switchTopic(tab)">{{tab?tab.topicName: null}}</div>
                    </div>
                </div>
                <div class="QuestionCard-wrapper">
                    <QuestionCard class="QuestionCard" v-for="data in dataArray" :cardInfo="data"></QuestionCard>
                </div>
            </div>
            <div class="indexSidebar-wrapper" :style="translateY">
                <div class="topics-currentTab">
                    <div class="topics-currentTabName">{{tab?tab.topicName: null}}</div>
                    <button v-if="isFollow" @click="removeFollow">取消关注</button>
                    <button v-else="isFollow" @click="addFollow">关注</button>
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
            isFollow: false,
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
            req('get', '/fetch/topics').then((res) => {
                this.topicTabs = res;
                this.tab = res[0];
                this.fetchTopicQuestion(this.tab.objectId);
            });
        },
        fetchTopicQuestion(topicID) {
            this.fetchTopicIsFollow(topicID);
            let url = `/fetch/topicQuestion?skip=${this.skip}&topicID=${topicID}`
            req('get', url).then((res) => {
                if (!this.dataArray) this.dataArray = [];
                this.canLoadMore = true;
                this.dataArray = this.dataArray.concat(res);
                this.skip += 20;
            })
        },
        fetchTopicIsFollow(topicID) {
            let url = `/fetch/topicIsFollow?topicID=${topicID}`
            req('get', url).then((res) => {
                this.isFollow = res;
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
        },
        addFollow() {
            let topicID = this.tab.objectId;
            let url = `/follow/topic?topicID=${topicID}`;
            req('get', url).then((res) => {
                this.isFollow = true;
                this.$store.dispatch('hint', {text: '关注成功！', hintStatus: 'success'});
            }).catch((err) => {
                this.$store.dispatch('hint', {text: '出现未知错误！', hintStatus: 'fail'});
            })
        },
        removeFollow() {
            let topicID = this.tab.objectId;
            let url = `/follow/removeTopic?topicID=${topicID}`;
            req('get', url).then((res) => {
                this.isFollow = false;
                this.$store.dispatch('hint', {text: '取消成功！', hintStatus: 'success'});
            }).catch((err) => {
                this.$store.dispatch('hint', {text: '出现未知错误！', hintStatus: 'fail'});
            })
        }
    },
    computed: {
        isLogin() {
            if (this.$store.state.isLogin) {
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
        this.fetchTopic();
    }
}
</script>

<style lang="scss">
.topicsContainer {
    width: 1000px;
    min-height: 100vh;
    display: flex;
    margin: auto;
    margin-top: 10px;
    justify-content: space-between;
    .topics-left {
        display: flex;
        flex-direction: column;
        width: calc(70% - 5px);
        .topicsCard-wrapper {
            background-color: #fff;
            padding: 16px 20px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(26,26,26,.1);
            border-radius: 2px;
            font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
            .topicsCard-tabs {
                display: flex;
                flex-wrap: wrap;
            }
            .topicsCard-title{
                margin-bottom: 10px;
            }
            .topicsCard-tabs .topics-tab {
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
            .topicsCard-tabs .topics-tab.active {
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
.topics-currentTab {
    background-color: #fff;
    padding: 16px 20px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    border-radius: 2px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;

    .topics-currentTabName {
        font-size: 18px;
        margin-bottom: 12px;
    }
    button {
        background-color: #0084ff;
        color: #fff;
        padding: 0 14px;
        line-height: 34px;
        border-radius: 3px;
        height: 34px;
        cursor: pointer;
    }
}

</style>
