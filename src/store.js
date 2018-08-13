import Vue from 'vue'
import Vuex from 'vuex'
import req from './models/req.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLogin: false,
        currentUser: null,
        showHint: {
            show: false,
            text: 'test',
            hintStatus: 'success'
        },
        clock: null
    },
    mutations: {
        login(state, payload) {
            state.isLogin = true;
            state.currentUser = payload;
        },
        logout(state) {
            state.isLogin = false;
            state.currentUser = null;
        }
    },
    actions: {
        hint(context, detail) {
            let text = detail.text;
            let hintStatus = detail.hintStatus;
            context.state.showHint.show = true;
            context.state.showHint.text = text;
            context.state.showHint.hintStatus = hintStatus;
            clearTimeout(context.state.clock);
            context.state.clock = setTimeout(function() {
                context.state.showHint.show = false;
            }, 2500)
        },
        async loginByCookie({commit}, userInfo) {
            let {sessionToken} = userInfo;
            let res = await req('POST', '/user/loginByCookie', userInfo);
            if (!res.code) {
                commit('login', res);
            }
            return res;
        },
        async signup(context, userInfo) {
            let {username, password} = userInfo;
            return await req('POST', '/user/signup', userInfo);
        },
        async login({commit}, userInfo) {
            let {username, password} = userInfo;
            let res = await req('POST', '/user/login', userInfo)
            if (!res.code) {
                commit('login', res);
            }
            return res;
        }
    }
})
