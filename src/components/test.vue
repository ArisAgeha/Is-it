<template>
    <div class="header">
        <div class="logo">
            <img src="" alt="">
        </div>
        <button @click="addUser()">addUser</button>
        <button @click="addQuestion()">addQuestion</button>
        <button @click="login()">login</button>
        <button @click="logout()">logout</button>
        <button @click="addAnswer()">addAnswer</button>
        <button @click="addAgree()">addAgree</button>
        <button @click="followUser()">followUser</button>
        <button @click="followQuestion()">followQuestion</button>
        <button @click="followTopic()">followTopic</button>
        <button @click="addComment()">addComment</button>
        <button @click="fetchUserFollowing()">fetchUserFollowing</button>
        <button @click="fetchUserFollower()">fetchUserFollower</button>
        <button @click="fetchTopicQuestion()">fetchTopicQuestion</button>
        <button @click="fetchIndex()">fetchIndex</button>
        <button @click="fetchQuestionPage()">fetchPage</button>
        <button @click="fetchTopic()">fetchTopic</button>
        <button @click="fetchUserDetail()">fetchUserDetail</button>
        <button @click="fetchComment()">fetchComment</button>
        <button @click="fetchDialog()">fetchDialog</button>
        <div class="cors">helloworld</div>
    </div>
</template>

<script>
</script>

<style>
.header {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
button {
    margin-right: 15px;
    padding: 10px 20px;
}
</style>

<script>
function req(method, path, body) {
    let url = 'http://localhost:3000' + path;
    return fetch(url, {
        method,
        body: JSON.stringify(body) || undefined,
        credentials: 'include',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"   
        }
    }).then((res) => {
        return res.json();
    })
}
export default {
    methods: {
        addUser() {
            let body = { username: 'aris2', password: 'test2' }
            req('POST', '/user/signup', body).then((res) => {
                console.log(res);
            })
        },
        addQuestion() {
            let body = {
                title: '今天天气怎样？？',
                topic: ['生活', '天气', '测试'],
                description: '1234'
            }
            req('POST', '/question/addQuestion', body).then((res) => {
                console.log(res);
            })
        },
        login() {
            let body = {
                username: 'aris4',
                password: 'aris4'
            }
            req('POST', '/user/login', body).then((res) => {
                console.log(res);
            })
        },
        logout() {
            req('delete', '/user/logout').then((res) => {
                console.log(res);
            })
        },
        addAnswer() {
            let body = {
                content: '成为死宅！',
                ellipsis: '这是一段测试...',
                questionID: '5b6ac82e808ca4003cc28d29'
            }
            req('POST', '/answer/addAnswer', body).then((res) => {
                console.log(res);
            })
        },
        addAgree() {
            let body = {
                answerID: '5b6acc40fe88c2005afade20'
            }
            req('POST', '/answer/addAgree', body).then((res) => {
                console.log(res);
            })
        },
        followUser() {
            let body = {
                userID: '5b6ab59ad50eee00312ed923'
            }
            req('POST', '/follow/user', body).then((res) => {
                console.log(res);
            })
        },
        followQuestion() {
            let body = {
                questionID: '5b69338f9f54540035db9ac8'
            }
            req('POST', '/follow/question', body).then((res) => {
                console.log(res);
            })
        },
        followTopic() {
            let body = {
                topicID: '5b69f68f808ca4003cb4bd8e'
            }
            req('POST', '/follow/topic', body).then((res) => {
                console.log(res);
            })
        },
        addComment() {
            let body = {
                answerID: '5b6acc40fe88c2005afade20',
                replyTo: 'aris2',
                replyQueue: '5b6b586c17d0090035aa14d2', // 回复对象的评论队列ID（队列最初的被评论对象的ID）
                hasReply: false,
                content: '这是第五条回复',
                targetData: {
                    id: '5b6b5c8f9f54540035eb6c2f', // 回复对象的评论ID
                    hasReply: false,
                }
            }
            req('POST', '/comment/addComment', body).then((res) => {
                console.log(res);
            })
        },
        fetchUserFollowing() {
            let body = {
                skip: 0,
                userID: '5b6981a6d50eee00312655c1'
            }
            req('POST', '/fetch/fetchUserFollowing', body).then((res) => {
                console.log(res);
            })
        },
        fetchUserFollower() {
            let body = {
                skip: 0,
                userID: '5b681d91fe88c2005b337183'
            }
            req('POST', '/fetch/fetchUserFollower', body).then((res) => {
                console.log(res);
            })
        },
        fetchTopicQuestion() {
            let body = {
                skip: 0,
                topicID: '5b69f5b19f54540035f0db82'
            }
            req('POST', '/fetch/topicQuestion', body).then((res) => {
                console.log(res);
            })
        },
        fetchIndex() {
            req('get', '/fetch/index?skip=0').then((res) => {
                console.log(res);
            })
        },
        fetchQuestionPage() {
            let body = {
                questionID: '5b6ac82e808ca4003cc28d29',
                skip: 0
            }
            req('POST', '/fetch/questionPage', body).then((res) => {
                console.log(res);
            })
        },
        fetchTopic() {
            req('get', '/fetch/topic').then((res) => {
                console.log(res);
            })
        },
        fetchUserDetail() {
            let body = {
                userID: '5b6b4cfa9f54540035fa996d'
            }
            req('POST', '/fetch/userDetail', body).then((res) => {
                console.log(res);
            })
        },
        fetchComment() {
            let body = {
                answerID: '5b6acc40fe88c2005afade20',
                skip: 0
            }
            req('POST', '/fetch/comment', body).then((res) => {
                console.log(res);
            })
        },
        fetchDialog() {
            let body = {
                queueID: '5b6b586c17d0090035aa14d2',
                skip: 0
            }
            req('POST', '/fetch/dialog', body).then((res) => {
                console.log(res);
            })
        }
    }
}
</script>
