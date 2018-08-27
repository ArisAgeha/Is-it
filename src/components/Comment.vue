<template>
    <div class="commentWrapper">
        <div class="commentList">
            <div v-for="(comment, index) in comments" class="commentItem">
                <div class="comment-header">
                    <div class="comment-user">
                        {{comment.userID.username}}
                        <span class="replyTo-text" v-if="comment.replyTo">回复</span>
                        <span class="replyto" v-if="comment.replyTo">{{comment.replyTo}}</span>
                    </div>
                    <div class="comment-timeInfo">{{getTimeInfo(comment)}}</div>
                </div>
                <div class="comment-content">{{comment.content}}</div>
                <div class="comment-ctrlPanel">
                    <div class="showDialog" v-if="hasDialog(comment)" @click="openDialog(comment)">查看对话</div>
                    <div class="replyToComment" @click="toggleReply(index)">回复</div>
                </div>
                <div class="comment-replyComment" v-if="showReply(index)">
                    <div class="replyComment-input" contenteditable="true" v-model="replyInput"></div>
                    <div class="replyComment-button" @click="replyComment(comment, index)">提交</div>
                </div>
            </div>
            <Dialog :queueID="replyQueue"></Dialog>
        </div>
        <div class="commentPage">
            <span :class="{currentPage: isCurrentPage(page), pagination: isPagination(page), nextPage: isNextPage(page), prevPage: isPrevPage(page)}" 
             v-for="(page, index) in pages" 
             class="pageButton"
             @click="switchPage(page)"
             >{{page}}</span>
        </div>
        <div class="addComment">
            <div class="addComment-input" contenteditable="true"></div>
            <div class="addComment-button" @click="addComment">提交</div>
        </div>
    </div>
</template>

<script>
import req from '../models/req.js';
import Dialog from './Dialog.vue';
export default {
    props: ['answerID', 'pageCount'],
    components: {
        Dialog
    },
    data() {
        return {
            pages: [],
            currentPage: 1,
            comments: null,
            showDialog: false,
            replyQueue: '',
            replyInput: '123',
            showReplyIndex: []
        }
    },
    computed: {
    },
    methods: {
        showReply(index) {
            return this.showReplyIndex[index];
        },
        toggleReply(index) {
            if (this.showReplyIndex.length < index + 1) this.showReplyIndex.length = index + 1;
            this.showReplyIndex.splice(index, 1, !this.showReplyIndex[index]);
        },
        replyComment(comment, index) {
            let content = this.$el.querySelectorAll('.commentItem')[index].querySelector('.replyComment-input').innerText;
            if (content === '') {
                this.$store.dispatch('hint', {text: '评论内容不能为空！', hintStatus: 'fail'});
                return;
            } else if (content.length > 150) {
                this.$store.dispatch('hint', {text: '评论不能超过150字！', hintStatus: 'fail'});
                return;
            } else if (!this.$store.state.isLogin) {
                this.$store.dispatch('hint', {text: '请先登录！', hintStatus: 'fail'});
                return;
            } else {
                let body = {
                    answerID: this.answerID,
                    replyTo: comment.userID.username,
                    replyQueue: comment.replyQueue || comment.objectId, // 回复对象的评论队列ID（队列最初的被评论对象的ID）
                    hasReply: false,
                    content,
                    targetData: {
                        id: comment.objectId, // 回复对象的评论ID
                        hasReply: comment.hasReply,
                    }
                }
                req('POST', '/comment/addComment', body).then((res) => {
                    this.$store.dispatch('hint', {text: '评论成功！', hintStatus: 'success'});
                    res.userID.username = this.$store.state.currentUser.username;
                    this.comments.unshift(res);
                    this.showReplyIndex.splice(index, 1, !this.showReplyIndex[index]);
                })
            }

        },
        addComment() {
            let content = this.$el.querySelector('.addComment-input').innerText;
            if (content === '') {
                this.$store.dispatch('hint', {text: '评论内容不能为空！', hintStatus: 'fail'});
                return;
            } else if (content.length > 150) {
                this.$store.dispatch('hint', {text: '评论不能超过150字！', hintStatus: 'fail'});
                return;
            } else if (!this.$store.state.isLogin) {
                this.$store.dispatch('hint', {text: '请先登录！', hintStatus: 'fail'});
                return;
            } else {
                let body = {
                    answerID: this.answerID,
                    replyTo: '',
                    replyQueue: '', // 回复对象的评论队列ID（队列最初的被评论对象的ID）
                    hasReply: false,
                    content,
                    targetData: {
                        id: '', // 回复对象的评论ID
                        hasReply: false,
                    }
                }
                req('POST', '/comment/addComment', body).then((res) => {
                    this.$store.dispatch('hint', {text: '评论成功！', hintStatus: 'success'});
                    res.userID.username = this.$store.state.currentUser.username;
                    this.comments.unshift(res);
                })
            }
        },
        getTimeInfo(item) {
            let createdAt = new Date(item.createdAt);
            let now = new Date();
            let elapsed = now - createdAt;
            let elapsedMins = Math.floor(elapsed / 1000 / 60);
            if (elapsedMins < 5) return `刚刚`
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
            this.replyQueue = comment.replyQueue;
            this.$store.commit('toggleDialog');
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
.comment-ctrlPanel {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .showDialog,
    .replyToComment {
        margin-right: 16px;
        color: #77839c;
        font-size: 14px;
        margin-top: 6px;
        cursor: pointer;
    }
}
.comment-replyComment {
    padding: 12px 0;
    background: #fff;
    display: flex;

    .replyComment-input {
        border: 1px solid #ebebeb;
        flex: 1;
        padding: 5px 12px;
    }
    .replyComment-button {
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
</style>
