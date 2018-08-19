<template>
    <div>
        <div class="question-wrapper">
            <div class="question-tabs">
                <div class="question-tab" v-for="topic in topicData">{{topic}}</div>
            </div>
            <div class="question-title">{{questionData.title}}</div>
            <div class="question-description">{{questionData.description}}</div>
            <div class="question-ctrlPanel">
                <div class="question-followButton">关注问题</div>
                <div class="question-addAnswer">写回答</div>
            </div>
        </div>
        <div class="answer-wrapper">
            <div v-for="answer in answers" class="answer-item">

            </div>
        </div>
    </div>
</template>


<script>
let req = require('../models/req.js');
export default {
    data() {
        return {
            topicData: null,
            questionData: null,
            answers: null
        }
    },
    beforeCreate() {
        let url = '/fetch/questionPage?skip=0&questionID=' + this.$route.params.id;
        req('get', url).then((res) => {
            console.log(res);
            this.questionData = res[0];
            this.answers = res[0].answers;
            this.topicData = res[0].topic;
        })

    }
}
</script>


<style>

</style>
