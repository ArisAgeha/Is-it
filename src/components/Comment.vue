<template>
    <div class="commentWrapper">
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
    },
    methods: {
        fetchComment(page) {
            console.log(page);
            let answerID = this.answerID;
            let skip = (page - 1) * 20 || 0;
            let url = `/fetch/comment?answerID=${answerID}&skip=${skip}`
            req('GET', url).then((res) => {
                this.comments = res;
                console.log(res);
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
    }
}
</script>


<style>
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
