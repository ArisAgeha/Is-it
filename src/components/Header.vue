<template>
    <div class="header-wrapper">
        <div class="header">
            <div class="tabs">
                <span class="tabs-logo">IS-IT</span>
                <router-link to="/"><span class="tabs-tab tabs-index">首页</span></router-link>
                <router-link to="/topic"><span class="tabs-tab tabs-topic">话题</span></router-link>
                <div class="tabs-search-wrapper">
                    <input class="tabs-search-input" type="text">
                    <button @click="addQuestion" class="tabs-addQuestion-submit">提问</button>
                </div>
            </div>
            <div v-if="isLogin" class="userInfo">
                <span class="greeting">您好，</span>{{username}} <span @click="logout" class="logout">注销</span>
            </div>
            <div v-else class="loginBar">
                <button @click="showLoginPanel" class="loginButton">登录 / 注册</button>
            </div>
            <div v-if="showLogin" class="loginPanel-wrapper">
                <div class="mask" @click="hiddenLoginPanel">
                    <div @click.stop class="loginPanel">
                        <div class="loginMessage-title">
                            ISIT
                        </div>
                        <div class="loginMessage-body">
                            是这样吗
                        </div>
                        <input id="username" class="username" type="text">
                        <input id="password" class="password" type="password">
                        <button @click="login" class="loginSubmit">登录</button>
                        <button @click="signup" class="signupSubmit">注册</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.loginPanel-wrapper, 
.signup-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 3;
}
.mask {
    height: 100%;
    width: 100%;
    background-color: rgb(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}
.loginPanel, 
.signupPanel {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    min-width: 450px;
    padding: 40px;
    justify-content: center;
}

.loginPanel > .loginMessage-title {
    font-size: 40px;
    color: #0084ff;
    text-align: center;
}
.loginPanel > .loginMessage-body {
    font-size: 22px;
    color: #0084ff;
    text-align: center;
}
.header-wrapper {
    box-shadow: 0 1px 3px rgba(26, 26, 26, .1);
    z-index: 1;
    background-color: #fff;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
}
.header-wrapper .mask input {
    outline: none;
    height: 48px;
    border-bottom: 1px solid #ebebeb;
    color: #8590a6;
    margin-bottom: 12px;
    font-size: 16px;
    padding:0 10px;
}
.header-wrapper .mask .password {
    letter-spacing: 15px;
}
.header-wrapper .mask button {
    margin-top: 30px;
    height: 36px;
    background-color: rgb(0, 132, 255);
    color: #fff;
    border-radius: 3px;
    border: 1px solid rgb(0, 132, 255)
}
.header-wrapper .mask .signupSubmit {
    background-color: rgba(0, 132, 255, 0.1);
    color: rgb(0, 132, 255)
}

.header {
    width: 1000px;
    min-width: 1000px;
    height: 52px;
    min-height: 52px;
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
.header .tabs .tabs-topic {
    color: #8590a6;
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
    background-color: #fff;
    border: 1px solid #8590A6;
    width: 400px;
}
.header .tabs .tabs-search-wrapper .tabs-addQuestion-submit {
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

.header .tabs .tabs-search-wrapper input:focus + .tabs-addQuestion-submit {
    opacity: 0;
    transform: scale(0);
}
.header .userInfo {
    font-size: 17px;
    line-height: 30px;
}
.header .userInfo .logout {
    color: #0084ff;
    font-size: 14px;
    cursor: pointer;
}

.header .loginBar {
    disply: flex;
    align-items: center;
}
.header .loginBar button {
    line-height: 30px;
    height: 34px;
    padding: 0 16px;
    border-radius: 3px;
    cursor:pointer;
}
.header .loginBar .loginButton {
    color: #fff;
    border: 1px solid #0084ff;
    background-color: #0084ff;
    text-align: center;
}
.header .loginBar .loginButton:hover {
    background-color: #0077e6;
}
</style>

<script>
let req = require('../models/req.js');

export default {
    data() {
        return {
            showLogin: false,
        }
    },
    methods: {
        addQuestion() {
            if (!this.$store.state.isLogin) {
                this.$store.dispatch('hint', {text: '请先登录！', hintStatus: 'fail'});
                return;
            } else {
                this.$store.commit('toggleQuestionEditor');
            }
        },
        hiddenLoginPanel() {
            this.showLogin = false;
        },
        showLoginPanel() {
            this.showLogin = true;
        },
        login() {
            let username = document.querySelector('#username').value.trim();
            let password = document.querySelector('#password').value.trim();
            if (username.length === 0) {
                this.$store.dispatch('hint', {text: '用户名不能为空', hintStatus: 'fail'})
                return;
            } else if (password.length ===0) {
                this.$store.dispatch('hint', {text: '密码不能为空', hintStatus: 'fail'})
                return;
            }

            this.$store.dispatch('login', {
                username,
                password
            }).then((res) => {
                if (res.username) {
                    this.$store.dispatch('hint', {text: '登录成功！', hintStatus: 'success'});
                    window.location.reload(true);
                    this.showLogin= false;
                    return;
                } else if (res.code === 211) {
                    this.$store.dispatch('hint', {text: '用户名不存在！', hintStatus: 'fail'});
                } else if (res.code === 210) {
                    this.$store.dispatch('hint', {text: '用户名与密码不匹配！', hintStatus: 'fail'});
                } else if (res.code === 219) {
                    this.$store.dispatch('hint', {text: '登录失败超过次数限制！请等待15分钟！', hintStatus: 'fail'});
                } else {
                    this.$store.dispatch('hint', {text: '未知原因登录错误，请重试。', hintStatus: 'fail'});
                }
            })
        },
        signup() {
            let username = document.querySelector('#username').value.trim();
            let password = document.querySelector('#password').value.trim();
            if (username.length === 0) {
                this.$store.dispatch('hint', {text: '用户名不能为空', hintStatus: 'fail'})
                return;
            } else if (password.length ===0) {
                this.$store.dispatch('hint', {text: '密码不能为空', hintStatus: 'fail'})
                return;
            } else if (username.length > 16) {
                this.$store.dispatch('hint', {text: '用户名不能超过16位', hintStatus: 'fail'})
                return;
            } else if (password.length > 16) {
                this.$store.dispatch('hint', {text: '密码不能超过16位', hintStatus: 'fail'})
                return;
            }

            this.$store.dispatch('signup', {
                username,
                password
            }).then((res) => {
                if (res.code === 202) {
                    this.$store.dispatch('hint', {text: '该用户名已被使用', hintStatus: 'fail'});
                    return;   
                } else if (res.code === 2) {
                    this.$store.dispatch('hint', {text: '请先退出登录！', hintStatus: 'fail'});
                    return;   
                } else if (res.code) {
                    this.$store.dispatch('hint', {text: '未知原因注册错误，请重试。', hintStatus: 'fail'});
                    return;   
                } else if (res.username){
                    this.$store.dispatch('hint', {text: '注册成功，请登录。', hintStatus: 'success'});
                }
            })
        },
        logout() {
            document.cookie = 'sessionToken=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            this.$store.commit('logout');
            this.$store.dispatch('hint', {text: '注销成功。', hintStatus: 'success'});
            window.location.reload(true);
        }
    },
    computed: {
        username() {
            return this.$store.state.currentUser.username;
        },
        isLogin() {
            return this.$store.state.isLogin;
        }
    },
    mounted() {
        /* 备用版本
        console.log(document.cookie);
        let userCookie;
        if (document.cookie) userCookie = document.cookie.slice(13);
        if (userCookie) {
            this.$store.dispatch('loginByCookie', {sessionToken: userCookie}).then((res) => {
                console.log(res);
            })
        }
        */

        let cookieMatch = document.cookie.match(/(?<=sessionToken=)\w+/);
        if (cookieMatch && cookieMatch[0]) {
            let userCookie = cookieMatch[0];
            if (userCookie) {
                this.$store.dispatch('loginByCookie', {sessionToken: userCookie}).then((res) => {
                    console.log(res);
                })
            }
        } 
    }
}
</script>
