<template>
    <div class="header-wrapper">
        <div class="header">
            <div class="tabs">
                <span class="tabs-logo">IS-IT</span>
                <span class="tabs-tab">首页</span>
                <span class="tabs-tab">话题</span>
                <div class="tabs-search-wrapper">
                    <input class="tabs-search-input" type="text">
                    <button class="tabs-search-submit">搜索</button>
                </div>
            </div>
            <div v-if="isLogin" class="userInfo">{{userInfo}}</div>
            <div v-else>
                <span>登录</span>
                <span>注册</span>
            </div>
        </div>
    </div>
</template>


<script>
let req = require('../models/req.js');

export default {
    methods: {
    }
}
</script>


<style>
.header-wrapper {
    box-shadow: 0 1px 3px rgba(26, 26, 26, .1);
    background-color: #fff;
}
.header {
    width: 1000px;
    min-width: 1000px;
    height: 52px;
    min-hegiht: 52px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
}
.header .tabs {
    display: flex;
    align-items: center;
    line-height: 30px;
    cursor: pointer;
}
.header .tabs .tabs-logo {
    font-size: 30px;
    padding-right: 15px;
    color: #0084ff;
}
.header .tabs .tabs-tab {
    padding: 0 15px;
}
.header .tabs .tabs-search-wrapper input {
    height: 34px;
    min-width: 325px;
    width:325px;
    padding: 4px 10px 4px 16px;
    background: #f6f6f6;
    border-radius: 3px;
    border: 1px solid #ebebeb; 
    outline: none;
    margin: 0 15px;
    transition: width .2s ease,background .3s ease;
}
.header .tabs .tabs-search-wrapper input:focus {
    border: 1px solid #8590A6;
    width: 400px;
}
.header .tabs .tabs-search-wrapper .tabs-search-submit {
    background-color: #0084ff;
    color: #fff;
    margin-left: 15px;
    padding: 0 14px;
    line-height: 34px;
    border-radius: 3px;
    height: 34px;
    cursor: pointer;
    transition: opacity .3s ease,transform .3s ease,-webkit-transform .3s ease;
}

.header .tabs .tabs-search-wrapper input:focus + .tabs-search-submit {
    opacity: 0;
    transform: scale(0);
}
.header .userInfo {
    font-size: 18px;
    cursor: pointer;
    line-height: 30px;
}
</style>
