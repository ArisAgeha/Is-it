<template>
    <div class="commentWrapper">
        <div class="commentList">
            <div v-for="comment in comments" class="commentItem">
                <div class="comment-header">
                    <div class="comment-user">
                        {{comment.userID.username}}
                        <span class="replyTo-text" v-if="comment.replyTo">回复</span>
                        <span class="replyto" v-if="comment.replyTo">{{comment.replyTo}}</span>
                    </div>
                    <div class="comment-timeInfo">{{getTimeInfo(comment)}}</div>
                </div>
                <div class="comment-content">{{comment.content}}</div>
                <div class="showDialog" v-if="hasDialog(comment)" @click="openDialog(comment)">查看对话</div>
                <div class="dialogContainer" v-if="showDialog">
                    <div class="dialogMask" @click="closeDialog">
                        <div class="dialogWrapper" @click.stop>
                            <div class="dialogTitle">查看对话</div>
                            <div class="dialogCard-wrapper">
                                <div class="dialogCard" v-for="dialogItem in dialogList">
                                    <div class="dialog-header">
                                        <div class="dialog-header-userInfo">
                                            <span>{{dialogItem.userID.username}}</span>
                                            <span v-if="dialogItem.replyTo" class="dialog-header-text">回复</span>
                                            <span v-if="dialogItem.replyTo">{{dialogItem.replyTo}}</span>
                                        </div>
                                        <div class="dialog-header-timeInfo">{{getTimeInfo(dialogItem)}}</div>
                                    </div>
                                    <div class="dialog-content">{{dialogItem.content}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="commentPage">
            <span :class="{currentPage: isCurrentPage(page), pagination: isPagination(page), nextPage: isNextPage(page), prevPage: isPrevPage(page)}" 
             v-for="(page, index) in pages" 
             class="pageButton"
             @click="switchPage(page)"
             >{{page}}</span>
        </div>
        <div class="addComment">
            <div class="addComment-input" contenteditable="true" v-model="commentInput"></div>
            <div class="addComment-button" @click="addComment">提交</div>
        </div>
    </div>
</template>

<script>
let req = require('../models/req.js');
export default {
    props: ['answerID', 'pageCount'],
    data() {
        return {
            pages: [],
            currentPage: 1,
            comments: null,
            showDialog: false,
            dialogList: [],
            commentInput: ''
        }
    },
    methods: {
        addComment() {
            if (this.commentInput === '') {
                this.$store.state.dispatch('hint', {text: '评论内容不能为空！', hintStatus: 'fail'});
                return;
            } else if (this.commentInput.length > 150) {
                this.$store.state.dispatch('hint', {text: '评论不能超过150字！', hintStatus: 'fail'});
                return;
            } else if (!this.$store.state.isLogin) {
                this.$store.state.dispatch('hint', {text: '请先登录！', hintStatus: 'fail'});
                return;
            } else {

            }
        },
        getTimeInfo(item) {
            let createdAt = new Date(item.createdAt);
            let now = new Date();
            let elapsed = now - createdAt;
            let elapsedMins = Math.floor(elapsed / 1000 / 60);
            if (elapsedMins < 60) return `${elapsedMins} 分钟前`

            let elapsedHours = Math.floor(elapsedMins / 60);
            if (elapsedHours < 24) return `${elapsedHours} 小时前`

            let elapsedDays = Math.floor(elapsedHours / 24);
            if (elapsedDays < 30) return `${elapsedDays} 天前`

            let elapsedMonths = getMonth(createdAt, now);
            if (elapsedMonths < 12) return `${elapsedMonths} 个月前`

            let elapsedYears = Math.floor(elapsedMonths / 12);
            return `${elapsedYears} 年前`

            function getMonth(startDate, endDate) {
                let startMonth = startDate.getMonth();
                let startYear = startDate.getFullYear();
                let endMonth = endDate.getMonth();
                let endYear = endDate.getFullYear();
                let passYear = endYear - startYear;
                let passMonth = endMonth - startMonth;
                if (passMonth < 0) {
                    passYear--;
                    passMonth = 12 + passMonth;
                }
                passMonth = passMonth + passYear * 12;
                return passMonth;
            }
        },
        openDialog(comment) {
            let queueID = comment.replyQueue;
            this.showDialog = true;
            let url = `/fetch/dialog?queueID=${queueID}`;
            req('get', url).then((res) => {
                this.dialogList = res;
            })
        },
        closeDialog() {
            this.showDialog = false;
        },
        hasDialog(comment) {
            if (comment.replyQueue) return true;
            else return false;
        },
        fetchComment(page) {
            let answerID = this.answerID;
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
            let pageCount = this.pageCount;
            let targetPage;
            if (page === '上一页' && this.currentPage !== 1) targetPage = this.currentPage - 1;
            else if (page === '下一页' && this.currentPage !== this.pages[this.pages.length - 2]) targetPage = this.currentPage + 1;
            else if (typeof(page) === 'number') targetPage = page;
            else return;
            this.currentPage = targetPage;
            let newPages = [];
            newPages.push('上一页');
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
            this.fetchComment(targetPage);
        }
    },
    created() {
        this.fetchComment(1);
        this.pages.push('上一页');
        if (this.pageCount <= 5) {
            for (let i = 1; i <= this.pageCount; i++) {
                this.pages.push(i);
            }
        } else {
            for (let i = 1; i <= 4; i++) {
                this.pages.push(i);
            }
            this.pages.push('...');
            this.pages.push(this.pageCount);
        }
        this.pages.push('下一页')
    }
}
</script>

<style lang="scss">
.addComment {
    padding: 12px 20px;
    background: #fff;
    border-top: 1px solid #ebebeb;
    display: flex;

    .addComment-input {
        border: 1px solid #ebebeb;
        flex: 1;
        padding: 5px 12px;
    }
    .addComment-button {
        background-color: #0077e6;
        padding: 0 14px;
        margin-left: 16px;
        line-height: 34px;
        border-radius: 3px;
        cursor: pointer;
        color: #fff;
        height: 34px;
    }
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
.commentList .commentItem .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
}
.commentList .commentItem .comment-header .comment-timeInfo {
    font-size: 14px;
    color: #8590a6;
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
.showDialog {
    color: #77839c;
    font-size: 14px;
    margin-top: 6px;
    cursor: pointer;
}
.dialogMask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}
.dialogWrapper {
    width: 688px;
    min-height: 100px;
    height: calc(100vh - 84px * 2);
    background-color: #fff;
    border-radius: 3px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.dialogWrapper .dialogTitle {
    padding: 0 20px;
    height: 50px;
    min-height: 50px;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    align-items: center;
    font-size: 15px;
    line-height: 1.7;
    color: #1a1a1a;
    font-weight: bold;
}
.dialogWrapper .dialogCard-wrapper{
    overflow: auto;
}
.dialogWrapper .dialogCard {
    padding: 12px 0 10px;
    margin: 0 20px;
    border-bottom: 1px solid #f6f6f6;
}
.dialogWrapper .dialog-header {
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
}
.dialogWrapper .dialog-header .dialog-header-timeInfo{
    font-size: 14px;
    color: #8590a6;
}
.dialogWrapper .dialog-header .dialog-header-text {
    color: #8590a6;
    margin: 0 .5rem;
}
</style>
