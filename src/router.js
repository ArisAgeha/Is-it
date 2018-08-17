import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Topic from './components/Topic.vue'

Vue.use(Router)

export default new Router({

    routes: [
        {
            path: '/',
            name: '',
            component: Index
        },
        {
            path: '/topic/:id',
            component: Topic
        }
    ]

})
