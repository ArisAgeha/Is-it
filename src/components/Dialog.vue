<template>
    <div class="dialogMask" @click="closeDialog" v-if="showDialog">
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
</template>

<script>
import req from '../models/req.js';
export default {
    props: ['queueID'],
    data() {
        return {
            dialogList: []
        }
    },
    computed: {
        showDialog() {
            if (this.$store.state.showDialog) {
                let queueID = this.queueID
                let url = `/fetch/dialog?queueID=${queueID}`;
                req('get', url).then((res) => {
                    this.dialogList = res;
                })
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        closeDialog() {
            this.$store.commit('toggleDialog');
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
        }
    }
}
</script>

<style>
.dialogMask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}
.dialogWrapper {
    width: 688px;
    min-height: 100px;
    height: calc(100vh - 24px * 2);
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
