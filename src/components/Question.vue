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
                    <div class="qt-followButton">关注问题</div>
                    <div class="qt-addAnswer">写回答</div>
                </div>
            </div>
        </div>
        <div class="answer-wrapper">
            <div v-for="(answer, index) in answers" class="answer-item">
                <div class="answer-user">{{answer.userID.username}}</div>
                <div class="answer-content">{{answer.content}}</div>
                <div class="answer-ctrlPanel">
                    <div :class="{active: answer.isAgree}" class="answer-agree" @click="agreeAnswer(answer)">赞同 {{answer.agreeCount}}</div>
                    <div class="answer-comment" @click="toggleComment(index)">{{answer.commentCount}} 条评论</div>
                </div>
                <div class="answer-commentDetail" v-if="answer.show">{{answer.agreeCount}}</div>
            </div>
        </div>
    </div>
</template>

<script>
let req = require('../models/req.js');
export default {
    data() {
        return {
            topicData: {},
            questionData: {},
            answers: {},
        }
    },
    methods: {
        toggleComment(index){
            this.answers[index].show = true;
        },
        agreeAnswer(answer) {
            if (!answer.isAgree) {
                let url = '/answer/addAgree?answerID=' + answer.objectId; 
                req('get', url).then((res) => {
                    answer.isAgree = true;
                    answer.agreeCount++;
                })
            }
        }
    },
    beforeCreate() {
        let url = '/fetch/questionPage?skip=0&questionID=' + this.$route.params.id;
        req('get', url).then((res) => {
            console.log(res);
            this.questionData = res[0];
            this.answers = res[0].answers;
            this.topicData = res[0].topic;
        })
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
        margin: auto;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(26,26,26,.1);
        margin-top: 12px;

        .answer-item {
            padding: 16px 0;
            margin: 0 20px;
            border-bottom: 1px solid #f6f6f6;

            .answer-user {
                font-size: 15px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .answer-content { }
            .answer-ctrlPanel {
                display: flex;
                align-items: center;
                margin-top: 8px;

                .answer-agree {
                    padding: 0 10px;
                    color: #0084ff;
                    background: rgba(0,132,255,.1);
                    font-size: 14px;
                    line-height: 32px;
                    cursor: pointer;
                    border-radius: 3px;
                }
                .answer-agree.active {
                    color: #fff;
                    background: #0084ff;
                }
                .answer-comment {
                    margin-left: 24px;
                    font-size: 14px;
                    color: #8590a6;
                }
            }

        }

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
            }
            .qt-addAnswer {
                color: #0084ff;
                border: 1px solid #0084ff;
            }
        }
    }
}
</style>
