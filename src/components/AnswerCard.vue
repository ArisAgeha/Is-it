<template>
    <div class="answer-item">
        <div class="answer-user">{{answer.userID.username}}</div>
        <div class="answer-content">{{answer.content}}</div>
        <div class="answer-ctrlPanel">
            <div :class="{active: answer.isAgree}" class="answer-agree" @click="agreeAnswer">赞同 {{answer.agreeCount}}</div>
            <div class="answer-comment" @click="toggleComment">{{answer.commentCount}} 条评论</div>
        </div>
        <div class="answer-commentWrapper" v-if="showComment">
            <Comment :pageCount="pageCount" :answerID="answer.objectId"></Comment>
        </div>
    </div>

</template>

<script>
let req = require('../models/req.js');
import Comment from './Comment.vue';

export default {
    props: ['answer'],
    components: {
        Comment
    },
    data() {
        return {
            showComment: false,
        }
    },
    methods: {
        toggleComment() {
            this.showComment = !this.showComment;
        },
        agreeAnswer() {
            let answer = this.answer;
            if (!answer.isAgree) {
                let url = '/answer/addAgree?answerID=' + answer.objectId; 
                req('get', url).then((res) => {
                    answer.isAgree = true;
                    answer.agreeCount++;
                })
            } else {
                let url = '/answer/removeAgree?answerID=' + answer.objectId;
                req('get', url).then((res) => {
                    answer.isAgree = false;
                    answer.agreeCount--;
                })
            }
        }
    },
    computed: {
        pageCount() {
            return Math.ceil(this.answer.commentCount / 20);
        }
    }
}

</script>

<style lang="scss">
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
            cursor: pointer;
        }
    }

}


</style>
