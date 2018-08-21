<template>
    <div class="qt-page">
        <div class="qt-container">
            <div class="qt-wrapper">
                <div class="qt-tabs">
                    <div class="qt-tab" v-for="topic in topicData">{{topic}}</div>
                </div>
                <div class="qt-title">{{questionData.title}}</div>
                <div class="qt-description">{{questionData.description}}</div>
                <div class="qt-ctrlPanel">
                    <div @click="followQuestion" class="qt-followButton">{{followText}}</div>
                    <div @click="writeAnswer" class="qt-addAnswer">写回答</div>
                </div>
            </div>
        </div>
        <div class="answer-wrapper">
            <AnswerCard v-for="answer in answers" :answer="answer" class="answer-item"></AnswerCard>
        </div>
        <div class="answer-editor">
            <AnswerEditor :questionID="questionData.objectId"></AnswerEditor>
        </div>
    </div>
</template>

<script>
let req = require('../models/req.js');
import AnswerCard from './AnswerCard.vue';
import AnswerEditor from './AnswerEditor.vue';
export default {
    components: {
        AnswerCard,
        AnswerEditor
    },
    data() {
        return {
            topicData: {},
            questionData: {},
            answers: {}
        }
    },
    computed: {
        followText() {
            return this.questionData.isFollow?'已关注': '关注问题';
        }
    },
    methods: {
        followQuestion() {
            if (this.$store.state.isLogin) {
                if (!this.questionData.isFollow) {
                    let questionID = this.questionData.objectId;
                    req('get', '/follow/question?questionID=' + questionID).then((res) => {
                    }).catch((err) => {
                        this.$store.dispatch('hint', {text: '出现未知错误！', hintStatus: 'fail'});
                    });
                }
            } else {
                this.$store.dispatch('hint', {text: '请先登录！', hintStatus: 'fail'});
            }
        },
        writeAnswer() {
            this.$store.commit('toggleAnswerEditor');
        },
    },
    beforeCreate() {
        let url = '/fetch/questionPage?skip=0&questionID=' + this.$route.params.id;
        req('get', url).then((res) => {
            console.log(res);
            this.questionData = res[0];
            this.answers = res[0].answers;
            this.topicData = res[0].topic;
        });
    }
}
</script>

<style lang="scss">
.qt-page {
    .answer-wrapper {
        width: 1000px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(26,26,26,.1);
        margin: 12px auto;
    }
}

.qt-page {
    .qt-container {
        position: relative;
        min-width: 1032px;
        padding: 16px 0;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 1px 3px rgba(26,26,26,.1);
    }
    .qt-wrapper {
        display: flex;
        justify-content: space-between;
        width: 1000px;
        height: 100%;
        padding: 0 16px;
        margin: 0 auto;
        flex-direction: column;

        .qt-tabs {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-bottom: 12px;

            .qt-tab {
                margin: 3px 5px 3px 0;
                height: 30px;
                padding: 0 12px;
                font-size: 14px;
                line-height: 30px;
                color: #0084ff;
                border-radius: 100px;
                background: rgba(0,132,255,.1);
            }
        }

        .qt-title {
            margin-top: 4px;
            margin-bottom: 4px;
            font-size: 22px;
            font-weight: 600;
            line-height: 32px;
            color: #1a1a1a;
        }
        .qt-content {
            font-size: 15px;
        }
        .qt-ctrlPanel {
            margin-top: 4px;
            background: #fff;
            display: flex;
            .qt-followButton,
            .qt-addAnswer {
                margin-right: 16px;
                min-width: 96px;
                padding: 0 16px;
                font-size: 14px;
                line-height: 32px;
                border-radius: 3px;
                text-align: center;
                vertical-align: middle;
            }
            .qt-followButton { 
                color: #fff;
                background-color: #0084ff;
                cursor: pointer;
            }
            .qt-addAnswer {
                color: #0084ff;
                border: 1px solid #0084ff;
                cursor: pointer;
            }
        }
    }
}
</style>
