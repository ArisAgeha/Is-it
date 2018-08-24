import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Topic from './components/Topic.vue'
import Topics from './components/Topics.vue'
import Question from './components/Question.vue'

Vue.use(Router)

export default new Router({

    routes: [
        {
            path: '/',
            name: '',
            component: Index
        },
        {
            path: '/topic',
            component: Topic
        },
        {
            path: '/topics',
            component: Topics
        },
        {
            path: '/question/:id',
            component: Question
        }
    ]

})
