<template>
    <div class="questionCard">
        <div class="source">来自话题：{{topic}}</div>
        <div v-if="hasAnswer" class="user">{{user.username}}</div>
        <div class="title">{{title}}</div>
        <div v-if="hasAnswer">
            <div v-if="showEllipsis">{{answer.ellipsis}} <span @click="switchText" class="extend">阅读全文</span></div>
            <div v-else>{{answer.content}}</div>
        </div>
        <div v-else class="questionDescription">{{description}}</div>
        <div v-if="hasAnswer" class="bottomBar">
            <div class="left">
                <div class="agreeCount" :class="isAgree">赞同 {{answer.agreeCount}}</div>
                <div class="commentCount" @click="switchComment">{{answer.commentCount}} <span>条评论</span></div> 
            </div>
            <div class="closeText" @click="switchText" v-if="!showEllipsis">收起</div>
        </div>
        <Comment :answerID="answerID" :pageCount="pageCount" v-if="showComment"></Comment>
    </div>
</template>

<style>
.questionCard {
    background-color: #fff;
    padding: 16px 20px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    border-radius: 2px;
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
}
.questionCard .source {
    margin-bottom: 8px;
    color: #8590a6;
    font-size: 15px;
}
.questionCard .user {
    font-weight: 600;
    margin-bottom: 14px;
}
.questionCard .title {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 6px;
}
.questionCard .extend {
    margin-left: 1rem;
    color: #175199;
    cursor: pointer;
}
.questionCard .bottomBar {
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.questionCard .bottomBar .left{
    display: flex;
    align-items: center;
}
.questionCard .bottomBar .agreeCount {
    line-height: 30px;
    padding: 0 12px;
    color: #0084ff;
    background: rgba(0,132,255,.1);
    border: 1px solid transparent;
    font-size: 14px;
    cursor: pointer;
    border-radius: 3px;
}
.questionCard .bottomBar .commentCount {
    margin-left: 24px;
    font-size: 14px;
    color: #8590a6;
    text-align: center;
    cursor: pointer;
}
.questionCard .bottomBar .closeText {
    color: #8590a6;
    cursor: pointer;
}
</style>


<script>
let req = require('../models/req.js');
import Comment from './Comment.vue';

export default {
    props: ['cardInfo'],
    components: {
        Comment
    },
    data() {
        return {
            title: this.cardInfo.title,
            description: this.cardInfo.description,
            questionID: this.cardInfo.objectId,
            hasAnswer: false,
            answer: null,
            user: null,
            showEllipsis: true,
            isAgree: false,
            showComment: false,
            answerID: null,
            pageCount: 1
        }
    },
    computed: {
        topic() {
            return this.cardInfo.topic.join('、');
        }
    },
    created() {
        if (this.cardInfo.answers.length > 0) {
            let answer = this.cardInfo.answers[0];
            this.hasAnswer = true;   
            this.answer = answer;
            this.user = answer.userID;
            this.answerID = answer.objectId;
            this.pageCount = answer.commentCount;
        }
        else this.hasAnswer = false; 
    },
    methods: {
        switchText() {
            this.showEllipsis = !this.showEllipsis;
        },
        switchComment() {
            this.showComment = !this.showComment;
        }
    }
}
</script>
