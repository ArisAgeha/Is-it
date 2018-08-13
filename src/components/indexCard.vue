<template>
    <div class="indexCard">
        <div class="source">{{topic}}</div>
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
        <div class="commentWrapper" v-if="showComment">
            <div class="commentList">
                <div v-for="comment in comments" class="commentItem">
                    <div class="comment-user">
                        {{comment.userID.username}}
                        <span class="replyTo-text" v-if="comment.replyTo">回复</span>
                        <span class="replyto" v-if="comment.replyTo">{{comment.replyTo}}</span>
                    </div>
                    <div class="comment-content">{{comment.content}}</div>
                </div>
            </div>
            <div class="commentPage">
                <span :class="{currentPage: isCurrentPage(page), pagination: isPagination(page), nextPage: isNextPage(page), prevPage: isPrevPage(page)}" 
                    v-for="(page, index) in pages" 
                    class="pageButton"
                    @click="switchPage(page)"
                    >{{page}}</span>
            </div>
            <div class="addComment"></div>
        </div>
    </div>
</template>

<style>
.indexCard {
    background-color: #fff;
    padding: 16px 20px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    border-radius: 2px;
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
}
.indexCard .source {
    margin-bottom: 8px;
    color: #8590a6;
    font-size: 15px;
}
.indexCard .user {
    font-weight: 600;
    margin-bottom: 14px;
}
.indexCard .title {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 6px;
}
.indexCard .extend {
    margin-left: 1rem;
    color: #175199;
    cursor: pointer;
}
.indexCard .bottomBar {
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.indexCard .bottomBar .left{
    display: flex;
    align-items: center;
}
.indexCard .bottomBar .agreeCount {
    line-height: 30px;
    padding: 0 12px;
    color: #0084ff;
    background: rgba(0,132,255,.1);
    border: 1px solid transparent;
    font-size: 14px;
    cursor: pointer;
    border-radius: 3px;
}
.indexCard .bottomBar .commentCount {
    margin-left: 24px;
    font-size: 14px;
    color: #8590a6;
    text-align: center;
    cursor: pointer;
}
.indexCard .bottomBar .closeText {
    color: #8590a6;
    cursor: pointer;
}
.commentWrapper {
    border: 1px solid #ebebeb;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    background: #fff;
    margin-top: 12px;
    border-radius: 4px;
}
.commentList .commentItem {
    padding: 12px 0 10px 0;
    margin: 0 20px;
    border-bottom: 1px solid #f6f6f6;
}
.commentList .commentItem .comment-user .replyTo-text{
    color: #8590a6;
    margin: 0 8px;
}

.commentWrapper .commentPage{
    display: flex;
    justify-content: center;
    padding: 16px 20px;
}

.commentWrapper .commentPage .pageButton{
    padding: 0 15px;
    cursor: pointer;
    user-select: none;
}
.commentWrapper .commentPage .currentPage,
.commentWrapper .commentPage .pagination{
    cursor: default;
    color: #8590a6;
}
</style>
<script>
let req = require('../models/req.js');

export default {
    props: ['cardInfo'],
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
            comments: [],
            pages: [],
            currentPage: 1
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
            let pageCount = Math.ceil(answer.commentCount / 20) + 20;
            this.pages.push('上一页');
            if (pageCount <= 5) {
                for (let i = 1; i <= pageCount; i++) {
                    this.pages.push(i);
                }
            } else {
                for (let i = 1; i <= 4; i++) {
                    this.pages.push(i);
                }
                this.pages.push('...');
                this.pages.push(pageCount);
            }
            this.pages.push('下一页')
        }
        else this.hasAnswer = false; 
    },
    methods: {
        switchText() {
            this.showEllipsis = !this.showEllipsis;
        },
        switchComment() {
            this.showComment = !this.showComment;
            this.fetchComment(1);
        },
        fetchComment(page) {
            let answerID = this.answer.objectId;
            let skip = (page - 1) * 20 || 0;
            let url = `/fetch/comment?answerID=${answerID}&skip=${skip}`
            req('GET', url).then((res) => {
                this.comments = res;
            })
        },
        isCurrentPage(page) {
            return page === this.currentPage;
        },
        isPagination(page) {
            return page === '...';
        },
        isNextPage(page) {
            return page === '下一页';
        },
        isPrevPage(page) {
            return page === '上一页';
        },
        switchPage(page) {
            let pageCount = this.pages[this.pages.length - 2];
            let targetPage;
            if (page === '上一页' && this.currentPage !== 1) targetPage = this.currentPage - 1;
            else if (page === '下一页' && this.currentPage !== this.pages[this.pages.length - 2]) targetPage = this.currentPage + 1;
            else if (typeof(page) === 'number') targetPage = page;
            else return;
            this.currentPage = targetPage;
            let newPages = [];
            newPages.push('上一页');
            console.warn('targetPage: ' + targetPage);
            console.warn('pageCount ' + pageCount);
            if (pageCount <= 5) {
                for(let i = 1; i <= pageCount; i++) {
                    newPages.push(i);
                }
            } else if (pageCount > 5) {
                if (pageCount - targetPage < 4) {
                    newPages.push('...');
                    for (let i = pageCount - 4; i <= pageCount; i++) {
                        newPages.push(i);
                    }
                } else if (targetPage > 1) {
                    newPages.push('...');
                    for (let i = targetPage; i < targetPage + 3; i++) {
                        newPages.push(i);
                    }
                    newPages.push('...');
                    newPages.push(pageCount);
                } else if (targetPage === 1) {
                    for (let i = 1; i <= 4; i++) {
                        newPages.push(i);
                    } 
                    newPages.push('...');
                    newPages.push(pageCount);
                }
            }
            newPages.push('下一页')
            this.pages = newPages;
            let skip = (targetPage - 1) * 20;
            this.fetchComment(skip);
        }
    }
}
</script>
