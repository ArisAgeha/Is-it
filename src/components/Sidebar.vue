<template>
    <div class="indexSidebar" :fetch="fetchUserDetail">
        <div class="myFollowing indexSidebar-tab">
            <span class="text">我关注的人</span>
            <span class="count">{{followingCount}}</span>
        </div>
        <div class="myFollower indexSidebar-tab">
            <span class="text">关注我的人</span>
            <span class="count">{{followerCount}}</span>
        </div>
        <div class="myAnswer indexSidebar-tab">
            <span class="text">我的回答</span>
            <span class="count">{{answerCount}}</span>
        </div>
        <div class="myFollowingQuestion indexSidebar-tab">
            <span class="text">我的问题</span>
            <span class="count">{{questionCount}}</span>
        </div>
    </div>
</template>

<style>
.indexSidebar {
    padding: 8px 0;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
}
.indexSidebar-tab {
    color: #77839c;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 40px;
    font-size: 14px;
}
.indexSidebar-tab .count {
    padding: 6px 14px;
    border-radius: 2px;
    background: #f6f6f6;
    color: #8590a6;
    font-size: 12px;
}
</style>

<script>
import req from '../models/req.js';
export default {
    data() {
        return {
            followingCount: 0,
            followerCount: 0,
            answerCount: 0,
            questionCount: 0
        }
    },
    computed: {
        fetchUserDetail() {
            if (this.$store.state.isLogin) {
                let body = {
                    userID: this.$store.state.currentUser.objectId
                }
                req('POST', '/fetch/userDetail', body).then((res) => {
                    this.followingCount = res.followingCount;
                    this.followerCount = res.followerCount;
                    this.answerCount = res.answerCount;
                    this.questionCount = res.questionCount;
                })
            } else {
                this.followingCount = 0;
                this.followerCount = 0;
                this.answerCount = 0;
                this.questionCount = 0;
            }
        }
    }
}
</script>
